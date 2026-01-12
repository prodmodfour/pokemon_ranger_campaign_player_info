const fs = require('fs');
const path = require('path');

const coreBookPath = path.join(__dirname, '../../books/markdown/Pokemon Tabletop United 1.05 Core.md');
const dataDir = path.join(__dirname, '../data');

const content = fs.readFileSync(coreBookPath, 'utf-8');
const lines = content.split('\n');

// Helper to clean text
const clean = (text) => text?.trim().replace(/\s+/g, ' ') || '';

// Parse Trainer Edges
function parseEdges() {
  const edges = [];
  let inEdgesSection = false;
  let currentEdge = null;
  let currentField = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of Edges section
    if (line.trim() === 'Edges' && lines[i+1]?.includes('following is the list of Edges')) {
      inEdgesSection = true;
      continue;
    }

    // End of Edges section (Features section starts)
    if (inEdgesSection && line.trim() === 'Features') {
      if (currentEdge && currentEdge.name) edges.push(currentEdge);
      break;
    }

    if (!inEdgesSection) continue;

    // Skip page headers and empty lines
    if (line.startsWith('## Page') || line.includes('Skills, Edges, Feats')) continue;

    // Check for subsection headers (like "Skill Edges", "Crafting Edges")
    if (line.match(/^[A-Z][a-z]+ Edges$/)) {
      if (currentEdge && currentEdge.name) edges.push(currentEdge);
      currentEdge = null;
      continue;
    }

    // Prerequisites line
    if (line.startsWith('Prerequisites:') || line.startsWith('Prerequisite:')) {
      if (currentEdge) {
        currentEdge.prerequisites = clean(line.replace(/Prerequisites?:/, ''));
        currentField = 'prerequisites';
      }
      continue;
    }

    // Effect line
    if (line.startsWith('Effect:')) {
      if (currentEdge) {
        currentEdge.effect = clean(line.replace('Effect:', ''));
        currentField = 'effect';
      }
      continue;
    }

    // Special line (for some edges)
    if (line.startsWith('Special')) {
      if (currentEdge) {
        currentEdge.special = clean(line.replace('Special', '').replace('-', '').trim());
      }
      continue;
    }

    // New edge name (capitalized word/phrase at start of line, not a field)
    const nameMatch = line.match(/^([A-Z][A-Za-z\s']+)$/);
    if (nameMatch && !line.includes(':') && line.trim().length > 2 && line.trim().length < 40) {
      if (currentEdge && currentEdge.name) edges.push(currentEdge);
      currentEdge = { name: clean(nameMatch[1]), prerequisites: '', effect: '' };
      currentField = null;
      continue;
    }

    // Continuation of current field
    if (currentEdge && currentField && line.trim() && !line.startsWith('##')) {
      currentEdge[currentField] += ' ' + clean(line);
    }
  }

  return edges.filter(e => e.name && e.effect);
}

// Parse Trainer Features
function parseFeatures() {
  const features = [];
  let inFeaturesSection = false;
  let currentFeature = null;
  let currentField = null;
  let bracketDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for feature definitions with [Tags]
    if (line.startsWith('[') && line.includes(']')) {
      const tags = line.match(/\[([^\]]+)\]/g)?.map(t => t.slice(1, -1)) || [];
      if (tags.length > 0 && currentFeature) {
        currentFeature.tags = tags;
      }
      continue;
    }

    // Prerequisites
    if (line.startsWith('Prerequisites:') || line.startsWith('Prerequisite:')) {
      if (currentFeature) {
        currentFeature.prerequisites = clean(line.replace(/Prerequisites?:/, ''));
        currentField = 'prerequisites';
      }
      continue;
    }

    // Frequency/Action (like "Daily x2 – Standard Action")
    const freqMatch = line.match(/^(Static|At-Will|Daily|Scene|1 AP|2 AP|Bind|Drain|Extended|Free|Standard|Swift)/i);
    if (freqMatch && currentFeature && !currentFeature.frequency) {
      currentFeature.frequency = clean(line);
      continue;
    }

    // Trigger
    if (line.startsWith('Trigger:')) {
      if (currentFeature) {
        currentFeature.trigger = clean(line.replace('Trigger:', ''));
        currentField = 'trigger';
      }
      continue;
    }

    // Target
    if (line.startsWith('Target:')) {
      if (currentFeature) {
        currentFeature.target = clean(line.replace('Target:', ''));
        currentField = 'target';
      }
      continue;
    }

    // Effect
    if (line.startsWith('Effect:')) {
      if (currentFeature) {
        currentFeature.effect = clean(line.replace('Effect:', ''));
        currentField = 'effect';
      }
      continue;
    }

    // Note
    if (line.startsWith('Note:')) {
      if (currentFeature) {
        currentFeature.note = clean(line.replace('Note:', ''));
        currentField = 'note';
      }
      continue;
    }
  }

  return features.filter(f => f.name && f.effect);
}

