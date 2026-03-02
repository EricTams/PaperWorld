import { getItemDef } from "../items/item-defs.js";
import { createContainer } from "../items/container.js";

const PLACE_GRID_SIZE = 32;

export function snapToPlaceGrid(worldX, worldY) {
  return {
    x: Math.round(worldX / PLACE_GRID_SIZE) * PLACE_GRID_SIZE,
    y: Math.round(worldY / PLACE_GRID_SIZE) * PLACE_GRID_SIZE,
  };
}

export function createPlacedObjectStore() {
  return { objects: [] };
}

export function addPlacedObject(store, itemId, x, y) {
  const def = getItemDef(itemId);
  const obj = {
    itemId,
    x,
    y,
    radius: def.placeRadius,
  };
  if (def.useAction === "container") {
    obj.container = createContainer();
  }
  store.objects.push(obj);
}

export function getPlacedObjectColliders(store) {
  const colliders = [];
  for (let i = 0; i < store.objects.length; i += 1) {
    const obj = store.objects[i];
    colliders.push({ x: obj.x, y: obj.y, radius: obj.radius });
  }
  return colliders;
}
