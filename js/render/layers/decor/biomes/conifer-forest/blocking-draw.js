import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 2;
const PAPER_SHADOW_OFFSET_Y = 3;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.26)";
const PINE_CANOPY_HIGHLIGHT_COLOR = "rgba(223, 244, 226, 0.12)";
const BOULDER_HIGHLIGHT_COLOR = "rgba(215, 224, 234, 0.2)";

export function drawConiferForestBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "pine-tree") {
    drawPineTree(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "boulder") {
    drawBoulder(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported conifer-forest blocking shape "${decorDef.shape}".`);
}

function drawPineTree(ctx, camera, worldLengthToScreen, x, y, canopyColor, footprintRadius) {
  const r = footprintRadius;
  const lift = r * 0.5;
  drawPaperStarLayer(ctx, camera, worldLengthToScreen, x, y, 7, r * 1.575, r * 0.72, 0, canopyColor, PAPER_PATTERN_IDS.LEAVES);
  drawPaperStarLayer(ctx, camera, worldLengthToScreen, x, y - lift, 7, r * 1.17, r * 0.57, Math.PI / 7, canopyColor, PAPER_PATTERN_IDS.LEAVES);
  drawPineHighlight(ctx, x, y - lift * 1.6, r * 0.27);
}

function drawBoulder(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const points = [
    { x: x - footprintRadius * 0.96, y: y + footprintRadius * 0.16 },
    { x: x - footprintRadius * 0.68, y: y - footprintRadius * 0.54 },
    { x: x - footprintRadius * 0.14, y: y - footprintRadius * 0.9 },
    { x: x + footprintRadius * 0.42, y: y - footprintRadius * 0.72 },
    { x: x + footprintRadius * 0.96, y: y - footprintRadius * 0.2 },
    { x: x + footprintRadius * 0.82, y: y + footprintRadius * 0.44 },
    { x: x + footprintRadius * 0.18, y: y + footprintRadius * 0.76 },
    { x: x - footprintRadius * 0.5, y: y + footprintRadius * 0.62 },
  ];
  drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, color);
  drawBoulderHighlight(ctx, x, y, footprintRadius);
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

function drawPaperStarLayer(ctx, camera, worldLengthToScreen, x, y, numPoints, outerRadius, innerRadius, rotation, fillColor, patternId = PAPER_PATTERN_IDS.CUT_WOOD) {
  const points = starPoints(x, y, numPoints, outerRadius, innerRadius, rotation);
  drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, fillColor, patternId);
}

function drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, fillColor, patternId = PAPER_PATTERN_IDS.ROUGH_STONE) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const shadowPoints = points.map((point) => ({
    x: point.x + shadowOffsetX,
    y: point.y + shadowOffsetY,
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

function drawBoulderHighlight(ctx, x, y, size) {
  const points = [
    { x: x - size * 0.42, y: y - size * 0.26 },
    { x: x - size * 0.17, y: y - size * 0.38 },
    { x: x + size * 0.08, y: y - size * 0.22 },
    { x: x - size * 0.1, y: y - size * 0.1 },
    { x: x - size * 0.34, y: y - size * 0.12 },
  ];
  ctx.fillStyle = BOULDER_HIGHLIGHT_COLOR;
  fillPolygon(ctx, points);
}

function drawPineHighlight(ctx, x, y, size) {
  const points = starPoints(x, y, 7, size, size * 0.45, Math.PI / 14);
  ctx.fillStyle = PINE_CANOPY_HIGHLIGHT_COLOR;
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
