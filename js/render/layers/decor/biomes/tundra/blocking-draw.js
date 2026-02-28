import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 2;
const PAPER_SHADOW_OFFSET_Y = 3;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.18)";
const ICE_HIGHLIGHT_COLOR = "rgba(220, 240, 255, 0.25)";

export function drawTundraBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "ice-boulder") {
    drawIceBoulder(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "dwarf-conifer") {
    drawDwarfConifer(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported tundra blocking shape "${decorDef.shape}".`);
}

function drawIceBoulder(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const backSize = r * 0.88;
  const frontSize = r * 1.1;
  drawIceRockLayer(ctx, camera, worldLengthToScreen, x - r * 0.3, y + r * 0.12, backSize, color);
  drawIceRockLayer(ctx, camera, worldLengthToScreen, x + r * 0.22, y - r * 0.06, frontSize, color);
  ctx.fillStyle = ICE_HIGHLIGHT_COLOR;
  fillPolygon(ctx, [
    { x: x - r * 0.1, y: y - r * 0.35 },
    { x: x + r * 0.15, y: y - r * 0.5 },
    { x: x + r * 0.35, y: y - r * 0.3 },
    { x: x + r * 0.2, y: y - r * 0.12 },
    { x: x - r * 0.05, y: y - r * 0.18 },
  ]);
}

function drawIceRockLayer(ctx, camera, worldLengthToScreen, x, y, size, fillColor) {
  const points = [
    { x: x - size * 0.9, y: y + size * 0.2 },
    { x: x - size * 0.65, y: y - size * 0.55 },
    { x: x - size * 0.1, y: y - size * 0.78 },
    { x: x + size * 0.48, y: y - size * 0.62 },
    { x: x + size * 0.88, y: y - size * 0.15 },
    { x: x + size * 0.78, y: y + size * 0.4 },
    { x: x + size * 0.18, y: y + size * 0.7 },
    { x: x - size * 0.5, y: y + size * 0.58 },
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

function drawDwarfConifer(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const lift = r * 0.35;
  drawPaperStarLayer(ctx, camera, worldLengthToScreen, x, y, 7, r * 1.1, r * 0.5, 0, color);
  drawPaperStarLayer(ctx, camera, worldLengthToScreen, x, y - lift, 7, r * 0.8, r * 0.38, Math.PI / 7, color);
  drawSnowCap(ctx, x, y - lift * 1.5, r * 0.22);
}

function starPoints(cx, cy, numPoints, outerRadius, innerRadius, rotation) {
  const points = [];
  const step = Math.PI / numPoints;
  for (let i = 0; i < numPoints * 2; i += 1) {
    const angle = rotation + i * step - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    points.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
  }
  return points;
}

function drawPaperStarLayer(ctx, camera, worldLengthToScreen, x, y, numPoints, outerRadius, innerRadius, rotation, fillColor) {
  const points = starPoints(x, y, numPoints, outerRadius, innerRadius, rotation);
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const shadowPoints = points.map((p) => ({
    x: p.x + shadowOffsetX,
    y: p.y + shadowOffsetY,
  }));
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillPolygon(ctx, shadowPoints);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      drawCtx.lineTo(points[i].x, points[i].y);
    }
    drawCtx.closePath();
  });
}

function drawSnowCap(ctx, x, y, size) {
  const points = starPoints(x, y, 7, size, size * 0.45, Math.PI / 14);
  ctx.fillStyle = "rgba(230, 240, 248, 0.55)";
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
