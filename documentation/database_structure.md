# Pokedex

## Core Tables

```sql
-- One row per species 
CREATE TABLE species (
  id            SERIAL PRIMARY KEY,
  dex_no        INTEGER NOT NULL,             -- National number
  name          TEXT    NOT NULL,             -- "Skorupi"
  size_class    TEXT,                          -- Small / Medium / etc (free text)
  height_m      NUMERIC(4,2),
  weight_kg     NUMERIC(5,2),
  weight_class  INTEGER,                       -- PTU weight class
  male_ratio    NUMERIC(4,3) CHECK (male_ratio BETWEEN 0 AND 1), -- 0.50 for 50% M
  hatch_days    INTEGER,                        -- "Average Hatch Rate"
  notes         TEXT                            -- any extra per-entry free text
);

-- Base stats
CREATE TABLE base_stats (
  species_id  INTEGER PRIMARY KEY REFERENCES species(id) ON DELETE CASCADE,
  hp          INTEGER NOT NULL,
  attack      INTEGER NOT NULL,
  defense     INTEGER NOT NULL,
  sp_attack   INTEGER NOT NULL,
  sp_defense  INTEGER NOT NULL,
  speed       INTEGER NOT NULL
);

-- Types and mapping
CREATE TABLE types (
  id   SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL            -- Bug, Poison, etc.
);

CREATE TABLE species_types (
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  type_id    INTEGER REFERENCES types(id),
  slot       SMALLINT CHECK (slot IN (1,2)) DEFAULT 1, -- 1st/2nd type
  PRIMARY KEY (species_id, slot)
);

-- Abilities and mapping (PTU has Basic 1/2, Advanced 1/2, High)
CREATE TABLE abilities (
  id   SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE species_abilities (
  species_id  INTEGER REFERENCES species(id) ON DELETE CASCADE,
  ability_id  INTEGER REFERENCES abilities(id),
  slot        TEXT NOT NULL CHECK (slot IN
              ('basic1','basic2','advanced1','advanced2','high')),
  PRIMARY KEY (species_id, slot)
);
```

## Skills 

```sql
CREATE TABLE skills (
  id   SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,        -- Athl, Acro, Combat, Stealth, Percep, Focus
  name TEXT UNIQUE NOT NULL
);

-- Store the PTU dice expression as text ("2d6+1")
CREATE TABLE species_skills (
  species_id  INTEGER REFERENCES species(id) ON DELETE CASCADE,
  skill_id    INTEGER REFERENCES skills(id),
  dice_expr   TEXT NOT NULL,
  PRIMARY KEY (species_id, skill_id)
);
```

## Capabilities

```sql
CREATE TABLE capabilities (
  id   SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL          -- Overland, Swim, Jump, Power, Naturewalk, Underdog, ...
);

CREATE TABLE species_capabilities (
  species_id  INTEGER REFERENCES species(id) ON DELETE CASCADE,
  capability_id INTEGER REFERENCES capabilities(id),
  val1        NUMERIC,               -- e.g., Overland = 4, Jump long
  val2        NUMERIC,               -- Jump high
  text_value  TEXT,                  -- e.g., "Forest, Marsh, Rainforest"
  PRIMARY KEY (species_id, capability_id)
);
```

## Moves and Learnsets

```sql
-- Master move list (store more columns as you need)
CREATE TABLE moves (
  id        SERIAL PRIMARY KEY,
  name      TEXT UNIQUE NOT NULL,
  type_id   INTEGER REFERENCES types(id),        -- Move type
  category  TEXT CHECK (category IN ('Physical','Special','Status')) NULL,
  frequency TEXT,                                -- At-Will, Scene, etc.
  ac        INTEGER, db INTEGER, range TEXT, keywords TEXT, effect TEXT
);

-- Level-up moves
CREATE TABLE species_levelup_moves (
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  move_id    INTEGER REFERENCES moves(id),
  level      INTEGER NOT NULL,
  PRIMARY KEY (species_id, move_id, level)
);

-- TM/HM catalogue (PTU uses numeric + A-codes)
CREATE TABLE tmhm (
  code   TEXT PRIMARY KEY,          -- e.g., 'A1', '01', '06', '94', '97'
  move_id INTEGER NOT NULL REFERENCES moves(id),
  name   TEXT UNIQUE NOT NULL       -- Redundant but handy
);

CREATE TABLE species_tmhm (
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  tm_code    TEXT REFERENCES tmhm(code),
  PRIMARY KEY (species_id, tm_code)
);

-- Egg and Tutor lists
CREATE TABLE species_egg_moves (
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  move_id    INTEGER REFERENCES moves(id),
  PRIMARY KEY (species_id, move_id)
);

CREATE TABLE species_tutor_moves (
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  move_id    INTEGER REFERENCES moves(id),
  PRIMARY KEY (species_id, move_id)
);
```