// Parse Poké Edges
function parsePokeEdges() {
  const pokeEdges = [];
  let inPokeEdgesSection = false;
  let currentEdge = null;
  let currentField = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of Poké Edges section
    if (line.trim() === 'Poké Edges') {
      inPokeEdgesSection = true;
      continue;
    }

    // End of section (next chapter)
    if (inPokeEdgesSection && (line.startsWith('Chapter') || line.includes('Pokémon Ecology'))) {
      if (currentEdge && currentEdge.name) pokeEdges.push(currentEdge);
      break;
    }

    if (!inPokeEdgesSection) continue;

    // Skip page headers
    if (line.startsWith('## Page') || line.match(/^Pokémon$/)) continue;
    if (line.match(/^\d+$/)) continue;

    // Tags line
    if (line.startsWith('[') && line.includes(']') && currentEdge) {
      currentEdge.tags = line.match(/\[([^\]]+)\]/g)?.map(t => t.slice(1, -1)) || [];
      continue;
    }

    // Prerequisites
    if (line.startsWith('Prerequisites:') || line.startsWith('Prerequisite:')) {
      if (currentEdge) {
        currentEdge.prerequisites = clean(line.replace(/Prerequisites?:/, ''));
        currentField = 'prerequisites';
      }
      continue;
    }

    // Cost
    if (line.startsWith('Cost:')) {
      if (currentEdge) {
        currentEdge.cost = clean(line.replace('Cost:', ''));
        currentField = 'cost';
      }
      continue;
    }

    // Effect
    if (line.startsWith('Effect:')) {
      if (currentEdge) {
        currentEdge.effect = clean(line.replace('Effect:', ''));
        currentField = 'effect';
      }
      continue;
    }

    // Note
    if (line.startsWith('Note:')) {
      if (currentEdge) {
        currentEdge.note = clean(line.replace('Note:', ''));
        currentField = 'note';
      }
      continue;
    }

    // Rank prerequisites (for ranked edges)
    if (line.match(/^Rank \d+ Prerequisites:/)) {
      if (currentEdge) {
        if (!currentEdge.ranks) currentEdge.ranks = [];
        currentEdge.ranks.push(clean(line));
      }
      continue;
    }

    // New edge name
    const nameMatch = line.match(/^([A-Z][A-Za-z\s']+)$/);
    if (nameMatch && !line.includes(':') && line.trim().length > 2 && line.trim().length < 50) {
      if (currentEdge && currentEdge.name) pokeEdges.push(currentEdge);
      currentEdge = { name: clean(nameMatch[1]), prerequisites: '', cost: '', effect: '' };
      currentField = null;
      continue;
    }

    // Continuation of current field
    if (currentEdge && currentField && line.trim() && !line.startsWith('##')) {
      currentEdge[currentField] += ' ' + clean(line);
    }
  }

  return pokeEdges.filter(e => e.name && (e.effect || e.cost));
}

// Parse Items
function parseItems() {
  const items = [];
  let inItemsSection = false;
  let currentCategory = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of Items section
    if (line.includes('Chapter 9:') && line.includes('Gear and Items')) {
      inItemsSection = true;
      continue;
    }

    // End of section
    if (inItemsSection && line.includes('Chapter 10:')) {
      break;
    }

    if (!inItemsSection) continue;

    // Skip page headers
    if (line.startsWith('## Page') || line.match(/^Gear and Items$/)) continue;
    if (line.match(/^\d+$/)) continue;

    // Category headers
    if (line.match(/^(Poké Balls|Medicines|Food Items|Refreshment Items|Travel Gear|Combat Items|Held Items|Evolutionary Items|Accessory Items|Pokémon Items)$/i)) {
      currentCategory = clean(line);
      continue;
    }

    // Item with price pattern: "Name: Description. Costs $X" or "Name: Description ($X)"
    const itemMatch = line.match(/^([A-Z][A-Za-z\s\-']+):\s*(.+)/);
    if (itemMatch) {
      const name = clean(itemMatch[1]);
      let description = clean(itemMatch[2]);
      let price = '';

      // Extract price
      const priceMatch = description.match(/\$[\d,]+|\bCosts?\s*\$[\d,]+/i);
      if (priceMatch) {
        price = priceMatch[0].replace(/Costs?\s*/i, '');
      }

      items.push({
        name,
        description,
        price,
        category: currentCategory
      });
    }
  }

  return items;
}

// Simplified approach - let's extract everything using a more targeted method
function extractDataSimple() {
  // Extract Edges between line markers
  const edgeStart = content.indexOf('\nEdges\nThe following is the list of Edges');
  const edgeEnd = content.indexOf('\nFeatures\nHow to Read Features');

  const edgesSection = content.slice(edgeStart, edgeEnd);
  const edges = [];

  // Pattern for edges: Name on its own line, followed by Prerequisites and Effect
  const edgePattern = /\n([A-Z][A-Za-z\s']+)\n(?:\[.*?\]\n)?Prerequisites?:\s*([^\n]+(?:\n(?![A-Z])[^\n]+)*)\n(?:Special[^\n]*\n)?Effect:\s*([^\n]+(?:\n(?![A-Z]|Prerequisites|Effect)[^\n]+)*)/g;

  let match;
  while ((match = edgePattern.exec(edgesSection)) !== null) {
    edges.push({
      name: clean(match[1]),
      prerequisites: clean(match[2]),
      effect: clean(match[3])
    });
  }

  // Extract Poké Edges
  const pokeEdgeStart = content.indexOf('\nPoké Edges\nWhile many Features');
  const pokeEdgeEnd = content.indexOf('\nPokémon Ecology\n') || content.indexOf('\nChapter 8:');

  const pokeEdgesSection = content.slice(pokeEdgeStart, pokeEdgeEnd > 0 ? pokeEdgeEnd : undefined);
  const pokeEdges = [];

  const pokeEdgePattern = /\n([A-Z][A-Za-z\s']+)\n(?:\[.*?\]\n)?(?:Rank \d+ )?Prerequisites?:\s*([^\n]+(?:\n(?![A-Z]|Cost|Effect)[^\n]+)*)\nCost:\s*([^\n]+)\nEffect:\s*([^\n]+(?:\n(?![A-Z]|Prerequisites|Cost|Note)[^\n]+)*)/g;

  while ((match = pokeEdgePattern.exec(pokeEdgesSection)) !== null) {
    pokeEdges.push({
      name: clean(match[1]),
      prerequisites: clean(match[2]),
      cost: clean(match[3]),
      effect: clean(match[4])
    });
  }

  return { edges, pokeEdges };
}

// Main execution
console.log('Parsing Core book data...\n');

const { edges, pokeEdges } = extractDataSimple();

console.log(`Found ${edges.length} Trainer Edges`);
console.log(`Found ${pokeEdges.length} Poké Edges`);

// Save edges
fs.writeFileSync(
  path.join(dataDir, 'edges.json'),
  JSON.stringify(edges, null, 2)
);
console.log('Saved edges.json');

// Save poke edges
fs.writeFileSync(
  path.join(dataDir, 'poke-edges.json'),
  JSON.stringify(pokeEdges, null, 2)
);
console.log('Saved poke-edges.json');

// Now let's also parse items from the items section more carefully
function parseItemsDetailed() {
  const items = [];

  // Find items section
  const itemsStart = content.indexOf('Chapter 9:');
  const itemsEnd = content.indexOf('Chapter 10:') || content.length;
  const itemsSection = content.slice(itemsStart, itemsEnd);

  // Medicine items table pattern
  const medicinePattern = /\n(Potion|Super Potion|Hyper Potion|Max Potion|Full Restore|Antidote|Awakening|Burn Heal|Ice Heal|Paralyze Heal|Full Heal|Revive|Max Revive|Energy[^\n]+|Ether|Max Ether|Elixir|Max Elixir)\n([^\n]+)\n\$?([\d,]+)/g;

  while ((match = medicinePattern.exec(itemsSection)) !== null) {
    items.push({
      name: clean(match[1]),
      effect: clean(match[2]),
      price: '$' + match[3],
      category: 'Medicine'
    });
  }

  // General item pattern: "ItemName: Description. Costs $X"
  const generalPattern = /([A-Z][A-Za-z\s\-']+):\s*([^$\n]+(?:\$[\d,]+[^.\n]*)?\.?)/g;

  while ((match = generalPattern.exec(itemsSection)) !== null) {
    const name = clean(match[1]);
    const desc = clean(match[2]);

    // Skip if it's a header or too short
    if (name.length < 3 || name.length > 40) continue;
    if (name.match(/^(Chapter|Page|Effect|Prerequisites|Note|Cost|Target|Trigger)/)) continue;

    const priceMatch = desc.match(/\$[\d,]+/);

    items.push({
      name,
      effect: desc,
      price: priceMatch ? priceMatch[0] : '',
      category: 'General'
    });
  }

  return items;
}

const items = parseItemsDetailed();
console.log(`Found ${items.length} Items`);

fs.writeFileSync(
  path.join(dataDir, 'items.json'),
  JSON.stringify(items.slice(0, 500), null, 2) // Limit to prevent duplicates
);
console.log('Saved items.json');

// Parse features - this is more complex, let's do a targeted extraction
function parseFeaturesDetailed() {
  const features = [];

  // Find the features listing sections - there are many throughout the book
  // Let's find key feature sections
  const featureSections = [
    { start: 'General Features', end: 'Pokémon Raising' },
    { start: 'Pokémon Raising and Battling Features', end: 'Pokémon Training' },
    { start: 'Combat Features', end: 'Other Features' }
  ];

  // Feature pattern: Name, [Tags], Prerequisites, Frequency, Effect
  const featurePattern = /\n([A-Z][A-Za-z\s']+)\n\[([^\]]+)\]\nPrerequisites?:\s*([^\n]+)\n([^\n]*(?:Static|At-Will|Daily|Scene|AP|Standard|Free|Swift|Extended)[^\n]*)\n(?:Trigger:\s*([^\n]+)\n)?(?:Target:\s*([^\n]+)\n)?Effect:\s*([^\n]+(?:\n(?![A-Z\[]|Prerequisites|Effect|Note|Trigger)[^\n]+)*)/g;

  let match;
  while ((match = featurePattern.exec(content)) !== null) {
    features.push({
      name: clean(match[1]),
      tags: match[2].split(',').map(t => t.trim()),
      prerequisites: clean(match[3]),
      frequency: clean(match[4]),
      trigger: match[5] ? clean(match[5]) : undefined,
      target: match[6] ? clean(match[6]) : undefined,
      effect: clean(match[7])
    });
  }

  return features;
}

const features = parseFeaturesDetailed();
console.log(`Found ${features.length} Trainer Features`);

fs.writeFileSync(
  path.join(dataDir, 'features.json'),
  JSON.stringify(features, null, 2)
);
console.log('Saved features.json');

console.log('\nDone parsing Core book data!');
