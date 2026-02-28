import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const FLOWER_PETAL_RADIUS = 4;
const FLOWER_CENTER_RADIUS = 2.5;
const FLOWER_RING_RADIUS = 5;
const FLOWER_CENTER_COLOR = "#fff6d1";
const CLOVER_LEAF_RADIUS = 4;
const CLOVER_RING_RADIUS = 4;
const TALL_GRASS_BLADE_HALF_WIDTH = 4;
const TALL_GRASS_BLADE_HEIGHT = 14;
const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.22)";
const STUMP_INNER_COLOR = "#b7845d";
const STUMP_RING_COLOR = "rgba(92, 58, 35, 0.45)";
const STUMP_BARK_NOTCH_COLOR = "#6e472f";
const STUMP_BARREL_COLOR = "#7a5034";
const STUMP_BARREL_HEIGHT_FACTOR = 0.35;

export function drawGrasslandNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  if (decorDef.shape === "flower-cluster") {
    drawFlowerCluster(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "clover-patch") {
    drawCloverPatch(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "tall-grass") {
    drawTallGrass(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "bush") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawBush(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "stump") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawStump(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported grassland non-blocking shape "${decorDef.shape}".`);
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

function drawCloverPatch(ctx, camera, worldLengthToScreen, x, y, leafColor) {
  const ring = worldLengthToScreen(camera, CLOVER_RING_RADIUS);
  const leafRadius = worldLengthToScreen(camera, CLOVER_LEAF_RADIUS);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - ring, y, leafRadius, leafColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + ring, y, leafRadius, leafColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y - ring, leafRadius, leafColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y + ring, leafRadius, leafColor);
}

function drawTallGrass(ctx, camera, worldLengthToScreen, x, y, bladeColor) {
  const sideOffset = worldLengthToScreen(camera, 5);
  const lowOffsetY = worldLengthToScreen(camera, 2);
  const bladeHalfWidth = worldLengthToScreen(camera, TALL_GRASS_BLADE_HALF_WIDTH);
  const bladeHeight = worldLengthToScreen(camera, TALL_GRASS_BLADE_HEIGHT);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - sideOffset, y + lowOffsetY, bladeHalfWidth, bladeHeight - 1, bladeColor);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x, y, bladeHalfWidth + 1, bladeHeight + 1, bladeColor);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + sideOffset, y + lowOffsetY, bladeHalfWidth, bladeHeight - 1, bladeColor);
}

function drawBush(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const leafRadius = footprintRadius * 0.95;
  const sideOffset = footprintRadius * 0.7;
  const topOffset = footprintRadius * 0.45;
  const yOffset = worldLengthToScreen(camera, 1);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - sideOffset, y + yOffset, leafRadius * 0.85, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + sideOffset, y + yOffset, leafRadius * 0.85, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y - topOffset, leafRadius, color);
}

function drawStump(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const outerRadiusX = footprintRadius * 1.05;
  const outerRadiusY = footprintRadius * 0.82;
  const innerRadiusX = outerRadiusX * 0.68;
  const innerRadiusY = outerRadiusY * 0.62;
  const barrelHeight = outerRadiusY * STUMP_BARREL_HEIGHT_FACTOR;
  drawStumpBarrel(ctx, camera, worldLengthToScreen, x, y, outerRadiusX, outerRadiusY, barrelHeight);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, outerRadiusX, outerRadiusY, color);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, innerRadiusX, innerRadiusY, STUMP_INNER_COLOR);
  drawStumpRing(ctx, x, y, innerRadiusX * 0.72, innerRadiusY * 0.72);
  drawStumpRing(ctx, x, y, innerRadiusX * 0.45, innerRadiusY * 0.45);
  drawBarkNotch(ctx, x + outerRadiusX * 0.62, y - outerRadiusY * 0.18, outerRadiusX * 0.22, outerRadiusY * 0.28);
}

function drawStumpBarrel(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY, barrelHeight) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  drawBarrelPath(ctx, x + shadowOffsetX, y + shadowOffsetY, radiusX, radiusY, barrelHeight);
  ctx.fill();
  fillPaperShape(ctx, camera, STUMP_BARREL_COLOR, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawBarrelPath(drawCtx, x, y, radiusX, radiusY, barrelHeight);
  });
}

function drawBarrelPath(ctx, x, y, radiusX, radiusY, barrelHeight) {
  ctx.beginPath();
  ctx.moveTo(x - radiusX, y);
  ctx.lineTo(x - radiusX, y + barrelHeight);
  ctx.ellipse(x, y + barrelHeight, radiusX, radiusY, 0, Math.PI, 0, true);
  ctx.lineTo(x + radiusX, y);
}

function drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillEllipse(ctx, x + shadowOffsetX, y + shadowOffsetY, radiusX, radiusY);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  });
}

function drawStumpRing(ctx, x, y, radiusX, radiusY) {
  ctx.save();
  ctx.strokeStyle = STUMP_RING_COLOR;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawBarkNotch(ctx, x, y, radiusX, radiusY) {
  ctx.fillStyle = STUMP_BARK_NOTCH_COLOR;
  fillEllipse(ctx, x, y, radiusX, radiusY);
}

function fillEllipse(ctx, x, y, radiusX, radiusY) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
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

function drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x, y, halfWidth, height, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillGrassBlade(ctx, x + shadowOffsetX, y + shadowOffsetY, halfWidth, height);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    const baseY = y + height * 0.5;
    const tipY = y - height * 0.5;
    drawCtx.beginPath();
    drawCtx.moveTo(x - halfWidth, baseY);
    drawCtx.quadraticCurveTo(x - halfWidth * 0.4, y, x, tipY);
    drawCtx.quadraticCurveTo(x + halfWidth * 0.4, y, x + halfWidth, baseY);
    drawCtx.closePath();
  });
}

function fillCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function fillGrassBlade(ctx, x, y, halfWidth, height) {
  const baseY = y + height * 0.5;
  const tipY = y - height * 0.5;
  ctx.beginPath();
  ctx.moveTo(x - halfWidth, baseY);
  ctx.quadraticCurveTo(x - halfWidth * 0.4, y, x, tipY);
  ctx.quadraticCurveTo(x + halfWidth * 0.4, y, x + halfWidth, baseY);
  ctx.closePath();
  ctx.fill();
}
