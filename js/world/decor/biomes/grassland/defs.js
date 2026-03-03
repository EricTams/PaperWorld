export const GRASSLAND_DECOR_DEFS = Object.freeze([
  {
    id: "grassland-wildflowers",
    biomeId: "grassland",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 12,
      clearance: 1,
    },
    shape: "flower-cluster",
    color: "#f4d35e",
  },
  {
    id: "grassland-clover-patch",
    biomeId: "grassland",
    blocking: false,
    footprint: { kind: "circle", radius: 11 },
    placement: {
      radius: 13,
      clearance: 2,
    },
    shape: "clover-patch",
    color: "#6fbf58",
  },
  {
    id: "grassland-tall-grass",
    biomeId: "grassland",
    blocking: false,
    footprint: { kind: "circle", radius: 9 },
    placement: {
      radius: 12,
      clearance: 2,
    },
    shape: "tall-grass",
    color: "#4f9a42",
  },
  {
    id: "grassland-bush",
    biomeId: "grassland",
    blocking: false,
    footprint: { kind: "circle", radius: 15 },
    placement: {
      radius: 26,
      clearance: 6,
    },
    shape: "bush",
    color: "#4e8e40",
  },
  {
    id: "grassland-stone",
    biomeId: "grassland",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 14,
      clearance: 3,
    },
    shape: "ground-stone",
    color: "#8a8f98",
    pickup: { itemId: "stone", count: 1, label: "Stone" },
  },
  {
    id: "grassland-stick",
    biomeId: "grassland",
    blocking: false,
    footprint: { kind: "circle", radius: 8 },
    placement: {
      radius: 12,
      clearance: 3,
    },
    shape: "ground-stick",
    color: "#8f6b3c",
    pickup: { itemId: "stick", count: 1, label: "Stick" },
  },
  {
    id: "grassland-herb",
    biomeId: "grassland",
    blocking: false,
    footprint: { kind: "circle", radius: 8 },
    placement: {
      radius: 12,
      clearance: 2,
    },
    shape: "ground-herb",
    color: "#4f9a42",
    pickup: { itemId: "herb", count: 1, label: "Herb", requiredTool: "stone-knife" },
  },
]);

const NON_BLOCKING_DECOR_IDS = Object.freeze([
  "grassland-wildflowers",
  "grassland-clover-patch",
  "grassland-tall-grass",
  "grassland-bush",
  "grassland-bush",
  "grassland-stick",
  "grassland-stick",
  "grassland-stone",
  "grassland-herb",
  "grassland-herb",
]);

const BLOCKING_DECOR_IDS = Object.freeze([]);

export const GRASSLAND_DECOR_CONFIG = Object.freeze({
  biomeId: "grassland",
  nonBlockingDecorIds: NON_BLOCKING_DECOR_IDS,
  blockingDecorIds: BLOCKING_DECOR_IDS,
  blockingCellStep: 66,
  blockingMinCount: 0,
});
