const PATTERN_TILE_SIZE_PX = 64;
const UV_WORLD_UNITS_PER_TILE = 24;
const PATTERN_OVERLAY_ALPHA = 0.68;

const PATTERN_IDS = Object.freeze({
  LEAVES: "leaves",
  CUT_WOOD: "cut-wood",
  ROUGH_STONE: "rough-stone",
  GROUND_PAPER: "ground-paper",
  CLOVER: "clover",
  NEEDLE_MAT: "needle-mat",
});

const patternTileById = new Map();
let cachedPatterns = new Map();
let cachedPatternKey = "";

export const PAPER_PATTERN_IDS = PATTERN_IDS;

export function fillPaperShape(ctx, camera, baseColor, patternId, drawPath) {
  ctx.fillStyle = baseColor;
  drawPath(ctx);
  ctx.fill();
  const pattern = getPaperPattern(ctx, camera, patternId);
  if (!pattern) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = PATTERN_OVERLAY_ALPHA;
  ctx.fillStyle = pattern;
  drawPath(ctx);
  ctx.fill();
  ctx.restore();
}

export function getPaperPattern(ctx, camera, patternId) {
  const key = `${camera.zoom},${camera.x},${camera.y},${camera.viewWidth},${camera.viewHeight}`;
  if (key !== cachedPatternKey) {
    cachedPatterns = new Map();
    cachedPatternKey = key;
  }
  const existing = cachedPatterns.get(patternId);
  if (existing) {
    return existing;
  }
  const pattern = createWorldPattern(ctx, camera, patternId);
  if (pattern) {
    cachedPatterns.set(patternId, pattern);
  }
  return pattern;
}

function createWorldPattern(ctx, camera, patternId) {
  const tile = getPatternTile(patternId);
  const pattern = ctx.createPattern(tile, "repeat");
  if (!pattern) {
    return null;
  }
  if (typeof pattern.setTransform === "function" && typeof DOMMatrix !== "undefined") {
    const scale = (camera.zoom * UV_WORLD_UNITS_PER_TILE) / PATTERN_TILE_SIZE_PX;
    const worldOriginScreenX = -camera.x * camera.zoom + camera.viewWidth * 0.5;
    const worldOriginScreenY = -camera.y * camera.zoom + camera.viewHeight * 0.5;
    pattern.setTransform(new DOMMatrix([scale, 0, 0, scale, worldOriginScreenX, worldOriginScreenY]));
  }
  return pattern;
}

function getPatternTile(patternId) {
  const cached = patternTileById.get(patternId);
  if (cached) {
    return cached;
  }
  const tile = createTileCanvas(PATTERN_TILE_SIZE_PX, PATTERN_TILE_SIZE_PX);
  const ctx = tile.getContext("2d");
  if (!ctx) {
    throw new Error(`Unable to create pattern context for "${patternId}".`);
  }
  if (patternId === PATTERN_IDS.LEAVES) {
    drawLeavesPatternTile(ctx, PATTERN_TILE_SIZE_PX);
  } else if (patternId === PATTERN_IDS.CUT_WOOD) {
    drawCutWoodPatternTile(ctx, PATTERN_TILE_SIZE_PX);
  } else if (patternId === PATTERN_IDS.ROUGH_STONE) {
    drawRoughStonePatternTile(ctx, PATTERN_TILE_SIZE_PX);
  } else if (patternId === PATTERN_IDS.GROUND_PAPER) {
    drawGroundPaperPatternTile(ctx, PATTERN_TILE_SIZE_PX);
  } else if (patternId === PATTERN_IDS.CLOVER) {
    drawCloverPatternTile(ctx, PATTERN_TILE_SIZE_PX);
  } else if (patternId === PATTERN_IDS.NEEDLE_MAT) {
    drawNeedleMatPatternTile(ctx, PATTERN_TILE_SIZE_PX);
  } else {
    throw new Error(`Unknown paper pattern "${patternId}".`);
  }
  patternTileById.set(patternId, tile);
  return tile;
}

