export const PRAIRIE_DECOR_DEFS = Object.freeze([
  {
    id: "prairie-tall-grass",
    biomeId: "prairie",
    blocking: false,
    footprint: { kind: "circle", radius: 11 },
    placement: {
      radius: 14,
      clearance: 2,
    },
    shape: "tall-grass",
    color: "#b89a38",
  },
  {
    id: "prairie-wildflowers",
    biomeId: "prairie",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 12,
      clearance: 1,
    },
    shape: "flower-cluster",
    color: "#e8a840",
  },
  {
    id: "prairie-bare-earth",
    biomeId: "prairie",
    blocking: false,
    footprint: { kind: "circle", radius: 12 },
    placement: {
      radius: 14,
      clearance: 2,
    },
    shape: "bare-earth",
    color: "#a08050",
  },
  {
    id: "prairie-thorn-bush",
    biomeId: "prairie",
    blocking: false,
    footprint: { kind: "circle", radius: 13 },
    placement: {
      radius: 22,
      clearance: 5,
    },
    shape: "thorn-bush",
    color: "#7a6e30",
  },
  {
    id: "prairie-copse",
    biomeId: "prairie",
    blocking: true,
    footprint: { kind: "circle", radius: 36 },
    placement: {
      radius: 60,
      clearance: 24,
    },
    shape: "copse",
    color: "#6b8a3e",
  },
  {
    id: "prairie-boulder",
    biomeId: "prairie",
    blocking: true,
    footprint: { kind: "circle", radius: 30 },
    placement: {
      radius: 52,
      clearance: 20,
    },
    shape: "boulder",
    color: "#8a8070",
  },
]);

const NON_BLOCKING_DECOR_IDS = Object.freeze([
  "prairie-tall-grass",
  "prairie-tall-grass",
  "prairie-tall-grass",
  "prairie-tall-grass",
  "prairie-wildflowers",
  "prairie-bare-earth",
  "prairie-thorn-bush",
]);

const BLOCKING_DECOR_IDS = Object.freeze([
  "prairie-copse",
  "prairie-copse",
  "prairie-boulder",
]);

export const PRAIRIE_DECOR_CONFIG = Object.freeze({
  biomeId: "prairie",
  nonBlockingDecorIds: NON_BLOCKING_DECOR_IDS,
  blockingDecorIds: BLOCKING_DECOR_IDS,
  blockingCellStep: 75,
  blockingMinCount: 1,
});
