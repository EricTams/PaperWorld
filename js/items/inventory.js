import { getItemDef } from "./item-defs.js";

const MAIN_SLOT_COUNT = 27;
const HOTBAR_SLOT_COUNT = 9;
export const PLAYER_SLOT_COUNT = MAIN_SLOT_COUNT + HOTBAR_SLOT_COUNT;
export const HOTBAR_START_INDEX = MAIN_SLOT_COUNT;

export function createInventory(slotCount) {
  const slots = new Array(slotCount);
  for (let i = 0; i < slotCount; i += 1) {
    slots[i] = null;
  }
  return { slots };
}

export function getSlot(inventory, index) {
  return inventory.slots[index];
}

export function addItem(inventory, itemId, count) {
  const def = getItemDef(itemId);
  let remaining = count;

  for (let i = 0; i < inventory.slots.length && remaining > 0; i += 1) {
    const slot = inventory.slots[i];
    if (slot && slot.itemId === itemId && slot.count < def.stackLimit) {
      const space = def.stackLimit - slot.count;
      const transfer = Math.min(space, remaining);
      slot.count += transfer;
      remaining -= transfer;
    }
  }

  for (let i = 0; i < inventory.slots.length && remaining > 0; i += 1) {
    if (inventory.slots[i] === null) {
      const transfer = Math.min(def.stackLimit, remaining);
      inventory.slots[i] = { itemId, count: transfer };
      remaining -= transfer;
    }
  }

  return remaining;
}

export function removeItem(inventory, slotIndex, count) {
  const slot = inventory.slots[slotIndex];
  if (!slot) {
    return 0;
  }
  const removed = Math.min(slot.count, count);
  slot.count -= removed;
  if (slot.count <= 0) {
    inventory.slots[slotIndex] = null;
  }
  return removed;
}

export function swapSlots(inventoryA, indexA, inventoryB, indexB) {
  const temp = inventoryA.slots[indexA];
  inventoryA.slots[indexA] = inventoryB.slots[indexB];
  inventoryB.slots[indexB] = temp;
}

export function countItem(inventory, itemId) {
  let total = 0;
  for (let i = 0; i < inventory.slots.length; i += 1) {
    const slot = inventory.slots[i];
    if (slot && slot.itemId === itemId) {
      total += slot.count;
    }
  }
  return total;
}

export function removeItemById(inventory, itemId, count) {
  let remaining = count;
  for (let i = 0; i < inventory.slots.length && remaining > 0; i += 1) {
    const slot = inventory.slots[i];
    if (slot && slot.itemId === itemId) {
      const take = Math.min(slot.count, remaining);
      slot.count -= take;
      remaining -= take;
      if (slot.count <= 0) {
        inventory.slots[i] = null;
      }
    }
  }
  return count - remaining;
}

export function canAddItem(inventory, itemId, count) {
  const def = getItemDef(itemId);
  let remaining = count;

  for (let i = 0; i < inventory.slots.length && remaining > 0; i += 1) {
    const slot = inventory.slots[i];
    if (slot && slot.itemId === itemId && slot.count < def.stackLimit) {
      remaining -= def.stackLimit - slot.count;
    }
  }

  for (let i = 0; i < inventory.slots.length && remaining > 0; i += 1) {
    if (inventory.slots[i] === null) {
      remaining -= def.stackLimit;
    }
  }

  return remaining <= 0;
}
