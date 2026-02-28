export const VOLCANIC_BADLANDS_DECOR_DEFS = Object.freeze([
  {
    id: "volcanic-badlands-ash-drift",
    biomeId: "volcanic-badlands",
    blocking: false,
    footprint: { kind: "circle", radius: 12 },
    placement: {
      radius: 14,
      clearance: 2,
    },
    shape: "ash-drift",
    color: "#6e6e6e",
  },
  {
    id: "volcanic-badlands-steam-vent",
    biomeId: "volcanic-badlands",
    blocking: false,
    footprint: { kind: "circle", radius: 8 },
    placement: {
      radius: 10,
      clearance: 2,
    },
    shape: "steam-vent",
    color: "#4a4a4a",
  },
  {
    id: "volcanic-badlands-cracked-earth",
    biomeId: "volcanic-badlands",
    blocking: false,
    footprint: { kind: "circle", radius: 11 },
    placement: {
      radius: 13,
      clearance: 1,
    },
    shape: "cracked-earth",
    color: "#3a3a3a",
  },
  {
    id: "volcanic-badlands-basalt-spire",
    biomeId: "volcanic-badlands",
    blocking: true,
    footprint: { kind: "circle", radius: 18 },
    placement: {
      radius: 32,
      clearance: 14,
    },
    shape: "basalt-spire",
    color: "#2e2e2e",
  },
  {
    id: "volcanic-badlands-lava-rock",
    biomeId: "volcanic-badlands",
    blocking: true,
    footprint: { kind: "circle", radius: 28 },
    placement: {
      radius: 48,
      clearance: 18,
    },
    shape: "lava-rock",
    color: "#3a3535",
  },
  {
    id: "volcanic-badlands-charred-tree",
    biomeId: "volcanic-badlands",
    blocking: true,
    footprint: { kind: "circle", radius: 16 },
    placement: {
      radius: 28,
      clearance: 12,
    },
    shape: "charred-tree",
    color: "#2a2220",
  },
]);

const NON_BLOCKING_DECOR_IDS = Object.freeze([
  "volcanic-badlands-ash-drift",
  "volcanic-badlands-ash-drift",
  "volcanic-badlands-cracked-earth",
  "volcanic-badlands-cracked-earth",
  "volcanic-badlands-steam-vent",
]);

const BLOCKING_DECOR_IDS = Object.freeze([
  "volcanic-badlands-basalt-spire",
  "volcanic-badlands-basalt-spire",
  "volcanic-badlands-lava-rock",
  "volcanic-badlands-lava-rock",
  "volcanic-badlands-charred-tree",
]);

export const VOLCANIC_BADLANDS_DECOR_CONFIG = Object.freeze({
  biomeId: "volcanic-badlands",
  nonBlockingDecorIds: NON_BLOCKING_DECOR_IDS,
  blockingDecorIds: BLOCKING_DECOR_IDS,
  blockingCellStep: 100,
  blockingMinCount: 1,
});
