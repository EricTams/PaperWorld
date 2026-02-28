import { GRASSLAND_DECOR_DEFS } from "./biomes/grassland/defs.js";
import { CONIFER_FOREST_DECOR_DEFS } from "./biomes/conifer-forest/defs.js";
import { ROCKY_HIGHLANDS_DECOR_DEFS } from "./biomes/rocky-highlands/defs.js";
import { DECIDUOUS_FOREST_DECOR_DEFS } from "./biomes/deciduous-forest/defs.js";
import { MARSH_DECOR_DEFS } from "./biomes/marsh/defs.js";
import { DESERT_DECOR_DEFS } from "./biomes/desert/defs.js";
import { TUNDRA_DECOR_DEFS } from "./biomes/tundra/defs.js";
import { COASTAL_DECOR_DEFS } from "./biomes/coastal/defs.js";
import { PRAIRIE_DECOR_DEFS } from "./biomes/prairie/defs.js";
import { VOLCANIC_BADLANDS_DECOR_DEFS } from "./biomes/volcanic-badlands/defs.js";

export const DECOR_DEFS = Object.freeze([
  ...GRASSLAND_DECOR_DEFS,
  ...CONIFER_FOREST_DECOR_DEFS,
  ...ROCKY_HIGHLANDS_DECOR_DEFS,
  ...DECIDUOUS_FOREST_DECOR_DEFS,
  ...MARSH_DECOR_DEFS,
  ...DESERT_DECOR_DEFS,
  ...TUNDRA_DECOR_DEFS,
  ...COASTAL_DECOR_DEFS,
  ...PRAIRIE_DECOR_DEFS,
  ...VOLCANIC_BADLANDS_DECOR_DEFS,
]);

const decorById = buildDecorById(DECOR_DEFS);

export function getDecorDefById(decorId) {
  const decor = decorById.get(decorId);
  if (!decor) {
    throw new Error(`Unknown decor definition "${decorId}".`);
  }
  return decor;
}

export function getDecorPlacementRadius(decorId) {
  return getDecorPlacementMeta(decorId).radius;
}

export function getDecorPlacementMeta(decorId) {
  const decor = getDecorDefById(decorId);
  if (decor.placement) {
    return decor.placement;
  }
  return {
    radius: decor.footprint.radius,
    clearance: 0,
  };
}

function buildDecorById(decorDefs) {
  const map = new Map();
  decorDefs.forEach((decor) => map.set(decor.id, decor));
  return map;
}
