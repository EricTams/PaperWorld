import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.20)";

const TALL_GRASS_BLADE_HALF_WIDTH = 5;
const TALL_GRASS_BLADE_HEIGHT = 18;
const TALL_GRASS_WIND_OFFSET = 3;

const FLOWER_PETAL_RADIUS = 4;
const FLOWER_CENTER_RADIUS = 2.5;
const FLOWER_RING_RADIUS = 5;
const FLOWER_CENTER_COLOR = "#fffbe0";

const CRACK_LINE_COLOR = "rgba(80, 60, 30, 0.45)";

export function drawPrairieNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  if (decorDef.shape === "tall-grass") {
    drawTallGrass(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "flower-cluster") {
    drawFlowerCluster(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "bare-earth") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawBareEarth(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "thorn-bush") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawThornBush(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported prairie non-blocking shape "${decorDef.shape}".`);
}

function drawTallGrass(ctx, camera, worldLengthToScreen, x, y, color) {
  const sideOffset = worldLengthToScreen(camera, 6);
  const windOffset = worldLengthToScreen(camera, TALL_GRASS_WIND_OFFSET);
  const lowY = worldLengthToScreen(camera, 2);
  const halfW = worldLengthToScreen(camera, TALL_GRASS_BLADE_HALF_WIDTH);
  const height = worldLengthToScreen(camera, TALL_GRASS_BLADE_HEIGHT);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - sideOffset + windOffset * 0.5, y + lowY, halfW * 0.85, height * 0.82, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - sideOffset * 0.3 + windOffset, y, halfW, height, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + sideOffset * 0.4 + windOffset * 0.8, y + lowY * 0.5, halfW * 0.9, height * 0.9, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + sideOffset + windOffset * 0.3, y + lowY, halfW * 0.8, height * 0.78, color);
}

function drawFlowerCluster(ctx, camera, worldLengthToScreen, x, y, petalColor) {
  const ring = worldLengthToScreen(camera, FLOWER_RING_RADIUS);
  const petalRadius = worldLengthToScreen(camera, FLOWER_PETAL_RADIUS);
  const centerRadius = worldLengthToScreen(camera, FLOWER_CENTER_RADIUS);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - ring, y, petalRadius, petalColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + ring, y, petalRadius, petalColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y - ring, petalRadius, petalColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y + ring, petalRadius, petalColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y, centerRadius, FLOWER_CENTER_COLOR);
}

function drawBareEarth(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const rx = footprintRadius * 1.3;
  const ry = footprintRadius * 0.7;
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, color);
  drawCrackLines(ctx, x, y, rx, ry);
}

function drawCrackLines(ctx, x, y, rx, ry) {
  ctx.save();
  ctx.strokeStyle = CRACK_LINE_COLOR;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(x - rx * 0.25, y - ry * 0.4);
  ctx.lineTo(x + rx * 0.1, y + ry * 0.2);
  ctx.lineTo(x + rx * 0.4, y + ry * 0.35);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + rx * 0.1, y + ry * 0.2);
  ctx.lineTo(x - rx * 0.1, y + ry * 0.55);
  ctx.stroke();
  ctx.restore();
}

function drawThornBush(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const numPoints = 8;
  const outerR = footprintRadius * 1.1;
  const innerR = footprintRadius * 0.55;
  const points = starPoints(x, y, numPoints, outerR, innerR);
  drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, color);
}

function starPoints(cx, cy, numPoints, outerRadius, innerRadius) {
  const points = [];
  const step = Math.PI / numPoints;
  for (let i = 0; i < numPoints * 2; i += 1) {
    const angle = i * step - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    points.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
  }
  return points;
}

function drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const shadowPoints = points.map((p) => ({
    x: p.x + shadowOffsetX,
    y: p.y + shadowOffsetY,
  }));
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillPolygon(ctx, shadowPoints);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      drawCtx.lineTo(points[i].x, points[i].y);
    }
    drawCtx.closePath();
  });
}

function drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillEllipse(ctx, x + shadowOffsetX, y + shadowOffsetY, rx, ry);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.GROUND_PAPER, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  });
}

function drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x, y, halfWidth, height, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const baseY = y + height * 0.5;
  const tipY = y - height * 0.5;
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillBlade(ctx, x + shadowOffsetX, baseY + shadowOffsetY, tipY + shadowOffsetY, halfWidth);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.moveTo(x - halfWidth, baseY);
    drawCtx.quadraticCurveTo(x - halfWidth * 0.4, y, x, tipY);
    drawCtx.quadraticCurveTo(x + halfWidth * 0.4, y, x + halfWidth, baseY);
    drawCtx.closePath();
  });
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

function fillBlade(ctx, x, baseY, tipY, halfWidth) {
  const midY = (baseY + tipY) * 0.5;
  ctx.beginPath();
  ctx.moveTo(x - halfWidth, baseY);
  ctx.quadraticCurveTo(x - halfWidth * 0.4, midY, x, tipY);
  ctx.quadraticCurveTo(x + halfWidth * 0.4, midY, x + halfWidth, baseY);
  ctx.closePath();
  ctx.fill();
}

function fillCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function fillEllipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
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
