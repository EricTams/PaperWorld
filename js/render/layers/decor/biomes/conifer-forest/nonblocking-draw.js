import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.24)";
const MUSHROOM_CAP_COLOR = "#b06c49";
const LOG_RING_COLOR = "#b68b62";
const STUMP_BARREL_COLOR = "#6b4a30";
const STUMP_BARREL_HEIGHT_FACTOR = 0.35;

const FERN_SIDE_OFFSET_X = 6;
const FERN_SIDE_OFFSET_Y = 2;
const FERN_CENTER_OFFSET_Y = 2;

const MOSS_OFFSET_A_X = 5;
const MOSS_OFFSET_A_Y = 1;
const MOSS_OFFSET_B_X = 4;
const MOSS_OFFSET_B_Y = 2;
const MOSS_OFFSET_C_X = 1;
const MOSS_OFFSET_C_Y = 4;
const MOSS_RADIUS_A = 7;
const MOSS_RADIUS_B = 6;

const MUSH_RING_A_X = 5;
const MUSH_RING_A_Y = 3;
const MUSH_RING_B_X = 6;
const MUSH_RING_B_Y = 1;
const MUSH_RING_C_X = 2;
const MUSH_RING_C_Y = 5;
const MUSH_RING_D_X = 7;
const MUSH_RING_D_Y = 4;

const MUSH_STEM_OFFSET_Y = 1;
const MUSH_CAP_OFFSET_Y = 2;

