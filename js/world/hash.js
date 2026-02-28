const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;

export function hashCoordinates(worldSeed, cx, cy) {
  let hash = hashString(String(worldSeed));
  hash = mixUint(hash, cx | 0);
  hash = mixUint(hash, cy | 0);
  return hash >>> 0;
}

export function hashToUnitFloat(hash) {
  return (hash >>> 0) / 4294967295;
}

function hashString(value) {
  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME);
  }
  return hash >>> 0;
}

function mixUint(currentHash, value) {
  let hash = currentHash ^ (value >>> 0);
  hash = Math.imul(hash, FNV_PRIME);
  return hash >>> 0;
}
