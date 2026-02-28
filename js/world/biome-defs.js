export const BIOMES = Object.freeze([
  { id: "grassland", color: "#6ea85f" },
  { id: "conifer-forest", color: "#2f6a3d" },
  { id: "rocky-highlands", color: "#777f8b" },
  { id: "deciduous-forest", color: "#4b7a3b" },
  { id: "marsh", color: "#4f6b48" },
  { id: "desert", color: "#d8bb74" },
  { id: "tundra", color: "#d7e2ea" },
  { id: "coastal", color: "#a6c7b5" },
  { id: "prairie", color: "#93a960" },
  { id: "volcanic-badlands", color: "#5a4a47" },
]);

export const BIOME_IDS = Object.freeze(BIOMES.map((biome) => biome.id));

const colorByBiomeId = buildColorMap(BIOMES);

export function getBiomeColor(biomeId) {
  const color = colorByBiomeId.get(biomeId);
  if (!color) {
    throw new Error(`Unknown biome color for biomeId "${biomeId}".`);
  }
  return color;
}

function buildColorMap(biomes) {
  const map = new Map();
  biomes.forEach((biome) => map.set(biome.id, biome.color));
  return map;
}
