const ITEM_DEFS = Object.freeze([
  {
    id: "stick",
    name: "Stick",
    stackLimit: 64,
    shape: "stick",
    color: "#8f6b3c",
    patternId: "cut-wood",
  },
  {
    id: "stone",
    name: "Stone",
    stackLimit: 64,
    shape: "stone",
    color: "#8a8f98",
    patternId: "rough-stone",
  },
  {
    id: "herb",
    name: "Herb",
    stackLimit: 64,
    shape: "herb",
    color: "#4f9a42",
    patternId: "leaves",
  },
  {
    id: "wood-pulp",
    name: "Wood Pulp",
    stackLimit: 64,
    shape: "wood-pulp",
    color: "#b09a6a",
    patternId: "cut-wood",
  },
  {
    id: "stone-powder",
    name: "Stone Powder",
    stackLimit: 64,
    shape: "stone-powder",
    color: "#a0a4ac",
    patternId: "rough-stone",
  },
  {
    id: "paper",
    name: "Paper",
    stackLimit: 64,
    shape: "paper",
    color: "#e8dfc8",
    patternId: "cut-wood",
  },
  {
    id: "grimoire",
    name: "Grimoire",
    stackLimit: 1,
    shape: "grimoire",
    color: "#5c3a6e",
    patternId: "leaves",
  },
  {
    id: "magic-circle",
    name: "Magic Circle",
    stackLimit: 1,
    shape: "magic-circle",
    color: "#a0a4ac",
    patternId: "rough-stone",
    placeable: true,
    placeRadius: 22,
    interactable: true,
    useAction: "station-magic-circle",
  },
  {
    id: "mortar-and-pestle",
    name: "Mortar and Pestle",
    stackLimit: 1,
    shape: "mortar-and-pestle",
    color: "#7a7e86",
    patternId: "rough-stone",
    placeable: true,
    placeRadius: 14,
    interactable: true,
    useAction: "station-mortar",
  },
  {
    id: "drying-rack",
    name: "Drying Rack",
    stackLimit: 1,
    shape: "drying-rack",
    color: "#9e7c4e",
    patternId: "cut-wood",
    placeable: true,
    placeRadius: 16,
    interactable: true,
    useAction: "station-drying-rack",
  },
  {
    id: "wicker-chest",
    name: "Wicker Chest",
    stackLimit: 1,
    shape: "wicker-chest",
    color: "#b08945",
    patternId: "cut-wood",
    placeable: true,
    placeRadius: 18,
    interactable: true,
    useAction: "container",
  },
  {
    id: "campfire",
    name: "Campfire",
    stackLimit: 1,
    shape: "campfire",
    color: "#8f6b3c",
    patternId: "cut-wood",
    placeable: true,
    placeRadius: 20,
    interactable: true,
    useAction: "station-campfire",
  },
  {
    id: "stone-knife",
    name: "Stone Knife",
    stackLimit: 1,
    shape: "stone-knife",
    color: "#7a7e86",
    patternId: "rough-stone",
    weapon: true,
    damage: 2,
    attackRange: 38,
    attackShape: "stab",
  },
  {
    id: "dried-herbs",
    name: "Dried Herbs",
    stackLimit: 64,
    shape: "dried-herbs",
    color: "#8a7a3a",
    patternId: "leaves",
  },
  {
    id: "herb-powder",
    name: "Herb Powder",
    stackLimit: 64,
    shape: "herb-powder",
    color: "#5a7a3a",
    patternId: "leaves",
  },
  {
    id: "cauldron",
    name: "Cauldron",
    stackLimit: 1,
    shape: "cauldron",
    color: "#5a5e66",
    patternId: "rough-stone",
    placeable: true,
    placeRadius: 20,
    interactable: true,
    useAction: "station-cauldron",
  },
  {
    id: "healing-potion",
    name: "Healing Potion",
    stackLimit: 16,
    shape: "potion-flask",
    color: "#4aaf5a",
    patternId: "leaves",
  },
  {
    id: "fortitude-potion",
    name: "Fortitude Potion",
    stackLimit: 16,
    shape: "potion-flask",
    color: "#c8a832",
    patternId: "leaves",
  },
  {
    id: "explosion-potion",
    name: "Explosion Potion",
    stackLimit: 16,
    shape: "potion-flask",
    color: "#c85a32",
    patternId: "rough-stone",
  },
]);

const itemById = buildItemById(ITEM_DEFS);

export function getItemDef(itemId) {
  const def = itemById.get(itemId);
  if (!def) {
    throw new Error(`Unknown item definition "${itemId}".`);
  }
  return def;
}

export function getAllItemDefs() {
  return ITEM_DEFS;
}

function buildItemById(defs) {
  const map = new Map();
  for (let i = 0; i < defs.length; i += 1) {
    const def = defs[i];
    if (map.has(def.id)) {
      throw new Error(`Duplicate item id "${def.id}".`);
    }
    map.set(def.id, def);
  }
  return map;
}
