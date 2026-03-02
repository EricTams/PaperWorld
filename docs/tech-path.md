# Initial Tech Path
*Brainstorm — not a final spec*

---

## Purpose

Map the first ~20 things the player can make, in what order, at what station, and what each step teaches. This document is a working sketch for the early crafting progression.

See [grimoire_design_doc.md](./grimoire_design_doc.md) for the broader game design.

---

## Design Goals

### Start Narrow
The player begins with two collectible materials: **sticks** and **stones**. That is it. Every new material, tool, and station is an unlock that expands what the player can do. Complexity is earned through pacing.

### Continuous Unfolding
Every tier teaches something new. There is no tutorial phase that ends — the game is always introducing the next concept, the next interaction, the next layer of depth. Each tier should feel like a small revelation.

### Grounded Chemistry
Crafting processes mirror real-world chemistry: grinding, drying, boiling, calcination, fermentation, distillation. The player builds intuition because the processes behave the way they would expect from real life. The ingredients are magical; the processes are not.

### Failure Case
The player is overwhelmed. Too many materials, too many stations, too many recipes at once. If the player ever feels lost about what to do next, the pacing has failed. Each tier introduces at most one new station and a small handful of new crafts.

---

## Starting Materials

The player can pick up **sticks** and **stones** from the ground with bare hands. These are the only freely collectible materials at the start. Everything else requires a tool or unlock:

- **Herbs** — require the stone knife to cut. Found in grasslands and forests.
- **Berries** — gathering method TBD.

Other materials (for later tiers) are discovered through exploration and are not available in the starting area.

---

## Crafting Modes

### Pocket Crafting
Accessed from the player inventory (Tab key). The inventory screen has two panels:

- **Left side:** inventory slots showing what the player is carrying.
- **Right side:** tabs — one for recipes (active), one for paperdoll (future).

The recipe tab shows a list of things the player can hand-craft with required ingredients listed. If they have the materials, they craft it right there. No station needed.

Pocket-crafted items include stations (mortar and pestle, drying rack), tools (stone knife), and utility items (basket, campfire).

### Station Crafting
Performed at a placed station in the world. The player interacts with the station and drives the process — grinding, drying, boiling. Station crafting involves a physical process, not just combining inputs.

### Stacking Rules
- **Materials** stack in inventory (stones, sticks, herbs, stone powder, etc.).
- **Stations and tools** do not stack. They are unique physical objects.

---

## Station Progression

Stations unlock in this order. Each one expands what the player can do.

| Order | Station | Process | Made From |
|-------|---------|---------|-----------|
| 1 | Mortar and Pestle | Grinding, crushing | Pocket-crafted from 2 stones |
| 2 | Drying Rack | Dehydrating, curing, sheet-forming | Pocket-crafted from sticks |
| 3 | Magic Circle | Casting basic magics | Stone powder (as chalk) drawn on the ground |
| 4 | Cauldron | Boiling, decoction, brewing | Stone shaped via Stone Shaping, heated via Fire Taming, filled via Water Calling |
| 5 | Campfire | Light, simple cooking/roasting | Pocket-crafted from sticks + stones, placed in world |
| 6 | Stone Furnace | Calcination, firing, charring | Stone shaped + clay, heated via Fire Taming |
| 7 | Fermentation Crock | Fermentation, acid production | Fired clay vessel + fitted lid |
| 8 | Distillation Still | Distillation, steam extraction | Fired clay + tubing |

The first two stations are mundane — built from sticks and stones before the grimoire exists. The magic circle is the first magical station, made possible by the grimoire. The cauldron and furnace both require basic magics. The crock and still require fired clay from the furnace.

---

## The Three Basic Magics

Foundational abilities learned through the grimoire. These are not potions or items — they are knowledge that enables new kinds of crafting.

### Stone Shaping
Magically form stone into tools and structures. Enables the stone knife, cauldron basin, and furnace construction.

