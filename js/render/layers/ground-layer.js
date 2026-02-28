import { getBiomeGroundDef } from "../../world/biome-ground-defs.js";
import { isInsideScatteredPatch } from "../../world/scatter-patch.js";
import { getGroundTexture } from "../paper/ground-textures.js";
import { getVisibleWorldBounds, isChunkVisible, worldToScreen, worldLengthToScreen } from "../camera.js";
import {
  createChunkCamera,
  getChunkScreenLayout,
  createOffscreenCanvas,
} from "../chunk-canvas-cache.js";

const SAWTOOTH_SHADOW_COLOR = "rgba(0, 0, 0, 0.18)";
const SAWTOOTH_AMPLITUDE_RATIO = 0.18;
const MIN_SAWTOOTH_AMPLITUDE = 2;

// --- Fringed tile Path2D (cached per zoom) ---

let cachedTilePath = null;
let cachedTileKey = "";

function getFringedTilePath(cellPx, amplitude) {
  const key = `${cellPx},${amplitude}`;
  if (key === cachedTileKey) {
    return cachedTilePath;
  }
  cachedTilePath = buildFringedTilePath(cellPx, amplitude);
  cachedTileKey = key;
  return cachedTilePath;
}

function buildFringedTilePath(s, a) {
  const sixth = s / 6;
  const path = new Path2D();
  path.moveTo(0, -a);
  path.lineTo(sixth, 0);
  path.lineTo(sixth * 2, -a);
  path.lineTo(sixth * 3, 0);
  path.lineTo(sixth * 4, -a);
  path.lineTo(sixth * 5, 0);
  path.lineTo(s, -a);
  path.lineTo(s + a, 0);
  path.lineTo(s, sixth);
  path.lineTo(s + a, sixth * 2);
  path.lineTo(s, sixth * 3);
  path.lineTo(s + a, sixth * 4);
  path.lineTo(s, sixth * 5);
  path.lineTo(s + a, s);
  path.lineTo(s, s + a);
  path.lineTo(sixth * 5, s);
  path.lineTo(sixth * 4, s + a);
  path.lineTo(sixth * 3, s);
  path.lineTo(sixth * 2, s + a);
  path.lineTo(sixth, s);
  path.lineTo(0, s + a);
  path.lineTo(-a, s);
  path.lineTo(0, sixth * 5);
  path.lineTo(-a, sixth * 4);
  path.lineTo(0, sixth * 3);
  path.lineTo(-a, sixth * 2);
  path.lineTo(0, sixth);
  path.lineTo(-a, 0);
  path.closePath();
  return path;
}

// --- Layer metrics ---

function createLayerMetrics(camera) {
  return {
    shadowOffsetX: Math.max(1, Math.round(camera.zoom * 1.6)),
    shadowOffsetY: Math.max(1, Math.round(camera.zoom * 2.4)),
  };
}

function computeGroundPadding(amplitude, shadowMetrics) {
  return Math.ceil(amplitude + Math.max(shadowMetrics.shadowOffsetX, shadowMetrics.shadowOffsetY)) + 1;
}

// --- Main draw function ---

export function drawGroundLayer(ctx, camera, chunks, chunkSize) {
  const visibleBounds = getVisibleWorldBounds(camera);
  const chunkMap = buildChunkMap(chunks);
  const visible = [];
  const allDepths = new Set();

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    if (!isChunkVisible(chunk, chunkSize, visibleBounds)) {
      continue;
    }
    const layout = getChunkScreenLayout(chunk, camera);
    const screenPos = worldToScreen(camera, layout.chunkWorldX, layout.chunkWorldY);
    const depthMap = getOrBuildDepthMap(chunk, chunkMap);
    for (let d = 0; d < depthMap.uniqueDepths.length; d += 1) {
      allDepths.add(depthMap.uniqueDepths[d]);
    }
    visible.push({ chunk, layout, screenPos, depthMap });
  }

  if (visible.length === 0) {
    return;
  }

  const sortedDepths = [...allDepths].sort((a, b) => a - b);
  const { cellSize } = visible[0].chunk.ground;
  const screenCellSize = cellSize * camera.zoom;
  const amplitude = Math.max(MIN_SAWTOOTH_AMPLITUDE, screenCellSize * SAWTOOTH_AMPLITUDE_RATIO);
  const shadowMetrics = createLayerMetrics(camera);
  const padding = computeGroundPadding(amplitude, shadowMetrics);

  for (let d = 0; d < sortedDepths.length; d += 1) {
    const depth = sortedDepths[d];
    for (let i = 0; i < visible.length; i += 1) {
      const { chunk, layout, screenPos, depthMap } = visible[i];
      if (!depthMap.uniqueDepths.includes(depth)) {
        continue;
      }
      const canvasMap = getOrBuildDepthCanvases(chunk, camera, chunkMap, layout, padding);
      const pair = canvasMap.get(depth);
      if (pair) {
        ctx.drawImage(pair.shadow, screenPos.x - padding, screenPos.y - padding);
      }
    }
    for (let i = 0; i < visible.length; i += 1) {
      const { chunk, layout, screenPos, depthMap } = visible[i];
      if (!depthMap.uniqueDepths.includes(depth)) {
        continue;
      }
      const canvasMap = getOrBuildDepthCanvases(chunk, camera, chunkMap, layout, padding);
      const pair = canvasMap.get(depth);
      if (pair) {
        ctx.drawImage(pair.fill, screenPos.x - padding, screenPos.y - padding);
      }
    }
  }
}

