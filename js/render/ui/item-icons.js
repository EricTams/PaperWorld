import { fillPaperShape, PAPER_PATTERN_IDS } from "../paper/patterns.js";

const SHADOW_OFFSET = 1.5;
const SHADOW_COLOR = "rgba(0, 0, 0, 0.25)";

const PATTERN_FOR_ID = Object.freeze({
  "cut-wood": PAPER_PATTERN_IDS.CUT_WOOD,
  "rough-stone": PAPER_PATTERN_IDS.ROUGH_STONE,
  "leaves": PAPER_PATTERN_IDS.LEAVES,
});

const UI_CAMERA = Object.freeze({
  x: 0,
  y: 0,
  viewWidth: 0,
  viewHeight: 0,
  zoom: 1,
});

export function drawItemIcon(ctx, itemDef, cx, cy, size) {
  const pattern = PATTERN_FOR_ID[itemDef.patternId];
  if (itemDef.shape === "stick") {
    drawStickIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "stone") {
    drawStoneIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "herb") {
    drawHerbIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "wood-pulp") {
    drawWoodPulpIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "stone-powder") {
    drawStonePowderIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "paper") {
    drawPaperIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "grimoire") {
    drawGrimoireIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "magic-circle") {
    drawMagicCircleIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "mortar-and-pestle") {
    drawMortarIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "drying-rack") {
    drawDryingRackIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "wicker-chest") {
    drawWickerChestIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "campfire") {
    drawCampfireIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "stone-knife") {
    drawStoneKnifeIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "dried-herbs") {
    drawDriedHerbsIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "herb-powder") {
    drawHerbPowderIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "cauldron") {
    drawCauldronIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else if (itemDef.shape === "potion-flask") {
    drawPotionFlaskIcon(ctx, pattern, cx, cy, size, itemDef.color);
  } else {
    drawFallbackIcon(ctx, cx, cy, size, itemDef.color);
  }
}

function drawStickIcon(ctx, pattern, cx, cy, size, color) {
  const halfLen = size * 0.42;
  const halfW = size * 0.08;
  const angle = -Math.PI / 5;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  ctx.fillStyle = SHADOW_COLOR;
  fillRotatedRect(ctx, cx + SHADOW_OFFSET, cy + SHADOW_OFFSET, halfLen, halfW, cos, sin);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    fillRotatedRect(drawCtx, cx, cy, halfLen, halfW, cos, sin);
  });
}

function drawStoneIcon(ctx, pattern, cx, cy, size, color) {
  const rx = size * 0.32;
  const ry = size * 0.26;

  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.ellipse(cx + SHADOW_OFFSET, cy + SHADOW_OFFSET, rx, ry, 0.15, 0, Math.PI * 2);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(cx, cy, rx, ry, 0.15, 0, Math.PI * 2);
  });
}

function drawHerbIcon(ctx, pattern, cx, cy, size, color) {
  const stemH = size * 0.32;
  const stemW = size * 0.04;
  const leafRx = size * 0.18;
  const leafRy = size * 0.1;
  const stemTop = cy - stemH * 0.5;
  const stemBottom = cy + stemH * 0.5;

  ctx.fillStyle = SHADOW_COLOR;
  ctx.fillRect(cx - stemW + SHADOW_OFFSET, stemTop + SHADOW_OFFSET, stemW * 2, stemH);

  fillPaperShape(ctx, UI_CAMERA, "#5a7a3a", pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(cx - stemW, stemTop, stemW * 2, stemH);
  });

  const leaves = [
    { ox: -leafRx * 0.7, oy: stemTop + stemH * 0.15, angle: -0.4 },
    { ox: leafRx * 0.7, oy: stemTop + stemH * 0.35, angle: 0.4 },
    { ox: 0, oy: stemTop - leafRy * 0.3, angle: 0 },
  ];

  for (let i = 0; i < leaves.length; i += 1) {
    const leaf = leaves[i];
    const lx = cx + leaf.ox;
    const ly = leaf.oy;

    ctx.fillStyle = SHADOW_COLOR;
    ctx.beginPath();
    ctx.ellipse(lx + SHADOW_OFFSET, ly + SHADOW_OFFSET, leafRx, leafRy, leaf.angle, 0, Math.PI * 2);
    ctx.fill();

    fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
      drawCtx.beginPath();
      drawCtx.ellipse(lx, ly, leafRx, leafRy, leaf.angle, 0, Math.PI * 2);
    });
  }
}