**Learned by feeding stone powder into the grimoire.** This is the player's very first research experiment. It establishes the grimoire's core mechanic: feed it materials, gain knowledge.

### Water Calling
Summon water from the environment. Enables water supply for potions and chemistry without needing to find a water source.

*(Open question: how is this learned? Same grimoire-feeding pattern with a different material? Learned at the magic circle? Unlocked through use?)*

### Fire Taming
Create and control fire. Enables heating the cauldron and furnace without flint or kindling mechanics.

*(Open question: same as Water Calling — learning method TBD.)*

---

## The Crafts — Tier by Tier

### Tier 0 — Pocket Crafting, No Station

| # | Craft | Made From | Made At |
|---|-------|-----------|---------|
| 1 | Mortar and Pestle | 2 stones | Pocket |
| 2 | Drying Rack | Sticks | Pocket |
| 3 | Basket | Sticks | Pocket |
| 4 | Campfire | Sticks + stones | Pocket (placed in world) |

**What the player learns:** you can build things from what you find. Stations and utility items are physical objects you place in the world. The basket gives extra carrying capacity. The campfire gives light and simple cooking.

---

### Tier 1 — Mortar + Drying Rack

| # | Craft | Made From | Made At |
|---|-------|-----------|---------|
| 5 | Wood Pulp | Sticks | Mortar |
| 6 | Paper | Wood pulp | Drying Rack |
| 7 | Grimoire | Paper + sticks | Pocket (hand-bound) |

**What the player learns:** stations transform materials. One station's output feeds into another — sticks become pulp at the mortar, pulp becomes paper at the drying rack. The grimoire is the player's first multi-step craft.

---

### Tier 2 — First Research + Basic Magics

| # | Craft | Made From | Made At |
|---|-------|-----------|---------|
| 8 | Stone Powder | Stone | Mortar |
| 9 | Stone Shaping (magic) | Feed stone powder to grimoire | Grimoire (research) |
| 10 | Stone Knife | Stone (shaped) | Magic — Stone Shaping |
| 11 | Magic Circle | Stone powder (as chalk) | Drawn on ground |

**What the player learns:** the grimoire is not just a book — it responds to materials. Feeding it something is how you discover new knowledge. The mortar, which was mundane, now feeds into magical discovery. The stone knife unlocks herb harvesting and doubles as a crude weapon — one craft opens two new capabilities.

---

### Tier 3 — Cauldron + First Potions

| # | Craft | Made From | Made At |
|---|-------|-----------|---------|
| 12 | Dried Herbs | Fresh herbs | Drying Rack |
| 13 | Cauldron | Stone (shaped) + fire + water | Stone Shaping + Fire Taming + Water Calling |
| 14 | Healing Potion | Fresh herbs + water | Cauldron |
| 15 | Fortitude Potion | Dried herbs + berries + water | Cauldron |
| 16 | Explosion Potion | Herb powder + reactive mineral + water | Cauldron |

**What the player learns:** basic magics combine to build something greater — all three are needed for the cauldron. Recipes vary in complexity. Healing is the simplest (fresh herbs + water). Fortitude uses a dried ingredient from the rack, showing that station outputs feed forward. Explosion requires herb powder (dry herbs on the rack, grind them in the mortar, then brew in the cauldron) — the first multi-station pipeline.

**The three potions serve three distinct purposes:**
- **Healing Potion** — restores current health. Immediate personal utility.
- **Fortitude Potion** — temporarily increases max health. Preparation before danger.
- **Explosion Potion** — single-use thrown weapon, medium damage. The first offensive craft.

---

### Tier 4 — Stone Furnace

| # | Craft | Made From | Made At |
|---|-------|-----------|---------|
| 17 | Stone Furnace | Stone (shaped) + clay | Stone Shaping + Fire Taming |
| 18 | Charcoal | Wood | Furnace (restricted air) |
| 19 | Wood Ash | Byproduct of burning wood | Furnace |
| 20 | Fired Clay Vessel | Clay (shaped and fired) | Furnace |
| 21 | Lye Water | Wood ash + water | Dissolution (vessel) |

