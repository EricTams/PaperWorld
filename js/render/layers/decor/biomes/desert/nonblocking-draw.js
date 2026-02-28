import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.18)";
const DUNE_HIGHLIGHT_COLOR = "rgba(255, 248, 220, 0.18)";
const CRACK_LINE_COLOR = "rgba(90, 70, 40, 0.55)";

export function drawDesertNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  if (decorDef.shape === "sand-dune") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawSandDune(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "dry-grass") {
    drawDryGrass(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "cracked-earth") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawCrackedEarth(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "thorn-bush") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawThornBush(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported desert non-blocking shape "${decorDef.shape}".`);
}

function drawSandDune(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const rx = footprintRadius * 1.4;
  const ry = footprintRadius * 0.5;
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, color);
  drawDuneHighlight(ctx, x - rx * 0.2, y - ry * 0.3, rx * 0.6, ry * 0.4);
}

function drawDuneHighlight(ctx, x, y, rx, ry) {
  ctx.fillStyle = DUNE_HIGHLIGHT_COLOR;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

const DRY_GRASS_BLADE_HALF_WIDTH = 3;
const DRY_GRASS_BLADE_HEIGHT = 10;
const DRY_GRASS_SIDE_OFFSET = 4;

function drawDryGrass(ctx, camera, worldLengthToScreen, x, y, color) {
  const sideOffset = worldLengthToScreen(camera, DRY_GRASS_SIDE_OFFSET);
  const lowY = worldLengthToScreen(camera, 1.5);
  const halfW = worldLengthToScreen(camera, DRY_GRASS_BLADE_HALF_WIDTH);
  const height = worldLengthToScreen(camera, DRY_GRASS_BLADE_HEIGHT);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - sideOffset, y + lowY, halfW * 0.85, height * 0.8, color);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + sideOffset * 0.7, y + lowY, halfW * 0.9, height * 0.85, color);
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
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - rx * 0.3, y - ry * 0.5);
  ctx.lineTo(x + rx * 0.1, y + ry * 0.15);
  ctx.lineTo(x + rx * 0.5, y + ry * 0.4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + rx * 0.1, y + ry * 0.15);
  ctx.lineTo(x - rx * 0.15, y + ry * 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + rx * 0.2, y - ry * 0.35);
  ctx.lineTo(x + rx * 0.4, y - ry * 0.1);
  ctx.stroke();
  ctx.restore();
}

function drawThornBush(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const numPoints = 8;
  const outerR = footprintRadius * 1.1;
  const innerR = footprintRadius * 0.55;
  const points = starPoints(x, y, numPoints, outerR, innerR);
  drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, color, PAPER_PATTERN_IDS.LEAVES);
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

function drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, fillColor, patternId) {
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

function drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, rx, ry, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillEllipse(ctx, x + shadowOffsetX, y + shadowOffsetY, rx, ry);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.ROUGH_STONE, (drawCtx) => {
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

function fillPolygon(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}
