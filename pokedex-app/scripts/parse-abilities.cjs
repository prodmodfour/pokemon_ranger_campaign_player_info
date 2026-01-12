const fs = require('fs');
const path = require('path');

const CORE_BOOK_PATH = path.join(__dirname, '../../books/markdown/Pokemon Tabletop United 1.05 Core.md');
const ABILITIES_PATH = path.join(__dirname, '../data/abilities.json');

// Read the core book
const content = fs.readFileSync(CORE_BOOK_PATH, 'utf-8');
const lines = content.split('\n');

// Find ability definitions
const abilities = new Map();

// Pattern: "Ability: Name" followed by trigger type and effect
let currentAbility = null;
let collectingEffect = false;
let effectLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Check for ability header
  const abilityMatch = line.match(/^Ability:\s*(.+)$/);
  if (abilityMatch) {
    // Save previous ability if exists
    if (currentAbility && effectLines.length > 0) {
      abilities.set(currentAbility.name.toLowerCase(), {
        name: currentAbility.name,
        trigger: currentAbility.trigger,
        effect: effectLines.join(' ').trim()
      });
    }

    currentAbility = {
      name: abilityMatch[1].trim(),
      trigger: null
    };
    effectLines = [];
    collectingEffect = false;
    continue;
  }

  if (currentAbility) {
    // Check for trigger type (Static, At-Will, Scene, Daily, etc.)
    if (!currentAbility.trigger && line.match(/^(Static|At-Will|Scene|Daily|Weekly)/i)) {
      currentAbility.trigger = line.trim();
      continue;
    }

    // Check for Effect: line
    if (line.match(/^Effect:/)) {
      collectingEffect = true;
      const effectText = line.replace(/^Effect:\s*/, '');
      if (effectText) effectLines.push(effectText);
      continue;
    }

    // Continue collecting effect text until next Ability: or empty section
    if (collectingEffect) {
      // Stop if we hit certain patterns
      if (line.match(/^Ability:/) || line.match(/^##\s*Page/) || line.trim() === '') {
        if (line.trim() === '' && effectLines.length < 3) {
          // Allow some blank lines in effects
          continue;
        }
        // Save and reset
        if (effectLines.length > 0) {
          abilities.set(currentAbility.name.toLowerCase(), {
            name: currentAbility.name,
            trigger: currentAbility.trigger,
            effect: effectLines.join(' ').trim()
          });
        }
        if (!line.match(/^Ability:/)) {
          currentAbility = null;
          collectingEffect = false;
          effectLines = [];
        }
      } else if (line.match(/^(Target|Trigger|Note|Keywords|Frequency):/)) {
        // Add these to the effect description
        effectLines.push(line.trim());
      } else if (line.trim()) {
        effectLines.push(line.trim());
      }
    }
  }
}

// Save last ability
if (currentAbility && effectLines.length > 0) {
  abilities.set(currentAbility.name.toLowerCase(), {
    name: currentAbility.name,
    trigger: currentAbility.trigger,
    effect: effectLines.join(' ').trim()
  });
}

console.log(`Parsed ${abilities.size} ability definitions`);

// Load existing abilities and merge
const existingAbilities = JSON.parse(fs.readFileSync(ABILITIES_PATH, 'utf-8'));

// Update with definitions
const updatedAbilities = existingAbilities.map(ability => {
  const definition = abilities.get(ability.name.toLowerCase());
  if (definition) {
    return {
      ...ability,
      trigger: definition.trigger,
      effect: definition.effect
    };
  }
  return ability;
});

// Count how many got definitions
const withDefs = updatedAbilities.filter(a => a.effect).length;
console.log(`${withDefs} abilities now have definitions`);

// Write back
fs.writeFileSync(ABILITIES_PATH, JSON.stringify(updatedAbilities, null, 2));
console.log('Updated abilities.json');
