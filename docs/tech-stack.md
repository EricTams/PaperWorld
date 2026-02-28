# PaperWorld Tech Stack

## Goals

- Ship as a static web game on GitHub Pages.
- Keep tooling minimal and deterministic for procedural generation.
- Support a layered 2D papercraft visual style with runtime-generated textures.

## Platform and Runtime

- **Language:** JavaScript (ES modules)
- **Runtime target:** Modern desktop and mobile browsers (ES2022 modules)
- **Hosting:** GitHub Pages (static files only)
- **App shape:** Single-page browser game with no backend requirement for core gameplay

## Project Constraints

- No build tools.
- No transpilation.
- No framework requirement.
- Deploy source files directly to GitHub Pages.
- Keep architecture explicit: input -> simulation -> render.

## Rendering Strategy

- **Default renderer:** Canvas 2D API.
- **Optional renderer path:** PixiJS loaded by CDN module import only if Canvas 2D becomes limiting.
- **Rule:** do not introduce a bundler or framework to support rendering.

## Why Minimal Stack

- Matches current workflow (`html/css/js` pushed directly).
- Minimizes moving parts and avoids tooling maintenance.
- Keeps focus on art direction and generation quality instead of build infrastructure.

## Procedural Generation and Determinism

- **Seeded RNG:** small local deterministic PRNG module in plain JS.
- **Noise:** either a small in-repo noise module or a single CDN-loaded noise library.
- **Deterministic contract:**
  - World seed chosen at new game start.
  - Chunk generation uses derived sub-seeds (for reproducible local generation).
  - All procedural systems consume RNG/noise through explicit generator parameters.

## Texture and Art Pipeline

- **Source style:** Runtime-generated papercraft textures (procedural canvas synthesis at startup).
- **Generation surface:** Offscreen Canvas (`OffscreenCanvas` when available, fallback to standard `canvas`).
- **Produced assets:**
  - Pattern fills (paper grain, dots, hatch, clover motifs, bark/pinecone motifs).
  - Edge masks/strokes for cut-paper feel.
  - Layer drop-shadow variants for stacked shapes.
- **Runtime usage model:**
  - Build texture entries in memory from generated canvases.
  - Reuse generated textures by biome + decoration key.

## Project Layout

- `docs/` - Design docs and architecture notes.
- `index.html` - Entry HTML for GitHub Pages.
- `styles.css` - Global styling.
- `js/main.js` - Bootstrapping and main loop.
- `js/world/` - Seed, chunks, biomes, and generation functions.
- `js/render/` - Draw layers, texture builder, and render systems.
- `js/entities/` - Player and NPC models and draw logic.

## Deployment

- Commit and push `index.html`, `styles.css`, and `js/` directly.
- Use GitHub Pages static hosting from the repository branch/folder setting.
- No compile or build output directory.

## Implementation Constraints

- Keep generation and rendering decoupled:
  - Generation outputs data structures only.
  - Rendering consumes generated data and texture keys.
- Keep draw order explicit with dedicated render layers.
- Avoid hidden randomness in render-time logic; generation decides placement/state.

## Related Docs

- World model and generation details: [world-generation.md](./world-generation.md)
- Biome definitions and decor specs: [biomes.md](./biomes.md)
