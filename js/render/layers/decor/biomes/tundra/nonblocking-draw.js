import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.14)";
const SNOW_HIGHLIGHT_COLOR = "rgba(255, 255, 255, 0.25)";
const ICE_CRACK_COLOR = "rgba(80, 120, 150, 0.5)";

export function drawTundraNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  if (decorDef.shape === "snow-drift") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawSnowDrift(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "frozen-grass") {
    drawFrozenGrass(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "frozen-pond") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawFrozenPond(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "snowy-shrub") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawSnowyShrub(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported tundra non-blocking shape "${decorDef.shape}".`);
}

function drawSnowDrift(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const rx = footprintRadius * 1.5;
  const ry = footprintRadius * 0.45;
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, color, PAPER_PATTERN_IDS.GROUND_PAPER);
  ctx.fillStyle = SNOW_HIGHLIGHT_COLOR;
  ctx.beginPath();
  ctx.ellipse(x - rx * 0.15, y - ry * 0.35, rx * 0.5, ry * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
}

const FROZEN_GRASS_BLADE_HALF_WIDTH = 2.5;
const FROZEN_GRASS_BLADE_HEIGHT = 9;
const FROZEN_GRASS_SIDE_OFFSET = 3.5;

function drawFrozenGrass(ctx, camera, worldLengthToScreen, x, y, color) {
  const sideOffset = worldLengthToScreen(camera, FROZEN_GRASS_SIDE_OFFSET);
  const lowY = worldLengthToScreen(camera, 1.5);
  const halfW = worldLengthToScreen(camera, FROZEN_GRASS_BLADE_HALF_WIDTH);
  const height = worldLengthToScreen(camera, FROZEN_GRASS_BLADE_HEIGHT);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - sideOffset, y + lowY, halfW * 0.85, height * 0.75, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + sideOffset * 0.7, y + lowY, halfW * 0.9, height * 0.8, color);
}

function drawFrozenPond(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const rx = footprintRadius * 1.3;
  const ry = footprintRadius * 0.75;
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, color, PAPER_PATTERN_IDS.ROUGH_STONE);
  drawIceCracks(ctx, x, y, rx, ry);
}

function drawIceCracks(ctx, x, y, rx, ry) {
  ctx.save();
  ctx.strokeStyle = ICE_CRACK_COLOR;
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(x - rx * 0.25, y - ry * 0.4);
  ctx.lineTo(x + rx * 0.15, y + ry * 0.1);
  ctx.lineTo(x + rx * 0.45, y + ry * 0.35);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + rx * 0.15, y + ry * 0.1);
  ctx.lineTo(x - rx * 0.1, y + ry * 0.55);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + rx * 0.25, y - ry * 0.3);
  ctx.lineTo(x + rx * 0.38, y - ry * 0.05);
  ctx.stroke();
  ctx.restore();
}

function drawSnowyShrub(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius * 0.9;
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x - r * 0.35, y + r * 0.1, r * 0.6, r * 0.5, color, PAPER_PATTERN_IDS.LEAVES);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x + r * 0.3, y + r * 0.05, r * 0.55, r * 0.45, color, PAPER_PATTERN_IDS.LEAVES);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y - r * 0.25, r * 0.5, r * 0.4, color, PAPER_PATTERN_IDS.LEAVES);
  ctx.fillStyle = SNOW_HIGHLIGHT_COLOR;
  ctx.beginPath();
  ctx.ellipse(x - r * 0.1, y - r * 0.35, r * 0.3, r * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, fillColor, patternId) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillEllipse(ctx, x + shadowOffsetX, y + shadowOffsetY, rx, ry);
  fillPaperShape(ctx, camera, fillColor, patternId, (drawCtx) => {
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
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.NEEDLE_MAT, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.moveTo(x - halfWidth, baseY);
    drawCtx.quadraticCurveTo(x - halfWidth * 0.4, y, x, tipY);
    drawCtx.quadraticCurveTo(x + halfWidth * 0.4, y, x + halfWidth, baseY);
    drawCtx.closePath();
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

function fillEllipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
