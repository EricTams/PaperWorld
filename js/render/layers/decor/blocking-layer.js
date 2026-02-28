import { getDecorDefById } from "../../../world/decor/defs.js";
import { drawGrasslandBlockingDecor } from "./biomes/grassland/blocking-draw.js";
import { drawConiferForestBlockingDecor } from "./biomes/conifer-forest/blocking-draw.js";
import { drawRockyHighlandsBlockingDecor } from "./biomes/rocky-highlands/blocking-draw.js";
import { drawDeciduousForestBlockingDecor } from "./biomes/deciduous-forest/blocking-draw.js";
import { drawMarshBlockingDecor } from "./biomes/marsh/blocking-draw.js";
import { drawDesertBlockingDecor } from "./biomes/desert/blocking-draw.js";
import { drawTundraBlockingDecor } from "./biomes/tundra/blocking-draw.js";
import { drawCoastalBlockingDecor } from "./biomes/coastal/blocking-draw.js";
import { drawPrairieBlockingDecor } from "./biomes/prairie/blocking-draw.js";
import { drawVolcanicBadlandsBlockingDecor } from "./biomes/volcanic-badlands/blocking-draw.js";
import { getVisibleWorldBounds, isChunkVisible, worldToScreen, worldLengthToScreen } from "../../camera.js";
import {
  getOrBuildCachedCanvas,
  createChunkCamera,
  getChunkScreenLayout,
  getDecorCanvasSize,
  createOffscreenCanvas,
} from "../../chunk-canvas-cache.js";

export function drawDecorBlockingLayer(ctx, camera, chunks, chunkSize) {
  const visibleBounds = getVisibleWorldBounds(camera);

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    if (!isChunkVisible(chunk, chunkSize, visibleBounds)) {
      continue;
    }
    if (!chunk.decorBlocking || chunk.decorBlocking.length === 0) {
      continue;
    }

    const layout = getChunkScreenLayout(chunk, camera);
    const canvasSize = getDecorCanvasSize(layout.screenW, layout.screenH, camera.zoom);
    const cached = getOrBuildCachedCanvas(chunk, "_bDecorCanvas", camera.zoom, () => {
      return buildBlockingDecorCanvas(chunk, camera, layout, canvasSize);
    });
    const screenPos = worldToScreen(camera, layout.chunkWorldX, layout.chunkWorldY);
    ctx.drawImage(cached, screenPos.x - canvasSize.padding, screenPos.y - canvasSize.padding);
  }
}

function buildBlockingDecorCanvas(chunk, camera, layout, canvasSize) {
  const canvas = createOffscreenCanvas(canvasSize.w, canvasSize.h);
  const offCtx = canvas.getContext("2d");
  const chunkCam = createChunkCamera(
    camera,
    layout.chunkWorldX - canvasSize.padding / camera.zoom,
    layout.chunkWorldY - canvasSize.padding / camera.zoom,
    canvasSize.w,
    canvasSize.h,
  );

  for (let i = 0; i < chunk.decorBlocking.length; i += 1) {
    const instance = chunk.decorBlocking[i];
    const decorDef = getDecorDefById(instance.decorId);
    const position = worldToScreen(chunkCam, instance.x, instance.y);
    if (decorDef.biomeId === "grassland") {
      drawGrasslandBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "conifer-forest") {
      drawConiferForestBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "rocky-highlands") {
      drawRockyHighlandsBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "deciduous-forest") {
      drawDeciduousForestBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "marsh") {
      drawMarshBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "desert") {
      drawDesertBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "tundra") {
      drawTundraBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "coastal") {
      drawCoastalBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "prairie") {
      drawPrairieBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "volcanic-badlands") {
      drawVolcanicBadlandsBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    }
  }
  return canvas;
}
