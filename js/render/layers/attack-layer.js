const THRUST_LENGTH = 26;
const THRUST_BASE_WIDTH = 8;
const THRUST_TIP_WIDTH = 16;
const STAB_LENGTH = 34;
const STAB_WIDTH = 9;

export function drawAttack(ctx, camera, player, worldToScreen, worldLengthToScreen) {
  const atk = player.attack;
  if (!atk.active) {
    return;
  }

  const t = atk.timer / atk.duration;

  if (atk.type === "stab") {
    drawStab(ctx, camera, player, worldToScreen, worldLengthToScreen, t);
  } else {
    drawThrust(ctx, camera, player, worldToScreen, worldLengthToScreen, t);
  }
}

function easeOutCubic(t) {
  return 1 - (1 - t) * (1 - t) * (1 - t);
}

function drawThrust(ctx, camera, player, worldToScreen, worldLengthToScreen, t) {
  const dir = player.attack.direction;
  const angle = Math.atan2(dir.y, dir.x);

  const thrustT = easeOutCubic(Math.min(t * 4, 1));
  const reach = THRUST_LENGTH * thrustT;

  const alpha = t < 0.3 ? 1 : 1 - (t - 0.3) / 0.7;

  const perpX = -Math.sin(angle);
  const perpY = Math.cos(angle);

  const baseX = player.x + Math.cos(angle) * 8;
  const baseY = player.y + Math.sin(angle) * 8;
  const tipX = player.x + Math.cos(angle) * (8 + reach);
  const tipY = player.y + Math.sin(angle) * (8 + reach);

  const halfBase = THRUST_BASE_WIDTH * 0.5;
  const halfTip = THRUST_TIP_WIDTH * 0.5;

  const b1 = worldToScreen(camera, baseX + perpX * halfBase, baseY + perpY * halfBase);
  const b2 = worldToScreen(camera, baseX - perpX * halfBase, baseY - perpY * halfBase);
  const t1 = worldToScreen(camera, tipX + perpX * halfTip, tipY + perpY * halfTip);
  const t2 = worldToScreen(camera, tipX - perpX * halfTip, tipY - perpY * halfTip);

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(b1.x, b1.y);
  ctx.lineTo(t1.x, t1.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.lineTo(b2.x, b2.y);
  ctx.closePath();
  ctx.fillStyle = `rgba(255, 250, 235, ${(alpha * 0.8).toFixed(2)})`;
  ctx.fill();

  ctx.strokeStyle = `rgba(220, 215, 200, ${(alpha * 0.5).toFixed(2)})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

function drawStab(ctx, camera, player, worldToScreen, worldLengthToScreen, t) {
  const dir = player.attack.direction;
  const angle = Math.atan2(dir.y, dir.x);

  const thrustT = easeOutCubic(Math.min(t * 4, 1));
  const thrustDist = STAB_LENGTH * thrustT;
  const tipX = player.x + Math.cos(angle) * thrustDist;
  const tipY = player.y + Math.sin(angle) * thrustDist;

  const baseOffsetX = player.x + Math.cos(angle) * 6;
  const baseOffsetY = player.y + Math.sin(angle) * 6;

  const perpX = -Math.sin(angle);
  const perpY = Math.cos(angle);
  const halfBase = STAB_WIDTH * 0.5;

  const alpha = t < 0.4 ? 1 : 1 - (t - 0.4) / 0.6;

  const p1 = worldToScreen(camera, tipX, tipY);
  const p2 = worldToScreen(camera, baseOffsetX + perpX * halfBase, baseOffsetY + perpY * halfBase);
  const p3 = worldToScreen(camera, baseOffsetX - perpX * halfBase, baseOffsetY - perpY * halfBase);

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.closePath();
  ctx.fillStyle = `rgba(200, 205, 215, ${(alpha * 0.9).toFixed(2)})`;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.closePath();
  ctx.strokeStyle = `rgba(140, 145, 155, ${(alpha * 0.7).toFixed(2)})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}
