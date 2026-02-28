import { getDecorDefById } from "../../../world/decor/defs.js";
import { drawGrasslandNonBlockingDecor } from "./biomes/grassland/nonblocking-draw.js";
import { drawConiferForestNonBlockingDecor } from "./biomes/conifer-forest/nonblocking-draw.js";
import { drawRockyHighlandsNonBlockingDecor } from "./biomes/rocky-highlands/nonblocking-draw.js";
import { drawDeciduousForestNonBlockingDecor } from "./biomes/deciduous-forest/nonblocking-draw.js";
import { drawMarshNonBlockingDecor } from "./biomes/marsh/nonblocking-draw.js";
import { drawDesertNonBlockingDecor } from "./biomes/desert/nonblocking-draw.js";
import { drawTundraNonBlockingDecor } from "./biomes/tundra/nonblocking-draw.js";
import { drawCoastalNonBlockingDecor } from "./biomes/coastal/nonblocking-draw.js";
import { drawPrairieNonBlockingDecor } from "./biomes/prairie/nonblocking-draw.js";
import { drawVolcanicBadlandsNonBlockingDecor } from "./biomes/volcanic-badlands/nonblocking-draw.js";
import { getVisibleWorldBounds, isChunkVisible, worldToScreen, worldLengthToScreen } from "../../camera.js";
import {
  getOrBuildCachedCanvas,
  createChunkCamera,
  getChunkScreenLayout,
  getDecorCanvasSize,
  createOffscreenCanvas,
} from "../../chunk-canvas-cache.js";

export function drawDecorNonBlockingLayer(ctx, camera, chunks, chunkSize) {
  const visibleBounds = getVisibleWorldBounds(camera);

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    if (!isChunkVisible(chunk, chunkSize, visibleBounds)) {
      continue;
    }
    if (!chunk.decorNonBlocking || chunk.decorNonBlocking.length === 0) {
      continue;
    }

    const layout = getChunkScreenLayout(chunk, camera);
    const canvasSize = getDecorCanvasSize(layout.screenW, layout.screenH, camera.zoom);
    const cached = getOrBuildCachedCanvas(chunk, "_nbDecorCanvas", camera.zoom, () => {
      return buildNonBlockingDecorCanvas(chunk, camera, layout, canvasSize);
    });
    const screenPos = worldToScreen(camera, layout.chunkWorldX, layout.chunkWorldY);
    ctx.drawImage(cached, screenPos.x - canvasSize.padding, screenPos.y - canvasSize.padding);
  }
}

function buildNonBlockingDecorCanvas(chunk, camera, layout, canvasSize) {
  const canvas = createOffscreenCanvas(canvasSize.w, canvasSize.h);
  const offCtx = canvas.getContext("2d");
  const chunkCam = createChunkCamera(
    camera,
    layout.chunkWorldX - canvasSize.padding / camera.zoom,
    layout.chunkWorldY - canvasSize.padding / camera.zoom,
    canvasSize.w,
    canvasSize.h,
  );

  for (let i = 0; i < chunk.decorNonBlocking.length; i += 1) {
    const instance = chunk.decorNonBlocking[i];
    const decorDef = getDecorDefById(instance.decorId);
    const position = worldToScreen(chunkCam, instance.x, instance.y);
    if (decorDef.biomeId === "grassland") {
      drawGrasslandNonBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "conifer-forest") {
      drawConiferForestNonBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "rocky-highlands") {
      drawRockyHighlandsNonBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "deciduous-forest") {
      drawDeciduousForestNonBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "marsh") {
      drawMarshNonBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "desert") {
      drawDesertNonBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "tundra") {
      drawTundraNonBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "coastal") {
      drawCoastalNonBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "prairie") {
      drawPrairieNonBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    } else if (decorDef.biomeId === "volcanic-badlands") {
      drawVolcanicBadlandsNonBlockingDecor(offCtx, chunkCam, worldLengthToScreen, position, decorDef);
    }
  }
  return canvas;
}
