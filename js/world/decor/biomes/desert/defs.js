export const DESERT_DECOR_DEFS = Object.freeze([
  {
    id: "desert-sand-dune",
    biomeId: "desert",
    blocking: false,
    footprint: { kind: "circle", radius: 12 },
    placement: {
      radius: 14,
      clearance: 2,
    },
    shape: "sand-dune",
    color: "#d4b872",
  },
  {
    id: "desert-dry-grass",
    biomeId: "desert",
    blocking: false,
    footprint: { kind: "circle", radius: 8 },
    placement: {
      radius: 10,
      clearance: 1,
    },
    shape: "dry-grass",
    color: "#bfa858",
  },
  {
    id: "desert-cracked-earth",
    biomeId: "desert",
    blocking: false,
    footprint: { kind: "circle", radius: 11 },
    placement: {
      radius: 13,
      clearance: 1,
    },
    shape: "cracked-earth",
    color: "#c4a65a",
  },
  {
    id: "desert-thorn-bush",
    biomeId: "desert",
    blocking: false,
    footprint: { kind: "circle", radius: 13 },
    placement: {
      radius: 22,
      clearance: 5,
    },
    shape: "thorn-bush",
    color: "#8a7d3a",
  },
  {
    id: "desert-cactus",
    biomeId: "desert",
    blocking: true,
    footprint: { kind: "circle", radius: 16 },
    placement: {
      radius: 28,
      clearance: 12,
    },
    shape: "cactus",
    color: "#5a8a4a",
  },
  {
    id: "desert-boulder",
    biomeId: "desert",
    blocking: true,
    footprint: { kind: "circle", radius: 30 },
    placement: {
      radius: 50,
      clearance: 20,
    },
    shape: "boulder",
    color: "#a09080",
  },
  {
    id: "desert-dead-tree",
    biomeId: "desert",
    blocking: true,
    footprint: { kind: "circle", radius: 18 },
    placement: {
      radius: 30,
      clearance: 12,
    },
    shape: "dead-tree",
    color: "#7a6040",
  },
]);

const NON_BLOCKING_DECOR_IDS = Object.freeze([
  "desert-sand-dune",
  "desert-sand-dune",
  "desert-dry-grass",
  "desert-dry-grass",
  "desert-cracked-earth",
  "desert-thorn-bush",
]);

const BLOCKING_DECOR_IDS = Object.freeze([
  "desert-cactus",
  "desert-cactus",
  "desert-cactus",
  "desert-boulder",
  "desert-boulder",
  "desert-dead-tree",
]);

export const DESERT_DECOR_CONFIG = Object.freeze({
  biomeId: "desert",
  nonBlockingDecorIds: NON_BLOCKING_DECOR_IDS,
  blockingDecorIds: BLOCKING_DECOR_IDS,
  blockingCellStep: 90,
  blockingMinCount: 1,
});
