import { getDecorDefById } from "../world/decor/defs.js";
import { countItem } from "../items/inventory.js";

const PICKUP_RANGE = 48;
const FACING_DOT_THRESHOLD = 0.3;

export function findPickupableDecor(player, loadedChunks, inventory) {
  let best = null;
  let bestDistSq = Infinity;

  for (let c = 0; c < loadedChunks.length; c += 1) {
    const chunk = loadedChunks[c];
    const decor = chunk.decorNonBlocking;
    if (!decor) {
      continue;
    }
    for (let i = 0; i < decor.length; i += 1) {
      const instance = decor[i];
      const decorDef = getDecorDefById(instance.decorId);
      if (!decorDef.pickup) {
        continue;
      }
      if (decorDef.pickup.requiredTool && countItem(inventory, decorDef.pickup.requiredTool) < 1) {
        continue;
      }

      const dx = instance.x - player.x;
      const dy = instance.y - player.y;
      const distSq = dx * dx + dy * dy;

      if (distSq > PICKUP_RANGE * PICKUP_RANGE) {
        continue;
      }

      const dist = Math.sqrt(distSq);
      if (dist > 0.001) {
        const dirX = dx / dist;
        const dirY = dy / dist;
        const dot = player.facing.x * dirX + player.facing.y * dirY;
        if (dot < FACING_DOT_THRESHOLD) {
          continue;
        }
      }

      if (distSq < bestDistSq) {
        best = { instance, decorDef, chunk };
        bestDistSq = distSq;
      }
    }
  }

  return best;
}

export function removeDecorInstance(chunk, instance) {
  const idx = chunk.decorNonBlocking.indexOf(instance);
  if (idx !== -1) {
    chunk.decorNonBlocking.splice(idx, 1);
  }
}
