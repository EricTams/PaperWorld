export const DECIDUOUS_FOREST_DECOR_DEFS = Object.freeze([
  {
    id: "deciduous-forest-fallen-leaves",
    biomeId: "deciduous-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 11 },
    placement: {
      radius: 13,
      clearance: 1,
    },
    shape: "fallen-leaves",
    color: "#c48a3a",
  },
  {
    id: "deciduous-forest-mushroom-cluster",
    biomeId: "deciduous-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 12,
      clearance: 2,
    },
    shape: "mushroom-cluster",
    color: "#d5c6a5",
  },
  {
    id: "deciduous-forest-fern",
    biomeId: "deciduous-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 12,
      clearance: 1,
    },
    shape: "fern",
    color: "#5a8a42",
  },
  {
    id: "deciduous-forest-bramble",
    biomeId: "deciduous-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 12 },
    placement: {
      radius: 14,
      clearance: 2,
    },
    shape: "bramble",
    color: "#6b7a3e",
  },
  {
    id: "deciduous-forest-broadleaf-tree",
    biomeId: "deciduous-forest",
    blocking: true,
    footprint: { kind: "circle", radius: 20 },
    placement: {
      radius: 28,
      clearance: 6,
    },
    shape: "broadleaf-tree",
    color: "#3d7a34",
  },
  {
    id: "deciduous-forest-shrub",
    biomeId: "deciduous-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 14 },
    placement: {
      radius: 20,
      clearance: 4,
    },
    shape: "shrub",
    color: "#4e7a3b",
  },
  {
    id: "deciduous-forest-hollow-log",
    biomeId: "deciduous-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 16 },
    placement: {
      radius: 24,
      clearance: 5,
    },
    shape: "hollow-log",
    color: "#6d4a31",
  },
]);

const NON_BLOCKING_DECOR_IDS = Object.freeze([
  "deciduous-forest-fallen-leaves",
  "deciduous-forest-fallen-leaves",
  "deciduous-forest-mushroom-cluster",
  "deciduous-forest-fern",
  "deciduous-forest-bramble",
  "deciduous-forest-shrub",
  "deciduous-forest-hollow-log",
]);

const BLOCKING_DECOR_IDS = Object.freeze([
  "deciduous-forest-broadleaf-tree",
  "deciduous-forest-broadleaf-tree",
  "deciduous-forest-broadleaf-tree",
  "deciduous-forest-broadleaf-tree",
]);

export const DECIDUOUS_FOREST_DECOR_CONFIG = Object.freeze({
  biomeId: "deciduous-forest",
  nonBlockingDecorIds: NON_BLOCKING_DECOR_IDS,
  blockingDecorIds: BLOCKING_DECOR_IDS,
  blockingCellStep: 24,
  blockingMinCount: 2,
});
