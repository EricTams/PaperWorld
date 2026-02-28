import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const PAPER_SHADOW_OFFSET_X = 2;
const PAPER_SHADOW_OFFSET_Y = 3;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.22)";
const BOULDER_HIGHLIGHT_COLOR = "rgba(230, 220, 200, 0.2)";
const CACTUS_HIGHLIGHT_COLOR = "rgba(180, 230, 160, 0.14)";

export function drawDesertBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
  if (decorDef.shape === "cactus") {
    drawCactus(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "boulder") {
    drawBoulder(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "dead-tree") {
    drawDeadTree(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  throw new Error(`Unsupported desert blocking shape "${decorDef.shape}".`);
}

function drawCactus(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const bodyW = r * 0.5;
  const bodyH = r * 2.2;
  const armW = r * 0.35;
  const armH = r * 0.9;
  const armJointH = r * 0.4;
  drawCactusArm(ctx, camera, worldLengthToScreen, x - r * 0.6, y - armJointH, armW, armH, color, -1);
  drawCactusArm(ctx, camera, worldLengthToScreen, x + r * 0.6, y + r * 0.1, armW, armH * 0.75, color, 1);
  drawPaperRoundedRect(ctx, camera, worldLengthToScreen, x, y, bodyW, bodyH, color, PAPER_PATTERN_IDS.ROUGH_STONE);
  drawCactusHighlight(ctx, x, y, bodyW * 0.3, bodyH * 0.6);
}

function drawCactusArm(ctx, camera, worldLengthToScreen, x, y, width, height, color, side) {
  const elbowX = x + side * width * 0.5;
  drawPaperRoundedRect(ctx, camera, worldLengthToScreen, elbowX, y + height * 0.5, width, height * 0.5, color, PAPER_PATTERN_IDS.ROUGH_STONE);
  drawPaperRoundedRect(ctx, camera, worldLengthToScreen, x, y, width * 0.9, height * 0.55, color, PAPER_PATTERN_IDS.ROUGH_STONE);
}

function drawCactusHighlight(ctx, x, y, width, height) {
  ctx.fillStyle = CACTUS_HIGHLIGHT_COLOR;
  ctx.beginPath();
  ctx.ellipse(x - width * 0.3, y - height * 0.1, width, height, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBoulder(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const backSize = r * 0.92;
  const frontSize = r * 1.14;
  drawPaperRockLayer(ctx, camera, worldLengthToScreen, x - r * 0.32, y + r * 0.1, backSize, color);
  drawPaperRockLayer(ctx, camera, worldLengthToScreen, x + r * 0.24, y - r * 0.04, frontSize, color);
  drawBoulderHighlight(ctx, x + r * 0.24, y - r * 0.04, frontSize);
}

function drawPaperRockLayer(ctx, camera, worldLengthToScreen, x, y, size, fillColor) {
  const points = [
    { x: x - size * 0.96, y: y + size * 0.18 },
    { x: x - size * 0.7, y: y - size * 0.52 },
    { x: x - size * 0.16, y: y - size * 0.82 },
    { x: x + size * 0.44, y: y - size * 0.68 },
    { x: x + size * 0.94, y: y - size * 0.18 },
    { x: x + size * 0.84, y: y + size * 0.38 },
    { x: x + size * 0.22, y: y + size * 0.72 },
    { x: x - size * 0.46, y: y + size * 0.64 },
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

function drawBoulderHighlight(ctx, x, y, size) {
  const points = [
    { x: x - size * 0.4, y: y - size * 0.28 },
    { x: x - size * 0.18, y: y - size * 0.4 },
    { x: x + size * 0.06, y: y - size * 0.26 },
    { x: x - size * 0.08, y: y - size * 0.1 },
    { x: x - size * 0.32, y: y - size * 0.12 },
  ];
  ctx.fillStyle = BOULDER_HIGHLIGHT_COLOR;
  fillPolygon(ctx, points);
}

function drawDeadTree(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const r = footprintRadius;
  const trunkW = r * 0.3;
  const trunkH = r * 2.4;
  const branchW = r * 0.18;
  const branchLen = r * 1.0;
  drawDeadBranch(ctx, camera, worldLengthToScreen, x - r * 0.15, y - r * 0.6, branchW, branchLen, -0.5, color);
  drawDeadBranch(ctx, camera, worldLengthToScreen, x + r * 0.2, y - r * 0.2, branchW, branchLen * 0.7, 0.6, color);
  drawDeadBranch(ctx, camera, worldLengthToScreen, x - r * 0.08, y - r * 1.1, branchW * 0.8, branchLen * 0.5, -0.4, color);
  drawPaperRoundedRect(ctx, camera, worldLengthToScreen, x, y, trunkW, trunkH, color, PAPER_PATTERN_IDS.CUT_WOOD);
}

function drawDeadBranch(ctx, camera, worldLengthToScreen, x, y, width, length, angle, color) {
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

function drawPaperRoundedRect(ctx, camera, worldLengthToScreen, x, y, halfWidth, height, fillColor, patternId) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const top = y - height * 0.5;
  const cornerRadius = halfWidth * 0.4;
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillRoundedRectPath(ctx, x - halfWidth + shadowOffsetX, top + shadowOffsetY, halfWidth * 2, height, cornerRadius);
  ctx.fill();
  fillPaperShape(ctx, camera, fillColor, patternId, (drawCtx) => {
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

function fillPolygon(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}
