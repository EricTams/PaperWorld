import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.18)";
const FOAM_ACCENT_COLOR = "rgba(255, 255, 255, 0.3)";

export function drawCoastalNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "seaweed") {
    drawSeaweed(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "foam-patch") {
    drawFoamPatch(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "dune-grass") {
    drawDuneGrass(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "driftwood") {
    drawDriftwood(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "shrub") {
    drawShrub(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported coastal non-blocking shape "${decorDef.shape}".`);
}

// --- Seaweed: wavy blade cluster ---

const SEAWEED_BLADE_HALF_WIDTH = 2.5;
const SEAWEED_BLADE_HEIGHT = 11;
const SEAWEED_SIDE_OFFSET = 3.5;

function drawSeaweed(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const sideOff = worldLengthToScreen(camera, SEAWEED_SIDE_OFFSET);
  const halfW = worldLengthToScreen(camera, SEAWEED_BLADE_HALF_WIDTH);
  const height = worldLengthToScreen(camera, SEAWEED_BLADE_HEIGHT);
  drawWavyBlade(ctx, camera, worldLengthToScreen, x - sideOff, y, halfW * 0.8, height * 0.85, color, -0.15);
  drawWavyBlade(ctx, camera, worldLengthToScreen, x + sideOff * 0.6, y, halfW * 0.9, height, color, 0.12);
  drawWavyBlade(ctx, camera, worldLengthToScreen, x, y + halfW, halfW * 0.7, height * 0.7, color, -0.08);
}

function drawWavyBlade(ctx, camera, worldLengthToScreen, x, y, halfWidth, height, fillColor, curveBias) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const baseY = y + height * 0.5;
  const tipY = y - height * 0.5;
  const curveX = halfWidth * 2 * curveBias;
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillWavyBladePath(ctx, x + shadowOffsetX, baseY + shadowOffsetY, tipY + shadowOffsetY, halfWidth, curveX);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    fillWavyBladePath(drawCtx, x, baseY, tipY, halfWidth, curveX);
  });
}

function fillWavyBladePath(ctx, x, baseY, tipY, halfWidth, curveX) {
  const midY = (baseY + tipY) * 0.5;
  ctx.beginPath();
  ctx.moveTo(x - halfWidth, baseY);
  ctx.quadraticCurveTo(x - halfWidth * 0.3 + curveX, midY, x + curveX * 0.5, tipY);
  ctx.quadraticCurveTo(x + halfWidth * 0.3 + curveX, midY, x + halfWidth, baseY);
  ctx.closePath();
  ctx.fill();
}

// --- Foam patch: cluster of small irregular blobs ---

const FOAM_BLOB_OFFSETS = Object.freeze([
  { dx: 0, dy: 0, scale: 1.0 },
  { dx: -0.7, dy: -0.5, scale: 0.7 },
  { dx: 0.8, dy: -0.3, scale: 0.65 },
  { dx: -0.4, dy: 0.7, scale: 0.6 },
  { dx: 0.5, dy: 0.6, scale: 0.55 },
]);

function drawFoamPatch(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  for (let i = 0; i < FOAM_BLOB_OFFSETS.length; i += 1) {
    const blob = FOAM_BLOB_OFFSETS[i];
    const bx = x + blob.dx * r;
    const by = y + blob.dy * r;
    const blobR = r * blob.scale * 0.45;
    ctx.fillStyle = PAPER_SHADOW_COLOR;
    ctx.beginPath();
    ctx.ellipse(bx + shadowOffsetX, by + shadowOffsetY, blobR * 1.1, blobR * 0.8, blob.dx * 0.3, 0, Math.PI * 2);
    ctx.fill();
    fillPaperShape(ctx, camera, color, PAPER_PATTERN_IDS.GROUND_PAPER, (drawCtx) => {
      drawCtx.beginPath();
      drawCtx.ellipse(bx, by, blobR * 1.1, blobR * 0.8, blob.dx * 0.3, 0, Math.PI * 2);
    });
  }
  drawFoamHighlights(ctx, x, y, r);
}

function drawFoamHighlights(ctx, x, y, r) {
  ctx.fillStyle = FOAM_ACCENT_COLOR;
  ctx.beginPath();
  ctx.ellipse(x - r * 0.15, y - r * 0.1, r * 0.2, r * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + r * 0.3, y - r * 0.15, r * 0.12, r * 0.08, 0.4, 0, Math.PI * 2);
  ctx.fill();
}

// --- Dune grass: blade cluster ---

const DUNE_GRASS_BLADE_HALF_WIDTH = 2.5;
const DUNE_GRASS_BLADE_HEIGHT = 10;
const DUNE_GRASS_SIDE_OFFSET = 3.5;

function drawDuneGrass(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const sideOff = worldLengthToScreen(camera, DUNE_GRASS_SIDE_OFFSET);
  const halfW = worldLengthToScreen(camera, DUNE_GRASS_BLADE_HALF_WIDTH);
  const height = worldLengthToScreen(camera, DUNE_GRASS_BLADE_HEIGHT);
  const lowY = worldLengthToScreen(camera, 1.5);
  drawStraightBlade(ctx, camera, worldLengthToScreen, x - sideOff, y + lowY, halfW * 0.85, height * 0.8, color);
  drawStraightBlade(ctx, camera, worldLengthToScreen, x + sideOff * 0.7, y + lowY, halfW * 0.9, height * 0.85, color);
}

function drawStraightBlade(ctx, camera, worldLengthToScreen, x, y, halfWidth, height, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const baseY = y + height * 0.5;
  const tipY = y - height * 0.5;
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillBladePath(ctx, x + shadowOffsetX, baseY + shadowOffsetY, tipY + shadowOffsetY, halfWidth);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    fillBladePath(drawCtx, x, baseY, tipY, halfWidth);
  });
}

function fillBladePath(ctx, x, baseY, tipY, halfWidth) {
  const midY = (baseY + tipY) * 0.5;
  ctx.beginPath();
  ctx.moveTo(x - halfWidth, baseY);
  ctx.quadraticCurveTo(x - halfWidth * 0.4, midY, x, tipY);
  ctx.quadraticCurveTo(x + halfWidth * 0.4, midY, x + halfWidth, baseY);
  ctx.closePath();
  ctx.fill();
}

// --- Driftwood: rounded rect ---

function drawDriftwood(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const halfW = footprintRadius * 1.4;
  const halfH = footprintRadius * 0.35;
  drawPaperRoundedRect(ctx, camera, worldLengthToScreen, x, y, halfW, halfH, color, PAPER_PATTERN_IDS.CUT_WOOD);
}

function drawPaperRoundedRect(ctx, camera, worldLengthToScreen, x, y, halfWidth, halfHeight, fillColor, patternId) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const cornerRadius = Math.min(halfWidth, halfHeight) * 0.4;
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillRoundedRectPath(ctx, x - halfWidth + shadowOffsetX, y - halfHeight + shadowOffsetY, halfWidth * 2, halfHeight * 2, cornerRadius);
  ctx.fill();
  fillPaperShape(ctx, camera, fillColor, patternId, (drawCtx) => {
    fillRoundedRectPath(drawCtx, x - halfWidth, y - halfHeight, halfWidth * 2, halfHeight * 2, cornerRadius);
  });
}

function fillRoundedRectPath(ctx, x, y, w, h, r) {
  const clampedR = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + clampedR, y);
  ctx.lineTo(x + w - clampedR, y);
  ctx.arcTo(x + w, y, x + w, y + clampedR, clampedR);
  ctx.lineTo(x + w, y + h - clampedR);
  ctx.arcTo(x + w, y + h, x + w - clampedR, y + h, clampedR);
  ctx.lineTo(x + clampedR, y + h);
  ctx.arcTo(x, y + h, x, y + h - clampedR, clampedR);
  ctx.lineTo(x, y + clampedR);
  ctx.arcTo(x, y, x + clampedR, y, clampedR);
  ctx.closePath();
}

// --- Shrub: rounded polygon ---

function drawShrub(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const points = buildShrubPoints(x, y, r);
  drawPaperPolygon(ctx, camera, worldLengthToScreen, points, color, PAPER_PATTERN_IDS.LEAVES);
}

function buildShrubPoints(cx, cy, radius) {
  const lobes = 6;
  const outerR = radius * 1.1;
  const innerR = radius * 0.75;
  const points = [];
  const step = Math.PI / lobes;
  for (let i = 0; i < lobes * 2; i += 1) {
    const angle = i * step - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  return points;
}

function drawPaperPolygon(ctx, camera, worldLengthToScreen, points, fillColor, patternId) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const shadowPoints = points.map((p) => ({
    x: p.x + shadowOffsetX,
    y: p.y + shadowOffsetY,
  }));
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillPolygon(ctx, shadowPoints);
  fillPaperShape(ctx, camera, fillColor, patternId, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      drawCtx.lineTo(points[i].x, points[i].y);
    }
    drawCtx.closePath();
  });
}

// --- Shared helpers ---

function fillPolygon(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}
