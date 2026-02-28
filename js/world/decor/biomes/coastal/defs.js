export const COASTAL_DECOR_DEFS = Object.freeze([
  {
    id: "coastal-seaweed",
    biomeId: "coastal",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 12,
      clearance: 1,
    },
    shape: "seaweed",
    color: "#3a6b4a",
  },
  {
    id: "coastal-foam-patch",
    biomeId: "coastal",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 13,
      clearance: 2,
    },
    shape: "foam-patch",
    color: "#e8eff4",
  },
  {
    id: "coastal-dune-grass",
    biomeId: "coastal",
    blocking: false,
    footprint: { kind: "circle", radius: 9 },
    placement: {
      radius: 12,
      clearance: 2,
    },
    shape: "dune-grass",
    color: "#8aaa6a",
  },
  {
    id: "coastal-driftwood",
    biomeId: "coastal",
    blocking: false,
    footprint: { kind: "circle", radius: 13 },
    placement: {
      radius: 20,
      clearance: 4,
    },
    shape: "driftwood",
    color: "#9a8060",
  },
  {
    id: "coastal-shrub",
    biomeId: "coastal",
    blocking: false,
    footprint: { kind: "circle", radius: 14 },
    placement: {
      radius: 24,
      clearance: 5,
    },
    shape: "shrub",
    color: "#5a7a50",
  },
  {
    id: "coastal-sea-rock",
    biomeId: "coastal",
    blocking: true,
    footprint: { kind: "circle", radius: 30 },
    placement: {
      radius: 50,
      clearance: 20,
    },
    shape: "sea-rock",
    color: "#5a6872",
  },
]);

const WATER_NON_BLOCKING_IDS = Object.freeze([
  "coastal-seaweed",
  "coastal-seaweed",
  "coastal-seaweed",
  "coastal-foam-patch",
  "coastal-foam-patch",
]);

const SAND_NON_BLOCKING_IDS = Object.freeze([
  "coastal-dune-grass",
  "coastal-dune-grass",
  "coastal-dune-grass",
  "coastal-driftwood",
  "coastal-driftwood",
  "coastal-shrub",
]);

const BLOCKING_IDS = Object.freeze([
  "coastal-sea-rock",
]);

export const COASTAL_WATER_DECOR_CONFIG = Object.freeze({
  biomeId: "coastal",
  cellVariant: "underlay",
  nonBlockingDecorIds: WATER_NON_BLOCKING_IDS,
  blockingDecorIds: [],
  blockingCellStep: 70,
  blockingMinCount: 0,
});

export const COASTAL_SAND_DECOR_CONFIG = Object.freeze({
  biomeId: "coastal",
  cellVariant: "base",
  nonBlockingDecorIds: SAND_NON_BLOCKING_IDS,
  blockingDecorIds: [],
  blockingCellStep: 70,
  blockingMinCount: 0,
});

export const COASTAL_BLOCKING_DECOR_CONFIG = Object.freeze({
  biomeId: "coastal",
  nonBlockingDecorIds: [],
  blockingDecorIds: BLOCKING_IDS,
  blockingCellStep: 70,
  blockingMinCount: 1,
});
