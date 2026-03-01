import { createAnimationState, updateAnimation, getCurrentFrame } from "../render/sprite/animation-state.js";
import { PLAYER_ANIMATIONS } from "../render/sprite/animation-defs.js";
import { drawSprite } from "../render/sprite/sprite-renderer.js";

export function createPlayer(startX, startY) {
  return {
    x: startX,
    y: startY,
    size: 36,
    collisionRadius: 14,
    speed: 132,
    facing: { x: 1, y: 0 },
    anim: createAnimationState(),
  };
}

export function updatePlayerMovement(player, inputAxis, dtSeconds) {
  const move = normalizeAxis(inputAxis);
  player.x += move.x * player.speed * dtSeconds;
  player.y += move.y * player.speed * dtSeconds;
  updateFacing(player, move);
}

export function updatePlayerAnimation(player, inputAxis, dtSeconds) {
  const animName = resolvePlayerAnimation(inputAxis);
  player.anim.flipX = player.facing.x < 0;
  updateAnimation(player.anim, animName, dtSeconds, PLAYER_ANIMATIONS);
}

export function drawPlayer(ctx, camera, player, worldToScreen, worldLengthToScreen, atlas) {
  const worldSize = player.size;

  if (atlas) {
    const frameName = getCurrentFrame(player.anim, PLAYER_ANIMATIONS);
    const region = frameName ? atlas.frames.get(frameName) : null;
    if (region) {
      const aspect = region.width / region.height;
      const drawW = worldSize;
      const drawH = worldSize / aspect;
      const halfW = drawW * 0.5;
      const halfH = drawH * 0.5;
      const topLeft = worldToScreen(camera, player.x - halfW, player.y - halfH);
      const screenW = worldLengthToScreen(camera, drawW);
      const screenH = worldLengthToScreen(camera, drawH);
      if (drawSprite(ctx, atlas, frameName, topLeft.x, topLeft.y, screenW, screenH, player.anim.flipX)) {
        return;
      }
    }
  }

  const half = worldSize * 0.5;
  const topLeft = worldToScreen(camera, player.x - half, player.y - half);
  const size = worldLengthToScreen(camera, worldSize);
  ctx.fillStyle = "#d64545";
  ctx.fillRect(topLeft.x, topLeft.y, size, size);
}

function resolvePlayerAnimation(inputAxis) {
  if (inputAxis.x !== 0 || inputAxis.y !== 0) {
    return "walk";
  }
  return "idle";
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
