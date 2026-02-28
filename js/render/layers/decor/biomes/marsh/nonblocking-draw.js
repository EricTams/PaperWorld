import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.22)";

const REED_BLADE_HALF_WIDTH = 3;
const REED_BLADE_HEIGHT = 16;
const REED_SIDE_OFFSET = 5;
const REED_LOW_OFFSET_Y = 2;

const LILY_RADIUS_X = 6;
const LILY_RADIUS_Y = 4;
const LILY_OFFSET_A_X = 5;
const LILY_OFFSET_A_Y = 1;
const LILY_OFFSET_B_X = 3;
const LILY_OFFSET_B_Y = 4;

const CATTAIL_BLADE_HALF_WIDTH = 3;
const CATTAIL_BLADE_HEIGHT = 18;
const CATTAIL_SIDE_OFFSET = 5;
const CATTAIL_LOW_OFFSET_Y = 2;
const CATTAIL_CAP_RADIUS_X = 2.5;
const CATTAIL_CAP_RADIUS_Y = 4;
const CATTAIL_CAP_OFFSET_Y = 7;
const CATTAIL_CAP_COLOR = "#6e4e2a";

const THICKET_BLADE_HALF_WIDTH = 4;
const THICKET_BLADE_HEIGHT = 22;
const THICKET_SPREAD = 6;
const THICKET_LOW_OFFSET_Y = 2;

const PUDDLE_RADIUS_X = 10;
const PUDDLE_RADIUS_Y = 6;

export function drawMarshNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  if (decorDef.shape === "reeds") {
    drawReeds(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "lily-pads") {
    drawLilyPads(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "cattails") {
    drawCattails(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "reed-thicket") {
    drawReedThicket(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "mud-puddle") {
    drawMudPuddle(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  throw new Error(`Unsupported marsh non-blocking shape "${decorDef.shape}".`);
}

function drawReeds(ctx, camera, worldLengthToScreen, x, y, color) {
  const sideOffset = worldLengthToScreen(camera, REED_SIDE_OFFSET);
  const lowOffsetY = worldLengthToScreen(camera, REED_LOW_OFFSET_Y);
  const halfWidth = worldLengthToScreen(camera, REED_BLADE_HALF_WIDTH);
  const height = worldLengthToScreen(camera, REED_BLADE_HEIGHT);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - sideOffset, y + lowOffsetY, halfWidth, height * 0.85, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x, y, halfWidth * 0.9, height, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + sideOffset, y + lowOffsetY, halfWidth, height * 0.88, color);
}

function drawLilyPads(ctx, camera, worldLengthToScreen, x, y, color) {
  const rx = worldLengthToScreen(camera, LILY_RADIUS_X);
  const ry = worldLengthToScreen(camera, LILY_RADIUS_Y);
  const oax = worldLengthToScreen(camera, LILY_OFFSET_A_X);
  const oay = worldLengthToScreen(camera, LILY_OFFSET_A_Y);
  const obx = worldLengthToScreen(camera, LILY_OFFSET_B_X);
  const oby = worldLengthToScreen(camera, LILY_OFFSET_B_Y);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x - oax, y + oay, rx, ry, color, 0.2);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x + obx, y - oby, rx * 0.88, ry * 0.9, color, -0.3);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x + oax * 0.4, y + oby, rx * 0.82, ry * 0.85, color, 0.5);
}

function drawCattails(ctx, camera, worldLengthToScreen, x, y, color) {
  const sideOffset = worldLengthToScreen(camera, CATTAIL_SIDE_OFFSET);
  const lowOffsetY = worldLengthToScreen(camera, CATTAIL_LOW_OFFSET_Y);
  const halfWidth = worldLengthToScreen(camera, CATTAIL_BLADE_HALF_WIDTH);
  const height = worldLengthToScreen(camera, CATTAIL_BLADE_HEIGHT);
  const capRx = worldLengthToScreen(camera, CATTAIL_CAP_RADIUS_X);
  const capRy = worldLengthToScreen(camera, CATTAIL_CAP_RADIUS_Y);
  const capOy = worldLengthToScreen(camera, CATTAIL_CAP_OFFSET_Y);

  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - sideOffset, y + lowOffsetY, halfWidth, height * 0.82, color);
  drawPaperEllipseCap(ctx, camera, worldLengthToScreen, x - sideOffset, y + lowOffsetY - capOy * 0.82, capRx * 0.9, capRy * 0.85);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x, y, halfWidth * 0.95, height, color);
  drawPaperEllipseCap(ctx, camera, worldLengthToScreen, x, y - capOy, capRx, capRy);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + sideOffset, y + lowOffsetY, halfWidth, height * 0.85, color);
  drawPaperEllipseCap(ctx, camera, worldLengthToScreen, x + sideOffset, y + lowOffsetY - capOy * 0.85, capRx * 0.9, capRy * 0.88);
}

function drawReedThicket(ctx, camera, worldLengthToScreen, x, y, color) {
  const spread = worldLengthToScreen(camera, THICKET_SPREAD);
  const lowY = worldLengthToScreen(camera, THICKET_LOW_OFFSET_Y);
  const hw = worldLengthToScreen(camera, THICKET_BLADE_HALF_WIDTH);
  const h = worldLengthToScreen(camera, THICKET_BLADE_HEIGHT);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - spread, y + lowY, hw, h * 0.78, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - spread * 0.35, y - lowY, hw * 1.1, h, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + spread * 0.3, y, hw, h * 0.92, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + spread, y + lowY, hw * 0.95, h * 0.78, color);
}

function drawMudPuddle(ctx, camera, worldLengthToScreen, x, y, color) {
  const rx = worldLengthToScreen(camera, PUDDLE_RADIUS_X);
  const ry = worldLengthToScreen(camera, PUDDLE_RADIUS_Y);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, color, 0.15);
}

function drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x, y, halfWidth, height, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillBlade(ctx, x + shadowOffsetX, y + shadowOffsetY, halfWidth, height);
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

function drawPaperEllipseCap(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillEllipse(ctx, x + shadowOffsetX, y + shadowOffsetY, radiusX, radiusY, 0);
  fillPaperShape(ctx, camera, CATTAIL_CAP_COLOR, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  });
}

function fillBlade(ctx, x, y, halfWidth, height) {
  const baseY = y + height * 0.5;
  const tipY = y - height * 0.5;
  ctx.beginPath();
  ctx.moveTo(x - halfWidth, baseY);
  ctx.quadraticCurveTo(x - halfWidth * 0.4, y, x, tipY);
  ctx.quadraticCurveTo(x + halfWidth * 0.4, y, x + halfWidth, baseY);
  ctx.closePath();
  ctx.fill();
}

function fillEllipse(ctx, x, y, radiusX, radiusY, rotation) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
  ctx.fill();
}
