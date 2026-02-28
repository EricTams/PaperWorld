import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 2;
const PAPER_SHADOW_OFFSET_Y = 3;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.22)";
const WET_SHEEN_COLOR = "rgba(180, 210, 230, 0.18)";

export function drawCoastalBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  if (decorDef.shape === "sea-rock") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawSeaRock(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported coastal blocking shape "${decorDef.shape}".`);
}

function drawSeaRock(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const backSize = r * 0.88;
  const frontSize = r * 1.1;
  drawRockLayer(ctx, camera, worldLengthToScreen, x - r * 0.28, y + r * 0.12, backSize, color);
  drawRockLayer(ctx, camera, worldLengthToScreen, x + r * 0.2, y - r * 0.06, frontSize, color);
  drawWetSheen(ctx, x + r * 0.2, y - r * 0.06, frontSize);
}

function drawRockLayer(ctx, camera, worldLengthToScreen, x, y, size, fillColor) {
  const points = [
    { x: x - size * 0.92, y: y + size * 0.14 },
    { x: x - size * 0.74, y: y - size * 0.56 },
    { x: x - size * 0.2, y: y - size * 0.78 },
    { x: x + size * 0.38, y: y - size * 0.72 },
    { x: x + size * 0.88, y: y - size * 0.22 },
    { x: x + size * 0.8, y: y + size * 0.34 },
    { x: x + size * 0.18, y: y + size * 0.68 },
    { x: x - size * 0.5, y: y + size * 0.6 },
  ];
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const shadowPoints = points.map((p) => ({
    x: p.x + shadowOffsetX,
    y: p.y + shadowOffsetY,
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

function drawWetSheen(ctx, x, y, size) {
  const points = [
    { x: x - size * 0.36, y: y - size * 0.32 },
    { x: x - size * 0.14, y: y - size * 0.44 },
    { x: x + size * 0.1, y: y - size * 0.3 },
    { x: x - size * 0.04, y: y - size * 0.12 },
    { x: x - size * 0.28, y: y - size * 0.14 },
  ];
  ctx.fillStyle = WET_SHEEN_COLOR;
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
