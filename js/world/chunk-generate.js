import { createRng } from "./rng.js";
import { worldToChunkCoord, encodeChunkKey, WORLD_CHUNK_SIZE } from "./chunks.js";
import { hashCoordinates } from "./hash.js";
import { sampleBiomeIdAtWorld } from "./biome-map.js";
import { getBiomeGroundDef } from "./biome-ground-defs.js";
import { isInsideScatteredPatch } from "./scatter-patch.js";
import { generateChunkDecor } from "./decor/generate.js";

const GROUND_CELL_SIZE = 32;

export function createChunkCache() {
  return {
    recordsByKey: new Map(),
  };
}

export function streamChunksAround(cache, worldSeed, centerCx, centerCy, radiusChunks, chunkSize = WORLD_CHUNK_SIZE) {
  for (let y = centerCy - radiusChunks; y <= centerCy + radiusChunks; y += 1) {
    for (let x = centerCx - radiusChunks; x <= centerCx + radiusChunks; x += 1) {
      getOrCreateChunk(cache, worldSeed, x, y, chunkSize);
    }
  }
  return Array.from(cache.recordsByKey.values());
}

export function evictFarChunks(cache, centerCx, centerCy, keepDistance) {
  const keys = Array.from(cache.recordsByKey.keys());
  keys.forEach((key) => {
    const chunk = cache.recordsByKey.get(key);
    if (!chunk) {
      return;
    }
    const distance = Math.max(Math.abs(chunk.cx - centerCx), Math.abs(chunk.cy - centerCy));
    if (distance > keepDistance) {
      cache.recordsByKey.delete(key);
    }
  });
}

export function updateChunkStreaming(cache, worldSeed, worldX, worldY, radiusChunks, chunkSize = WORLD_CHUNK_SIZE, keepDistance = radiusChunks + 2) {
  const center = worldToChunkCoord(worldX, worldY, chunkSize);
  const loadedChunks = streamChunksAround(cache, worldSeed, center.x, center.y, radiusChunks, chunkSize);
  evictFarChunks(cache, center.x, center.y, keepDistance);
  return {
    centerChunk: center,
    loadedChunks,
  };
}

export function getOrCreateChunk(cache, worldSeed, cx, cy, chunkSize = WORLD_CHUNK_SIZE) {
  const key = encodeChunkKey(cx, cy);
  const existing = cache.recordsByKey.get(key);
  if (existing) {
    return existing;
  }

  const created = generateChunkRecord(worldSeed, cx, cy, chunkSize);
  cache.recordsByKey.set(key, created);
  return created;
}

function generateChunkRecord(worldSeed, cx, cy, chunkSize) {
  const cellCountPerAxis = Math.floor(chunkSize / GROUND_CELL_SIZE);
  const chunkSeed = hashCoordinates(worldSeed, cx, cy);
  const rng = createRng(chunkSeed);
  const groundBiomeIds = [];
  for (let row = 0; row < cellCountPerAxis; row += 1) {
    for (let col = 0; col < cellCountPerAxis; col += 1) {
      const worldX = cx * chunkSize + col * GROUND_CELL_SIZE + GROUND_CELL_SIZE * 0.5;
      const worldY = cy * chunkSize + row * GROUND_CELL_SIZE + GROUND_CELL_SIZE * 0.5;
      const jitterX = (rng.nextFloat() - 0.5) * GROUND_CELL_SIZE * 0.25;
      const jitterY = (rng.nextFloat() - 0.5) * GROUND_CELL_SIZE * 0.25;
      groundBiomeIds.push(sampleBiomeIdAtWorld(worldSeed, worldX + jitterX, worldY + jitterY));
    }
  }
  const variants = buildGroundVariants(groundBiomeIds, cellCountPerAxis, cx, cy, chunkSize);
  const ground = {
    cellSize: GROUND_CELL_SIZE,
    widthCells: cellCountPerAxis,
    heightCells: cellCountPerAxis,
    biomeIds: groundBiomeIds,
    variants,
  };
  const decor = generateChunkDecor(worldSeed, cx, cy, chunkSize, ground);

  return {
    key: encodeChunkKey(cx, cy),
    cx,
    cy,
    ground,
    decorNonBlocking: decor.decorNonBlocking,
    decorBlocking: decor.decorBlocking,
  };
}

function buildGroundVariants(biomeIds, cellCountPerAxis, cx, cy, chunkSize) {
  const variants = new Array(biomeIds.length);
  for (let row = 0; row < cellCountPerAxis; row += 1) {
    for (let col = 0; col < cellCountPerAxis; col += 1) {
      const index = row * cellCountPerAxis + col;
      const biomeId = biomeIds[index];
      const def = getBiomeGroundDef(biomeId);
      const bw = def.boundaryWidth || 1;
      if (isNearBiomeBoundaryLocal(biomeIds, cellCountPerAxis, col, row, bw)) {
        variants[index] = "base";
        continue;
      }
      const worldX = cx * chunkSize + col * GROUND_CELL_SIZE + GROUND_CELL_SIZE * 0.5;
      const worldY = cy * chunkSize + row * GROUND_CELL_SIZE + GROUND_CELL_SIZE * 0.5;
      if (def.underlay && isInsideScatteredPatch(worldX, worldY, def.underlay)) {
        variants[index] = "underlay";
      } else if (def.overlay && isInsideScatteredPatch(worldX, worldY, def.overlay)) {
        variants[index] = "overlay";
      } else {
        variants[index] = "base";
      }
    }
  }
  return variants;
}

function isNearBiomeBoundaryLocal(biomeIds, cellCountPerAxis, col, row, width) {
  const biomeId = biomeIds[row * cellCountPerAxis + col];
  for (let dy = -width; dy <= width; dy += 1) {
    for (let dx = -width; dx <= width; dx += 1) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      const nc = col + dx;
      const nr = row + dy;
      if (nc < 0 || nc >= cellCountPerAxis || nr < 0 || nr >= cellCountPerAxis) {
        continue;
      }
      if (biomeIds[nr * cellCountPerAxis + nc] !== biomeId) {
        return true;
      }
    }
  }
  return false;
}