export function drawConiferForestNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  if (decorDef.shape === "fern") {
    drawFernCluster(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "moss-patch") {
    drawMossPatch(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "mushroom-ring") {
    drawMushroomRing(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "fallen-log") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawFallenLog(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "stump") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawStump(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported conifer-forest non-blocking shape "${decorDef.shape}".`);
}

function drawFernCluster(ctx, camera, worldLengthToScreen, x, y, color) {
  const sideX = worldLengthToScreen(camera, FERN_SIDE_OFFSET_X);
  const sideY = worldLengthToScreen(camera, FERN_SIDE_OFFSET_Y);
  const centerY = worldLengthToScreen(camera, FERN_CENTER_OFFSET_Y);
  drawPaperLeaf(ctx, camera, worldLengthToScreen, x - sideX, y + sideY, 7, 14, color);
  drawPaperLeaf(ctx, camera, worldLengthToScreen, x, y - centerY, 8, 16, color);
  drawPaperLeaf(ctx, camera, worldLengthToScreen, x + sideX, y + sideY, 7, 14, color);
}

function drawMossPatch(ctx, camera, worldLengthToScreen, x, y, color) {
  const radiusA = worldLengthToScreen(camera, MOSS_RADIUS_A);
  const radiusB = worldLengthToScreen(camera, MOSS_RADIUS_B);
  const oax = worldLengthToScreen(camera, MOSS_OFFSET_A_X);
  const oay = worldLengthToScreen(camera, MOSS_OFFSET_A_Y);
  const obx = worldLengthToScreen(camera, MOSS_OFFSET_B_X);
  const oby = worldLengthToScreen(camera, MOSS_OFFSET_B_Y);
  const ocx = worldLengthToScreen(camera, MOSS_OFFSET_C_X);
  const ocy = worldLengthToScreen(camera, MOSS_OFFSET_C_Y);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - oax, y + oay, radiusA, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + obx, y - oby, radiusA, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + ocx, y + ocy, radiusB, color);
}

function drawMushroomRing(ctx, camera, worldLengthToScreen, x, y, stemColor) {
  const ax = worldLengthToScreen(camera, MUSH_RING_A_X);
  const ay = worldLengthToScreen(camera, MUSH_RING_A_Y);
  const bx = worldLengthToScreen(camera, MUSH_RING_B_X);
  const by = worldLengthToScreen(camera, MUSH_RING_B_Y);
  const cx = worldLengthToScreen(camera, MUSH_RING_C_X);
  const cy = worldLengthToScreen(camera, MUSH_RING_C_Y);
  const dx = worldLengthToScreen(camera, MUSH_RING_D_X);
  const dy = worldLengthToScreen(camera, MUSH_RING_D_Y);
  drawMushroom(ctx, camera, worldLengthToScreen, x - ax, y - ay, stemColor);
  drawMushroom(ctx, camera, worldLengthToScreen, x + bx, y - by, stemColor);
  drawMushroom(ctx, camera, worldLengthToScreen, x + cx, y + cy, stemColor);
  drawMushroom(ctx, camera, worldLengthToScreen, x - dx, y + dy, stemColor);
}

function drawMushroom(ctx, camera, worldLengthToScreen, x, y, stemColor) {
  const stemWidth = worldLengthToScreen(camera, 2.5);
  const stemHeight = worldLengthToScreen(camera, 6);
  const capRadiusX = worldLengthToScreen(camera, 4);
  const capRadiusY = worldLengthToScreen(camera, 2.7);
  const stemOy = worldLengthToScreen(camera, MUSH_STEM_OFFSET_Y);
  const capOy = worldLengthToScreen(camera, MUSH_CAP_OFFSET_Y);
  drawPaperStem(ctx, camera, worldLengthToScreen, x, y + stemOy, stemWidth, stemHeight, stemColor);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y - capOy, capRadiusX, capRadiusY, MUSHROOM_CAP_COLOR);
}

function drawFallenLog(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  drawPaperRectLayer(ctx, camera, worldLengthToScreen, x, y, r * 2.4, r * 0.55, color);
  drawPaperRectLayer(ctx, camera, worldLengthToScreen, x - r * 0.7, y - r * 0.5, r * 1.0, r * 0.38, color);
  drawLogRing(ctx, x + r * 1.2, y, r * 0.12, r * 0.22);
  drawLogRing(ctx, x - r * 0.2, y - r * 0.5, r * 0.09, r * 0.15);
}

function drawStump(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const radiusX = footprintRadius;
  const radiusY = footprintRadius * 0.78;
  const barrelHeight = radiusY * STUMP_BARREL_HEIGHT_FACTOR;
  drawStumpBarrel(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY, barrelHeight);
  drawPaperEllipseWood(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY, color);
  drawLogRing(ctx, x, y, footprintRadius * 0.52, footprintRadius * 0.4);
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

function drawPaperRectLayer(ctx, camera, worldLengthToScreen, x, y, width, height, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  ctx.fillRect(x - width * 0.5 + shadowOffsetX, y - height * 0.5 + shadowOffsetY, width, height);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(x - width * 0.5, y - height * 0.5, width, height);
  });
}

function drawPaperEllipseWood(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillEllipse(ctx, x + shadowOffsetX, y + shadowOffsetY, radiusX, radiusY);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  });
}

function drawLogRing(ctx, x, y, radiusX, radiusY) {
  ctx.save();
  ctx.fillStyle = LOG_RING_COLOR;
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function fillEllipse(ctx, x, y, radiusX, radiusY) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPaperLeaf(ctx, camera, worldLengthToScreen, x, y, halfWidthWorld, heightWorld, fillColor) {
  const halfWidth = worldLengthToScreen(camera, halfWidthWorld);
  const height = worldLengthToScreen(camera, heightWorld);
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillLeaf(ctx, x + shadowOffsetX, y + shadowOffsetY, halfWidth, height);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    const topY = y - height * 0.5;
    const bottomY = y + height * 0.5;
    drawCtx.beginPath();
    drawCtx.moveTo(x, topY);
    drawCtx.quadraticCurveTo(x + halfWidth, y, x, bottomY);
    drawCtx.quadraticCurveTo(x - halfWidth, y, x, topY);
    drawCtx.closePath();
  });
}

function drawPaperStem(ctx, camera, worldLengthToScreen, x, y, width, height, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillRoundedRect(ctx, x + shadowOffsetX, y + shadowOffsetY, width, height);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(x - width * 0.5, y - height * 0.5, width, height);
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

function drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillEllipse(ctx, x + shadowOffsetX, y + shadowOffsetY, radiusX, radiusY);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  });
}

function fillLeaf(ctx, x, y, halfWidth, height) {
  const topY = y - height * 0.5;
  const bottomY = y + height * 0.5;
  ctx.beginPath();
  ctx.moveTo(x, topY);
  ctx.quadraticCurveTo(x + halfWidth, y, x, bottomY);
  ctx.quadraticCurveTo(x - halfWidth, y, x, topY);
  ctx.closePath();
  ctx.fill();
}

function fillRoundedRect(ctx, x, y, width, height) {
  ctx.fillRect(x - width * 0.5, y - height * 0.5, width, height);
}

function fillCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}