function drawWoodPulpIcon(ctx, pattern, cx, cy, size, color) {
  const rx = size * 0.3;
  const ry = size * 0.2;

  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.ellipse(cx + SHADOW_OFFSET, cy + SHADOW_OFFSET + size * 0.04, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(cx, cy + size * 0.04, rx, ry, 0, 0, Math.PI * 2);
  });

  const fibers = [
    { ox: -size * 0.08, oy: -size * 0.06, angle: -0.3, len: size * 0.14 },
    { ox: size * 0.1, oy: -size * 0.04, angle: 0.5, len: size * 0.12 },
    { ox: 0, oy: -size * 0.1, angle: 0.1, len: size * 0.1 },
  ];
  const fiberW = size * 0.025;
  for (let i = 0; i < fibers.length; i += 1) {
    const f = fibers[i];
    const fx = cx + f.ox;
    const fy = cy + f.oy;
    const fcos = Math.cos(f.angle);
    const fsin = Math.sin(f.angle);
    fillPaperShape(ctx, UI_CAMERA, "#8a7a50", pattern, (drawCtx) => {
      fillRotatedRect(drawCtx, fx, fy, f.len, fiberW, fcos, fsin);
    });
  }
}

function drawStonePowderIcon(ctx, pattern, cx, cy, size, color) {
  const moundRx = size * 0.28;
  const moundRy = size * 0.14;
  const moundCy = cy + size * 0.06;

  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.ellipse(cx + SHADOW_OFFSET, moundCy + SHADOW_OFFSET, moundRx, moundRy, 0, Math.PI, 0, true);
  ctx.ellipse(cx + SHADOW_OFFSET, moundCy + SHADOW_OFFSET, moundRx, moundRy * 0.3, 0, 0, Math.PI, true);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(cx, moundCy, moundRx, moundRy, 0, Math.PI, 0, true);
    drawCtx.ellipse(cx, moundCy, moundRx, moundRy * 0.3, 0, 0, Math.PI, true);
  });

  const specks = [
    { ox: -size * 0.18, oy: size * 0.1, r: size * 0.03 },
    { ox: size * 0.2, oy: size * 0.12, r: size * 0.025 },
    { ox: size * 0.12, oy: size * 0.06, r: size * 0.02 },
  ];
  for (let i = 0; i < specks.length; i += 1) {
    const s = specks[i];
    fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
      drawCtx.beginPath();
      drawCtx.arc(cx + s.ox, cy + s.oy, s.r, 0, Math.PI * 2);
    });
  }
}

function drawPaperIcon(ctx, pattern, cx, cy, size, color) {
  const w = size * 0.42;
  const h = size * 0.52;
  const left = cx - w * 0.5;
  const top = cy - h * 0.5;
  const foldSize = size * 0.1;

  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.moveTo(left + SHADOW_OFFSET, top + SHADOW_OFFSET);
  ctx.lineTo(left + w - foldSize + SHADOW_OFFSET, top + SHADOW_OFFSET);
  ctx.lineTo(left + w + SHADOW_OFFSET, top + foldSize + SHADOW_OFFSET);
  ctx.lineTo(left + w + SHADOW_OFFSET, top + h + SHADOW_OFFSET);
  ctx.lineTo(left + SHADOW_OFFSET, top + h + SHADOW_OFFSET);
  ctx.closePath();
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.moveTo(left, top);
    drawCtx.lineTo(left + w - foldSize, top);
    drawCtx.lineTo(left + w, top + foldSize);
    drawCtx.lineTo(left + w, top + h);
    drawCtx.lineTo(left, top + h);
    drawCtx.closePath();
  });

  ctx.strokeStyle = "rgba(180, 170, 150, 0.4)";
  ctx.lineWidth = 0.6;
  const lineGap = h / 5;
  for (let i = 1; i < 5; i += 1) {
    const ly = top + lineGap * i;
    ctx.beginPath();
    ctx.moveTo(left + size * 0.05, ly);
    ctx.lineTo(left + w - size * 0.05, ly);
    ctx.stroke();
  }
}

