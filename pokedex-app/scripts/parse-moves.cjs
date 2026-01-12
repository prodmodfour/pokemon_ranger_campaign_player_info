const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../../../PTU 1.05 - Moves Data.csv');
const OUTPUT_PATH = path.join(__dirname, '../data/moves.json');

function parseCSV(content) {
  const lines = content.split('\n');
  const moves = [];

  // Column indices based on row 2 (header row)
  const COLUMNS = {
    name: 0,
    type: 1,
    category: 2,
    damageBase: 3,
    frequency: 4,
    ac: 5,
    range: 6,
    effects: 7,
    contestStats: 8,
    moveCategory: 9,  // Physical/Special/Status
    moveType: 10,     // Actual type
    sheerForce: 11,
    toughClaws: 12,
    technician: 13,
    reckless: 14,
    ironFist: 15,
    megaLauncher: 16,
    megaLauncherPlaytest: 17,
    punkRock: 18,
    strongJaw: 19,
    recklessPlaytest: 20
  };

  let currentType = null;

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Parse CSV properly handling quoted fields
    const fields = parseCSVLine(line);

    const name = fields[COLUMNS.name]?.trim();
    if (!name) continue;

    // Skip header rows that appear between type sections
    if (name === 'Name') {
      continue;
    }

    // Skip invalid entries (fragments from CSV parsing)
    const invalidPatterns = [
      /^-/,                          // Starts with dash (habitat entries)
      /^»/,                          // Starts with special char
      /^Special:/,                   // Special: descriptions
      /^Limitation/,                 // Limitation descriptions
      /^Effect:/,                    // Effect: descriptions
      /^Note:/,                      // Note: descriptions
      /^Resolution/,                 // Resolution descriptions
      /^September Playtest/,         // Playtest notes
      /^After /i,                    // "After attacking with..."
      /^Pokémon and/i,               // "Pokémon and Trainers..."
      /^The user/i,                  // "The user..." fragments
      /^If /i,                        // "If..." fragments
      /^When /i,                     // "When..." fragments
      /,--,/,                        // Malformed CSV data
      /^,/,                          // Starts with comma
      /^EW /,                        // EW Adept/Expert (trainer features)
      /^MH /,                        // MH Adept/Expert (trainer features)
      /^OH /,                        // OH Adept (trainer features)
    ];

    // Combat maneuvers and other non-moves
    const invalidNames = [
      'Maneuver',
      'Attack of Opportunity',
      'Disarm',
      'Dirty Trick',
      'Grapple',
      'Push',
      'Trip',
      'Additional Rules',
      'Once a Scene',
    ];

    if (
      invalidPatterns.some(pattern => pattern.test(name)) ||
      invalidNames.includes(name) ||
      name.length > 60
    ) {
      continue;
    }

    // Get type from column 10 (moveType) or track from previous entries
    let type = fields[COLUMNS.moveType]?.trim();
    if (type && type !== '') {
      currentType = type;
    } else {
      type = currentType;
    }

    const category = fields[COLUMNS.moveCategory]?.trim() || '';
    const damageBase = fields[COLUMNS.damageBase]?.trim() || '';
    const frequency = fields[COLUMNS.frequency]?.trim() || '';
    const ac = fields[COLUMNS.ac]?.trim() || '';
    const range = fields[COLUMNS.range]?.trim() || '';
    const effects = fields[COLUMNS.effects]?.trim() || '';
    const contestStats = fields[COLUMNS.contestStats]?.trim() || '';

    // Parse ability interactions
    const abilityInteractions = [];
    if (fields[COLUMNS.sheerForce] === 'o') abilityInteractions.push('Sheer Force');
    if (fields[COLUMNS.toughClaws] === 'o') abilityInteractions.push('Tough Claws');
    if (fields[COLUMNS.technician] === 'o') abilityInteractions.push('Technician');
    if (fields[COLUMNS.reckless] === 'o') abilityInteractions.push('Reckless');
    if (fields[COLUMNS.ironFist] === 'o') abilityInteractions.push('Iron Fist');
    if (fields[COLUMNS.megaLauncher] === 'o') abilityInteractions.push('Mega Launcher');
    if (fields[COLUMNS.punkRock] === 'o') abilityInteractions.push('Punk Rock');
    if (fields[COLUMNS.strongJaw] === 'o') abilityInteractions.push('Strong Jaw');

    const move = {
      name,
      type: type || 'Normal',
      category: category || 'Status',
      damageBase: damageBase || '--',
      frequency: frequency || 'At-Will',
      ac: ac || '--',
      range: range || 'Self',
      effects: effects || '',
      contestStats: contestStats || ''
    };

    if (abilityInteractions.length > 0) {
      move.abilityInteractions = abilityInteractions;
    }

    moves.push(move);
  }

  return moves;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// Main execution
console.log('Reading CSV file...');
const content = fs.readFileSync(CSV_PATH, 'utf-8');

console.log('Parsing moves data...');
const moves = parseCSV(content);

console.log(`Found ${moves.length} moves`);

// Write output
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(moves, null, 2));
console.log(`Wrote moves.json with ${moves.length} entries`);

// Print sample moves for verification
console.log('\nSample moves:');
for (let i = 0; i < Math.min(5, moves.length); i++) {
  console.log(`  ${moves[i].name} (${moves[i].type}, ${moves[i].category}, DB: ${moves[i].damageBase})`);
}

console.log('\nDone!');
