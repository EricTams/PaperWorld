import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 2;
const PAPER_SHADOW_OFFSET_Y = 3;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.26)";
const CANOPY_HIGHLIGHT_COLOR = "rgba(180, 200, 160, 0.14)";
const TRUNK_COLOR = "#4a3926";
const TRUNK_WIDTH_FACTOR = 0.22;
const TRUNK_HEIGHT_FACTOR = 0.7;
const MOUND_HIGHLIGHT_COLOR = "rgba(160, 150, 130, 0.18)";

export function drawMarshBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "swamp-tree") {
    drawSwampTree(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "mud-mound") {
    drawMudMound(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported marsh blocking shape "${decorDef.shape}".`);
}

function drawSwampTree(ctx, camera, worldLengthToScreen, x, y, canopyColor, footprintRadius) {
  const r = footprintRadius;
  const trunkW = r * TRUNK_WIDTH_FACTOR;
  const trunkH = r * TRUNK_HEIGHT_FACTOR;
  drawPaperRectLayer(ctx, camera, worldLengthToScreen, x, y + r * 0.1, trunkW * 2, trunkH, TRUNK_COLOR);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x - r * 0.4, y + r * 0.15, r * 0.62, r * 0.54, canopyColor);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x + r * 0.38, y + r * 0.1, r * 0.58, r * 0.5, canopyColor);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y - r * 0.28, r * 0.72, r * 0.62, canopyColor);
  drawCanopyHighlight(ctx, x - r * 0.12, y - r * 0.22, r * 0.32, r * 0.2);
}

function drawMudMound(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const points = [
    { x: x - r * 0.92, y: y + r * 0.28 },
    { x: x - r * 0.78, y: y - r * 0.2 },
    { x: x - r * 0.36, y: y - r * 0.52 },
    { x: x + r * 0.12, y: y - r * 0.58 },
    { x: x + r * 0.62, y: y - r * 0.38 },
    { x: x + r * 0.94, y: y + r * 0.06 },
    { x: x + r * 0.82, y: y + r * 0.48 },
    { x: x + r * 0.24, y: y + r * 0.62 },
    { x: x - r * 0.44, y: y + r * 0.56 },
  ];
  drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, color);
  drawMoundHighlight(ctx, x - r * 0.1, y - r * 0.16, r);
}

function drawCanopyHighlight(ctx, x, y, radiusX, radiusY) {
  ctx.fillStyle = CANOPY_HIGHLIGHT_COLOR;
  fillEllipse(ctx, x, y, radiusX, radiusY);
}

function drawMoundHighlight(ctx, x, y, size) {
  const points = [
    { x: x - size * 0.32, y: y - size * 0.18 },
    { x: x - size * 0.08, y: y - size * 0.3 },
    { x: x + size * 0.14, y: y - size * 0.2 },
    { x: x + size * 0.04, y: y - size * 0.06 },
    { x: x - size * 0.22, y: y - size * 0.04 },
  ];
  ctx.fillStyle = MOUND_HIGHLIGHT_COLOR;
  fillPolygon(ctx, points);
}

function drawPaperRectLayer(ctx, camera, worldLengthToScreen, x, y, width, height, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  ctx.fillRect(x - width * 0.5 + shadowOffsetX, y - height * 0.5 + shadowOffsetY, width, height);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(x - width * 0.5, y - height * 0.5, width, height);
  });
}

function drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, radiusX, radiusY, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillEllipse(ctx, x + shadowOffsetX, y + shadowOffsetY, radiusX, radiusY);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  });
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

function fillEllipse(ctx, x, y, radiusX, radiusY) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
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
