const FNV_OFFSET = 2166136261;
const FNV_PRIME = 16777619;
const CORE_RATIO = 0.35;

export function isInsideScatteredPatch(worldX, worldY, layerDef) {
  const gridSize = layerDef.patchGridSize;
  const gx = Math.floor(worldX / gridSize);
  const gy = Math.floor(worldY / gridSize);
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (patchHitTest(worldX, worldY, gx + dx, gy + dy, gridSize, layerDef)) {
        return true;
      }
    }
  }
  return false;
}

function patchHitTest(worldX, worldY, gx, gy, gridSize, layerDef) {
  const salt = layerDef.noiseSalt;
  if (gridHash(gx, gy, salt, 0) > layerDef.patchChance) {
    return false;
  }
  const cx = (gx + 0.3 + gridHash(gx, gy, salt, 1) * 0.4) * gridSize;
  const cy = (gy + 0.3 + gridHash(gx, gy, salt, 2) * 0.4) * gridSize;
  const radius = layerDef.patchRadiusMin + gridHash(gx, gy, salt, 3) * (layerDef.patchRadiusMax - layerDef.patchRadiusMin);
  const dx = worldX - cx;
  const dy = worldY - cy;
  const dist2 = dx * dx + dy * dy;
  const r2 = radius * radius;
  if (dist2 > r2) {
    return false;
  }
  const t = Math.sqrt(dist2) / radius;
  if (t < CORE_RATIO) {
    return true;
  }
  const chance = 1.0 - (t - CORE_RATIO) / (1.0 - CORE_RATIO);
  return cellHash(worldX, worldY, salt) < chance;
}

function cellHash(worldX, worldY, salt) {
  let h = FNV_OFFSET ^ (salt | 0);
  h = Math.imul(h, FNV_PRIME);
  h ^= Math.floor(worldX) | 0;
  h = Math.imul(h, FNV_PRIME);
  h ^= Math.floor(worldY) | 0;
  h = Math.imul(h, FNV_PRIME);
  return (h >>> 0) / 4294967295;
}

function gridHash(gx, gy, salt, channel) {
  let h = FNV_OFFSET ^ (salt | 0);
  h = Math.imul(h, FNV_PRIME);
  h ^= (gx | 0);
  h = Math.imul(h, FNV_PRIME);
  h ^= (gy | 0);
  h = Math.imul(h, FNV_PRIME);
  h ^= (channel | 0);
  h = Math.imul(h, FNV_PRIME);
  return (h >>> 0) / 4294967295;
}