export function drawChunkGridOverlay(ctx, camera, chunks, chunkSize) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
  ctx.lineWidth = 1;
  const visibleBounds = getVisibleWorldBounds(camera);
  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    if (!isChunkVisible(chunk, chunkSize, visibleBounds)) {
      continue;
    }
    const x = chunk.cx * chunkSize;
    const y = chunk.cy * chunkSize;
    const topLeft = worldToScreen(camera, x, y);
    const screenChunkSize = worldLengthToScreen(camera, chunkSize);
    ctx.strokeRect(topLeft.x, topLeft.y, screenChunkSize, screenChunkSize);
  }
  ctx.restore();
}

// --- Per-depth canvas cache ---

function getOrBuildDepthCanvases(chunk, camera, chunkMap, layout, padding) {
  if (chunk._groundDepthCanvases && chunk._groundDepthZoom === camera.zoom) {
    return chunk._groundDepthCanvases;
  }
  const map = buildAllDepthCanvases(chunk, camera, chunkMap, layout, padding);
  chunk._groundDepthCanvases = map;
  chunk._groundDepthZoom = camera.zoom;
  return map;
}

function buildAllDepthCanvases(chunk, camera, chunkMap, layout, padding) {
  const depthMap = getOrBuildDepthMap(chunk, chunkMap);
  const { cellSize } = chunk.ground;
  const screenCellSize = cellSize * camera.zoom;
  const amplitude = Math.max(MIN_SAWTOOTH_AMPLITUDE, screenCellSize * SAWTOOTH_AMPLITUDE_RATIO);
  const tilePath = getFringedTilePath(screenCellSize, amplitude);
  const shadowMetrics = createLayerMetrics(camera);

  const canvasW = Math.ceil(layout.screenW) + padding * 2;
  const canvasH = Math.ceil(layout.screenH) + padding * 2;
  const chunkCam = createChunkCamera(
    camera,
    layout.chunkWorldX - padding / camera.zoom,
    layout.chunkWorldY - padding / camera.zoom,
    canvasW,
    canvasH,
  );

  const map = new Map();
  for (let tierIdx = 0; tierIdx < depthMap.uniqueDepths.length; tierIdx += 1) {
    const depth = depthMap.uniqueDepths[tierIdx];
    const cells = collectCellsAtDepth(depthMap, depth, chunk, chunkCam);
    if (cells.length === 0) {
      continue;
    }

    const shadowCanvas = createOffscreenCanvas(canvasW, canvasH);
    renderShadowPass(shadowCanvas.getContext("2d"), cells, tilePath, shadowMetrics);

    const fillCanvas = createOffscreenCanvas(canvasW, canvasH);
    renderFillPass(fillCanvas.getContext("2d"), cells, depthMap, tilePath, screenCellSize);

    map.set(depth, { shadow: shadowCanvas, fill: fillCanvas });
  }
  return map;
}

// --- Render shadow and fill to separate offscreen canvases ---

function renderShadowPass(offCtx, cells, tilePath, shadowMetrics) {
  offCtx.fillStyle = SAWTOOTH_SHADOW_COLOR;
  for (let i = 0; i < cells.length; i += 1) {
    offCtx.setTransform(1, 0, 0, 1, cells[i].px + shadowMetrics.shadowOffsetX, cells[i].py + shadowMetrics.shadowOffsetY);
    offCtx.fill(tilePath);
  }
  offCtx.setTransform(1, 0, 0, 1, 0, 0);
}

function renderFillPass(offCtx, cells, depthMap, tilePath, screenCellSize) {
  const groups = new Map();
  for (let i = 0; i < cells.length; i += 1) {
    const textureId = depthMap.textureIds[cells[i].index];
    if (!groups.has(textureId)) {
      groups.set(textureId, []);
    }
    groups.get(textureId).push(cells[i]);
  }

  for (const [textureId, groupCells] of groups) {
    const pattern = getGroundTexture(screenCellSize, textureId);
    if (!pattern) {
      continue;
    }
    offCtx.fillStyle = pattern;
    for (let i = 0; i < groupCells.length; i += 1) {
      offCtx.setTransform(1, 0, 0, 1, groupCells[i].px, groupCells[i].py);
      offCtx.fill(tilePath);
    }
  }
  offCtx.setTransform(1, 0, 0, 1, 0, 0);
}

