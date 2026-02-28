import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.22)";
const ASH_HIGHLIGHT_COLOR = "rgba(160, 155, 145, 0.16)";
const CRACK_LINE_COLOR = "rgba(140, 40, 10, 0.5)";
const STEAM_COLOR = "rgba(180, 175, 170, 0.25)";

export function drawVolcanicBadlandsNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "ash-drift") {
    drawAshDrift(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "steam-vent") {
    drawSteamVent(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "cracked-earth") {
    drawCrackedEarth(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported volcanic-badlands non-blocking shape "${decorDef.shape}".`);
}

function drawAshDrift(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const rx = footprintRadius * 1.5;
  const ry = footprintRadius * 0.45;
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, color);
  ctx.fillStyle = ASH_HIGHLIGHT_COLOR;
  ctx.beginPath();
  ctx.ellipse(x - rx * 0.2, y - ry * 0.35, rx * 0.5, ry * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawSteamVent(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const ventR = footprintRadius * 0.6;
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, ventR, ventR * 0.7, color);
  drawSteamWisps(ctx, x, y, footprintRadius);
}

function drawSteamWisps(ctx, x, y, footprintRadius) {
  const wispH = footprintRadius * 1.6;
  ctx.save();
  ctx.strokeStyle = STEAM_COLOR;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - footprintRadius * 0.15, y);
  ctx.quadraticCurveTo(x - footprintRadius * 0.4, y - wispH * 0.5, x - footprintRadius * 0.1, y - wispH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + footprintRadius * 0.1, y - footprintRadius * 0.1);
  ctx.quadraticCurveTo(x + footprintRadius * 0.35, y - wispH * 0.4, x + footprintRadius * 0.05, y - wispH * 0.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + footprintRadius * 0.15, y - wispH * 0.55, x - footprintRadius * 0.05, y - wispH * 0.7);
  ctx.stroke();
  ctx.restore();
}

function drawCrackedEarth(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const rx = footprintRadius * 1.2;
  const ry = footprintRadius * 0.8;
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, color);
  drawCrackLines(ctx, x, y, rx, ry);
}

function drawCrackLines(ctx, x, y, rx, ry) {
  ctx.save();
  ctx.strokeStyle = CRACK_LINE_COLOR;
  ctx.lineWidth = 1.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - rx * 0.4, y - ry * 0.6);
  ctx.lineTo(x, y);
  ctx.lineTo(x + rx * 0.55, y + ry * 0.35);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - rx * 0.2, y + ry * 0.65);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + rx * 0.15, y - ry * 0.45);
  ctx.lineTo(x + rx * 0.45, y);
  ctx.lineTo(x + rx * 0.3, y + ry * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - rx * 0.5, y + ry * 0.2);
  ctx.lineTo(x - rx * 0.15, y + ry * 0.1);
  ctx.stroke();
  ctx.restore();
}

function drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  ctx.beginPath();
  ctx.ellipse(x + shadowOffsetX, y + shadowOffsetY, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.ROUGH_STONE, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  });
}
