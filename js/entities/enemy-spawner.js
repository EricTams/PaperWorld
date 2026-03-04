import { ENEMY_TYPE_NAMES, ENEMY_TYPES } from "../render/sprite/enemy-animation-defs.js";
import { getVisibleWorldBounds } from "../render/camera.js";
import { collectBlockingCircleColliders, isCollidingAt } from "../sim/collision.js";
import { createEnemy, updateEnemy, drawEnemy } from "./enemy.js";

const MAX_ENEMIES = 2;
const SPAWN_COOLDOWN = 2;
const SPAWN_BAND_MIN = 50;
const SPAWN_BAND_MAX = 200;
const DESPAWN_DISTANCE = 400;
const POOF_DURATION = 0.3;

export function createEnemySpawner() {
  return {
    enemies: [],
    spawnTimer: 0,
    poofs: [],
  };
}

export function updateEnemySpawner(spawner, camera, player, loadedChunks, dtSeconds) {
  const bounds = getVisibleWorldBounds(camera);
  const colliders = collectBlockingCircleColliders(loadedChunks);

  despawnFarAway(spawner, bounds);

  spawner.spawnTimer -= dtSeconds;
  if (spawner.spawnTimer <= 0) {
    spawner.spawnTimer = SPAWN_COOLDOWN;
    if (spawner.enemies.length < MAX_ENEMIES) {
      const typeName = ENEMY_TYPE_NAMES[Math.floor(Math.random() * ENEMY_TYPE_NAMES.length)];
      const radius = ENEMY_TYPES[typeName].collisionRadius;
      const pos = pickSpawnInBand(bounds, colliders, radius);
      if (pos) {
        spawner.enemies.push(createEnemy(typeName, pos.x, pos.y));
      }
    }
  }

  for (const enemy of spawner.enemies) {
    updateEnemy(enemy, dtSeconds, colliders);
  }

  collectDeadEnemies(spawner);
  updatePoofs(spawner, dtSeconds);
}

export function drawEnemies(ctx, camera, spawner, worldToScreen, worldLengthToScreen, atlas) {
  for (const enemy of spawner.enemies) {
    drawEnemy(ctx, camera, enemy, worldToScreen, worldLengthToScreen, atlas);
  }
  drawPoofs(ctx, camera, spawner, worldToScreen, worldLengthToScreen);
}

function despawnFarAway(spawner, bounds) {
  spawner.enemies = spawner.enemies.filter((e) =>
    e.x > bounds.minX - DESPAWN_DISTANCE &&
    e.x < bounds.maxX + DESPAWN_DISTANCE &&
    e.y > bounds.minY - DESPAWN_DISTANCE &&
    e.y < bounds.maxY + DESPAWN_DISTANCE
  );
}

function pickSpawnInBand(bounds, colliders, radius) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const pos = randomBandPosition(bounds);
    if (!isCollidingAt(pos.x, pos.y, radius, colliders)) {
      return pos;
    }
  }
  return null;
}

function randomBandPosition(bounds) {
  const edge = Math.floor(Math.random() * 4);
  const bandOffset = SPAWN_BAND_MIN + Math.random() * (SPAWN_BAND_MAX - SPAWN_BAND_MIN);

  switch (edge) {
    case 0:
      return { x: lerp(bounds.minX, bounds.maxX), y: bounds.minY - bandOffset };
    case 1:
      return { x: lerp(bounds.minX, bounds.maxX), y: bounds.maxY + bandOffset };
    case 2:
      return { x: bounds.minX - bandOffset, y: lerp(bounds.minY, bounds.maxY) };
    default:
      return { x: bounds.maxX + bandOffset, y: lerp(bounds.minY, bounds.maxY) };
  }
}

function collectDeadEnemies(spawner) {
  for (let i = spawner.enemies.length - 1; i >= 0; i--) {
    const enemy = spawner.enemies[i];
    if (enemy.dead) {
      spawner.poofs.push({ x: enemy.x, y: enemy.y, timer: POOF_DURATION });
      spawner.enemies.splice(i, 1);
    }
  }
}

function updatePoofs(spawner, dtSeconds) {
  for (let i = spawner.poofs.length - 1; i >= 0; i--) {
    spawner.poofs[i].timer -= dtSeconds;
    if (spawner.poofs[i].timer <= 0) {
      spawner.poofs.splice(i, 1);
    }
  }
}

function drawPoofs(ctx, camera, spawner, worldToScreen, worldLengthToScreen) {
  for (const poof of spawner.poofs) {
    const progress = 1 - poof.timer / POOF_DURATION;
    const worldRadius = 10 + progress * 16;
    const alpha = 1 - progress;
    const center = worldToScreen(camera, poof.x, poof.y);
    const screenRadius = worldLengthToScreen(camera, worldRadius);

    ctx.beginPath();
    ctx.arc(center.x, center.y, screenRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.6).toFixed(2)})`;
    ctx.fill();

    const innerRadius = screenRadius * 0.5;
    ctx.beginPath();
    ctx.arc(center.x, center.y, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 220, 200, ${(alpha * 0.4).toFixed(2)})`;
    ctx.fill();
  }
}

function lerp(min, max) {
  return min + Math.random() * (max - min);
}
