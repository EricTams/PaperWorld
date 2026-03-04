import { damageEnemy } from "../entities/enemy.js";

const ATTACK_ARC_HALF = Math.PI / 3;

export function resolveAttackHits(player, enemies) {
  const atk = player.attack;
  if (!atk.active || atk.hitApplied) {
    return;
  }

  atk.hitApplied = true;

  const dirAngle = Math.atan2(atk.direction.y, atk.direction.x);

  for (const enemy of enemies) {
    if (enemy.dead) {
      continue;
    }
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const dist = Math.hypot(dx, dy);

    if (dist > atk.range + enemy.collisionRadius) {
      continue;
    }

    const angleToEnemy = Math.atan2(dy, dx);
    let angleDiff = angleToEnemy - dirAngle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    if (Math.abs(angleDiff) <= ATTACK_ARC_HALF) {
      damageEnemy(enemy, atk.damage);
    }
  }
}
