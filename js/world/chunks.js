export const WORLD_CHUNK_SIZE = 256;

export function encodeChunkKey(cx, cy) {
  return `${cx},${cy}`;
}

export function decodeChunkKey(key) {
  const [rawX, rawY] = key.split(",");
  return {
    x: Number(rawX),
    y: Number(rawY),
  };
}

export function worldToChunkCoord(worldX, worldY, chunkSize = WORLD_CHUNK_SIZE) {
  return {
    x: Math.floor(worldX / chunkSize),
    y: Math.floor(worldY / chunkSize),
  };
}
