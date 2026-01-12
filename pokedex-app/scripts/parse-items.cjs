const fs = require('fs');
const path = require('path');

const coreBookPath = path.join(__dirname, '../../books/markdown/Pokemon Tabletop United 1.05 Core.md');
const dataDir = path.join(__dirname, '../data');

const content = fs.readFileSync(coreBookPath, 'utf-8');
const lines = content.split('\n');

const clean = (text) => text?.trim().replace(/\s+/g, ' ') || '';

const items = [];

// Find items chapter (Chapter 9) - need to find the actual chapter, not TOC
// The actual chapter starts around line 17538 with "Chapter 9:" on its own line
const chapter9Idx = lines.findIndex((l, i) => i > 15000 && l.trim().startsWith('Chapter 9:'));
const chapter10Idx = lines.findIndex((l, i) => i > chapter9Idx && l.includes('Chapter 10'));

console.log(`Chapter 9 starts at line ${chapter9Idx}, Chapter 10 at ${chapter10Idx}`);

const endIdx = chapter10Idx > 0 ? chapter10Idx : lines.length;

let currentCategory = 'General';
let state = 'seeking'; // seeking, got_name, collecting_effect
let currentItem = null;

const skipWords = new Set([
  'Item', 'Effect', 'Cost', 'Equipment', 'Effects', 'Name', 'Tier Spr',
  'Gear and Items', 'Cost '
]);

const categoryPatterns = [
  'Basic Restoratives', 'X-Items', 'Bandages and Poultices', 'Snacks',
  'Refreshments', 'Herbs', 'Apricorns', 'Medicines', 'Food Items',
  'Travel Gear', 'Trainer Equipment', 'Body Equipment', 'Head Equipment',
  'Feet Equipment', 'Hand Equipment', 'Accessory Items', 'Held Items',
  'Evolutionary Items', 'Combat Items', 'Type-Boosting Items', 'Mega Stones',
  'Poké Balls', 'Berry Chart', 'Pokémon Items'
];

