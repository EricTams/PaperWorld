export const CONIFER_FOREST_DECOR_DEFS = Object.freeze([
  {
    id: "conifer-forest-fern",
    biomeId: "conifer-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 12,
      clearance: 1,
    },
    shape: "fern",
    color: "#5f8b47",
  },
  {
    id: "conifer-forest-moss",
    biomeId: "conifer-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 11 },
    placement: {
      radius: 12,
      clearance: 1,
    },
    shape: "moss-patch",
    color: "#3f7043",
  },
  {
    id: "conifer-forest-mushroom-ring",
    biomeId: "conifer-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 12,
      clearance: 2,
    },
    shape: "mushroom-ring",
    color: "#d5c6a5",
  },
  {
    id: "conifer-forest-pine-tree",
    biomeId: "conifer-forest",
    blocking: true,
    footprint: { kind: "circle", radius: 18 },
    placement: {
      radius: 24,
      clearance: 5,
    },
    shape: "pine-tree",
    color: "#2b5a33",
  },
  {
    id: "conifer-forest-fallen-log",
    biomeId: "conifer-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 14 },
    placement: {
      radius: 22,
      clearance: 5,
    },
    shape: "fallen-log",
    color: "#6d4a31",
    pickup: { itemId: "stick", count: 2, label: "Wood" },
  },
  {
    id: "conifer-forest-stump",
    biomeId: "conifer-forest",
    blocking: false,
    footprint: { kind: "circle", radius: 12 },
    placement: {
      radius: 18,
      clearance: 3,
    },
    shape: "stump",
    color: "#7f5738",
    pickup: { itemId: "stick", count: 1, label: "Wood" },
  },
  {
    id: "conifer-forest-boulder",
    biomeId: "conifer-forest",
    blocking: true,
    footprint: { kind: "circle", radius: 26 },
    placement: {
      radius: 40,
      clearance: 12,
    },
    shape: "boulder",
    color: "#707b84",
  },
]);

const NON_BLOCKING_DECOR_IDS = Object.freeze([
  "conifer-forest-fern",
  "conifer-forest-moss",
  "conifer-forest-mushroom-ring",
  "conifer-forest-fallen-log",
  "conifer-forest-stump",
]);

const BLOCKING_DECOR_IDS = Object.freeze([
  "conifer-forest-pine-tree",
  "conifer-forest-pine-tree",
  "conifer-forest-pine-tree",
  "conifer-forest-pine-tree",
  "conifer-forest-boulder",
]);

export const CONIFER_FOREST_DECOR_CONFIG = Object.freeze({
  biomeId: "conifer-forest",
  nonBlockingDecorIds: NON_BLOCKING_DECOR_IDS,
  blockingDecorIds: BLOCKING_DECOR_IDS,
  blockingCellStep: 22,
  blockingMinCount: 2,
});