## Evolution

```sql
CREATE TABLE evolutions (
  from_species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  to_species_id   INTEGER REFERENCES species(id) ON DELETE CASCADE,
  trigger         TEXT NOT NULL,      -- 'level', 'item', 'trade', 'other'
  min_level       INTEGER,
  item_name       TEXT,
  condition_text  TEXT,               -- free-form e.g. "min level 40"
  PRIMARY KEY (from_species_id, to_species_id, trigger, COALESCE(min_level,0), COALESCE(item_name,''))
);
```


## Breeding, Habitat, Diet

```sql
CREATE TABLE egg_groups (
  id   SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL          -- Bug, Water 3, etc.
);

CREATE TABLE species_egg_groups (
  species_id  INTEGER REFERENCES species(id) ON DELETE CASCADE,
  egg_group_id INTEGER REFERENCES egg_groups(id),
  PRIMARY KEY (species_id, egg_group_id)
);

CREATE TABLE habitats (
  id   SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL          -- Forest, Marsh, Rainforest, etc.
);

CREATE TABLE species_habitats (
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  habitat_id INTEGER REFERENCES habitats(id),
  PRIMARY KEY (species_id, habitat_id)
);

CREATE TABLE diets (
  id   SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL          -- Carnivore, Herbivore, etc.
);

CREATE TABLE species_diets (
  species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
  diet_id    INTEGER REFERENCES diets(id),
  PRIMARY KEY (species_id, diet_id)
);
```

## Minimal Seeding Example

