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
    id: "grassland-boulder",
    biomeId: "grassland",
    blocking: true,
    footprint: { kind: "circle", radius: 32 },
    placement: {
      radius: 54,
      clearance: 22,
    },
    shape: "boulder",
    color: "#8a8f98",
  },
  {
    id: "grassland-stump",
    biomeId: "grassland",
    blocking: false,
    footprint: { kind: "circle", radius: 12 },
    placement: {
      radius: 16,
      clearance: 4,
    },
    shape: "stump",
    color: "#8f5e3c",
  },
]);

const NON_BLOCKING_DECOR_IDS = Object.freeze([
  "grassland-wildflowers",
  "grassland-clover-patch",
  "grassland-tall-grass",
  "grassland-bush",
  "grassland-bush",
  "grassland-stump",
  "grassland-stump",
]);

const BLOCKING_DECOR_IDS = Object.freeze([
  "grassland-boulder",
]);

export const GRASSLAND_DECOR_CONFIG = Object.freeze({
  biomeId: "grassland",
  nonBlockingDecorIds: NON_BLOCKING_DECOR_IDS,
  blockingDecorIds: BLOCKING_DECOR_IDS,
  blockingCellStep: 66,
  blockingMinCount: 1,
});