function drawGrimoireIcon(ctx, pattern, cx, cy, size, color) {
  const w = size * 0.44;
  const h = size * 0.54;
  const left = cx - w * 0.5;
  const top = cy - h * 0.5;
  const spineW = size * 0.06;

  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.roundRect(left + SHADOW_OFFSET, top + SHADOW_OFFSET, w, h, 2);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.roundRect(left, top, w, h, 2);
  });

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(left, top, spineW, h);

  const pageInset = size * 0.05;
  const pageColor = "#e8dfc8";
  fillPaperShape(ctx, UI_CAMERA, pageColor, PATTERN_FOR_ID["cut-wood"], (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(left + spineW + pageInset, top + pageInset, w - spineW - pageInset * 2, h - pageInset * 2);
  });

  ctx.strokeStyle = "rgba(90, 50, 120, 0.5)";
  ctx.lineWidth = 0.8;
  const starCx = cx + size * 0.04;
  const starCy = cy;
  const starR = size * 0.08;
  ctx.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const px = starCx + Math.cos(angle) * starR;
    const py = starCy + Math.sin(angle) * starR;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.stroke();
}

function drawMagicCircleIcon(ctx, pattern, cx, cy, size, color) {
  const outerR = size * 0.38;
  const innerR = size * 0.3;

  ctx.strokeStyle = SHADOW_COLOR;
  ctx.lineWidth = size * 0.04;
  ctx.beginPath();
  ctx.arc(cx + SHADOW_OFFSET, cy + SHADOW_OFFSET, outerR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.04;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(140, 100, 200, 0.6)";
  ctx.lineWidth = size * 0.025;
  ctx.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const nextAngle = -Math.PI / 2 + (((i + 2) % 5) * 2 * Math.PI) / 5;
    ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
    ctx.lineTo(cx + Math.cos(nextAngle) * innerR, cy + Math.sin(nextAngle) * innerR);
  }
  ctx.stroke();

  const dotR = size * 0.025;
  for (let i = 0; i < 5; i += 1) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const dx = cx + Math.cos(angle) * innerR;
    const dy = cy + Math.sin(angle) * innerR;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(dx, dy, dotR, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMortarIcon(ctx, pattern, cx, cy, size, color) {
  const bowlRx = size * 0.3;
  const bowlRy = size * 0.18;
  const bowlTop = cy - size * 0.02;
  const bowlBottom = cy + size * 0.22;
  const pestleHalfLen = size * 0.32;
  const pestleHalfW = size * 0.055;
  const pestleAngle = -Math.PI / 4.5;
  const pCos = Math.cos(pestleAngle);
  const pSin = Math.sin(pestleAngle);
  const pestleCx = cx + size * 0.08;
  const pestleCy = cy - size * 0.12;

  ctx.fillStyle = SHADOW_COLOR;
  fillBowlPath(ctx, cx + SHADOW_OFFSET, bowlTop + SHADOW_OFFSET, bowlRx, bowlRy, bowlBottom - bowlTop);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    fillBowlPath(drawCtx, cx, bowlTop, bowlRx, bowlRy, bowlBottom - bowlTop);
  });

  ctx.fillStyle = SHADOW_COLOR;
  fillRotatedRect(ctx, pestleCx + SHADOW_OFFSET, pestleCy + SHADOW_OFFSET, pestleHalfLen, pestleHalfW, pCos, pSin);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, "#6b5a3a", PATTERN_FOR_ID["cut-wood"], (drawCtx) => {
    fillRotatedRect(drawCtx, pestleCx, pestleCy, pestleHalfLen, pestleHalfW, pCos, pSin);
  });
}

function fillBowlPath(ctx, cx, top, rx, ry, depth) {
  ctx.beginPath();
  ctx.moveTo(cx - rx, top);
  ctx.lineTo(cx - rx * 0.85, top + depth);
  ctx.ellipse(cx, top + depth, rx * 0.85, ry * 0.6, 0, Math.PI, 0, true);
  ctx.lineTo(cx + rx, top);
  ctx.ellipse(cx, top, rx, ry, 0, 0, Math.PI, true);
  ctx.closePath();
}

function drawDryingRackIcon(ctx, pattern, cx, cy, size, color) {
  const postW = size * 0.08;
  const postH = size * 0.5;
  const barW = size * 0.55;
  const barH = size * 0.07;
  const postSpacing = size * 0.32;
  const barY = cy - size * 0.18;
  const postTop = barY - barH * 0.5;
  const postBottom = postTop + postH;

  const posts = [cx - postSpacing, cx + postSpacing];
  for (let i = 0; i < posts.length; i += 1) {
    const px = posts[i];
    ctx.fillStyle = SHADOW_COLOR;
    ctx.fillRect(px - postW * 0.5 + SHADOW_OFFSET, postTop + SHADOW_OFFSET, postW, postH);

    fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
      drawCtx.beginPath();
      drawCtx.rect(px - postW * 0.5, postTop, postW, postH);
    });
  }

  ctx.fillStyle = SHADOW_COLOR;
  ctx.fillRect(cx - barW * 0.5 + SHADOW_OFFSET, barY - barH * 0.5 + SHADOW_OFFSET, barW, barH);

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(cx - barW * 0.5, barY - barH * 0.5, barW, barH);
  });
}