for (let i = chapter9Idx; i < endIdx; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Skip empty lines
  if (!trimmed) continue;

  // Skip page markers
  if (trimmed.startsWith('## Page') || /^\d+$/.test(trimmed)) continue;

  // Skip table headers
  if (skipWords.has(trimmed)) continue;

  // Check for category
  const isCat = categoryPatterns.some(p => trimmed === p || trimmed.startsWith(p));
  if (isCat) {
    // Save current item if any
    if (currentItem && currentItem.name) {
      items.push(currentItem);
    }
    currentCategory = trimmed;
    currentItem = null;
    state = 'seeking';
    continue;
  }

  // Check if this is a price line
  const isPrice = /^\$[\d,]+$/.test(trimmed) || trimmed === '---';

  if (isPrice) {
    if (currentItem) {
      currentItem.price = trimmed === '---' ? 'Rare' : trimmed;
      items.push(currentItem);
      currentItem = null;
    }
    state = 'seeking';
    continue;
  }

  // Check if this looks like an item name (short, capitalized, no period)
  // Item names are typically 1-4 words, no verbs or articles
  const couldBeName = trimmed.length > 1 &&
                      trimmed.length < 35 &&
                      /^[A-Z][a-zA-Z\-'\s]*$/.test(trimmed) &&
                      !trimmed.endsWith('.') &&
                      !trimmed.endsWith(',') &&
                      !trimmed.endsWith(':') &&
                      trimmed.split(' ').length <= 5 &&
                      !/^(The |A |An |If |When |While |This |These |For |You |Using |During |By |Some |All |On |At |In )/.test(trimmed) &&
                      !/^(HP |AC |DC |See |Cannot|Grants|Increases|Decreases|Heals|Cures|Restores|Used|Pokémon|Trainer|Standard|Action|Effect|Note|GM|Be )/.test(trimmed) &&
                      !/(will|can|may|are|is|be|have|has|does|do|was|were|would|could|should) /i.test(trimmed) &&
                      !trimmed.includes(' or ') &&
                      !trimmed.includes(' and ') &&
                      !trimmed.includes(' the ') &&
                      !trimmed.includes(' to ') &&
                      !trimmed.includes(' of ');

  if (state === 'seeking' && couldBeName) {
    // Start new item
    currentItem = {
      name: trimmed,
      category: currentCategory,
      effect: '',
      price: ''
    };
    state = 'collecting_effect';
    continue;
  }

  // Collecting effect text
  if (state === 'collecting_effect' && currentItem) {
    // Check if line ends with price
    const priceAtEnd = trimmed.match(/^(.+?)\s+(\$[\d,]+)$/);
    if (priceAtEnd) {
      currentItem.effect += (currentItem.effect ? ' ' : '') + priceAtEnd[1];
      currentItem.price = priceAtEnd[2];
      items.push(currentItem);
      currentItem = null;
      state = 'seeking';
      continue;
    }

    // Check if this is actually a new item name (effect was on same line as name, now we see next item)
    // This happens when effect is combined with name like "Energy Powder Heals 25 Hit Points - Repulsive"
    if (couldBeName && !trimmed.startsWith('and ') && !trimmed.startsWith('or ')) {
      // Previous item had no separate effect, name might include effect
      const nameEffectMatch = currentItem.name.match(/^([A-Za-z\s\-']+?)\s+(Heals|Cures|Grants|Increases|Restores|Removes|The |A |An ).+$/i);
      if (nameEffectMatch) {
        currentItem.name = nameEffectMatch[1].trim();
        currentItem.effect = currentItem.name.slice(nameEffectMatch[1].length).trim();
      }
      // Save and start new
      if (currentItem.name) items.push(currentItem);
      currentItem = {
        name: trimmed,
        category: currentCategory,
        effect: '',
        price: ''
      };
      continue;
    }

    currentItem.effect += (currentItem.effect ? ' ' : '') + trimmed;
  }
}

// Save last item
if (currentItem && currentItem.name) {
  items.push(currentItem);
}

// Clean and dedupe
const junkNames = new Set([
  'Spr', 'Ball Name', 'Modifier', 'Tier', 'Combat Stages', 'Price', 'Yield Roll',
  'Plant Type', 'By', 'Black', 'Energy', 'Roots', 'Big', 'Poffin Ingredient',
  'Weapons', 'Weapon Moves', 'Dark Vision', 'Running', 'Glue', 'Held Item',
  'Evolutionary Stones', 'Pansear', 'Revival', 'Chapter', 'Berries'
]);

const cleanedItems = items
  .map(item => ({
    name: clean(item.name),
    category: item.category,
    effect: clean(item.effect),
    price: item.price || ''
  }))
  .filter(item =>
    item.name.length > 2 &&
    !skipWords.has(item.name) &&
    !junkNames.has(item.name) &&
    item.effect.length > 5 &&
    !item.name.includes(':') &&
    !item.category.includes(' cannot ') &&
    !item.category.includes(' may ') &&
    !item.category.includes(' are ')
  );

// Dedupe by name
const seen = new Set();
const uniqueItems = cleanedItems.filter(item => {
  const key = item.name.toLowerCase();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

console.log(`Parsed ${uniqueItems.length} items`);
console.log('\nSample items by category:');
const byCategory = {};
uniqueItems.forEach(item => {
  if (!byCategory[item.category]) byCategory[item.category] = [];
  byCategory[item.category].push(item);
});
Object.entries(byCategory).forEach(([cat, catItems]) => {
  console.log(`\n${cat} (${catItems.length}):`);
  catItems.slice(0, 3).forEach(item => {
    console.log(`  - ${item.name}: ${item.effect.slice(0, 40)}... ${item.price}`);
  });
});

fs.writeFileSync(
  path.join(dataDir, 'items.json'),
  JSON.stringify(uniqueItems, null, 2)
);

console.log('\nSaved items.json');