function createTileCanvas(width, height) {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function drawLeavesPatternTile(ctx, size) {
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.13)";
  ctx.lineWidth = 1.5;
  for (let y = -size; y < size * 2; y += 15) {
    ctx.beginPath();
    ctx.moveTo(-4, y);
    ctx.bezierCurveTo(size * 0.25, y + 3, size * 0.7, y - 1, size + 4, y + 4);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.17)";
  for (let i = 0; i < 18; i += 1) {
    const x = ((i * 19) + 9) % size;
    const y = ((i * 27) + 15) % size;
    const rx = 2.2 + (i % 2) * 1.4;
    const ry = 1.8 + ((i + 1) % 2) * 1.1;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCutWoodPatternTile(ctx, size) {
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.17)";
  ctx.lineWidth = 1.1;
  const knots = [
    { x: size * 0.3, y: size * 0.32, r: 11 },
    { x: size * 0.73, y: size * 0.66, r: 9 },
  ];
  knots.forEach((knot) => {
    for (let r = knot.r; r > 2; r -= 3.2) {
      ctx.beginPath();
      ctx.ellipse(knot.x, knot.y, r, r * 0.8, 0.35, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  ctx.strokeStyle = "rgba(0, 0, 0, 0.13)";
  for (let i = 0; i < 8; i += 1) {
    const x = i * 8;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 2, size * 0.35, x - 2, size * 0.72, x + 1, size);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
  for (let i = 0; i < 10; i += 1) {
    const x = ((i * 11) + 7) % size;
    const y = ((i * 17) + 3) % size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 4, y + 6);
    ctx.stroke();
  }
}

function drawRoughStonePatternTile(ctx, size) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  for (let i = 0; i < 24; i += 1) {
    const x = ((i * 13) + 5) % size;
    const y = ((i * 21) + 19) % size;
    const w = 2.2 + (i % 3) * 1.8;
    const h = 2 + ((i + 1) % 3) * 1.6;
    ctx.fillRect(x, y, w, h);
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.13)";
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 7; i += 1) {
    const y = i * 10;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(size + 2, y + 3);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(0, 0, 0, 0.13)";
  for (let i = 0; i < 6; i += 1) {
    const x = i * 11;
    ctx.beginPath();
    ctx.moveTo(x, -2);
    ctx.lineTo(x - 4, size + 2);
    ctx.stroke();
  }
}

function drawGroundPaperPatternTile(ctx, size) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let i = 0; i < 36; i += 1) {
    const x = ((i * 11) + 3) % size;
    const y = ((i * 19) + 7) % size;
    const radius = 0.9 + (i % 3) * 0.65;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i += 1) {
    const y = i * 8;
    ctx.beginPath();
    ctx.moveTo(-2, y);
    ctx.lineTo(size + 2, y + 2);
    ctx.stroke();
  }
}

function drawCloverPatternTile(ctx, size) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  for (let i = 0; i < 12; i += 1) {
    const x = ((i * 23) + 9) % size;
    const y = ((i * 19) + 5) % size;
    fillCloverGlyph(ctx, x, y, 2.2);
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i += 1) {
    const y = i * 10;
    ctx.beginPath();
    ctx.moveTo(-3, y);
    ctx.lineTo(size + 3, y + 2);
    ctx.stroke();
  }
}

function drawNeedleMatPatternTile(ctx, size) {
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.19)";
  ctx.lineWidth = 1.25;
  for (let i = 0; i < 28; i += 1) {
    const x = ((i * 17) + 3) % size;
    const y = ((i * 13) + 11) % size;
    const length = 5 + (i % 3) * 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length * 0.72, y + length);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  for (let i = 0; i < 16; i += 1) {
    const x = ((i * 21) + 7) % size;
    const y = ((i * 9) + 5) % size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 2, y + 3);
    ctx.stroke();
  }
}

function fillCloverGlyph(ctx, x, y, radius) {
  fillCircle(ctx, x - radius * 0.7, y, radius);
  fillCircle(ctx, x + radius * 0.7, y, radius);
  fillCircle(ctx, x, y - radius * 0.7, radius);
  ctx.fillRect(x - 0.5, y + radius * 0.6, 1, radius * 1.1);
}

function fillCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}