```sql
-- Types
INSERT INTO types (name) VALUES ('Bug'), ('Poison');

-- Abilities (names only here)
INSERT INTO abilities (name) VALUES
  ('Battle Armor'), ('Sniper'), ('Keen Eye'), ('Strong Jaw'), ('Vicious');

-- Skills
INSERT INTO skills (code, name) VALUES
  ('Athl','Athletics'), ('Acro','Acrobatics'), ('Combat','Combat'),
  ('Stealth','Stealth'), ('Percep','Perception'), ('Focus','Focus');

-- Capabilities
INSERT INTO capabilities (name) VALUES
  ('Overland'),('Swim'),('Jump'),('Power'),('Naturewalk'),('Underdog');

-- Moves (a few)
INSERT INTO moves (name) VALUES
  ('Bite'), ('Poison Sting'), ('Leer'), ('Knock Off'),
  ('Pin Missile'), ('Pursuit'), ('Bug Bite'), ('Poison Fang'),
  ('Venoshock'), ('Hone Claws'), ('Toxic'), ('Dark Pulse'), ('Rock Smash');

-- TM/HM (subset)
INSERT INTO tmhm (code, move_id, name)
SELECT x.code, m.id, x.name
FROM (VALUES
  ('A1','Cut'),('A4','Strength'),('01','Hone Claws'),('06','Toxic'),
  ('09','Venoshock'),('94','Rock Smash'),('97','Dark Pulse')
) AS x(code,name)
JOIN moves m ON m.name = x.name;

-- Skorupi
INSERT INTO species (dex_no, name, size_class, height_m, weight_kg, weight_class, male_ratio, hatch_days)
VALUES (451, 'Skorupi', 'Small', 0.8, 12.0, 2, 0.50, 10);

INSERT INTO base_stats (species_id, hp, attack, defense, sp_attack, sp_defense, speed)
SELECT id, 4, 5, 9, 3, 6, 7 FROM species WHERE name='Skorupi';

-- Types
INSERT INTO species_types (species_id, type_id, slot)
SELECT s.id, t.id, 1 FROM species s JOIN types t ON t.name='Poison' WHERE s.name='Skorupi';
INSERT INTO species_types (species_id, type_id, slot)
SELECT s.id, t.id, 2 FROM species s JOIN types t ON t.name='Bug' WHERE s.name='Skorupi';

-- Abilities
INSERT INTO species_abilities (species_id, ability_id, slot)
SELECT s.id, a.id, 'basic1' FROM species s JOIN abilities a ON a.name='Battle Armor' WHERE s.name='Skorupi';
INSERT INTO species_abilities (species_id, ability_id, slot)
SELECT s.id, a.id, 'basic2' FROM species s JOIN abilities a ON a.name='Sniper' WHERE s.name='Skorupi';
INSERT INTO species_abilities (species_id, ability_id, slot)
SELECT s.id, a.id, 'advanced1' FROM species s JOIN abilities a ON a.name='Keen Eye' WHERE s.name='Skorupi';
INSERT INTO species_abilities (species_id, ability_id, slot)
SELECT s.id, a.id, 'advanced2' FROM species s JOIN abilities a ON a.name='Strong Jaw' WHERE s.name='Skorupi';
INSERT INTO species_abilities (species_id, ability_id, slot)
SELECT s.id, a.id, 'high' FROM species s JOIN abilities a ON a.name='Vicious' WHERE s.name='Skorupi';

-- Skills
INSERT INTO species_skills (species_id, skill_id, dice_expr)
SELECT s.id, k.id, v.dice
FROM species s, skills k
JOIN (VALUES
  ('Athl','2d6+1'),('Acro','1d6+1'),('Combat','2d6+1'),
  ('Stealth','3d6+1'),('Percep','2d6'),('Focus','2d6')
) AS v(code,dice) ON v.code = k.code
WHERE s.name='Skorupi';

-- Capabilities
INSERT INTO species_capabilities (species_id, capability_id, val1)
SELECT s.id, c.id, 4 FROM species s JOIN capabilities c ON c.name='Overland' WHERE s.name='Skorupi';
INSERT INTO species_capabilities (species_id, capability_id, val1)
SELECT s.id, c.id, 2 FROM species s JOIN capabilities c ON c.name='Swim' WHERE s.name='Skorupi';
INSERT INTO species_capabilities (species_id, capability_id, val1, val2)
SELECT s.id, c.id, 1, 1 FROM species s JOIN capabilities c ON c.name='Jump' WHERE s.name='Skorupi';
INSERT INTO species_capabilities (species_id, capability_id, val1)
SELECT s.id, c.id, 2 FROM species s JOIN capabilities c ON c.name='Power' WHERE s.name='Skorupi';
INSERT INTO species_capabilities (species_id, capability_id, text_value)
SELECT s.id, c.id, 'Forest, Marsh, Rainforest'
FROM species s JOIN capabilities c ON c.name='Naturewalk' WHERE s.name='Skorupi';
INSERT INTO species_capabilities (species_id, capability_id)
SELECT s.id, c.id FROM species s JOIN capabilities c ON c.name='Underdog' WHERE s.name='Skorupi';

-- Level-up moves (subset)
INSERT INTO species_levelup_moves (species_id, move_id, level)
SELECT s.id, m.id, v.level
FROM species s
JOIN moves m ON m.name = v.move
JOIN (VALUES
  (1,'Bite'), (1,'Poison Sting'), (1,'Leer'),
  (5,'Knock Off'), (9,'Pin Missile'), (16,'Pursuit'),
  (20,'Bug Bite'), (31,'Scary Face')  -- add the rest as needed
) AS v(level, move) ON TRUE
WHERE s.name='Skorupi';

-- TM/HM access (subset)
INSERT INTO species_tmhm (species_id, tm_code)
SELECT s.id, x.code
FROM species s
JOIN (VALUES ('A1'),('A4'),('01'),('06'),('09'),('94'),('97')) AS x(code) ON TRUE
WHERE s.name='Skorupi';

-- Egg groups, habitat, diet
INSERT INTO egg_groups (name) VALUES ('Bug') ON CONFLICT DO NOTHING;
INSERT INTO egg_groups (name) VALUES ('Water 3') ON CONFLICT DO NOTHING;
INSERT INTO habitats (name) VALUES ('Forest'), ('Marsh'), ('Rainforest') ON CONFLICT DO NOTHING;
INSERT INTO diets (name) VALUES ('Carnivore') ON CONFLICT DO NOTHING;

INSERT INTO species_egg_groups (species_id, egg_group_id)
SELECT s.id, g.id FROM species s, egg_groups g
WHERE s.name='Skorupi' AND g.name IN ('Bug','Water 3');

INSERT INTO species_habitats (species_id, habitat_id)
SELECT s.id, h.id FROM species s, habitats h
WHERE s.name='Skorupi' AND h.name IN ('Forest','Marsh','Rainforest');

INSERT INTO species_diets (species_id, diet_id)
SELECT s.id, d.id FROM species s, diets d
WHERE s.name='Skorupi' AND d.name='Carnivore';

-- Evolution (Skorupi -> Drapion at min level 40)
-- (Insert Drapion row first in species, then…)
INSERT INTO evolutions (from_species_id, to_species_id, trigger, min_level, condition_text)
SELECT s1.id, s2.id, 'level', 40, 'Minimum 40'
FROM species s1, species s2
WHERE s1.name='Skorupi' AND s2.name='Drapion';
```

# Trainers

