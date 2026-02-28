const DECOR_PADDING_WORLD = 50;

export function getOrBuildCachedCanvas(chunk, cacheKey, zoom, buildFn) {
  const zoomKey = cacheKey + "Zoom";
  if (chunk[cacheKey] && chunk[zoomKey] === zoom) {
    return chunk[cacheKey];
  }
  const canvas = buildFn();
  chunk[cacheKey] = canvas;
  chunk[zoomKey] = zoom;
  return canvas;
}

export function invalidateChunkCanvases(chunk) {
  chunk._groundDepthCanvases = null;
  chunk._groundDepthZoom = 0;
  chunk._nbDecorCanvas = null;
  chunk._nbDecorCanvasZoom = 0;
  chunk._bDecorCanvas = null;
  chunk._bDecorCanvasZoom = 0;
}

export function invalidateAllChunkCanvases(chunks) {
  for (let i = 0; i < chunks.length; i += 1) {
    invalidateChunkCanvases(chunks[i]);
  }
}

export function createChunkCamera(realCamera, chunkWorldX, chunkWorldY, canvasW, canvasH) {
  return {
    x: chunkWorldX + canvasW / (2 * realCamera.zoom),
    y: chunkWorldY + canvasH / (2 * realCamera.zoom),
    viewWidth: canvasW,
    viewHeight: canvasH,
    zoom: realCamera.zoom,
  };
}

export function getChunkScreenLayout(chunk, camera) {
  const { widthCells, heightCells, cellSize } = chunk.ground;
  const chunkWorldX = chunk.cx * widthCells * cellSize;
  const chunkWorldY = chunk.cy * heightCells * cellSize;
  const screenW = widthCells * cellSize * camera.zoom;
  const screenH = heightCells * cellSize * camera.zoom;
  return { chunkWorldX, chunkWorldY, screenW, screenH };
}

export function getDecorCanvasSize(screenW, screenH, zoom) {
  const pad = Math.ceil(DECOR_PADDING_WORLD * zoom);
  const w = Math.ceil(screenW) + pad * 2;
  const h = Math.ceil(screenH) + pad * 2;
  return { w, h, padding: pad };
}

export function createOffscreenCanvas(width, height) {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
