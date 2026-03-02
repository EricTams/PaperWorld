import { countItem, removeItemById, addItem, canAddItem } from "./inventory.js";

export function canCraft(inventory, recipe) {
  for (let i = 0; i < recipe.ingredients.length; i += 1) {
    const ingredient = recipe.ingredients[i];
    if (countItem(inventory, ingredient.itemId) < ingredient.count) {
      return false;
    }
  }
  return canAddItem(inventory, recipe.output.itemId, recipe.output.count);
}

export function doCraft(inventory, recipe) {
  if (!canCraft(inventory, recipe)) {
    return false;
  }
  for (let i = 0; i < recipe.ingredients.length; i += 1) {
    const ingredient = recipe.ingredients[i];
    removeItemById(inventory, ingredient.itemId, ingredient.count);
  }
  addItem(inventory, recipe.output.itemId, recipe.output.count);
  return true;
}
