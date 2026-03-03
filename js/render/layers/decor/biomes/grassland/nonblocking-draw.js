import { fillPaperShape, PAPER_PATTERN_IDS } from "../../../../paper/patterns.js";

const FLOWER_PETAL_RADIUS = 4;
const FLOWER_CENTER_RADIUS = 2.5;
const FLOWER_RING_RADIUS = 5;
const FLOWER_CENTER_COLOR = "#fff6d1";
const CLOVER_LEAF_RADIUS = 4;
const CLOVER_RING_RADIUS = 4;
const TALL_GRASS_BLADE_HALF_WIDTH = 4;
const TALL_GRASS_BLADE_HEIGHT = 14;
const PAPER_SHADOW_OFFSET_X = 1;
const PAPER_SHADOW_OFFSET_Y = 2;
const PAPER_SHADOW_COLOR = "rgba(0, 0, 0, 0.32)";
const STONE_HIGHLIGHT_COLOR = "rgba(214, 220, 228, 0.22)";

export function drawGrasslandNonBlockingDecor(ctx, camera, worldLengthToScreen, position, decorDef) {
  if (decorDef.shape === "flower-cluster") {
    drawFlowerCluster(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "clover-patch") {
    drawCloverPatch(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "tall-grass") {
    drawTallGrass(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  if (decorDef.shape === "bush") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawBush(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "ground-stick") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawGroundStick(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "ground-stone") {
    const footprintRadius = worldLengthToScreen(camera, decorDef.footprint.radius);
    drawGroundStone(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color, footprintRadius);
    return;
  }
  if (decorDef.shape === "ground-herb") {
    drawGroundHerb(ctx, camera, worldLengthToScreen, position.x, position.y, decorDef.color);
    return;
  }
  throw new Error(`Unsupported grassland non-blocking shape "${decorDef.shape}".`);
}

function drawFlowerCluster(ctx, camera, worldLengthToScreen, x, y, petalColor) {
  const ring = worldLengthToScreen(camera, FLOWER_RING_RADIUS);
  const petalRadius = worldLengthToScreen(camera, FLOWER_PETAL_RADIUS);
  const centerRadius = worldLengthToScreen(camera, FLOWER_CENTER_RADIUS);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - ring, y, petalRadius, petalColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + ring, y, petalRadius, petalColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y - ring, petalRadius, petalColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y + ring, petalRadius, petalColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y, centerRadius, FLOWER_CENTER_COLOR);
}

function drawCloverPatch(ctx, camera, worldLengthToScreen, x, y, leafColor) {
  const ring = worldLengthToScreen(camera, CLOVER_RING_RADIUS);
  const leafRadius = worldLengthToScreen(camera, CLOVER_LEAF_RADIUS);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - ring, y, leafRadius, leafColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + ring, y, leafRadius, leafColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y - ring, leafRadius, leafColor);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y + ring, leafRadius, leafColor);
}

function drawTallGrass(ctx, camera, worldLengthToScreen, x, y, bladeColor) {
  const sideOffset = worldLengthToScreen(camera, 5);
  const lowOffsetY = worldLengthToScreen(camera, 2);
  const bladeHalfWidth = worldLengthToScreen(camera, TALL_GRASS_BLADE_HALF_WIDTH);
  const bladeHeight = worldLengthToScreen(camera, TALL_GRASS_BLADE_HEIGHT);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x - sideOffset, y + lowOffsetY, bladeHalfWidth, bladeHeight - 1, bladeColor);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x, y, bladeHalfWidth + 1, bladeHeight + 1, bladeColor);
  drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x + sideOffset, y + lowOffsetY, bladeHalfWidth, bladeHeight - 1, bladeColor);
}

function drawBush(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const leafRadius = footprintRadius * 0.95;
  const sideOffset = footprintRadius * 0.7;
  const topOffset = footprintRadius * 0.45;
  const yOffset = worldLengthToScreen(camera, 1);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x - sideOffset, y + yOffset, leafRadius * 0.85, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x + sideOffset, y + yOffset, leafRadius * 0.85, color);
  drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y - topOffset, leafRadius, color);
}

function drawGroundStick(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const halfLen = footprintRadius * 1.1;
  const halfW = footprintRadius * 0.14;
  drawPaperRectLayer(ctx, camera, worldLengthToScreen, x - halfLen * 0.15, y + halfLen * 0.1, halfLen, halfW, -0.25, color);
  drawPaperRectLayer(ctx, camera, worldLengthToScreen, x + halfLen * 0.1, y - halfLen * 0.05, halfLen * 0.8, halfW, 0.55, color);
}

function drawPaperRectLayer(ctx, camera, worldLengthToScreen, cx, cy, halfLen, halfW, angle, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const pts = [
    { x: cx + cos * -halfLen - sin * -halfW, y: cy + sin * -halfLen + cos * -halfW },
    { x: cx + cos * halfLen - sin * -halfW,  y: cy + sin * halfLen + cos * -halfW },
    { x: cx + cos * halfLen - sin * halfW,   y: cy + sin * halfLen + cos * halfW },
    { x: cx + cos * -halfLen - sin * halfW,  y: cy + sin * -halfLen + cos * halfW },
  ];
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillPolygon(ctx, pts.map((p) => ({ x: p.x + shadowOffsetX, y: p.y + shadowOffsetY })));
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.CUT_WOOD, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i += 1) {
      drawCtx.lineTo(pts[i].x, pts[i].y);
    }
    drawCtx.closePath();
  });
}

