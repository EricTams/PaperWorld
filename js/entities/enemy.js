import { createAnimationState, updateAnimation, getCurrentFrame } from "../render/sprite/animation-state.js";
import { ENEMY_TYPES } from "../render/sprite/enemy-animation-defs.js";
import { drawSprite } from "../render/sprite/sprite-renderer.js";
import { separateFromColliders } from "../sim/collision.js";

const IDLE_DURATION = 2;
const MOVE_DURATION = 1;
const ENEMY_MAX_HP = 3;
const FLASH_DURATION = 0.15;

export function createEnemy(typeName, x, y) {
  const def = ENEMY_TYPES[typeName];
  return {
    typeName,
    x,
    y,
    size: def.size,
    collisionRadius: def.collisionRadius,
    speed: def.speed,
    age: 0,
    anim: createAnimationState(),
    behavior: {
      phase: "idle",
      timer: IDLE_DURATION,
      moveDir: { x: 0, y: 0 },
    },
    hp: ENEMY_MAX_HP,
    flashTimer: 0,
    dead: false,
  };
}

export function updateEnemy(enemy, dtSeconds, colliders) {
  const def = ENEMY_TYPES[enemy.typeName];
  const beh = enemy.behavior;

  enemy.age += dtSeconds;
  beh.timer -= dtSeconds;

  if (beh.phase === "idle" && beh.timer <= 0) {
    beh.phase = "move";
    beh.timer = MOVE_DURATION;
    const angle = Math.random() * Math.PI * 2;
    beh.moveDir.x = Math.cos(angle);
    beh.moveDir.y = Math.sin(angle);
  } else if (beh.phase === "move" && beh.timer <= 0) {
    beh.phase = "idle";
    beh.timer = IDLE_DURATION;
    beh.moveDir.x = 0;
    beh.moveDir.y = 0;
  }

  if (beh.phase === "move") {
    enemy.x += beh.moveDir.x * enemy.speed * dtSeconds;
    enemy.y += beh.moveDir.y * enemy.speed * dtSeconds;
    const resolved = separateFromColliders(enemy, enemy.collisionRadius, colliders);
    enemy.x = resolved.x;
    enemy.y = resolved.y;
  }

  if (enemy.flashTimer > 0) {
    enemy.flashTimer -= dtSeconds;
    if (enemy.flashTimer < 0) {
      enemy.flashTimer = 0;
    }
  }

  const animName = beh.phase === "move" ? "walk" : "idle";
  updateAnimation(enemy.anim, animName, dtSeconds, def.animations);
}

export function damageEnemy(enemy, amount) {
  enemy.hp -= amount;
  enemy.flashTimer = FLASH_DURATION;
  if (enemy.hp <= 0) {
    enemy.hp = 0;
    enemy.dead = true;
  }
}

export function drawEnemy(ctx, camera, enemy, worldToScreen, worldLengthToScreen, atlas) {
  const def = ENEMY_TYPES[enemy.typeName];
  const worldSize = enemy.size;
  const flashing = enemy.flashTimer > 0;

  if (atlas) {
    const frameName = getCurrentFrame(enemy.anim, def.animations);
    const region = frameName ? atlas.frames.get(frameName) : null;
    if (region) {
      const aspect = region.width / region.height;
      const drawW = worldSize;
      const drawH = worldSize / aspect;
      const halfW = drawW * 0.5;
      const halfH = drawH * 0.5;
      const topLeft = worldToScreen(camera, enemy.x - halfW, enemy.y - halfH);
      const screenW = worldLengthToScreen(camera, drawW);
      const screenH = worldLengthToScreen(camera, drawH);
      const beh = enemy.behavior;
      const flipX = beh.phase === "move" ? beh.moveDir.x > 0 : true;
      if (drawSprite(ctx, atlas, frameName, topLeft.x, topLeft.y, screenW, screenH, flipX)) {
        if (flashing) {
          drawFlashOverlay(ctx, topLeft.x, topLeft.y, screenW, screenH);
        }
        return;
      }
    }
  }

  const half = worldSize * 0.5;
  const topLeft = worldToScreen(camera, enemy.x - half, enemy.y - half);
  const size = worldLengthToScreen(camera, worldSize);
  ctx.fillStyle = flashing ? "#ffffff" : "#6ab04c";
  ctx.fillRect(topLeft.x, topLeft.y, size, size);
}

function drawFlashOverlay(ctx, x, y, w, h) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillRect(x, y, w, h);
}
