export const ROCKY_HIGHLANDS_DECOR_DEFS = Object.freeze([
  {
    id: "rocky-highlands-grass-tuft",
    biomeId: "rocky-highlands",
    blocking: false,
    footprint: { kind: "circle", radius: 8 },
    placement: {
      radius: 10,
      clearance: 1,
    },
    shape: "grass-tuft",
    color: "#7a9468",
  },
  {
    id: "rocky-highlands-lichen",
    biomeId: "rocky-highlands",
    blocking: false,
    footprint: { kind: "circle", radius: 10 },
    placement: {
      radius: 12,
      clearance: 1,
    },
    shape: "lichen-patch",
    color: "#a8ab6e",
  },
  {
    id: "rocky-highlands-heather",
    biomeId: "rocky-highlands",
    blocking: false,
    footprint: { kind: "circle", radius: 9 },
    placement: {
      radius: 11,
      clearance: 2,
    },
    shape: "heather",
    color: "#9a6b8a",
  },
  {
    id: "rocky-highlands-rock-outcrop",
    biomeId: "rocky-highlands",
    blocking: true,
    footprint: { kind: "circle", radius: 36 },
    placement: {
      radius: 58,
      clearance: 20,
    },
    shape: "rock-outcrop",
    color: "#7b838e",
  },
  {
    id: "rocky-highlands-boulder",
    biomeId: "rocky-highlands",
    blocking: true,
    footprint: { kind: "circle", radius: 28 },
    placement: {
      radius: 46,
      clearance: 16,
    },
    shape: "boulder",
    color: "#6e7880",
  },
  {
    id: "rocky-highlands-stone-pillar",
    biomeId: "rocky-highlands",
    blocking: true,
    footprint: { kind: "circle", radius: 14 },
    placement: {
      radius: 20,
      clearance: 8,
    },
    shape: "stone-pillar",
    color: "#85909a",
  },
]);

const NON_BLOCKING_DECOR_IDS = Object.freeze([
  "rocky-highlands-grass-tuft",
  "rocky-highlands-lichen",
  "rocky-highlands-heather",
]);

const BLOCKING_DECOR_IDS = Object.freeze([
  "rocky-highlands-rock-outcrop",
  "rocky-highlands-rock-outcrop",
  "rocky-highlands-rock-outcrop",
  "rocky-highlands-boulder",
  "rocky-highlands-boulder",
  "rocky-highlands-boulder",
  "rocky-highlands-boulder",
  "rocky-highlands-stone-pillar",
]);

export const ROCKY_HIGHLANDS_DECOR_CONFIG = Object.freeze({
  biomeId: "rocky-highlands",
  nonBlockingDecorIds: NON_BLOCKING_DECOR_IDS,
  blockingDecorIds: BLOCKING_DECOR_IDS,
  blockingCellStep: 80,
  blockingMinCount: 1,
});
