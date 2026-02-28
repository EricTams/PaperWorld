# PaperWorld Biomes

## Purpose

Define the full set of biomes available for world generation, including ground layer stacks, decorative elements, papercraft construction guidance, and placement intent.

See generation pipeline in [world-generation.md](./world-generation.md).
See stack/tooling decisions in [tech-stack.md](./tech-stack.md).

## Decor Constraints

All decorative elements across biomes follow two rules:

- **Scale:** no tiny props. Every element must read clearly at game zoom. If a motif is naturally small, represent it as a visible grouped form (e.g. clover patch, mushroom ring).
- **Charisma:** every element must pass a kids-book test — if you were drawing the canonical version of this biome, this element belongs in the picture. Prefer iconic silhouettes over niche realism. Reject filler.

## Biome Roster

| ID | Ground character | Decor density |
|----|-----------------|---------------|
| `grassland` | soft, layered greens | moderate |
| `conifer-forest` | dark soil, needle cover | dense |
| `rocky-highlands` | exposed stone, sparse soil | sparse |
| `deciduous-forest` | rich soil, leaf cover | dense |
| `marsh` | waterlogged mud, standing water | moderate |
| `desert` | sand, cracked earth | sparse |
| `tundra` | frozen ground, snow | sparse |
| `coastal` | sand, wet stone, tide line | moderate |
| `prairie` | deep soil, tall grass root mat | moderate |
| `volcanic-badlands` | charred rock, ash | sparse |

## Biome Definitions

### grassland

Ground stack:
1. Dirt/mud base sheet
2. Grass top sheet with irregular torn edges
3. Clover/detail overlay accents

Non-blocking decor: wildflowers, clover patches, tall grass, bushes, stumps.

Blocking decor: boulders.

Papercraft motifs:
- Soft rounded cut edges on grass layers.
- Dot/clover repeat pattern on overlay sheet.
- Warm green-to-yellow hue shift top-to-bottom.

Generation notes: high ground coverage, moderate decor spacing. Open sightlines between blocking elements.

### conifer-forest

Ground stack:
1. Dark soil base sheet
2. Pine needle carpet with jagged edges
3. Moss accent overlays

Non-blocking decor: ferns, moss, mushroom rings, fallen logs, stumps.

Blocking decor: pine trees, boulders.

Papercraft motifs:
- Spiky cut edges on canopy layers (stacked dark-green circles).
- Brown trunk segments between canopy and ground.
- Hatch pattern on bark, dot pattern on moss.
- Top-to-bottom hue shift on canopy to avoid flat color.

Generation notes: dense blocking placement with tight spacing. Ground visibility low between trees.

### rocky-highlands

Ground stack:
1. Grey stone base sheet
2. Cracked rock surface layer with sharp edges
3. Sparse dirt/gravel accent patches

Non-blocking decor: grass tufts, lichen, heather.

Blocking decor: rock outcrops, boulders, stone pillars.

Papercraft motifs:
- Angular cut edges on all layers.
- Stipple/grain pattern on stone surfaces.
- Cool grey-to-blue hue shift for depth.

Generation notes: sparse decor overall. Large open expanses of ground between blocking elements. Blocking elements tend to cluster.

### deciduous-forest

Ground stack:
1. Rich brown soil base sheet
2. Leaf litter layer with soft irregular edges
3. Moss/root accent overlays

Non-blocking decor: fallen leaves, mushrooms, ferns, brambles, shrubs, hollow logs.

Blocking decor: broadleaf trees.

Papercraft motifs:
- Rounded, organic cut edges on canopy (layered circles/ellipses).
- Warm palette: greens, browns, amber, rust.
- Leaf-shape repeat pattern on canopy layers.

Generation notes: dense canopy coverage. Mix of large broadleaf trees and smaller shrubs creates layered depth.

### marsh

Ground stack:
1. Dark mud base sheet
2. Waterlogged surface layer with blurred wet edges
3. Shallow water accent overlays

Non-blocking decor: reeds, lily pads, cattails, mud puddles, reed thickets.

Blocking decor: swamp trees, mud mounds.

Papercraft motifs:
- Wavy, soft cut edges on water layers.
- Muted palette: olive, brown, murky green.
- Ripple pattern on water overlays.

