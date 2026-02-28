import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 2;
const PAPER_SHADOW_OFFSET_Y = 3;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.25)";
const BOULDER_HIGHLIGHT_COLOR = "rgba(214, 220, 228, 0.22)";

export function drawGrasslandBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "boulder") {
    drawBoulder(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported grassland blocking shape "${decorDef.shape}".`);
}

function drawBoulder(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const backSize = footprintRadius * 0.95;
  const frontSize = footprintRadius * 1.18;
  drawPaperRockLayer(ctx, camera, worldLengthToScreen, x - footprintRadius * 0.34, y + footprintRadius * 0.1, backSize, color);
  drawPaperRockLayer(ctx, camera, worldLengthToScreen, x + footprintRadius * 0.22, y - footprintRadius * 0.02, frontSize, color);
  drawBoulderHighlight(ctx, x + footprintRadius * 0.22, y - footprintRadius * 0.02, frontSize);
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

function drawPaperRockLayer(ctx, camera, worldLengthToScreen, x, y, size, fillColor) {
  const points = [
    { x: x - size * 1.0, y: y + size * 0.2 },
    { x: x - size * 0.74, y: y - size * 0.5 },
    { x: x - size * 0.2, y: y - size * 0.78 },
    { x: x + size * 0.42, y: y - size * 0.66 },
    { x: x + size * 0.98, y: y - size * 0.22 },
    { x: x + size * 0.86, y: y + size * 0.36 },
    { x: x + size * 0.26, y: y + size * 0.7 },
    { x: x - size * 0.48, y: y + size * 0.66 },
  ];
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

function drawBoulderHighlight(ctx, x, y, size) {
  const points = [
    { x: x - size * 0.45, y: y - size * 0.3 },
    { x: x - size * 0.2, y: y - size * 0.42 },
    { x: x + size * 0.04, y: y - size * 0.28 },
    { x: x - size * 0.12, y: y - size * 0.12 },
    { x: x - size * 0.36, y: y - size * 0.14 },
  ];
  ctx.fillStyle = BOULDER_HIGHLIGHT_COLOR;
  fillPolygon(ctx, points);
}