function drawGroundHerb(ctx, camera, worldLengthToScreen, x, y, color) {
  const stemW = worldLengthToScreen(camera, 1);
  const stemH = worldLengthToScreen(camera, 10);
  const leafRx = worldLengthToScreen(camera, 5);
  const leafRy = worldLengthToScreen(camera, 3);
  const stemTop = y - stemH * 0.5;
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);

  ctx.fillStyle = PAPER_SHADOW_COLOR;
  ctx.fillRect(x - stemW + shadowOffsetX, stemTop + shadowOffsetY, stemW * 2, stemH);
  fillPaperShape(ctx, camera, "#5a7a3a", PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(x - stemW, stemTop, stemW * 2, stemH);
  });

  const leaves = [
    { ox: -leafRx * 0.7, oy: stemTop + stemH * 0.15, angle: -0.4 },
    { ox: leafRx * 0.7, oy: stemTop + stemH * 0.35, angle: 0.4 },
    { ox: 0, oy: stemTop - leafRy * 0.3, angle: 0 },
  ];
  for (let i = 0; i < leaves.length; i += 1) {
    const leaf = leaves[i];
    const lx = x + leaf.ox;
    const ly = leaf.oy;
    ctx.fillStyle = PAPER_SHADOW_COLOR;
    ctx.beginPath();
    ctx.ellipse(lx + shadowOffsetX, ly + shadowOffsetY, leafRx, leafRy, leaf.angle, 0, Math.PI * 2);
    ctx.fill();
    fillPaperShape(ctx, camera, color, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
      drawCtx.beginPath();
      drawCtx.ellipse(lx, ly, leafRx, leafRy, leaf.angle, 0, Math.PI * 2);
    });
  }
}

function drawGroundStone(ctx, camera, worldLengthToScreen, x, y, color, footprintRadius) {
  const size = footprintRadius * 0.9;
  const points = [
    { x: x - size * 0.92, y: y + size * 0.18 },
    { x: x - size * 0.6,  y: y - size * 0.55 },
    { x: x + size * 0.1,  y: y - size * 0.72 },
    { x: x + size * 0.78, y: y - size * 0.3 },
    { x: x + size * 0.88, y: y + size * 0.28 },
    { x: x + size * 0.2,  y: y + size * 0.68 },
    { x: x - size * 0.44, y: y + size * 0.6 },
  ];
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillPolygon(ctx, points.map((p) => ({ x: p.x + shadowOffsetX, y: p.y + shadowOffsetY })));
  fillPaperShape(ctx, camera, color, PAPER_PATTERN_IDS.ROUGH_STONE, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      drawCtx.lineTo(points[i].x, points[i].y);
    }
    drawCtx.closePath();
  });
  const hlPoints = [
    { x: x - size * 0.3, y: y - size * 0.28 },
    { x: x - size * 0.08, y: y - size * 0.42 },
    { x: x + size * 0.16, y: y - size * 0.24 },
    { x: x + size * 0.02, y: y - size * 0.1 },
    { x: x - size * 0.22, y: y - size * 0.12 },
  ];
  ctx.fillStyle = STONE_HIGHLIGHT_COLOR;
  fillPolygon(ctx, hlPoints);
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

function drawPaperCircleLayer(ctx, camera, worldLengthToScreen, x, y, radius, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillCircle(ctx, x + shadowOffsetX, y + shadowOffsetY, radius);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.arc(x, y, radius, 0, Math.PI * 2);
  });
}

function drawPaperBladeLayer(ctx, camera, worldLengthToScreen, x, y, halfWidth, height, fillColor) {
  const shadowOffsetX = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_X);
  const shadowOffsetY = worldLengthToScreen(camera, PAPER_SHADOW_OFFSET_Y);
  ctx.fillStyle = PAPER_SHADOW_COLOR;
  fillGrassBlade(ctx, x + shadowOffsetX, y + shadowOffsetY, halfWidth, height);
  fillPaperShape(ctx, camera, fillColor, PAPER_PATTERN_IDS.LEAVES, (drawCtx) => {
    const baseY = y + height * 0.5;
    const tipY = y - height * 0.5;
    drawCtx.beginPath();
    drawCtx.moveTo(x - halfWidth, baseY);
    drawCtx.quadraticCurveTo(x - halfWidth * 0.4, y, x, tipY);
    drawCtx.quadraticCurveTo(x + halfWidth * 0.4, y, x + halfWidth, baseY);
    drawCtx.closePath();
  });
}

function fillCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function fillGrassBlade(ctx, x, y, halfWidth, height) {
  const baseY = y + height * 0.5;
  const tipY = y - height * 0.5;
  ctx.beginPath();
  ctx.moveTo(x - halfWidth, baseY);
  ctx.quadraticCurveTo(x - halfWidth * 0.4, y, x, tipY);
  ctx.quadraticCurveTo(x + halfWidth * 0.4, y, x + halfWidth, baseY);
  ctx.closePath();
  ctx.fill();
}