function collectCellsAtDepth(depthMap, depth, chunk, chunkCam) {
  const { widthCells, heightCells, cellSize } = chunk.ground;
  const chunkWorldX = chunk.cx * widthCells * cellSize;
  const chunkWorldY = chunk.cy * heightCells * cellSize;
  const cells = [];
  for (let row = 0; row < heightCells; row += 1) {
    for (let col = 0; col < widthCells; col += 1) {
      const index = row * widthCells + col;
      if (depthMap.depths[index] !== depth) {
        continue;
      }
      const worldX = chunkWorldX + col * cellSize;
      const worldY = chunkWorldY + row * cellSize;
      const pos = worldToScreen(chunkCam, worldX, worldY);
      cells.push({ px: pos.x, py: pos.y, index });
    }
  }
  return cells;
}

// --- Chunk map ---

function buildChunkMap(chunks) {
  const map = new Map();
  for (let i = 0; i < chunks.length; i += 1) {
    const c = chunks[i];
    map.set(`${c.cx},${c.cy}`, c);
  }
  return map;
}

// --- Depth map ---

export function getOrBuildDepthMap(chunk, chunkMap) {
  if (chunk.ground.depthMap) {
    return chunk.ground.depthMap;
  }
  const depthMap = buildDepthMap(chunk, chunkMap);
  chunk.ground.depthMap = depthMap;
  return depthMap;
}

function buildDepthMap(chunk, chunkMap) {
  const { widthCells, heightCells, cellSize, biomeIds } = chunk.ground;
  const cellCount = widthCells * heightCells;
  const depths = new Array(cellCount);
  const textureIds = new Array(cellCount);

  for (let i = 0; i < cellCount; i += 1) {
    const def = getBiomeGroundDef(biomeIds[i]);
    depths[i] = def.depth;
    textureIds[i] = def.id;
  }

  for (let row = 0; row < heightCells; row += 1) {
    for (let col = 0; col < widthCells; col += 1) {
      const index = row * widthCells + col;
      const def = getBiomeGroundDef(biomeIds[index]);

      const bw = def.boundaryWidth || 1;
      if (isNearBiomeBoundary(chunk, chunkMap, col, row, bw)) {
        continue;
      }

      const worldX = chunk.cx * widthCells * cellSize + col * cellSize + cellSize * 0.5;
      const worldY = chunk.cy * heightCells * cellSize + row * cellSize + cellSize * 0.5;

      if (def.underlay && isInsideScatteredPatch(worldX, worldY, def.underlay)) {
        depths[index] = def.depth + def.underlay.depthOffset;
        textureIds[index] = def.id + "-underlay";
        continue;
      }

      if (def.overlay && isInsideScatteredPatch(worldX, worldY, def.overlay)) {
        depths[index] = def.depth + def.overlay.depthOffset;
        textureIds[index] = def.id + "-overlay";
        continue;
      }
    }
  }

  const uniqueDepths = [...new Set(depths)].sort((a, b) => a - b);
  return { depths, textureIds, uniqueDepths };
}

function getNeighborBiomeId(chunk, chunkMap, col, row, dcol, drow) {
  const { widthCells, heightCells, biomeIds } = chunk.ground;
  const nc = col + dcol;
  const nr = row + drow;
  if (nc >= 0 && nc < widthCells && nr >= 0 && nr < heightCells) {
    return biomeIds[nr * widthCells + nc];
  }
  const chunkOffX = nc < 0 ? -1 : (nc >= widthCells ? 1 : 0);
  const chunkOffY = nr < 0 ? -1 : (nr >= heightCells ? 1 : 0);
  const neighborChunk = chunkMap ? chunkMap.get(`${chunk.cx + chunkOffX},${chunk.cy + chunkOffY}`) : null;
  if (!neighborChunk) {
    return biomeIds[row * widthCells + col];
  }
  const wrapCol = ((nc % widthCells) + widthCells) % widthCells;
  const wrapRow = ((nr % heightCells) + heightCells) % heightCells;
  return neighborChunk.ground.biomeIds[wrapRow * widthCells + wrapCol];
}

function isNearBiomeBoundary(chunk, chunkMap, col, row, width) {
  const biomeId = chunk.ground.biomeIds[row * chunk.ground.widthCells + col];
  for (let dy = -width; dy <= width; dy += 1) {
    for (let dx = -width; dx <= width; dx += 1) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      if (getNeighborBiomeId(chunk, chunkMap, col, row, dx, dy) !== biomeId) {
        return true;
      }
    }
  }
  return false;
}

