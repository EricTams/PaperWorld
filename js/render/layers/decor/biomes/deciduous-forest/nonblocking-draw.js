import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.22)";
const MUSHROOM_CAP_COLOR = "#a8624a";
const LOG_END_WOOD_COLOR = "#b7845d";
const HOLLOW_COLOR = "#2e1e14";
const HOLLOW_RING_COLOR = "rgba(92, 58, 35, 0.4)";

const LEAF_SCATTER_A_X = 6;
const LEAF_SCATTER_A_Y = 2;
const LEAF_SCATTER_B_X = 3;
const LEAF_SCATTER_B_Y = 5;
const LEAF_SCATTER_C_X = 5;
const LEAF_SCATTER_C_Y = 4;
const LEAF_ELLIPSE_RX = 5;
const LEAF_ELLIPSE_RY = 3.5;

const FERN_SIDE_OFFSET_X = 6;
const FERN_SIDE_OFFSET_Y = 2;
const FERN_CENTER_OFFSET_Y = 2;

const MUSH_CLUSTER_A_X = 5;
const MUSH_CLUSTER_A_Y = 2;
const MUSH_CLUSTER_B_X = 4;
const MUSH_CLUSTER_B_Y = 4;
const MUSH_CLUSTER_C_X = 6;
const MUSH_CLUSTER_C_Y = 3;
const MUSH_STEM_OFFSET_Y = 1;
const MUSH_CAP_OFFSET_Y = 2;

const BRAMBLE_SIDE_OFFSET = 6;
const BRAMBLE_TOP_OFFSET = 4;
const BRAMBLE_RADIUS = 6;

