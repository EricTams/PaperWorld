import { hashCoordinates, hashToUnitFloat } from "./hash.js";

const WARP_FREQUENCY = 1 / 2200;
const HEAT_FREQUENCY = 1 / 2800;
const MOISTURE_FREQUENCY = 1 / 2500;
const WARP_STRENGTH = 350;
const FRACTAL_OCTAVES = 3;
const FRACTAL_GAIN = 0.5;
const FRACTAL_LACUNARITY = 2;

export function sampleBiomeScalar(worldSeed, worldX, worldY) {
  const climate = sampleBiomeClimate(worldSeed, worldX, worldY);
  return climate.heat * 0.55 + climate.moisture * 0.45;
}

export function sampleBiomeClimate(worldSeed, worldX, worldY) {
  const warp = sampleWarp(worldSeed, worldX, worldY);
  const heat = sampleFractalField(
    `${worldSeed}:heat`,
    worldX + warp.x + 1100,
    worldY + warp.y - 700,
    HEAT_FREQUENCY
  );
  const moisture = sampleFractalField(
    `${worldSeed}:moisture`,
    worldX - warp.y - 1900,
    worldY + warp.x + 1300,
    MOISTURE_FREQUENCY
  );
  return { heat, moisture };
}

function sampleWarp(worldSeed, worldX, worldY) {
  const x = sampleFractalField(`${worldSeed}:warp-x`, worldX, worldY, WARP_FREQUENCY);
  const y = sampleFractalField(`${worldSeed}:warp-y`, worldX + 1700, worldY - 900, WARP_FREQUENCY);
  return {
    x: (x - 0.5) * WARP_STRENGTH,
    y: (y - 0.5) * WARP_STRENGTH,
  };
}

function sampleFractalField(worldSeed, worldX, worldY, baseFrequency) {
  let amplitude = 1;
  let frequency = baseFrequency;
  let sum = 0;
  let maxAmplitude = 0;
  for (let octave = 0; octave < FRACTAL_OCTAVES; octave += 1) {
    const sample = sampleValueNoise(worldSeed, worldX * frequency, worldY * frequency);
    sum += sample * amplitude;
    maxAmplitude += amplitude;
    amplitude *= FRACTAL_GAIN;
    frequency *= FRACTAL_LACUNARITY;
  }
  return sum / maxAmplitude;
}

function sampleValueNoise(worldSeed, scaledX, scaledY) {
  const x0 = Math.floor(scaledX);
  const y0 = Math.floor(scaledY);
  const tx = scaledX - x0;
  const ty = scaledY - y0;

  const v00 = latticeValue(worldSeed, x0, y0);
  const v10 = latticeValue(worldSeed, x0 + 1, y0);
  const v01 = latticeValue(worldSeed, x0, y0 + 1);
  const v11 = latticeValue(worldSeed, x0 + 1, y0 + 1);

  const sx = smoothStep(tx);
  const sy = smoothStep(ty);
  const north = lerp(v00, v10, sx);
  const south = lerp(v01, v11, sx);
  return lerp(north, south, sy);
}

function latticeValue(worldSeed, gx, gy) {
  const hash = hashCoordinates(worldSeed, gx, gy);
  return hashToUnitFloat(hash);
}

function smoothStep(value) {
  return value * value * (3 - 2 * value);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
