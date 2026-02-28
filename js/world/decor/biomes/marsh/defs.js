export const MARSH_DECOR_DEFS = Object.freeze([
  {
    id: "marsh-reeds",
    biomeId: "marsh",
    blocking: false,
    footprint: { kind: "circle", radius: 9 },
    placement: {
      radius: 11,
      clearance: 1,
    },
    shape: "reeds",
    color: "#5a6b42",
  },
  {
    id: "marsh-lily-pads",
    biomeId: "marsh",
    blocking: false,
    footprint: { kind: "circle", radius: 11 },
    placement: {
      radius: 13,
      clearance: 1,
    },
    shape: "lily-pads",
    color: "#3f5a3a",
  },
  {
    id: "marsh-cattails",
    biomeId: "marsh",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 12,
      clearance: 2,
    },
    shape: "cattails",
    color: "#6b7a4e",
  },
  {
    id: "marsh-mud-puddle",
    biomeId: "marsh",
    blocking: false,
    footprint: { kind: "circle", radius: 12 },
    placement: {
      radius: 14,
      clearance: 1,
    },
    shape: "mud-puddle",
    color: "#7a6844",
  },
  {
    id: "marsh-swamp-tree",
    biomeId: "marsh",
    blocking: true,
    footprint: { kind: "circle", radius: 22 },
    placement: {
      radius: 30,
      clearance: 8,
    },
    shape: "swamp-tree",
    color: "#3f5a3a",
  },
  {
    id: "marsh-reed-thicket",
    biomeId: "marsh",
    blocking: false,
    footprint: { kind: "circle", radius: 16 },
    placement: {
      radius: 18,
      clearance: 3,
    },
    shape: "reed-thicket",
    color: "#5a6b42",
  },
  {
    id: "marsh-mud-mound",
    biomeId: "marsh",
    blocking: true,
    footprint: { kind: "circle", radius: 28 },
    placement: {
      radius: 44,
      clearance: 14,
    },
    shape: "mud-mound",
    color: "#6e5a3b",
  },
]);

const NON_BLOCKING_DECOR_IDS = Object.freeze([
  "marsh-reeds",
  "marsh-reeds",
  "marsh-cattails",
  "marsh-cattails",
  "marsh-lily-pads",
  "marsh-mud-puddle",
  "marsh-reed-thicket",
  "marsh-reed-thicket",
]);

const BLOCKING_DECOR_IDS = Object.freeze([
  "marsh-swamp-tree",
  "marsh-swamp-tree",
  "marsh-swamp-tree",
  "marsh-swamp-tree",
  "marsh-swamp-tree",
  "marsh-mud-mound",
]);

export const MARSH_DECOR_CONFIG = Object.freeze({
  biomeId: "marsh",
  nonBlockingDecorIds: NON_BLOCKING_DECOR_IDS,
  blockingDecorIds: BLOCKING_DECOR_IDS,
  blockingCellStep: 55,
  blockingMinCount: 1,
});
