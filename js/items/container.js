import { createInventory } from "./inventory.js";

const CONTAINER_SLOT_COUNT = 27;

export function createContainer() {
  return {
    inventory: createInventory(CONTAINER_SLOT_COUNT),
  };
}
