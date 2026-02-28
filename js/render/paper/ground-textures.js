const TILE_SIZE = 64;

const textureTileCache = new Map();
let patternCache = new Map();
let patternCacheKey = 0;

export function getGroundTexture(cellScreenSize, textureId) {
  if (cellScreenSize !== patternCacheKey) {
    patternCache = new Map();
    patternCacheKey = cellScreenSize;
  }
  const existing = patternCache.get(textureId);
  if (existing) {
    return existing;
  }
  const tile = getTextureTile(textureId);
  if (!tile) {
    return null;
  }
  const canvas = createTinyCanvas();
  const ctx = canvas.getContext("2d");
  const pattern = ctx.createPattern(tile, "repeat");
  if (!pattern) {
    return null;
  }
  const scale = cellScreenSize / TILE_SIZE;
  if (typeof pattern.setTransform === "function" && typeof DOMMatrix !== "undefined") {
    pattern.setTransform(new DOMMatrix([scale, 0, 0, scale, 0, 0]));
  }
  patternCache.set(textureId, pattern);
  return pattern;
}

function getTextureTile(textureId) {
  const cached = textureTileCache.get(textureId);
  if (cached) {
    return cached;
  }
  const generator = TEXTURE_GENERATORS[textureId];
  if (!generator) {
    return null;
  }
  const canvas = createTileCanvas(TILE_SIZE);
  const ctx = canvas.getContext("2d");
  generator(ctx, TILE_SIZE);
  textureTileCache.set(textureId, canvas);
  return canvas;
}

let tinyCanvas = null;

function createTinyCanvas() {
  if (tinyCanvas) {
    return tinyCanvas;
  }
  tinyCanvas = typeof OffscreenCanvas !== "undefined"
    ? new OffscreenCanvas(1, 1)
    : (() => { const c = document.createElement("canvas"); c.width = 1; c.height = 1; return c; })();
  return tinyCanvas;
}

function createTileCanvas(size) {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(size, size);
  }
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  return c;
}

// --- Texture generators ---

const TEXTURE_GENERATORS = {
  "grassland": drawGrassland,
  "grassland-underlay": drawGrasslandUnderlay,
  "grassland-overlay": drawGrasslandOverlay,
  "conifer-forest": drawConiferForest,
  "conifer-forest-underlay": drawConiferForestUnderlay,
  "conifer-forest-overlay": drawConiferForestOverlay,
  "deciduous-forest": drawDeciduousForest,
  "deciduous-forest-underlay": drawDeciduousForestUnderlay,
  "deciduous-forest-overlay": drawDeciduousForestOverlay,
  "prairie": drawPrairie,
  "prairie-underlay": drawPrairieUnderlay,
  "prairie-overlay": drawPrairieOverlay,
  "marsh": drawMarsh,
  "marsh-underlay": drawMarshUnderlay,
  "marsh-overlay": drawMarshOverlay,
  "coastal": drawCoastal,
  "coastal-underlay": drawCoastalUnderlay,
  "coastal-overlay": drawCoastalOverlay,
  "rocky-highlands": drawRockyHighlands,
  "rocky-highlands-underlay": drawRockyHighlandsUnderlay,
  "rocky-highlands-overlay": drawRockyHighlandsOverlay,
  "desert": drawDesert,
  "desert-underlay": drawDesertUnderlay,
  "desert-overlay": drawDesertOverlay,
  "tundra": drawTundra,
  "tundra-underlay": drawTundraUnderlay,
  "tundra-overlay": drawTundraOverlay,
  "volcanic-badlands": drawVolcanicBadlands,
  "volcanic-badlands-underlay": drawVolcanicBadlandsUnderlay,
  "volcanic-badlands-overlay": drawVolcanicBadlandsOverlay,
};

// --- Individual biome textures ---

