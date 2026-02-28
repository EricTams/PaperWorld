import { hashCoordinates } from "../hash.js";
import { createRng } from "../rng.js";
import { getDecorPlacementMeta } from "./defs.js";
import { GRASSLAND_DECOR_CONFIG } from "./biomes/grassland/defs.js";
import { CONIFER_FOREST_DECOR_CONFIG } from "./biomes/conifer-forest/defs.js";
import { ROCKY_HIGHLANDS_DECOR_CONFIG } from "./biomes/rocky-highlands/defs.js";
import { DECIDUOUS_FOREST_DECOR_CONFIG } from "./biomes/deciduous-forest/defs.js";
import { MARSH_DECOR_CONFIG } from "./biomes/marsh/defs.js";
import { DESERT_DECOR_CONFIG } from "./biomes/desert/defs.js";
import { TUNDRA_DECOR_CONFIG } from "./biomes/tundra/defs.js";
import {
  COASTAL_WATER_DECOR_CONFIG,
  COASTAL_SAND_DECOR_CONFIG,
  COASTAL_BLOCKING_DECOR_CONFIG,
} from "./biomes/coastal/defs.js";
import { PRAIRIE_DECOR_CONFIG } from "./biomes/prairie/defs.js";
import { VOLCANIC_BADLANDS_DECOR_CONFIG } from "./biomes/volcanic-badlands/defs.js";

const DECOR_JITTER_RATIO = 0.3;
const NON_BLOCKING_CELL_STEP = 7;
const NON_BLOCKING_MIN_COUNT = 3;
const BLOCKING_JITTER_SCALE = 0.7;
const NON_BLOCKING_PADDING = 3;
const BLOCKING_PADDING = 8;
const MAX_PLACEMENT_ATTEMPTS = 12;
const BIOME_DECOR_CONFIGS = Object.freeze([
  GRASSLAND_DECOR_CONFIG,
  CONIFER_FOREST_DECOR_CONFIG,
  ROCKY_HIGHLANDS_DECOR_CONFIG,
  DECIDUOUS_FOREST_DECOR_CONFIG,
  MARSH_DECOR_CONFIG,
  DESERT_DECOR_CONFIG,
  TUNDRA_DECOR_CONFIG,
  COASTAL_WATER_DECOR_CONFIG,
  COASTAL_SAND_DECOR_CONFIG,
  COASTAL_BLOCKING_DECOR_CONFIG,
  PRAIRIE_DECOR_CONFIG,
  VOLCANIC_BADLANDS_DECOR_CONFIG,
]);

export function generateChunkDecor(worldSeed, cx, cy, chunkSize, ground) {
  const rng = createChunkDecorRng(worldSeed, cx, cy);
  const occupied = [];
  const decorBlocking = [];
  const decorNonBlocking = [];
  BIOME_DECOR_CONFIGS.forEach((config) => {
    const cells = collectBiomeCells(ground, config.biomeId, config.cellVariant);
    decorBlocking.push(...generateBlockingDecor(cells, ground, cx, cy, chunkSize, rng, config.blockingDecorIds, config.blockingMinCount, config.blockingCellStep, occupied));
    decorNonBlocking.push(...generateNonBlockingDecor(cells, ground, cx, cy, chunkSize, rng, config.nonBlockingDecorIds, occupied));
  });
  return {
    decorNonBlocking,
    decorBlocking,
  };
}

function generateBlockingDecor(cells, ground, cx, cy, chunkSize, rng, decorIds, minCount, cellStep, occupied) {
  return generateDecorSet(
    cells,
    ground,
    cx,
    cy,
    chunkSize,
    rng,
    decorIds,
    minCount,
    cellStep,
    BLOCKING_JITTER_SCALE,
    BLOCKING_PADDING,
    occupied
  );
}

function generateNonBlockingDecor(cells, ground, cx, cy, chunkSize, rng, decorIds, occupied) {
  return generateDecorSet(
    cells,
    ground,
    cx,
    cy,
    chunkSize,
    rng,
    decorIds,
    NON_BLOCKING_MIN_COUNT,
    NON_BLOCKING_CELL_STEP,
    1,
    NON_BLOCKING_PADDING,
    occupied
  );
}

