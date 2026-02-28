export function createPlayer(startX, startY) {
  return {
    x: startX,
    y: startY,
    size: 36,
    collisionRadius: 14,
    speed: 132,
    facing: { x: 1, y: 0 },
  };
}

export function updatePlayerMovement(player, inputAxis, dtSeconds) {
  const move = normalizeAxis(inputAxis);
  player.x += move.x * player.speed * dtSeconds;
  player.y += move.y * player.speed * dtSeconds;
  updateFacing(player, move);
}

export function drawPlayer(ctx, camera, player, worldToScreen, worldLengthToScreen) {
  const half = player.size * 0.5;
  const topLeft = worldToScreen(camera, player.x - half, player.y - half);
  const size = worldLengthToScreen(camera, player.size);
  ctx.fillStyle = "#d64545";
  ctx.fillRect(topLeft.x, topLeft.y, size, size);
}

export function clampPlayerToBounds(player, bounds) {
  const radius = player.collisionRadius;
  player.x = clamp(player.x, bounds.minX + radius, bounds.maxX - radius);
  player.y = clamp(player.y, bounds.minY + radius, bounds.maxY - radius);
}

function normalizeAxis(axis) {
  const length = Math.hypot(axis.x, axis.y);
  if (length === 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: axis.x / length,
    y: axis.y / length,
  };
}

function updateFacing(player, moveAxis) {
  if (moveAxis.x === 0 && moveAxis.y === 0) {
    return;
  }

  player.facing = moveAxis;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
