import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MARKDOWN_PATH = path.join(__dirname, '../../books/markdown/Combined_Pokedex.md');
const OUTPUT_DIR = path.join(__dirname, '../data');

// Pokemon types with colors
const POKEMON_TYPES = {
  'Normal': '#A8A878',
  'Fire': '#F08030',
  'Water': '#6890F0',
  'Electric': '#F8D030',
  'Grass': '#78C850',
  'Ice': '#98D8D8',
  'Fighting': '#C03028',
  'Poison': '#A040A0',
  'Ground': '#E0C068',
  'Flying': '#A890F0',
  'Psychic': '#F85888',
  'Bug': '#A8B820',
  'Rock': '#B8A038',
  'Ghost': '#705898',
  'Dragon': '#7038F8',
  'Dark': '#705848',
  'Steel': '#B8B8D0',
  'Fairy': '#EE99AC'
};

// Known abilities (will be populated during parsing)
const abilities = new Map();
const moves = new Map();
const capabilities = new Map();

function parseBaseStats(text) {
  const stats = {};

  // Match patterns like "HP:" followed by a number on next line or same line
  const statPatterns = [
    { name: 'hp', pattern: /HP:[\s\t]*\n?[\s\t]*(\d+)/i },
    { name: 'attack', pattern: /Attack:[\s\t]*\n?[\s\t]*(\d+)/i },
    { name: 'defense', pattern: /Defense:[\s\t]*\n?[\s\t]*(\d+)/i },
    { name: 'special_attack', pattern: /Special Attack:[\s\t]*\n?[\s\t]*(\d+)/i },
    { name: 'special_defense', pattern: /Special Defense:[\s\t]*\n?[\s\t]*(\d+)/i },
    { name: 'speed', pattern: /Speed:[\s\t]*\n?[\s\t]*(\d+)/i }
  ];

  for (const { name, pattern } of statPatterns) {
    const match = text.match(pattern);
    if (match) {
      stats[name] = parseInt(match[1]);
    }
  }
  return stats;
}

function parseType(text) {
  const typeMatch = text.match(/Type\s*:\s*([A-Za-z]+(?:\s*\/\s*[A-Za-z]+)?)/i);
  if (typeMatch) {
    return typeMatch[1].split('/').map(t => t.trim());
  }
  return [];
}

function parseAbilities(lines) {
  const result = { basic: [], advanced: [], high: null };

  for (const line of lines) {
    if (line.match(/Basic Ability [12]/i)) {
      const match = line.match(/Basic Ability [12]:\s*(.+)/i);
      if (match && match[1].trim()) {
        const ability = match[1].trim();
        result.basic.push(ability);
        abilities.set(ability, { name: ability, type: 'basic' });
      }
    }
    if (line.match(/Adv Ability [12]/i)) {
      const match = line.match(/Adv Ability [12]:\s*(.+)/i);
      if (match && match[1].trim()) {
        const ability = match[1].trim();
        result.advanced.push(ability);
        abilities.set(ability, { name: ability, type: 'advanced' });
      }
    }
    if (line.match(/High Ability/i)) {
      const match = line.match(/High Ability:\s*(.+)/i);
      if (match && match[1].trim()) {
        const ability = match[1].trim();
        result.high = ability;
        abilities.set(ability, { name: ability, type: 'high' });
      }
    }
  }
  return result;
}