function drawGrassland(ctx, s) {
  ctx.fillStyle = "#6ea85f";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i += 1) {
    const y = i * 7 + 2;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(s + 2, y + 1.5);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
  for (let i = 0; i < 20; i += 1) {
    const x = ((i * 17) + 5) % s;
    const y = ((i * 23) + 9) % s;
    const r = 0.7 + (i % 3) * 0.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGrasslandUnderlay(ctx, s) {
  ctx.fillStyle = "#716049";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
  for (let i = 0; i < 28; i += 1) {
    const x = ((i * 13) + 7) % s;
    const y = ((i * 19) + 3) % s;
    const r = 0.6 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 5; i += 1) {
    const x = ((i * 14) + 3) % s;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 3, s * 0.4, x - 2, s * 0.7, x + 1, s);
    ctx.stroke();
  }
}

function drawGrasslandOverlay(ctx, s) {
  ctx.fillStyle = "#5a904b";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  for (let i = 0; i < 10; i += 1) {
    const x = ((i * 23) + 9) % s;
    const y = ((i * 19) + 5) % s;
    fillClover(ctx, x, y, 2);
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i += 1) {
    const y = i * 10;
    ctx.beginPath();
    ctx.moveTo(-3, y);
    ctx.lineTo(s + 3, y + 2);
    ctx.stroke();
  }
}

function drawConiferForest(ctx, s) {
  ctx.fillStyle = "#2f6a3d";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i += 1) {
    const x = ((i * 17) + 3) % s;
    const y = ((i * 13) + 11) % s;
    const len = 4 + (i % 3) * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len * 0.6, y + len);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  for (let i = 0; i < 12; i += 1) {
    const x = ((i * 21) + 5) % s;
    const y = ((i * 11) + 7) % s;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 2, y + 3);
    ctx.stroke();
  }
}

function drawConiferForestUnderlay(ctx, s) {
  ctx.fillStyle = "#3e332d";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  for (let i = 0; i < 30; i += 1) {
    const x = ((i * 11) + 5) % s;
    const y = ((i * 17) + 3) % s;
    const r = 0.5 + (i % 3) * 0.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 4; i += 1) {
    const y = ((i * 17) + 8) % s;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(s + 2, y + 2);
    ctx.stroke();
  }
}

function drawConiferForestOverlay(ctx, s) {
  ctx.fillStyle = "#3f7043";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.14)";
  ctx.lineWidth = 1.1;
  for (let i = 0; i < 24; i += 1) {
    const x = ((i * 15) + 5) % s;
    const y = ((i * 11) + 7) % s;
    const len = 3 + (i % 3) * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len * 0.5, y + len);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  for (let i = 0; i < 10; i += 1) {
    const x = ((i * 19) + 9) % s;
    const y = ((i * 13) + 3) % s;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 1.5, y + 2.5);
    ctx.stroke();
  }
}

