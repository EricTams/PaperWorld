import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 2;
const PAPER_SHADOW_OFFSET_Y = 3;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.25)";
const LAVA_GLOW_COLOR = "rgba(180, 50, 10, 0.18)";
const SPIRE_HIGHLIGHT_COLOR = "rgba(120, 115, 110, 0.14)";

export function drawVolcanicBadlandsBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "basalt-spire") {
    drawBasaltSpire(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "lava-rock") {
    drawLavaRock(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "charred-tree") {
    drawCharredTree(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported volcanic-badlands blocking shape "${decorDef.shape}".`);
}

function drawBasaltSpire(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const spireW = r * 0.45;
  const spireH = r * 2.8;
  const points = [
    { x: x - spireW * 0.3, y: y + spireH * 0.38 },
    { x: x - spireW * 0.9, y: y + spireH * 0.1 },
    { x: x - spireW * 0.7, y: y - spireH * 0.18 },
    { x: x - spireW * 0.2, y: y - spireH * 0.42 },
    { x: x + spireW * 0.1, y: y - spireH * 0.5 },
    { x: x + spireW * 0.5, y: y - spireH * 0.28 },
    { x: x + spireW * 0.85, y: y + spireH * 0.05 },
    { x: x + spireW * 0.6, y: y + spireH * 0.35 },
  ];
  drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, color);
  drawSpireHighlight(ctx, x, y - spireH * 0.15, spireW * 0.3, spireH * 0.22);
}

function drawSpireHighlight(ctx, x, y, w, h) {
  ctx.fillStyle = SPIRE_HIGHLIGHT_COLOR;
  ctx.beginPath();
  ctx.moveTo(x - w * 0.4, y + h);
  ctx.lineTo(x, y - h);
  ctx.lineTo(x + w * 0.3, y + h * 0.8);
  ctx.closePath();
  ctx.fill();
}

function drawLavaRock(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const backPoints = [
    { x: x - r * 0.85, y: y + r * 0.25 },
    { x: x - r * 0.65, y: y - r * 0.5 },
    { x: x - r * 0.1, y: y - r * 0.75 },
    { x: x + r * 0.5, y: y - r * 0.6 },
    { x: x + r * 0.9, y: y - r * 0.1 },
    { x: x + r * 0.75, y: y + r * 0.45 },
    { x: x + r * 0.15, y: y + r * 0.7 },
    { x: x - r * 0.5, y: y + r * 0.6 },
  ];
  drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, backPoints, color);
  drawLavaGlow(ctx, x + r * 0.05, y + r * 0.1, r * 0.5);
}

function drawLavaGlow(ctx, x, y, size) {
  const points = [
    { x: x - size * 0.6, y: y + size * 0.15 },
    { x: x - size * 0.2, y: y - size * 0.35 },
    { x: x + size * 0.4, y: y - size * 0.2 },
    { x: x + size * 0.3, y: y + size * 0.3 },
    { x: x - size * 0.15, y: y + size * 0.4 },
  ];
  ctx.fillStyle = LAVA_GLOW_COLOR;
  fillPolygon(ctx, points);
}

function drawCharredTree(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const trunkW = r * 0.28;
  const trunkH = r * 2.5;
  const branchW = r * 0.15;
  const branchLen = r * 0.9;
  drawCharredBranch(ctx, camera, worldLengthToScreen, x - r * 0.12, y - r * 0.65, branchW, branchLen, -0.55, color);
  drawCharredBranch(ctx, camera, worldLengthToScreen, x + r * 0.18, y - r * 0.25, branchW, branchLen * 0.65, 0.5, color);
  drawCharredBranch(ctx, camera, worldLengthToScreen, x - r * 0.06, y - r * 1.05, branchW * 0.75, branchLen * 0.45, -0.35, color);
  drawPaperRoundedRect(ctx, camera, worldLengthToScreen, x, y, trunkW, trunkH, color);
}

function drawCharredBranch(ctx, camera, worldLengthToScreen, x, y, width, length, angle, color) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  ctx.fillRect(-width * 0.5 + shadowOffsetX, -length + shadowOffsetY, width, length);
  ctx.restore();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  fillPaperShape(ctx, camera, color, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(-width * 0.5, -length, width, length);
  });
  ctx.restore();
}

function drawPaperRoundedRect(ctx, camera, worldLengthToScreen, x, y, halfWidth, height, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const top = y - height * 0.5;
  const cornerRadius = halfWidth * 0.35;
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillRoundedRectPath(ctx, x - halfWidth + shadowOffsetX, top + shadowOffsetY, halfWidth * 2, height, cornerRadius);
  ctx.fill();
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    fillRoundedRectPath(drawCtx, x - halfWidth, top, halfWidth * 2, height, cornerRadius);
  });
}

function fillRoundedRectPath(ctx, x, y, w, h, r) {
  const clampedR = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + clampedR, y);
  ctx.lineTo(x + w - clampedR, y);
  ctx.arcTo(x + w, y, x + w, y + clampedR, clampedR);
  ctx.lineTo(x + w, y + h - clampedR);
  ctx.arcTo(x + w, y + h, x + w - clampedR, y + h, clampedR);
  ctx.lineTo(x + clampedR, y + h);
  ctx.arcTo(x, y + h, x, y + h - clampedR, clampedR);
  ctx.lineTo(x, y + clampedR);
  ctx.arcTo(x, y, x + clampedR, y, clampedR);
  ctx.closePath();
}

function drawPaperPolygonLayer(ctx, camera, worldLengthToScreen, points, fillColor) {
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

function fillPolygon(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}