function parseEvolution(lines) {
  const evolution = [];
  for (const line of lines) {
    const match = line.match(/^\s*([123])\s*-\s*([A-Za-z\-']+(?:\s*\([MF]\))?)\s*(.*)?/);
    if (match) {
      const stage = {
        stage: parseInt(match[1]),
        name: match[2].trim(),
        requirement: match[3] ? match[3].trim() : null
      };
      evolution.push(stage);
    }
  }
  return evolution;
}

function parseSizeInfo(lines) {
  let height = null;
  let weight = null;
  let sizeClass = null;
  let weightClass = null;

  for (const line of lines) {
    const heightMatch = line.match(/Height\s*:\s*([^(]+)\(([^)]+)\)/i);
    if (heightMatch) {
      height = heightMatch[1].trim();
      sizeClass = heightMatch[2].trim();
    }
    const weightMatch = line.match(/Weight\s*:\s*([^(]+)\(([^)]+)\)/i);
    if (weightMatch) {
      weight = weightMatch[1].trim();
      weightClass = weightMatch[2].trim();
    }
  }
  return { height, weight, sizeClass, weightClass };
}

function parseBreedingInfo(lines) {
  const info = {};
  for (const line of lines) {
    if (line.match(/Gender Ratio/i)) {
      const match = line.match(/Gender Ratio\s*:\s*(.+)/i);
      if (match) info.genderRatio = match[1].trim();
    }
    if (line.match(/Egg Group/i)) {
      const match = line.match(/Egg Group\s*:\s*(.+)/i);
      if (match) info.eggGroup = match[1].trim().split(/[\/,]/).map(g => g.trim());
    }
    if (line.match(/Hatch Rate/i)) {
      const match = line.match(/Hatch Rate:\s*(.+)/i);
      if (match) info.hatchRate = match[1].trim();
    }
    if (line.match(/Diet/i)) {
      const match = line.match(/Diet\s*:\s*(.+)/i);
      if (match) info.diet = match[1].trim();
    }
    if (line.match(/Habitat/i)) {
      const match = line.match(/Habitat\s*:\s*(.+)/i);
      if (match) info.habitat = match[1].trim().split(',').map(h => h.trim());
    }
  }
  return info;
}

function parseCapabilities(text) {
  const caps = [];
  // Common capabilities pattern - comprehensive list
  const capPattern = /(?:Overland|Swim|Jump|Power|Sky|Levitate|Burrow|Naturewalk|Underdog|Sinker|Glow|Heater|Freezer|Zapper|Telekinetic|Telepath|Invisibility|Threaded|Amorphous|Inflatable|Firestarter|Reach|Fountain|Volatile|Weathered|Phasing|Mountable|Darkvision|Gilled|Tracker|Dead Silent|Pack Mon|Aura|Guster|Wallclimber|Chilled|Magnetic|Magnet Rise|Alluring|Blessed|Shrinkable|Mindlock|Legendary|Honey Gather|Shapeshifter|Waddler|Dusker|X-Ray Vision|Earthshaper|Clone|Fairy Mist|Warper|Stealth|Soulless|Mindreader|Venom)\s*(?:\d+|\([^)]+\))?/gi;
  const matches = text.match(capPattern);
  if (matches) {
    for (const cap of matches) {
      const trimmed = cap.trim();
      caps.push(trimmed);
      const capName = trimmed.split(/[\s(]/)[0];
      capabilities.set(capName, { name: capName, description: trimmed });
    }
  }
  return caps;
}

function parseSkills(text) {
  const skills = {};
  const skillPattern = /(Athl|Acro|Combat|Stealth|Percep|Focus)\s+(\d+d\d+(?:\+\d+)?)/gi;
  let match;
  while ((match = skillPattern.exec(text)) !== null) {
    skills[match[1].toLowerCase()] = match[2];
  }
  return skills;
}

function parseMoves(text, section) {
  const moveList = [];
  // Level up moves: "1  Tackle - Normal"
  if (section === 'levelup') {
    const pattern = /(\d+)\s+([A-Za-z\-\s']+)\s*-\s*([A-Za-z]+)/g;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const move = {
        level: parseInt(match[1]),
        name: match[2].trim(),
        type: match[3].trim()
      };
      moveList.push(move);
      moves.set(move.name, { name: move.name, type: move.type });
    }
  } else {
    // TM/Egg/Tutor moves - comma separated
    const moveNames = text.split(/[,\n]/).map(m => m.trim()).filter(m => m && m.length > 1);
    for (const name of moveNames) {
      // Clean up the name
      const cleanName = name.replace(/^\d+\s*/, '').replace(/\s*-\s*[A-Za-z]+$/, '').trim();
      if (cleanName && cleanName.length > 1 && !cleanName.match(/^[A-Z]\d+$/)) {
        moveList.push(cleanName);
        moves.set(cleanName, { name: cleanName });
      }
    }
  }
  return moveList;
}

function cleanName(name) {
  // Clean up name - remove extra whitespace, tabs, newlines
  return name.replace(/[\t\n\r]/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/)[0];
}

function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, (m) => m.toUpperCase());
}

function parsePokemonEntry(text, name) {
  const lines = text.split('\n');
  const cleanedName = toTitleCase(cleanName(name));

  const pokemon = {
    name: cleanedName,
    baseStats: parseBaseStats(text),
    types: parseType(text),
    abilities: parseAbilities(lines),
    evolution: parseEvolution(lines),
    size: parseSizeInfo(lines),
    breeding: parseBreedingInfo(lines),
    capabilities: [],
    skills: {},
    moves: {
      levelUp: [],
      tmHm: [],
      egg: [],
      tutor: []
    }
  };

  // Find capability section
  const capStart = text.indexOf('Capability List');
  const skillStart = text.indexOf('Skill List');
  if (capStart !== -1 && skillStart !== -1) {
    const capText = text.substring(capStart, skillStart);
    pokemon.capabilities = parseCapabilities(capText);
  }

  // Find skill section
  const moveStart = text.indexOf('Move List');
  if (skillStart !== -1 && moveStart !== -1) {
    const skillText = text.substring(skillStart, moveStart);
    pokemon.skills = parseSkills(skillText);
  }

  // Parse move sections
  const levelUpMatch = text.match(/Level Up Move List([\s\S]*?)(?:TM\/HM|$)/i);
  if (levelUpMatch) {
    pokemon.moves.levelUp = parseMoves(levelUpMatch[1], 'levelup');
  }

  const tmMatch = text.match(/TM\/HM Move List([\s\S]*?)(?:Egg Move|$)/i);
  if (tmMatch) {
    pokemon.moves.tmHm = parseMoves(tmMatch[1], 'tm');
  }

  const eggMatch = text.match(/Egg Move List([\s\S]*?)(?:Tutor Move|$)/i);
  if (eggMatch) {
    pokemon.moves.egg = parseMoves(eggMatch[1], 'egg');
  }

  const tutorMatch = text.match(/Tutor Move List([\s\S]*?)(?:##|$)/i);
  if (tutorMatch) {
    pokemon.moves.tutor = parseMoves(tutorMatch[1], 'tutor');
  }

  return pokemon;
}

function parsePokedex(content) {
  const pokemon = [];

  // Split by Pokemon name headers (all caps names at start of entries)
  // Look for patterns like "BULBASAUR" followed by Base Stats
  const entries = content.split(/(?=^[A-Z][A-Z\-'\s()]+\n[\s\S]*?Base Stats:)/m);

  for (const entry of entries) {
    if (!entry.trim()) continue;

    // Get Pokemon name from first line
    const nameMatch = entry.match(/^([A-Z][A-Z\-'\s()]+)/);
    if (!nameMatch) continue;

    const name = nameMatch[1].trim();
    // Skip non-Pokemon entries
    if (name.match(/^(PAGE|CONTENTS|HOW TO|POKEDEX$|COMBINED)/i)) continue;
    if (!entry.includes('Base Stats')) continue;

    try {
      const pokemonData = parsePokemonEntry(entry, name);
      if (pokemonData.types.length > 0) {
        pokemon.push(pokemonData);
      }
    } catch (e) {
      console.error(`Error parsing ${name}:`, e.message);
    }
  }

  return pokemon;
}

// Main execution
console.log('Reading markdown file...');
const content = fs.readFileSync(MARKDOWN_PATH, 'utf-8');

console.log('Parsing Pokemon data...');
const pokemonList = parsePokedex(content);
console.log(`Found ${pokemonList.length} Pokemon`);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Write Pokemon data
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'pokemon.json'),
  JSON.stringify(pokemonList, null, 2)
);
console.log(`Wrote pokemon.json with ${pokemonList.length} entries`);

// Write types data
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'types.json'),
  JSON.stringify(POKEMON_TYPES, null, 2)
);
console.log('Wrote types.json');

// Write abilities
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'abilities.json'),
  JSON.stringify(Array.from(abilities.values()), null, 2)
);
console.log(`Wrote abilities.json with ${abilities.size} entries`);

// Write moves
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'moves.json'),
  JSON.stringify(Array.from(moves.values()), null, 2)
);
console.log(`Wrote moves.json with ${moves.size} entries`);

// Write capabilities
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'capabilities.json'),
  JSON.stringify(Array.from(capabilities.values()), null, 2)
);
console.log(`Wrote capabilities.json with ${capabilities.size} entries`);

console.log('Done!');
