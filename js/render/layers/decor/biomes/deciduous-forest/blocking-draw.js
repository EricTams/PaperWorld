import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 2;
const PAPER_SHADOW_OFFSET_Y = 3;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.26)";
const CANOPY_HIGHLIGHT_COLOR = "rgba(240, 248, 220, 0.12)";

export function drawDeciduousForestBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "broadleaf-tree") {
    drawBroadleafTree(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported deciduous-forest blocking shape "${decorDef.shape}".`);
}

function drawBroadleafTree(ctx, camera, worldLengthToScreen, x, y, canopyColor, footprintRadius) {
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x, y, footprintRadius * 1.1, footprintRadius * 1.0, canopyColor);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x - footprintRadius * 0.38, y + footprintRadius * 0.22, footprintRadius * 0.62, footprintRadius * 0.56, canopyColor);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x + footprintRadius * 0.36, y + footprintRadius * 0.18, footprintRadius * 0.6, footprintRadius * 0.54, canopyColor);
  drawPaperEllipseLayer(ctx, camera, worldLengthToScreen, x - footprintRadius * 0.14, y - footprintRadius * 0.38, footprintRadius * 0.56, footprintRadius * 0.48, canopyColor);
  drawCanopyHighlight(ctx, x - footprintRadius * 0.18, y - footprintRadius * 0.22, footprintRadius * 0.38, footprintRadius * 0.24);
}

function drawCanopyHighlight(ctx, x, y, radiusX, radiusY) {
  ctx.fillStyle = CANOPY_HIGHLIGHT_COLOR;
  fillEllipse(ctx, x, y, radiusX, radiusY);
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

function fillEllipse(ctx, x, y, radiusX, radiusY) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
}