function drawWickerChestIcon(ctx, pattern, cx, cy, size, color) {
  const bodyW = size * 0.52;
  const bodyH = size * 0.32;
  const lidH = size * 0.1;
  const bodyTop = cy - bodyH * 0.3;
  const bodyBottom = bodyTop + bodyH;
  const lidTop = bodyTop - lidH;
  const taperInset = size * 0.04;

  ctx.fillStyle = SHADOW_COLOR;
  fillTrapezoid(ctx, cx + SHADOW_OFFSET, bodyTop + SHADOW_OFFSET, bodyW, bodyH, taperInset);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    fillTrapezoid(drawCtx, cx, bodyTop, bodyW, bodyH, taperInset);
  });

  const lidColor = "#c49b52";
  ctx.fillStyle = SHADOW_COLOR;
  ctx.fillRect(cx - bodyW * 0.5 + SHADOW_OFFSET, lidTop + SHADOW_OFFSET, bodyW, lidH);

  fillPaperShape(ctx, UI_CAMERA, lidColor, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(cx - bodyW * 0.5, lidTop, bodyW, lidH);
  });

  ctx.strokeStyle = "rgba(90, 65, 30, 0.4)";
  ctx.lineWidth = 0.8;
  const stripeGap = bodyH / 4;
  for (let i = 1; i < 4; i += 1) {
    const sy = bodyTop + stripeGap * i;
    ctx.beginPath();
    ctx.moveTo(cx - bodyW * 0.46, sy);
    ctx.lineTo(cx + bodyW * 0.46, sy);
    ctx.stroke();
  }
}

function fillTrapezoid(ctx, cx, top, width, height, inset) {
  const halfTop = width * 0.5;
  const halfBottom = halfTop - inset;
  ctx.beginPath();
  ctx.moveTo(cx - halfTop, top);
  ctx.lineTo(cx + halfTop, top);
  ctx.lineTo(cx + halfBottom, top + height);
  ctx.lineTo(cx - halfBottom, top + height);
  ctx.closePath();
}

function drawCampfireIcon(ctx, pattern, cx, cy, size, color) {
  const stickHalfLen = size * 0.3;
  const stickHalfW = size * 0.045;
  const stickY = cy + size * 0.1;

  const angle1 = Math.PI / 5;
  const angle2 = -Math.PI / 5;

  ctx.fillStyle = SHADOW_COLOR;
  fillRotatedRect(ctx, cx + SHADOW_OFFSET, stickY + SHADOW_OFFSET, stickHalfLen, stickHalfW, Math.cos(angle1), Math.sin(angle1));
  ctx.fill();
  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    fillRotatedRect(drawCtx, cx, stickY, stickHalfLen, stickHalfW, Math.cos(angle1), Math.sin(angle1));
  });

  ctx.fillStyle = SHADOW_COLOR;
  fillRotatedRect(ctx, cx + SHADOW_OFFSET, stickY + SHADOW_OFFSET, stickHalfLen, stickHalfW, Math.cos(angle2), Math.sin(angle2));
  ctx.fill();
  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    fillRotatedRect(drawCtx, cx, stickY, stickHalfLen, stickHalfW, Math.cos(angle2), Math.sin(angle2));
  });

  const flameColor = "#e8922d";
  const flameW = size * 0.2;
  const flameH = size * 0.32;
  const flameBase = stickY - size * 0.02;
  const flameTip = flameBase - flameH;

  ctx.fillStyle = SHADOW_COLOR;
  fillFlamePath(ctx, cx + SHADOW_OFFSET, flameBase + SHADOW_OFFSET, flameTip + SHADOW_OFFSET, flameW);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, flameColor, PATTERN_FOR_ID["leaves"], (drawCtx) => {
    fillFlamePath(drawCtx, cx, flameBase, flameTip, flameW);
  });
}

