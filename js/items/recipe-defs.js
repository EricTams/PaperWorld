export const POCKET_RECIPES = Object.freeze([
  {
    id: "mortar-and-pestle",
    name: "Mortar and Pestle",
    ingredients: [{ itemId: "stone", count: 2 }],
    output: { itemId: "mortar-and-pestle", count: 1 },
  },
  {
    id: "drying-rack",
    name: "Drying Rack",
    ingredients: [{ itemId: "stick", count: 4 }],
    output: { itemId: "drying-rack", count: 1 },
  },
  {
    id: "wicker-chest",
    name: "Wicker Chest",
    ingredients: [{ itemId: "stick", count: 6 }],
    output: { itemId: "wicker-chest", count: 1 },
  },
  {
    id: "campfire",
    name: "Campfire",
    ingredients: [
      { itemId: "stick", count: 3 },
      { itemId: "stone", count: 2 },
    ],
    output: { itemId: "campfire", count: 1 },
  },
  {
    id: "grimoire",
    name: "Grimoire",
    ingredients: [
      { itemId: "paper", count: 4 },
      { itemId: "stick", count: 2 },
    ],
    output: { itemId: "grimoire", count: 1 },
  },
]);

export const MORTAR_RECIPES = Object.freeze([
  {
    id: "wood-pulp",
    name: "Wood Pulp",
    ingredients: [{ itemId: "stick", count: 1 }],
    output: { itemId: "wood-pulp", count: 1 },
  },
  {
    id: "stone-powder",
    name: "Stone Powder",
    ingredients: [{ itemId: "stone", count: 1 }],
    output: { itemId: "stone-powder", count: 1 },
  },
  {
    id: "herb-powder",
    name: "Herb Powder",
    ingredients: [{ itemId: "dried-herbs", count: 1 }],
    output: { itemId: "herb-powder", count: 1 },
  },
]);

export const DRYING_RACK_RECIPES = Object.freeze([
  {
    id: "paper",
    name: "Paper",
    ingredients: [{ itemId: "wood-pulp", count: 1 }],
    output: { itemId: "paper", count: 1 },
  },
  {
    id: "dried-herbs",
    name: "Dried Herbs",
    ingredients: [{ itemId: "herb", count: 1 }],
    output: { itemId: "dried-herbs", count: 1 },
  },
]);

export const GRIMOIRE_RECIPES = Object.freeze([
  {
    id: "magic-circle",
    name: "Magic Circle",
    ingredients: [{ itemId: "stone-powder", count: 4 }],
    output: { itemId: "magic-circle", count: 1 },
  },
]);

export const MAGIC_CIRCLE_RECIPES = Object.freeze([
  {
    id: "stone-knife",
    name: "Stone Knife",
    ingredients: [
      { itemId: "stone", count: 2 },
      { itemId: "stone-powder", count: 1 },
    ],
    output: { itemId: "stone-knife", count: 1 },
  },
  {
    id: "cauldron",
    name: "Cauldron",
    ingredients: [
      { itemId: "stone", count: 4 },
      { itemId: "stick", count: 2 },
      { itemId: "stone-powder", count: 2 },
    ],
    output: { itemId: "cauldron", count: 1 },
  },
]);

export const CAMPFIRE_RECIPES = Object.freeze([]);

export const CAULDRON_RECIPES = Object.freeze([
  {
    id: "healing-potion",
    name: "Healing Potion",
    ingredients: [{ itemId: "herb", count: 2 }],
    output: { itemId: "healing-potion", count: 1 },
  },
  {
    id: "fortitude-potion",
    name: "Fortitude Potion",
    ingredients: [
      { itemId: "dried-herbs", count: 1 },
      { itemId: "herb", count: 1 },
    ],
    output: { itemId: "fortitude-potion", count: 1 },
  },
  {
    id: "explosion-potion",
    name: "Explosion Potion",
    ingredients: [
      { itemId: "herb-powder", count: 1 },
      { itemId: "stone-powder", count: 1 },
    ],
    output: { itemId: "explosion-potion", count: 1 },
  },
]);

const recipeById = buildRecipeById(POCKET_RECIPES);

export function getRecipeById(recipeId) {
  const recipe = recipeById.get(recipeId);
  if (!recipe) {
    throw new Error(`Unknown recipe "${recipeId}".`);
  }
  return recipe;
}

function buildRecipeById(recipes) {
  const map = new Map();
  for (let i = 0; i < recipes.length; i += 1) {
    map.set(recipes[i].id, recipes[i]);
  }
  return map;
}