**What the player learns:** exploration unlocks new materials and stations — clay is the first material that requires venturing further into the world. Fire transforms materials in ways boiling cannot (calcination). Byproducts like ash are useful, not waste. Lye is the player's first encounter with producing a chemical base (potassium hydroxide).

---

### Tier 5 — Fermentation Crock

| # | Craft | Made From | Made At |
|---|-------|-----------|---------|
| 22 | Fermentation Crock | Fired clay vessel + fitted lid | Pocket (assembly) |
| 23 | Vinegar | Berry juice | Fermentation Crock |
| 24 | Herbal Tincture | Herb powder + vinegar | Fermentation Crock |

**What the player learns:** time as an ingredient — fermentation is slow. Stations you build become materials for other stations. Acids dissolve things that water alone cannot. Vinegar (acetic acid) is the player's first crafted acid, complementing lye as a base from the previous tier.

---

### Tier 6 — Distillation Still

| # | Craft | Made From | Made At |
|---|-------|-----------|---------|
| 25 | Distillation Still | Fired clay + tubing | Pocket (assembly) |
| 26 | Essential Oil | Fresh herbs (steam-distilled) | Still |

**What the player learns:** separation and concentration. The same herbs that made a simple healing potion at the cauldron yield something more potent and specific through a more sophisticated process.

---

## Chemistry Process Map

Each station introduces one or more real-world chemistry processes. The player encounters them in this order:

| Process | Real-World Basis | Station | First Encountered |
|---------|-----------------|---------|-------------------|
| Trituration | Grinding solids into powder | Mortar and Pestle | Tier 1 |
| Dehydration | Removing moisture to preserve or transform | Drying Rack | Tier 1 |
| Decoction | Boiling to extract soluble compounds | Cauldron | Tier 3 |
| Calcination | Heat decomposition (wood to charcoal,ite to ash) | Furnace | Tier 4 |
| Dissolution | Dissolving a solid into liquid (ash + water = lye) | Vessel | Tier 4 |
| Fermentation | Biological acid production (juice to vinegar) | Crock | Tier 5 |
| Acid Extraction | Dissolving active compounds using acid | Crock | Tier 5 |
| Distillation | Separating liquids by boiling point | Still | Tier 6 |

Eight distinct real-world processes across the first 26 crafts.

---

## Pacing Philosophy

Every tier teaches something new. There is no point where learning stops.

- **Tier 0:** the world is physical. You build things from what you find.
- **Tier 1:** stations transform materials. Outputs chain together.
- **Tier 2:** the world is magical. The grimoire responds to materials. Tools unlock new world interactions.
- **Tier 3:** magic combines. Longer pipelines yield better results. Potions are real and useful.
- **Tier 4:** exploration unlocks new materials and stations. Chemistry has depth — bases, byproducts.
- **Tier 5:** time is an ingredient. Acids do things water cannot.
- **Tier 6:** the same inputs yield different outputs through different processes.

The complexity curve is continuous: hand-crafting, grinding and drying, basic magic, boiling, burning, fermenting, distilling. Each step builds on the last. The player never needs to juggle more than two new concepts at once.

---

## Open Questions

- How are Water Calling and Fire Taming learned? Same grimoire-feeding pattern as Stone Shaping? At the magic circle? Through use?
- What is the reactive mineral used in the explosion potion? Where is it found?
- How are berries gathered — by hand or with a tool?
- What can the campfire cook/roast before the cauldron is available?
- Does the magic circle have uses beyond learning basic magics?

---

## Proposed Change to Existing Design

The grimoire design doc describes paper as made by combining pulp and sticks directly. This tech path introduces the drying rack before paper, so paper is wood pulp spread on the drying rack. This makes paper feel more physically grounded and gives the drying rack an immediate purpose in the progression.