function fillFlamePath(ctx, cx, base, tip, width) {
  const half = width * 0.5;
  ctx.beginPath();
  ctx.moveTo(cx - half, base);
  ctx.quadraticCurveTo(cx - half * 0.6, base - (base - tip) * 0.5, cx, tip);
  ctx.quadraticCurveTo(cx + half * 0.6, base - (base - tip) * 0.5, cx + half, base);
  ctx.closePath();
}

function drawStoneKnifeIcon(ctx, pattern, cx, cy, size, color) {
  const bladeH = size * 0.38;
  const bladeW = size * 0.22;
  const handleH = size * 0.2;
  const handleW = size * 0.08;
  const bladeTop = cy - size * 0.22;
  const bladeMid = bladeTop + bladeH;

  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.moveTo(cx + SHADOW_OFFSET, bladeTop + SHADOW_OFFSET);
  ctx.lineTo(cx + bladeW * 0.5 + SHADOW_OFFSET, bladeMid + SHADOW_OFFSET);
  ctx.lineTo(cx - bladeW * 0.5 + SHADOW_OFFSET, bladeMid + SHADOW_OFFSET);
  ctx.closePath();
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.moveTo(cx, bladeTop);
    drawCtx.lineTo(cx + bladeW * 0.5, bladeMid);
    drawCtx.lineTo(cx - bladeW * 0.5, bladeMid);
    drawCtx.closePath();
  });

  ctx.fillStyle = SHADOW_COLOR;
  ctx.fillRect(cx - handleW * 0.5 + SHADOW_OFFSET, bladeMid + SHADOW_OFFSET, handleW, handleH);

  fillPaperShape(ctx, UI_CAMERA, "#6b5a3a", PATTERN_FOR_ID["cut-wood"], (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(cx - handleW * 0.5, bladeMid, handleW, handleH);
  });
}

function drawDriedHerbsIcon(ctx, pattern, cx, cy, size, color) {
  const stemH = size * 0.32;
  const stemW = size * 0.04;
  const leafRx = size * 0.16;
  const leafRy = size * 0.08;
  const stemTop = cy - stemH * 0.5;

  ctx.fillStyle = SHADOW_COLOR;
  ctx.fillRect(cx - stemW + SHADOW_OFFSET, stemTop + SHADOW_OFFSET, stemW * 2, stemH);

  fillPaperShape(ctx, UI_CAMERA, "#6a5a2a", pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(cx - stemW, stemTop, stemW * 2, stemH);
  });

  const leaves = [
    { ox: -leafRx * 0.6, oy: stemTop + stemH * 0.2, angle: -0.5 },
    { ox: leafRx * 0.6, oy: stemTop + stemH * 0.4, angle: 0.5 },
    { ox: -leafRx * 0.3, oy: stemTop - leafRy * 0.2, angle: -0.15 },
  ];
  for (let i = 0; i < leaves.length; i += 1) {
    const leaf = leaves[i];
    const lx = cx + leaf.ox;
    const ly = leaf.oy;
    ctx.fillStyle = SHADOW_COLOR;
    ctx.beginPath();
    ctx.ellipse(lx + SHADOW_OFFSET, ly + SHADOW_OFFSET, leafRx, leafRy, leaf.angle, 0, Math.PI * 2);
    ctx.fill();
    fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
      drawCtx.beginPath();
      drawCtx.ellipse(lx, ly, leafRx, leafRy, leaf.angle, 0, Math.PI * 2);
    });
  }
}

function drawHerbPowderIcon(ctx, pattern, cx, cy, size, color) {
  const moundRx = size * 0.28;
  const moundRy = size * 0.14;
  const moundCy = cy + size * 0.06;

  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.ellipse(cx + SHADOW_OFFSET, moundCy + SHADOW_OFFSET, moundRx, moundRy, 0, Math.PI, 0, true);
  ctx.ellipse(cx + SHADOW_OFFSET, moundCy + SHADOW_OFFSET, moundRx, moundRy * 0.3, 0, 0, Math.PI, true);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(cx, moundCy, moundRx, moundRy, 0, Math.PI, 0, true);
    drawCtx.ellipse(cx, moundCy, moundRx, moundRy * 0.3, 0, 0, Math.PI, true);
  });

  const specks = [
    { ox: -size * 0.16, oy: size * 0.1, r: size * 0.025 },
    { ox: size * 0.18, oy: size * 0.11, r: size * 0.02 },
    { ox: size * 0.1, oy: size * 0.05, r: size * 0.018 },
  ];
  for (let i = 0; i < specks.length; i += 1) {
    const s = specks[i];
    fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
      drawCtx.beginPath();
      drawCtx.arc(cx + s.ox, cy + s.oy, s.r, 0, Math.PI * 2);
    });
  }
}

