import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.22)";

const TUFT_BLADE_HALF_WIDTH = 3;
const TUFT_BLADE_HEIGHT = 10;
const TUFT_SIDE_OFFSET = 4;
const TUFT_LOW_OFFSET_Y = 2;

const LICHEN_RADIUS_A = 6;
const LICHEN_RADIUS_B = 5;
const LICHEN_OFFSET_A_X = 4;
const LICHEN_OFFSET_A_Y = 1;
const LICHEN_OFFSET_B_X = 3;
const LICHEN_OFFSET_B_Y = 3;

const HEATHER_DOT_RADIUS = 3;
const HEATHER_RING_RADIUS = 5;
const HEATHER_LEAF_COLOR = "#6b8a5e";

export function drawRockyHighlandsNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  if (decorDef.shape === "grass-tuft") {
    drawGrassTuft(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "lichen-patch") {
    drawLichenPatch(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "heather") {
    drawHeather(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  throw new Error(`Unsupported rocky-highlands non-blocking shape "${decorDef.shape}".`);
}

function drawGrassTuft(ctx, camera, worldLengthToScreen, x, y, color) {
  const sideOffset = worldLengthToScreen(camera, TUFT_SIDE_OFFSET);
  const lowOffsetY = worldLengthToScreen(camera, TUFT_LOW_OFFSET_Y);
  const halfWidth = worldLengthToScreen(camera, TUFT_BLADE_HALF_WIDTH);
  const height = worldLengthToScreen(camera, TUFT_BLADE_HEIGHT);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - sideOffset, y + lowOffsetY, halfWidth, height - 1, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + sideOffset, y + lowOffsetY, halfWidth, height - 1, color);
}

function drawLichenPatch(ctx, camera, worldLengthToScreen, x, y, color) {
  const radiusA = worldLengthToScreen(camera, LICHEN_RADIUS_A);
  const radiusB = worldLengthToScreen(camera, LICHEN_RADIUS_B);
  const oax = worldLengthToScreen(camera, LICHEN_OFFSET_A_X);
  const oay = worldLengthToScreen(camera, LICHEN_OFFSET_A_Y);
  const obx = worldLengthToScreen(camera, LICHEN_OFFSET_B_X);
  const oby = worldLengthToScreen(camera, LICHEN_OFFSET_B_Y);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - oax, y + oay, radiusA, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + obx, y - oby, radiusB, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + oax * 0.3, y + oby, radiusB * 0.85, color);
}

function drawHeather(ctx, camera, worldLengthToScreen, x, y, color) {
  const ring = worldLengthToScreen(camera, HEATHER_RING_RADIUS);
  const dotRadius = worldLengthToScreen(camera, HEATHER_DOT_RADIUS);
  const leafRadius = dotRadius * 1.4;
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y + ring * 0.6, leafRadius, HEATHER_LEAF_COLOR);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - ring, y - ring * 0.3, dotRadius, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + ring, y - ring * 0.2, dotRadius, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y - ring * 0.7, dotRadius * 0.9, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + ring * 0.4, y + ring * 0.4, dotRadius * 0.85, color);
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

function fillCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
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