export function drawDeciduousForestNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  if (decorDef.shape === "fallen-leaves") {
    drawFallenLeaves(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "mushroom-cluster") {
    drawMushroomCluster(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "fern") {
    drawFernCluster(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "bramble") {
    drawBramble(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "shrub") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawShrub(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "hollow-log") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawHollowLog(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported deciduous-forest non-blocking shape "${decorDef.shape}".`);
}

function drawFallenLeaves(ctx, camera, worldLengthToScreen, x, y, color) {
  const rx = worldLengthToScreen(camera, LEAF_ELLIPSE_RX);
  const ry = worldLengthToScreen(camera, LEAF_ELLIPSE_RY);
  const ax = worldLengthToScreen(camera, LEAF_SCATTER_A_X);
  const ay = worldLengthToScreen(camera, LEAF_SCATTER_A_Y);
  const bx = worldLengthToScreen(camera, LEAF_SCATTER_B_X);
  const by = worldLengthToScreen(camera, LEAF_SCATTER_B_Y);
  const cx = worldLengthToScreen(camera, LEAF_SCATTER_C_X);
  const cy = worldLengthToScreen(camera, LEAF_SCATTER_C_Y);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x - ax, y + ay, rx, ry, color, 0.3);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x + bx, y - by, rx * 0.9, ry * 0.85, color, -0.4);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x + cx, y + cy, rx * 0.85, ry * 0.9, color, 0.6);
}

function drawMushroomCluster(ctx, camera, worldLengthToScreen, x, y, stemColor) {
  const ax = worldLengthToScreen(camera, MUSH_CLUSTER_A_X);
  const ay = worldLengthToScreen(camera, MUSH_CLUSTER_A_Y);
  const bx = worldLengthToScreen(camera, MUSH_CLUSTER_B_X);
  const by = worldLengthToScreen(camera, MUSH_CLUSTER_B_Y);
  const cxOff = worldLengthToScreen(camera, MUSH_CLUSTER_C_X);
  const cyOff = worldLengthToScreen(camera, MUSH_CLUSTER_C_Y);
  drawMushroom(ctx, camera, worldLengthToScreen, x - ax, y - ay, stemColor);
  drawMushroom(ctx, camera, worldLengthToScreen, x + bx, y + by, stemColor);
  drawMushroom(ctx, camera, worldLengthToScreen, x - cxOff, y + cyOff, stemColor);
}

function drawFernCluster(ctx, camera, worldLengthToScreen, x, y, color) {
  const sideX = worldLengthToScreen(camera, FERN_SIDE_OFFSET_X);
  const sideY = worldLengthToScreen(camera, FERN_SIDE_OFFSET_Y);
  const centerY = worldLengthToScreen(camera, FERN_CENTER_OFFSET_Y);
  drawPaperLeaf(ctx, camera, worldLengthToScreen, x - sideX, y + sideY, 7, 14, color);
  drawPaperLeaf(ctx, camera, worldLengthToScreen, x, y - centerY, 8, 16, color);
  drawPaperLeaf(ctx, camera, worldLengthToScreen, x + sideX, y + sideY, 7, 14, color);
}

function drawBramble(ctx, camera, worldLengthToScreen, x, y, color) {
  const side = worldLengthToScreen(camera, BRAMBLE_SIDE_OFFSET);
  const top = worldLengthToScreen(camera, BRAMBLE_TOP_OFFSET);
  const radius = worldLengthToScreen(camera, BRAMBLE_RADIUS);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - side, y + top * 0.3, radius * 0.85, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + side, y + top * 0.3, radius * 0.85, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y - top, radius, color);
}

function drawShrub(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const leafRadius = footprintRadius * 0.82;
  const sideOffset = footprintRadius * 0.58;
  const topOffset = footprintRadius * 0.38;
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - sideOffset, y + topOffset * 0.3, leafRadius * 0.78, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + sideOffset, y + topOffset * 0.3, leafRadius * 0.78, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y - topOffset, leafRadius, color);
}

function drawHollowLog(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const bodyWidth = footprintRadius * 2.4;
  const bodyHeight = footprintRadius * 0.9;
  const endRadiusX = bodyHeight * 0.36;
  const endRadiusY = bodyHeight * 0.5;
  drawPaperRectLayer(ctx, camera, worldLengthToScreen, x, y, bodyWidth, bodyHeight, color);
  drawHollowEnd(ctx, camera, worldLengthToScreen, x + bodyWidth * 0.5, y, endRadiusX, endRadiusY);
}

function drawHollowEnd(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY) {
  drawPaperEllipseWood(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY, LOG_END_WOOD_COLOR);
  drawHollowRing(ctx, x, y, radiusX * 0.72, radiusY * 0.72);
  drawPaperEllipseWood(ctx, camera, worldLengthToScreen, x, y, radiusX * 0.45, radiusY * 0.45, HOLLOW_COLOR);
}

function drawHollowRing(ctx, x, y, radiusX, radiusY) {
  ctx.save();
  ctx.strokeStyle = HOLLOW_RING_COLOR;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawPaperEllipseWood(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillEllipse(ctx, x + shadowOffsetX, y + shadowOffsetY, radiusX, radiusY, 0);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  });
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

function drawMushroom(ctx, camera, worldLengthToScreen, x, y, stemColor) {
  const stemWidth = worldLengthToScreen(camera, 2.5);
  const stemHeight = worldLengthToScreen(camera, 6);
  const capRadiusX = worldLengthToScreen(camera, 4);
  const capRadiusY = worldLengthToScreen(camera, 2.7);
  const stemOy = worldLengthToScreen(camera, MUSH_STEM_OFFSET_Y);
  const capOy = worldLengthToScreen(camera, MUSH_CAP_OFFSET_Y);
  drawPaperStem(ctx, camera, worldLengthToScreen, x, y + stemOy, stemWidth, stemHeight, stemColor);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y - capOy, capRadiusX, capRadiusY, MUSHROOM_CAP_COLOR, 0);
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
  ctx.fillRect(x - width * 0.5 + shadowOffsetX, y - height * 0.5 + shadowOffsetY, width, height);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(x - width * 0.5, y - height * 0.5, width, height);
  });
}

function drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY, fillColor, rotation) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillEllipse(ctx, x + shadowOffsetX, y + shadowOffsetY, radiusX, radiusY, rotation);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
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

function fillEllipse(ctx, x, y, radiusX, radiusY, rotation) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
  ctx.fill();
}

function fillCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}
