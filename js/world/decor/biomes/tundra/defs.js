export const TUNDRA_DECOR_DEFS = Object.freeze([
  {
    id: "tundra-snow-drift",
    biomeId: "tundra",
    blocking: false,
    footprint: { kind: "circle", radius: 13 },
    placement: {
      radius: 15,
      clearance: 2,
    },
    shape: "snow-drift",
    color: "#e8eef4",
  },
  {
    id: "tundra-frozen-grass",
    biomeId: "tundra",
    blocking: false,
    footprint: { kind: "circle", radius: 8 },
    placement: {
      radius: 10,
      clearance: 1,
    },
    shape: "frozen-grass",
    color: "#c5d4de",
  },
  {
    id: "tundra-frozen-pond",
    biomeId: "tundra",
    blocking: false,
    footprint: { kind: "circle", radius: 14 },
    placement: {
      radius: 16,
      clearance: 2,
    },
    shape: "frozen-pond",
    color: "#b0c4cf",
  },
  {
    id: "tundra-snowy-shrub",
    biomeId: "tundra",
    blocking: false,
    footprint: { kind: "circle", radius: 12 },
    placement: {
      radius: 20,
      clearance: 5,
    },
    shape: "snowy-shrub",
    color: "#9aafba",
  },
  {
    id: "tundra-ice-boulder",
    biomeId: "tundra",
    blocking: true,
    footprint: { kind: "circle", radius: 28 },
    placement: {
      radius: 48,
      clearance: 20,
    },
    shape: "ice-boulder",
    color: "#7a9aad",
  },
  {
    id: "tundra-dwarf-conifer",
    biomeId: "tundra",
    blocking: true,
    footprint: { kind: "circle", radius: 16 },
    placement: {
      radius: 28,
      clearance: 12,
    },
    shape: "dwarf-conifer",
    color: "#3d6650",
  },
]);

const NON_BLOCKING_DECOR_IDS = Object.freeze([
  "tundra-snow-drift",
  "tundra-snow-drift",
  "tundra-snow-drift",
  "tundra-frozen-grass",
  "tundra-frozen-grass",
  "tundra-frozen-pond",
  "tundra-snowy-shrub",
]);

const BLOCKING_DECOR_IDS = Object.freeze([
  "tundra-ice-boulder",
  "tundra-ice-boulder",
  "tundra-dwarf-conifer",
]);

export const TUNDRA_DECOR_CONFIG = Object.freeze({
  biomeId: "tundra",
  nonBlockingDecorIds: NON_BLOCKING_DECOR_IDS,
  blockingDecorIds: BLOCKING_DECOR_IDS,
  blockingCellStep: 100,
  blockingMinCount: 1,
});
