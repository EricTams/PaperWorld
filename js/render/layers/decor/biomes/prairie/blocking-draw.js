import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 2;
const PAPER_SHADOW_OFFSET_Y = 3;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.22)";
const BOULDER_HIGHLIGHT_COLOR = "rgba(210, 200, 180, 0.2)";
const TRUNK_COLOR = "#6e5030";
const TRUNK_HEIGHT_FACTOR = 0.6;

export function drawPrairieBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "copse") {
    drawCopse(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "boulder") {
    drawBoulder(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported prairie blocking shape "${decorDef.shape}".`);
}

function drawCopse(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const canopyRadius = r * 0.55;
  const trunkW = r * 0.12;
  const trunkH = canopyRadius * TRUNK_HEIGHT_FACTOR;

  drawTrunk(ctx, camera, worldLengthToScreen, x - r * 0.35, y + r * 0.1, trunkW, trunkH);
  drawTrunk(ctx, camera, worldLengthToScreen, x + r * 0.3, y + r * 0.15, trunkW, trunkH);
  drawTrunk(ctx, camera, worldLengthToScreen, x, y - r * 0.05, trunkW, trunkH);

  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - r * 0.35, y - r * 0.1, canopyRadius * 0.85, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + r * 0.3, y + r * 0.0, canopyRadius * 0.9, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y - r * 0.25, canopyRadius, color);
}

function drawTrunk(ctx, camera, worldLengthToScreen, x, y, halfWidth, height) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const top = y;
  const cornerRadius = halfWidth * 0.3;
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillRoundedRectPath(ctx, x - halfWidth + shadowOffsetX, top + shadowOffsetY, halfWidth * 2, height, cornerRadius);
  ctx.fill();
  fillPaperShape(ctx, camera, TRUNK_COLOR, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    fillRoundedRectPath(drawCtx, x - halfWidth, top, halfWidth * 2, height, cornerRadius);
  });
}

function drawBoulder(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const backSize = footprintRadius * 0.92;
  const frontSize = footprintRadius * 1.15;
  drawPaperRockLayer(ctx, camera, worldLengthToScreen, x - footprintRadius * 0.32, y + footprintRadius * 0.1, backSize, color);
  drawPaperRockLayer(ctx, camera, worldLengthToScreen, x + footprintRadius * 0.22, y - footprintRadius * 0.03, frontSize, color);
  drawBoulderHighlight(ctx, x + footprintRadius * 0.22, y - footprintRadius * 0.03, frontSize);
}

function drawPaperRockLayer(ctx, camera, worldLengthToScreen, x, y, size, fillColor) {
  const points = [
    { x: x - size * 0.98, y: y + size * 0.2 },
    { x: x - size * 0.72, y: y - size * 0.5 },
    { x: x - size * 0.18, y: y - size * 0.76 },
    { x: x + size * 0.4, y: y - size * 0.64 },
    { x: x + size * 0.96, y: y - size * 0.2 },
    { x: x + size * 0.84, y: y + size * 0.36 },
    { x: x + size * 0.24, y: y + size * 0.68 },
    { x: x - size * 0.46, y: y + size * 0.64 },
  ];
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const shadowPoints = points.map((p) => ({
    x: p.x + shadowOffsetX,
    y: p.y + shadowOffsetY,
  }));
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillPolygon(ctx, shadowPoints);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.ROUGH_STONE, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      drawCtx.lineTo(points[i].x, points[i].y);
    }
    drawCtx.closePath();
  });
}

function drawBoulderHighlight(ctx, x, y, size) {
  const points = [
    { x: x - size * 0.42, y: y - size * 0.28 },
    { x: x - size * 0.18, y: y - size * 0.4 },
    { x: x + size * 0.05, y: y - size * 0.26 },
    { x: x - size * 0.1, y: y - size * 0.1 },
    { x: x - size * 0.34, y: y - size * 0.13 },
  ];
  ctx.fillStyle = BOULDER_HIGHLIGHT_COLOR;
  fillPolygon(ctx, points);
}

function drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y, radius, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillCircle(ctx, x + shadowOffsetX, y + shadowOffsetY, radius);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.arc(x, y, radius, 0, Math.PI * 2);
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

function fillCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function fillPolygon(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}