```sql
CREATE TABLE trainers (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,          -- e.g., "Rika"
  player     BOOLEAN NOT NULL DEFAULT FALSE, -- is this a player character?
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

# Pokemon Instances

```sql
-- One row per actual Pokémon in the world
CREATE TABLE pokemon_instances (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id   INTEGER NOT NULL REFERENCES species(id),
  form_id      INTEGER REFERENCES forms(id),   -- null if you don't use forms
  nickname     TEXT,
  level        INTEGER,                         -- PTU level
  gender       TEXT CHECK (gender IN ('M','F','N/A','Unknown')) DEFAULT 'Unknown',
  nature       TEXT,
  ability_id   INTEGER REFERENCES abilities(id),-- the *chosen* ability
  shiny        BOOLEAN NOT NULL DEFAULT FALSE,
  captured_at  TIMESTAMPTZ,
  ball         TEXT,                            -- Poké Ball type
  status       TEXT,                            -- Burned, etc. (optional)
  height_m     NUMERIC(4,2),                    -- per-mon overrides (optional)
  weight_kg    NUMERIC(5,2),
  notes        TEXT
);
```

## Known Moves

```sql
CREATE TABLE pokemon_known_moves (
  pokemon_id UUID REFERENCES pokemon_instances(id) ON DELETE CASCADE,
  move_id    INTEGER REFERENCES moves(id),
  how_learned TEXT,                -- level/tm/tutor/egg/other
  learned_at_level INTEGER,
  PRIMARY KEY (pokemon_id, move_id)
);
```

## Capability mods (edges, items, GM rulings)

```sql
CREATE TABLE pokemon_capability_mods (
  pokemon_id    UUID REFERENCES pokemon_instances(id) ON DELETE CASCADE,
  capability_id INTEGER REFERENCES capabilities(id),
  delta_val1    NUMERIC,
  delta_val2    NUMERIC,
  text_note     TEXT,
  PRIMARY KEY (pokemon_id, capability_id)
);
```

# Links between Pokémon and trainers (many-to-many, with time)

```sql
CREATE TABLE pokemon_trainer_links (
  pokemon_id  UUID    NOT NULL REFERENCES pokemon_instances(id) ON DELETE CASCADE,
  trainer_id  INTEGER NOT NULL REFERENCES trainers(id)          ON DELETE CASCADE,
  role        TEXT    NOT NULL DEFAULT 'owner',   -- owner, caretaker, breeder, loan, etc.
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,     -- optional: designate a main handler
  started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at    TIMESTAMPTZ,
  PRIMARY KEY (pokemon_id, trainer_id, started_at)
);

-- No duplicate "active" link for the same pair
CREATE UNIQUE INDEX uniq_active_link
  ON pokemon_trainer_links(pokemon_id, trainer_id)
  WHERE ended_at IS NULL;

```

# Handy Views and Queries

```sql
-- Current ownership view
CREATE VIEW current_pokemon_trainers AS
SELECT *
FROM pokemon_trainer_links
WHERE ended_at IS NULL;

-- All Pokémon a trainer currently has
SELECT p.*
FROM pokemon_instances p
JOIN current_pokemon_trainers l ON l.pokemon_id = p.id
WHERE l.trainer_id = $1;

-- All trainers for a given Pokémon right now
SELECT t.*
FROM trainers t
JOIN current_pokemon_trainers l ON l.trainer_id = t.id
WHERE l.pokemon_id = $1;

-- Pokémon with no current trainer (wild/PC box/NPC storage)
SELECT p.*
FROM pokemon_instances p
LEFT JOIN current_pokemon_trainers l ON l.pokemon_id = p.id
WHERE l.pokemon_id IS NULL;

-- Transfer to a new sole owner (example):
-- 1) end all active links
UPDATE pokemon_trainer_links
SET ended_at = now()
WHERE pokemon_id = $pokemon AND ended_at IS NULL;

-- 2) add the new owner
INSERT INTO pokemon_trainer_links (pokemon_id, trainer_id, role, is_primary)
VALUES ($pokemon, $trainer, 'owner', TRUE);
```

# Example Inserts

```sql
-- A Skorupi instance (ties back to your species table)
INSERT INTO pokemon_instances (species_id, nickname, level, gender)
SELECT s.id, 'Pinchy', 15, 'F' FROM species s WHERE s.name='Skorupi'
RETURNING id;  -- save this as :pinchy

-- Two trainers
INSERT INTO trainers (name) VALUES ('Jules'), ('Mina') RETURNING id;

-- Co-ownership (many trainers at once)
INSERT INTO pokemon_trainer_links (pokemon_id, trainer_id, role, is_primary)
VALUES (:pinchy, :jules, 'owner', TRUE),
       (:pinchy, :mina,  'owner', FALSE);
```