function drawDeciduousForest(ctx, s) {
  ctx.fillStyle = "#4b7a3b";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1.2;
  for (let y = -s; y < s * 2; y += 14) {
    ctx.beginPath();
    ctx.moveTo(-4, y);
    ctx.bezierCurveTo(s * 0.3, y + 3, s * 0.7, y - 1, s + 4, y + 3);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
  for (let i = 0; i < 14; i += 1) {
    const x = ((i * 19) + 7) % s;
    const y = ((i * 23) + 11) % s;
    const rx = 1.8 + (i % 2) * 1;
    const ry = 1.4 + ((i + 1) % 2) * 0.8;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDeciduousForestUnderlay(ctx, s) {
  ctx.fillStyle = "#5c4a33";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  for (let i = 0; i < 24; i += 1) {
    const x = ((i * 11) + 7) % s;
    const y = ((i * 17) + 5) % s;
    const rx = 1.2 + (i % 3) * 0.6;
    const ry = 0.8 + ((i + 1) % 3) * 0.5;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, i * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 6; i += 1) {
    const x = ((i * 12) + 4) % s;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 4, s * 0.35, x - 3, s * 0.65, x + 2, s);
    ctx.stroke();
  }
}

function drawDeciduousForestOverlay(ctx, s) {
  ctx.fillStyle = "#3b6330";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  for (let i = 0; i < 12; i += 1) {
    const x = ((i * 21) + 5) % s;
    const y = ((i * 17) + 9) % s;
    const rx = 2.2 + (i % 3) * 0.8;
    const ry = 1.6 + ((i + 1) % 2) * 0.7;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, i * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  for (let y = -s; y < s * 2; y += 16) {
    ctx.beginPath();
    ctx.moveTo(-3, y);
    ctx.bezierCurveTo(s * 0.3, y + 2, s * 0.7, y - 2, s + 3, y + 2);
    ctx.stroke();
  }
}

function drawPrairie(ctx, s) {
  ctx.fillStyle = "#93a960";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.07)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 12; i += 1) {
    const y = ((i * 5.5) + 1) % s;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.bezierCurveTo(s * 0.3, y + 1, s * 0.6, y - 0.5, s + 2, y + 0.8);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
  for (let i = 0; i < 16; i += 1) {
    const x = ((i * 13) + 7) % s;
    const y = ((i * 19) + 3) % s;
    ctx.fillRect(x, y, 1.2, 2);
  }
}

function drawPrairieUnderlay(ctx, s) {
  ctx.fillStyle = "#8b7e52";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let i = 0; i < 30; i += 1) {
    const x = ((i * 9) + 5) % s;
    const y = ((i * 13) + 7) % s;
    const r = 0.5 + (i % 3) * 0.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 5; i += 1) {
    const y = ((i * 13) + 3) % s;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(s + 2, y + 1.5);
    ctx.stroke();
  }
}

function drawPrairieOverlay(ctx, s) {
  ctx.fillStyle = "#a8b86e";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 14; i += 1) {
    const y = ((i * 4.8) + 2) % s;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.bezierCurveTo(s * 0.25, y + 1.5, s * 0.55, y - 1, s + 2, y + 1);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
  for (let i = 0; i < 8; i += 1) {
    const x = ((i * 17) + 9) % s;
    const y = ((i * 23) + 5) % s;
    ctx.fillRect(x, y, 1, 2.5);
    ctx.fillRect(x + 2, y + 1, 1, 2);
  }
}

function drawMarsh(ctx, s) {
  ctx.fillStyle = "#4f6b48";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
  for (let i = 0; i < 6; i += 1) {
    const x = ((i * 23) + 5) % s;
    const y = ((i * 17) + 11) % s;
    const rx = 4 + (i % 3) * 2;
    const ry = 3 + ((i + 1) % 3) * 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, i * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  for (let i = 0; i < 20; i += 1) {
    const x = ((i * 11) + 3) % s;
    const y = ((i * 21) + 7) % s;
    ctx.beginPath();
    ctx.arc(x, y, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMarshUnderlay(ctx, s) {
  ctx.fillStyle = "#3d4938";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let i = 0; i < 8; i += 1) {
    const x = ((i * 19) + 3) % s;
    const y = ((i * 13) + 9) % s;
    const rx = 3.5 + (i % 3) * 2;
    const ry = 2.5 + ((i + 1) % 3) * 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, i * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  for (let i = 0; i < 16; i += 1) {
    const x = ((i * 13) + 5) % s;
    const y = ((i * 17) + 3) % s;
    ctx.beginPath();
    ctx.arc(x, y, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMarshOverlay(ctx, s) {
  ctx.fillStyle = "#5a7a50";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 16; i += 1) {
    const x = ((i * 11) + 5) % s;
    const y = ((i * 13) + 7) % s;
    const h = 3 + (i % 3) * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.5, y - h);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  for (let i = 0; i < 12; i += 1) {
    const x = ((i * 17) + 9) % s;
    const y = ((i * 19) + 3) % s;
    ctx.beginPath();
    ctx.arc(x, y, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCoastal(ctx, s) {
  ctx.fillStyle = "#d4c4a0";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
  for (let i = 0; i < 44; i += 1) {
    const x = ((i * 7) + 3) % s;
    const y = ((i * 11) + 5) % s;
    const r = 0.3 + (i % 4) * 0.25;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 5; i += 1) {
    const y = ((i * 13) + 4) % s;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(s + 2, y + 1);
    ctx.stroke();
  }
}

function drawCoastalUnderlay(ctx, s) {
  ctx.fillStyle = "#4a7fa0";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i += 1) {
    const y = i * 9 + 2;
    ctx.beginPath();
    ctx.moveTo(-3, y);
    ctx.bezierCurveTo(s * 0.2, y - 1.5, s * 0.5, y + 1.5, s * 0.8, y - 1);
    ctx.lineTo(s + 3, y + 0.5);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  for (let i = 0; i < 16; i += 1) {
    const x = ((i * 11) + 7) % s;
    const y = ((i * 13) + 3) % s;
    ctx.beginPath();
    ctx.arc(x, y, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCoastalOverlay(ctx, s) {
  ctx.fillStyle = "#8fb8ad";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i += 1) {
    const y = i * 9 + 2;
    ctx.beginPath();
    ctx.moveTo(-3, y);
    ctx.bezierCurveTo(s * 0.2, y - 1.5, s * 0.5, y + 1.5, s * 0.8, y - 1);
    ctx.lineTo(s + 3, y + 0.5);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
  for (let i = 0; i < 20; i += 1) {
    const x = ((i * 11) + 7) % s;
    const y = ((i * 13) + 3) % s;
    ctx.beginPath();
    ctx.arc(x, y, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRockyHighlands(ctx, s) {
  ctx.fillStyle = "#777f8b";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i += 1) {
    const x = ((i * 11) + 5) % s;
    const y = ((i * 13) + 3) % s;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 7, y + 4);
    ctx.lineTo(x + 12, y + 3);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let i = 0; i < 16; i += 1) {
    const x = ((i * 13) + 7) % s;
    const y = ((i * 17) + 5) % s;
    const w = 1.5 + (i % 3) * 1;
    const h = 1.2 + ((i + 1) % 3) * 0.8;
    ctx.fillRect(x, y, w, h);
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 5; i += 1) {
    const y = i * 13 + 4;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(s + 2, y + 2);
    ctx.stroke();
  }
}

function drawRockyHighlandsUnderlay(ctx, s) {
  ctx.fillStyle = "#5a5e66";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  for (let i = 0; i < 20; i += 1) {
    const x = ((i * 11) + 5) % s;
    const y = ((i * 13) + 9) % s;
    const w = 1.8 + (i % 3) * 1.2;
    const h = 1.4 + ((i + 1) % 3) * 0.9;
    ctx.fillRect(x, y, w, h);
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 4; i += 1) {
    const x = ((i * 17) + 3) % s;
    const y = ((i * 11) + 5) % s;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 6, y + 3);
    ctx.lineTo(x + 10, y + 2);
    ctx.stroke();
  }
}

function drawRockyHighlandsOverlay(ctx, s) {
  ctx.fillStyle = "#8e96a2";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let i = 0; i < 10; i += 1) {
    const x = ((i * 19) + 7) % s;
    const y = ((i * 23) + 5) % s;
    const rx = 2 + (i % 3) * 1;
    const ry = 1.5 + ((i + 1) % 2) * 0.8;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, i * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
  ctx.lineWidth = 0.9;
  for (let i = 0; i < 5; i += 1) {
    const y = i * 13 + 3;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(s + 2, y + 1.5);
    ctx.stroke();
  }
}

function drawDesert(ctx, s) {
  ctx.fillStyle = "#d8bb74";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
  for (let i = 0; i < 36; i += 1) {
    const x = ((i * 9) + 5) % s;
    const y = ((i * 13) + 7) % s;
    const r = 0.4 + (i % 3) * 0.3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 7; i += 1) {
    const y = ((i * 9) + 2) % s;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(s + 2, y + 1);
    ctx.stroke();
  }
}

function drawDesertUnderlay(ctx, s) {
  ctx.fillStyle = "#b89a5c";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
  for (let i = 0; i < 28; i += 1) {
    const x = ((i * 11) + 3) % s;
    const y = ((i * 13) + 9) % s;
    const r = 0.4 + (i % 3) * 0.3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 4; i += 1) {
    const y = ((i * 17) + 5) % s;
    const x = ((i * 11) + 7) % s;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 8, y + 0.5);
    ctx.moveTo(x + 2, y + 3);
    ctx.lineTo(x + 10, y + 3.5);
    ctx.stroke();
  }
}

function drawDesertOverlay(ctx, s) {
  ctx.fillStyle = "#e4cd8e";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
  ctx.lineWidth = 0.9;
  for (let i = 0; i < 8; i += 1) {
    const y = ((i * 8) + 3) % s;
    ctx.beginPath();
    ctx.moveTo(-3, y);
    ctx.bezierCurveTo(s * 0.25, y + 1, s * 0.5, y - 0.5, s * 0.75, y + 1);
    ctx.lineTo(s + 3, y + 0.5);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  for (let i = 0; i < 24; i += 1) {
    const x = ((i * 9) + 7) % s;
    const y = ((i * 11) + 5) % s;
    const r = 0.3 + (i % 3) * 0.2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTundra(ctx, s) {
  ctx.fillStyle = "#d7e2ea";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  for (let i = 0; i < 18; i += 1) {
    const x = ((i * 13) + 7) % s;
    const y = ((i * 17) + 3) % s;
    const r = 0.5 + (i % 3) * 0.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
  for (let i = 0; i < 24; i += 1) {
    const x = ((i * 11) + 5) % s;
    const y = ((i * 19) + 9) % s;
    ctx.beginPath();
    ctx.arc(x, y, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(0, 0, 0, 0.04)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 8; i += 1) {
    const y = i * 8 + 3;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(s + 2, y + 1);
    ctx.stroke();
  }
}

function drawTundraUnderlay(ctx, s) {
  ctx.fillStyle = "#a8b5c0";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
  for (let i = 0; i < 20; i += 1) {
    const x = ((i * 13) + 5) % s;
    const y = ((i * 11) + 7) % s;
    const r = 0.5 + (i % 3) * 0.4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 6; i += 1) {
    const y = ((i * 11) + 4) % s;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(s + 2, y + 1.5);
    ctx.stroke();
  }
}

function drawTundraOverlay(ctx, s) {
  ctx.fillStyle = "#e8eef4";
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 0.6;
  for (let i = 0; i < 14; i += 1) {
    const x = ((i * 17) + 9) % s;
    const y = ((i * 13) + 5) % s;
    fillFrostStar(ctx, x, y, 1.8 + (i % 3) * 0.6);
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
  for (let i = 0; i < 18; i += 1) {
    const x = ((i * 11) + 3) % s;
    const y = ((i * 19) + 7) % s;
    ctx.beginPath();
    ctx.arc(x, y, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawVolcanicBadlands(ctx, s) {
  ctx.fillStyle = "#5a4a47";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  for (let i = 0; i < 20; i += 1) {
    const x = ((i * 11) + 3) % s;
    const y = ((i * 17) + 7) % s;
    const r = 0.5 + (i % 3) * 0.3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 0.9;
  for (let i = 0; i < 5; i += 1) {
    const x = ((i * 14) + 5) % s;
    const y = ((i * 11) + 3) % s;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 5, y + 8);
    ctx.lineTo(x + 9, y + 10);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let i = 0; i < 16; i += 1) {
    const x = ((i * 13) + 9) % s;
    const y = ((i * 19) + 5) % s;
    ctx.fillRect(x, y, 1.5, 1.2);
  }
}

function drawVolcanicBadlandsUnderlay(ctx, s) {
  ctx.fillStyle = "#3d3230";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  for (let i = 0; i < 22; i += 1) {
    const x = ((i * 13) + 5) % s;
    const y = ((i * 11) + 7) % s;
    const w = 1.6 + (i % 3) * 1;
    const h = 1.2 + ((i + 1) % 3) * 0.8;
    ctx.fillRect(x, y, w, h);
  }
  ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
  ctx.lineWidth = 0.9;
  for (let i = 0; i < 4; i += 1) {
    const x = ((i * 17) + 3) % s;
    const y = ((i * 13) + 5) % s;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 6, y + 5);
    ctx.stroke();
  }
}

function drawVolcanicBadlandsOverlay(ctx, s) {
  ctx.fillStyle = "#6e524b";
  ctx.fillRect(0, 0, s, s);
  ctx.fillStyle = "rgba(255, 80, 20, 0.06)";
  for (let i = 0; i < 10; i += 1) {
    const x = ((i * 19) + 7) % s;
    const y = ((i * 17) + 5) % s;
    const r = 1.2 + (i % 3) * 0.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 0.9;
  for (let i = 0; i < 6; i += 1) {
    const x = ((i * 12) + 3) % s;
    const y = ((i * 14) + 7) % s;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 4, y + 7);
    ctx.lineTo(x + 8, y + 8);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  for (let i = 0; i < 14; i += 1) {
    const x = ((i * 11) + 9) % s;
    const y = ((i * 13) + 3) % s;
    ctx.beginPath();
    ctx.arc(x, y, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --- Helpers ---

function fillClover(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x - r * 0.7, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + r * 0.7, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y - r * 0.7, r, 0, Math.PI * 2);
  ctx.fill();
}

function fillFrostStar(ctx, x, y, r) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x, y + r);
  ctx.moveTo(x - r, y);
  ctx.lineTo(x + r, y);
  ctx.moveTo(x - r * 0.7, y - r * 0.7);
  ctx.lineTo(x + r * 0.7, y + r * 0.7);
  ctx.moveTo(x + r * 0.7, y - r * 0.7);
  ctx.lineTo(x - r * 0.7, y + r * 0.7);
  ctx.stroke();
}
