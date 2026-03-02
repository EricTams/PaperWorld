# Game Design Document
*Working Title: Grimoire*

---

## Overview

An outdoor crafting game centered on alchemy and magical ingredient processing. The player builds a lab of connected stations in the open world, gathers magical ingredients while adventuring, and masters real-world-inspired processes to produce potions, tinctures, oils, and enchanting materials. Knowledge is recorded in a hand-crafted grimoire that grows as the player experiments.

---

## Inspirations

### World of Warcraft — Gathering
Ingredients are scattered through the world and discovered incidentally while doing other things. The joy is in stumbling across something interesting, not in dedicated farming loops. Finding a rare ingredient while adventuring should feel like a small gift.

### Potioncraft — Tactile Process
Crafting has physical weight. The way you operate a station — pressure, timing, temperature — matters to the outcome. Process is not just "combine A + B = C." Skilled execution produces better results than careless execution of the same recipe.

### Thaumcraft — Environmental Consequence
Sloppy or greedy crafting generates residue that bleeds into the surrounding world. Over time this warps the local environment — plants mutate, creatures become strange and aggressive. Taint is not purely punishment; corrupted environments may yield unique ingredients unavailable anywhere else.

### Skyrim / Orb of Creation — Synergy Stacking
Potions, enchantments, and spell reagents produced in the lab interact and multiply each other. Mastery means recognizing these synergies and building temporary towers of combined effects for a specific goal.

### Factorio — Pipeline Design
Stations are reliable and do exactly what they should. The craft is in designing a good pipeline — how you connect stations and route ingredients shapes the output. Stations do not interfere with each other. The world outside the lab is where unpredictability lives.

---

## Core Design Principles

### Start Narrow, Expand Slowly
The player begins with almost nothing. One or two possible actions. Each unlock is significant precisely because the starting set is so small. The game earns its complexity through pacing, not by front-loading options.

### Process Over Recipe
Real-world processes form the mechanical backbone — grinding, steam extraction, distillation, fermentation, filtration, reduction. Players reason about what a process does because they have real-world intuition about it. Ingredients are magical; processes are grounded.

### Magical Ingredients, Real Outputs
The outputs of crafting mirror the real world — essential oils, tinctures, distillates, resins, fermented extracts. What makes them magical is what went into them. Steam-extracting a mundane herb gives a pleasant oil. Steam-extracting something that absorbed starlight gives an oil with entirely different properties. The process is the same; the ingredient is what makes it magical.

### Two Phases of Mastery
Discovery and execution are distinct phases. The grimoire governs discovery — experiments build knowledge, and unlocking a recipe reveals the full process. Execution is the artisan phase — skilled performance of a known process where quality reflects care and competence. Once a recipe is known, the challenge is doing it well, not figuring it out again.

---

## The Grimoire

### Purpose
The grimoire is the player's living knowledge base. It grows through experimentation and records every recipe the player has unlocked. It is not a quest log or skill tree — it is a craftsperson's notebook that reflects genuine understanding earned through play.

### Two Modes of Navigation

**Broad view:** The player can see categories and ingredient families that have researchable content. "There are things to discover in the space of fire-natured ingredients and distillation." Direction is always available even when specific recipes are not yet visible.

**Specific view:** Once enough adjacent work has been done, specific locked recipes become visible. The player can see what they are working toward and knows that continued experimentation with the right ingredients and processes will unlock it.

### Unlocking Recipes
Performing experiments with an ingredient makes progress toward unlocking the next grimoire entry that uses it. Experiments are deliberately imprecise — they cost a small amount of material and confirm hypotheses rather than demanding blind guesswork. When a recipe unlocks, the full process is revealed immediately. The player is not drip-fed hints; they receive the master's notes in full. Execution is then their challenge.

### Crafting the Grimoire
The grimoire does not exist at the start of the game. The player's first task is to make it. This tutorial sequence teaches the two most fundamental game concepts — gathering and processing — using completely mundane materials before any magic is introduced.

---

## Tutorial Sequence — Making the Grimoire

### Step 1: Gather
The player finds three stones and some sticks in the immediate environment. No instruction is needed — these are the most intuitive materials imaginable.

### Step 2: Craft a Station
Two stones are combined to make a mortar and pestle. This is the player's first station and their introduction to the rule that stations are physical objects crafted from gathered materials, not abstract unlocks. The lab is built, not given.

### Step 3: Process
Sticks are ground in the mortar and pestle to produce pulp. This teaches station operation — the player drives the process manually, learning the physical feel of the crafting system at its simplest.

### Step 4: Bind
Pulp and sticks are combined to form paper and a frame, then bound into the grimoire. The moment the grimoire is complete, it opens to its first page — and the game begins in earnest.

---

## The Lab

### Outdoor Workspace
The lab is not a building the player enters. It is a collection of stations placed and arranged in the open world — a workspace carved out of the environment. The player can and should rearrange stations freely as their goals change. Reconfiguring the pipeline is a normal part of play, not a costly decision.

### Stations
Each station does one thing reliably. Stations are crafted from gathered materials. They do not interfere with each other — the pipeline design puzzle is purely about connection and sequence, not placement optimization or adjacency management. The world around the lab is where interference and consequence live; the lab itself is a sanctuary of predictable behavior.

### Pipeline Design
The path an ingredient takes through connected stations shapes what it becomes. The same ingredient routed through different sequences produces meaningfully different outputs. This is where the Factorio-style design satisfaction lives — the player is an engineer building a process, not just pressing a craft button.

---

## The Taint System

### Residue
Every act of crafting generates residue — a byproduct of manipulating raw magic. Small amounts dissipate harmlessly. Sloppy execution, rushed processes, or pushing potency too hard produces more residue than careful work. The grimoire tells the player exactly how to do things right; the world notices when they do not.

### Environmental Consequence
Excess residue vents into the surrounding world. Over time this warps the local environment. Plants mutate. Weather shifts. Creatures become aggressive or behaviorally strange. The effect is cumulative and localized — the area around a heavily-used lab site changes with use.

### The Temptation Loop
Taint is not purely punishment. A corrupted environment may yield ingredients with properties unavailable anywhere else. The player faces a genuine choice: craft cleanly and preserve the world around them, or pollute deliberately to unlock new possibilities. This tension is ongoing and never fully resolved — it is a relationship with the environment, not a meter to manage.

---

## Synergy System

### Layered Outputs
The lab produces potions, enchanted materials, and spell reagents. These outputs interact. A potion that buffs heat resistance makes a heating station more effective. Better heat processing improves fire-infused enchantments. Better enchantments amplify the next potion run. Mastery is recognizing these chains and building toward a specific compounded goal.

### Temporary Towers
Synergies are not permanent — they are constructed for a purpose and dissipate. The player prepares, executes, and then rebuilds toward the next goal. This keeps the system dynamic and rewards ongoing engagement with the crafting loop rather than one-time optimization.