function createChunkDecorRng(worldSeed, cx, cy) {
  const decorSeed = hashCoordinates(`${worldSeed}:decor`, cx, cy);
  return createRng(decorSeed);
}

function collectBiomeCells(ground, biomeId, cellVariant) {
  const cells = [];
  for (let index = 0; index < ground.biomeIds.length; index += 1) {
    if (ground.biomeIds[index] !== biomeId) {
      continue;
    }
    if (cellVariant && ground.variants && ground.variants[index] !== cellVariant) {
      continue;
    }
    const col = index % ground.widthCells;
    const row = Math.floor(index / ground.widthCells);
    cells.push({ col, row });
  }
  return cells;
}

function generateDecorSet(cells, ground, cx, cy, chunkSize, rng, decorIds, minCount, cellStep, jitterScale, spacingPadding, occupied) {
  if (cells.length === 0 || decorIds.length === 0) {
    return [];
  }

  const count = computeInstanceCount(cells.length, minCount, cellStep);
  const selectedIds = pickWeightedDecorIds(rng, decorIds, count);
  selectedIds.sort((a, b) => getDecorPlacementMeta(b).radius - getDecorPlacementMeta(a).radius);
  const instances = [];
  for (let i = 0; i < selectedIds.length; i += 1) {
    const placement = tryPlaceDecor(cells, ground, cx, cy, chunkSize, rng, selectedIds[i], jitterScale, spacingPadding, occupied);
    if (placement) {
      instances.push(placement);
      occupied.push(createOccupiedCircle(placement));
    }
  }
  return instances;
}

function pickWeightedDecorIds(rng, decorIds, count) {
  const selected = [];
  for (let i = 0; i < count; i += 1) {
    selected.push(decorIds[Math.floor(rng.nextFloat() * decorIds.length)]);
  }
  return selected;
}

function computeInstanceCount(cellCount, minCount, cellStep) {
  const scaledCount = Math.floor(cellCount / cellStep);
  return Math.max(minCount, scaledCount);
}

function createDecorInstance(decorId, position, cellSize, rng, jitterScale) {
  const placementMeta = getDecorPlacementMeta(decorId);
  const jitter = (cellSize * DECOR_JITTER_RATIO * jitterScale) * 0.5;
  return {
    decorId,
    x: position.x + (rng.nextFloat() - 0.5) * jitter,
    y: position.y + (rng.nextFloat() - 0.5) * jitter,
    radius: placementMeta.radius,
    clearance: placementMeta.clearance,
  };
}

function tryPlaceDecor(cells, ground, cx, cy, chunkSize, rng, decorId, jitterScale, spacingPadding, occupied) {
  for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt += 1) {
    const pickedCell = cells[Math.floor(rng.nextFloat() * cells.length)];
    const position = getCellCenterWorldPos(pickedCell, ground.cellSize, cx, cy, chunkSize);
    const placement = createDecorInstance(decorId, position, ground.cellSize, rng, jitterScale);
    if (canPlaceDecor(placement, spacingPadding, occupied)) {
      return placement;
    }
  }
  return null;
}

function canPlaceDecor(placement, spacingPadding, occupied) {
  for (let i = 0; i < occupied.length; i += 1) {
    const other = occupied[i];
    const minDistance = placement.radius + other.radius + spacingPadding + placement.clearance + other.clearance;
    if (distanceSquared(placement.x, placement.y, other.x, other.y) < minDistance * minDistance) {
      return false;
    }
  }
  return true;
}

function createOccupiedCircle(placement) {
  return {
    x: placement.x,
    y: placement.y,
    radius: placement.radius,
    clearance: placement.clearance,
  };
}

function distanceSquared(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function getCellCenterWorldPos(cell, cellSize, cx, cy, chunkSize) {
  return {
    x: cx * chunkSize + cell.col * cellSize + cellSize * 0.5,
    y: cy * chunkSize + cell.row * cellSize + cellSize * 0.5,
  };
}