function drawCauldronIcon(ctx, pattern, cx, cy, size, color) {
  const bodyRx = size * 0.32;
  const bodyRy = size * 0.24;
  const bodyTop = cy - size * 0.08;
  const rimH = size * 0.06;
  const legH = size * 0.12;
  const legW = size * 0.05;

  ctx.fillStyle = SHADOW_COLOR;
  fillBowlPath(ctx, cx + SHADOW_OFFSET, bodyTop + SHADOW_OFFSET, bodyRx, bodyRy, bodyRy * 1.2);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    fillBowlPath(drawCtx, cx, bodyTop, bodyRx, bodyRy, bodyRy * 1.2);
  });

  fillPaperShape(ctx, UI_CAMERA, "#4a4e56", pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(cx, bodyTop, bodyRx, bodyRy * 0.35, 0, 0, Math.PI * 2);
  });

  const legSpacing = bodyRx * 0.6;
  const legBaseY = bodyTop + bodyRy * 1.2;
  const legs = [cx - legSpacing, cx, cx + legSpacing];
  for (let i = 0; i < legs.length; i += 1) {
    ctx.fillStyle = SHADOW_COLOR;
    ctx.fillRect(legs[i] - legW * 0.5 + SHADOW_OFFSET, legBaseY + SHADOW_OFFSET, legW, legH);
    fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
      drawCtx.beginPath();
      drawCtx.rect(legs[i] - legW * 0.5, legBaseY, legW, legH);
    });
  }
}

function drawPotionFlaskIcon(ctx, pattern, cx, cy, size, color) {
  const bodyRx = size * 0.2;
  const bodyRy = size * 0.22;
  const bodyCy = cy + size * 0.08;
  const neckW = size * 0.08;
  const neckH = size * 0.18;
  const neckTop = bodyCy - bodyRy - neckH + size * 0.02;
  const corkH = size * 0.06;
  const corkW = size * 0.1;

  ctx.fillStyle = SHADOW_COLOR;
  ctx.beginPath();
  ctx.ellipse(cx + SHADOW_OFFSET, bodyCy + SHADOW_OFFSET, bodyRx, bodyRy, 0, 0, Math.PI * 2);
  ctx.fill();

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.ellipse(cx, bodyCy, bodyRx, bodyRy, 0, 0, Math.PI * 2);
  });

  ctx.fillStyle = SHADOW_COLOR;
  ctx.fillRect(cx - neckW * 0.5 + SHADOW_OFFSET, neckTop + SHADOW_OFFSET, neckW, neckH);

  fillPaperShape(ctx, UI_CAMERA, color, pattern, (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(cx - neckW * 0.5, neckTop, neckW, neckH);
  });

  fillPaperShape(ctx, UI_CAMERA, "#8a6a3a", PATTERN_FOR_ID["cut-wood"], (drawCtx) => {
    drawCtx.beginPath();
    drawCtx.rect(cx - corkW * 0.5, neckTop - corkH + size * 0.02, corkW, corkH);
  });

  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.beginPath();
  ctx.ellipse(cx - bodyRx * 0.3, bodyCy - bodyRy * 0.25, bodyRx * 0.18, bodyRy * 0.3, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawFallbackIcon(ctx, cx, cy, size, color) {
  const half = size * 0.3;
  ctx.fillStyle = color;
  ctx.fillRect(cx - half, cy - half, half * 2, half * 2);
}

function fillRotatedRect(ctx, cx, cy, halfLen, halfW, cos, sin) {
  const dx1 = halfLen * cos;
  const dy1 = halfLen * sin;
  const dx2 = halfW * -sin;
  const dy2 = halfW * cos;

  ctx.beginPath();
  ctx.moveTo(cx - dx1 - dx2, cy - dy1 - dy2);
  ctx.lineTo(cx + dx1 - dx2, cy + dy1 - dy2);
  ctx.lineTo(cx + dx1 + dx2, cy + dy1 + dy2);
  ctx.lineTo(cx - dx1 + dx2, cy - dy1 + dy2);
  ctx.closePath();
}
