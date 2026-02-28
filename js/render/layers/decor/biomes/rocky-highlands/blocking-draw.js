import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 2;
const PAPER_SHADOW_OFFSET_Y = 3;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.28)";
const HIGHLIGHT_COLOR = "rgba(200, 215, 230, 0.22)";
const PILLAR_HIGHLIGHT_COLOR = "rgba(195, 210, 225, 0.18)";

export function drawRockyHighlandsBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "rock-outcrop") {
    drawRockOutcrop(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "boulder") {
    drawBoulder(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "stone-pillar") {
    drawStonePillar(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported rocky-highlands blocking shape "${decorDef.shape}".`);
}

function drawRockOutcrop(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const backSize = footprintRadius * 0.88;
  const frontSize = footprintRadius * 1.12;
  drawPaperRockLayer(ctx, camera, worldLengthToScreen, x - footprintRadius * 0.3, y + footprintRadius * 0.14, backSize, color);
  drawPaperRockLayer(ctx, camera, worldLengthToScreen, x + footprintRadius * 0.24, y - footprintRadius * 0.08, frontSize, color);
  drawHighlight(ctx, x + footprintRadius * 0.1, y - footprintRadius * 0.18, frontSize);
}

function drawBoulder(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const points = [
    { x: x - footprintRadius * 0.94, y: y + footprintRadius * 0.18 },
    { x: x - footprintRadius * 0.72, y: y - footprintRadius * 0.48 },
    { x: x - footprintRadius * 0.16, y: y - footprintRadius * 0.82 },
    { x: x + footprintRadius * 0.38, y: y - footprintRadius * 0.68 },
    { x: x + footprintRadius * 0.92, y: y - footprintRadius * 0.18 },
    { x: x + footprintRadius * 0.84, y: y + footprintRadius * 0.42 },
    { x: x + footprintRadius * 0.2, y: y + footprintRadius * 0.74 },
    { x: x - footprintRadius * 0.52, y: y + footprintRadius * 0.58 },
  ];
  drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, color);
  drawHighlight(ctx, x - footprintRadius * 0.08, y - footprintRadius * 0.14, footprintRadius);
}

function drawStonePillar(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const halfWidth = footprintRadius * 0.7;
  const height = footprintRadius * 2.4;
  const topY = y - height * 0.5;
  const bottomY = y + height * 0.5;
  const points = [
    { x: x - halfWidth * 0.9, y: bottomY },
    { x: x - halfWidth, y: topY + height * 0.15 },
    { x: x - halfWidth * 0.6, y: topY },
    { x: x + halfWidth * 0.5, y: topY + height * 0.04 },
    { x: x + halfWidth, y: topY + height * 0.12 },
    { x: x + halfWidth * 0.92, y: bottomY },
  ];
  drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, color);
  drawPillarHighlight(ctx, x - halfWidth * 0.3, topY + height * 0.12, halfWidth * 0.5, height * 0.3);
}

function drawPillarHighlight(ctx, x, y, width, height) {
  const points = [
    { x: x - width * 0.5, y },
    { x: x + width * 0.4, y: y + height * 0.08 },
    { x: x + width * 0.5, y: y + height },
    { x: x - width * 0.4, y: y + height * 0.9 },
  ];
  ctx.fillStyle = PILLAR_HIGHLIGHT_COLOR;
  fillPolygon(ctx, points);
}

function drawPaperRockLayer(ctx, camera, worldLengthToScreen, x, y, size, fillColor) {
  const points = [
    { x: x - size * 0.96, y: y + size * 0.22 },
    { x: x - size * 0.7, y: y - size * 0.46 },
    { x: x - size * 0.18, y: y - size * 0.74 },
    { x: x + size * 0.44, y: y - size * 0.62 },
    { x: x + size * 0.94, y: y - size * 0.2 },
    { x: x + size * 0.82, y: y + size * 0.38 },
    { x: x + size * 0.28, y: y + size * 0.68 },
    { x: x - size * 0.5, y: y + size * 0.64 },
  ];
  drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, fillColor);
}

function drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const shadowPoints = points.map((point) => ({
    x: point.x + shadowOffsetX,
    y: point.y + shadowOffsetY,
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

function drawHighlight(ctx, x, y, size) {
  const points = [
    { x: x - size * 0.4, y: y - size * 0.28 },
    { x: x - size * 0.14, y: y - size * 0.4 },
    { x: x + size * 0.06, y: y - size * 0.24 },
    { x: x - size * 0.08, y: y - size * 0.1 },
    { x: x - size * 0.32, y: y - size * 0.12 },
  ];
  ctx.fillStyle = HIGHLIGHT_COLOR;
  fillPolygon(ctx, points);
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
