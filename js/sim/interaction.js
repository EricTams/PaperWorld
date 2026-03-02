import { getItemDef } from "../items/item-defs.js";

const INTERACTION_RANGE = 48;
const FACING_DOT_THRESHOLD = 0.3;

export function findHoveredObject(mouseWorldX, mouseWorldY, placedObjects) {
  let closest = null;
  let closestDistSq = Infinity;

  for (let i = 0; i < placedObjects.objects.length; i += 1) {
    const obj = placedObjects.objects[i];
    const def = getItemDef(obj.itemId);
    if (!def.interactable) {
      continue;
    }
    const dx = mouseWorldX - obj.x;
    const dy = mouseWorldY - obj.y;
    const distSq = dx * dx + dy * dy;
    if (distSq < obj.radius * obj.radius && distSq < closestDistSq) {
      closest = obj;
      closestDistSq = distSq;
    }
  }

  return closest;
}

export function findInteractableObject(player, placedObjects) {
  let best = null;
  let bestDistSq = Infinity;

  for (let i = 0; i < placedObjects.objects.length; i += 1) {
    const obj = placedObjects.objects[i];
    const def = getItemDef(obj.itemId);
    if (!def.interactable) {
      continue;
    }

    const dx = obj.x - player.x;
    const dy = obj.y - player.y;
    const distSq = dx * dx + dy * dy;

    if (distSq > INTERACTION_RANGE * INTERACTION_RANGE) {
      continue;
    }

    const dist = Math.sqrt(distSq);
    if (dist < 0.001) {
      if (distSq < bestDistSq) {
        best = obj;
        bestDistSq = distSq;
      }
      continue;
    }

    const dirX = dx / dist;
    const dirY = dy / dist;
    const dot = player.facing.x * dirX + player.facing.y * dirY;

    if (dot < FACING_DOT_THRESHOLD) {
      continue;
    }

    if (distSq < bestDistSq) {
      best = obj;
      bestDistSq = distSq;
    }
  }

  return best;
}