Generation notes: moderate decor density. Non-blocking water elements cover large ground areas. Blocking elements are spread unevenly, creating navigable channels.

### desert

Ground stack:
1. Pale sand base sheet
2. Dune contour layer with smooth rolling edges
3. Cracked-earth accent overlays

Non-blocking decor: sand dunes, dry grass, cracked earth, thorn bushes.

Blocking decor: cacti, boulders, dead trees.

Papercraft motifs:
- Smooth, flowing cut edges on dune layers.
- Warm palette: tan, ochre, bleached yellow.
- Dot/stipple pattern for sand grain texture.

Generation notes: sparse decor with wide open ground. Blocking elements are isolated with large spacing.

### tundra

Ground stack:
1. Frozen earth base sheet
2. Snow cover layer with soft ragged edges
3. Ice crust accent overlays

Non-blocking decor: snow drifts, frozen grass, frozen ponds, snowy shrubs.

Blocking decor: ice boulders, dwarf conifers.

Papercraft motifs:
- Soft, torn cut edges on snow layers.
- Cool palette: white, pale blue, grey.
- Crystal/frost pattern on ice overlays.

Generation notes: sparse decor. Wide expanses of snow ground. Blocking elements are small and widely spaced.

### coastal

Ground stack:
1. Wet sand base sheet
2. Dry sand upper layer with tide-line edge
3. Foam/spray accent overlays

Non-blocking decor: seaweed, tide pools, dune grass, driftwood, shrubs.

Blocking decor: sea rocks.

Papercraft motifs:
- Wavy cut edges along tide boundary.
- Palette shifts from wet dark sand to dry pale sand.
- Wave-line repeat pattern on foam overlays.

Generation notes: moderate decor density. Non-blocking elements cluster near the tide line. Blocking elements are scattered across the dune area.

### prairie

Ground stack:
1. Deep soil base sheet
2. Dense grass mat layer with wind-swept edges
3. Bare-earth accent patches

Non-blocking decor: tall grass, wildflowers, bare earth, thorn bushes.

Blocking decor: copses, boulders.

Papercraft motifs:
- Long, flowing cut edges suggesting wind direction.
- Warm palette: gold, amber, green.
- Grass-blade repeat pattern on mat layer.

Generation notes: moderate decor density. Tall grass non-blocking elements cover large areas. Blocking elements are few and widely spaced, creating open fields.

### volcanic-badlands

Ground stack:
1. Dark basalt base sheet
2. Ash layer with crumbling ragged edges
3. Ember/heat accent overlays

Non-blocking decor: ash drifts, steam vents, cracked earth.

Blocking decor: basalt spires, lava rocks, charred trees.

Papercraft motifs:
- Jagged, fractured cut edges on all layers.
- Dark palette: charcoal, deep red, ash grey.
- Crack-line pattern on basalt surfaces.

Generation notes: sparse decor. Harsh open terrain. Blocking elements are dramatic vertical shapes (spires, charred trunks) with wide spacing.

## Settlement Placement

Small settlements (a few huts or a camp) can appear in any biome. There is no biome lock on settlement placement.

Soft suitability guidance for generation:
- Settlements require a local clearing: a patch of ground free of blocking decor.
- Flatter, more open biomes (grassland, prairie, coastal) naturally produce clearings more often.
- Harsher biomes (volcanic-badlands, tundra, marsh) produce clearings less often, making settlements rarer but not impossible.
- Settlement placement consumes the same noise/seed pipeline as decor placement. No special-case generation logic.

## Biome Coverage

The 10 biomes provide progression from lower to higher environmental challenge:

- **Open/mild:** grassland, prairie, coastal.
- **Forested/dense:** conifer-forest, deciduous-forest.
- **Rugged/transitional:** rocky-highlands, marsh.
- **Harsh/extreme:** desert, tundra, volcanic-badlands.

This spread ensures visual variety across exploration and supports a range of traversal difficulty without requiring explicit difficulty systems.

## Related Docs

- World generation pipeline: [world-generation.md](./world-generation.md)
- Tech stack and rendering: [tech-stack.md](./tech-stack.md)
