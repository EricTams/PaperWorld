import { sampleBiomeClimate, sampleBiomeScalar } from "./biome-noise.js";

export function mapScalarToBiomeId(scalar) {
  if (scalar < 0 || scalar > 1) {
    throw new Error(`Biome scalar must be in [0, 1]. Received ${scalar}.`);
  }

  return mapClimateToBiomeId({ heat: scalar, moisture: 1 - scalar });
}

export function mapClimateToBiomeId(climate) {
  assertUnitRange(climate.heat, "heat");
  assertUnitRange(climate.moisture, "moisture");
  const best = findClosestBiome(climate);
  return best.id;
}

export function sampleBiomeIdAtWorld(worldSeed, worldX, worldY) {
  const climate = sampleBiomeClimate(worldSeed, worldX, worldY);
  return mapClimateToBiomeId(climate);
}

export function sampleBiomeDebugScalar(worldSeed, worldX, worldY) {
  return sampleBiomeScalar(worldSeed, worldX, worldY);
}

const BIOME_CLIMATE_POINTS = Object.freeze([
  { id: "grassland", heat: 0.55, moisture: 0.52 },
  { id: "conifer-forest", heat: 0.38, moisture: 0.68 },
  { id: "rocky-highlands", heat: 0.34, moisture: 0.28 },
  { id: "deciduous-forest", heat: 0.57, moisture: 0.73 },
  { id: "marsh", heat: 0.67, moisture: 0.9 },
  { id: "desert", heat: 0.86, moisture: 0.16 },
  { id: "tundra", heat: 0.12, moisture: 0.43 },
  { id: "coastal", heat: 0.6, moisture: 0.86 },
  { id: "prairie", heat: 0.66, moisture: 0.36 },
  { id: "volcanic-badlands", heat: 0.93, moisture: 0.32 },
]);

function findClosestBiome(climate) {
  let bestBiome = BIOME_CLIMATE_POINTS[0];
  let bestDistance = climateDistanceSq(climate, bestBiome);
  for (let i = 1; i < BIOME_CLIMATE_POINTS.length; i += 1) {
    const candidate = BIOME_CLIMATE_POINTS[i];
    const distance = climateDistanceSq(climate, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestBiome = candidate;
    }
  }
  return bestBiome;
}

function climateDistanceSq(a, b) {
  const heatDelta = a.heat - b.heat;
  const moistureDelta = a.moisture - b.moisture;
  return heatDelta * heatDelta + moistureDelta * moistureDelta;
}

function assertUnitRange(value, name) {
  if (value < 0 || value > 1) {
    throw new Error(`Biome climate ${name} must be in [0, 1]. Received ${value}.`);
  }
}
