export function createCamera(viewWidth, viewHeight) {
  return {
    x: 0,
    y: 0,
    viewWidth,
    viewHeight,
    zoom: 1,
  };
}

export function resizeCamera(camera, viewWidth, viewHeight) {
  camera.viewWidth = viewWidth;
  camera.viewHeight = viewHeight;
}

export function updateCameraFollow(camera, targetX, targetY) {
  camera.x = targetX;
  camera.y = targetY;
}

export function setCameraZoom(camera, zoom) {
  if (zoom <= 0) {
    throw new Error(`Camera zoom must be > 0. Received ${zoom}.`);
  }
  camera.zoom = zoom;
}

export function worldToScreen(camera, worldX, worldY) {
  const zoom = camera.zoom;
  return {
    x: (worldX - camera.x) * zoom + camera.viewWidth * 0.5,
    y: (worldY - camera.y) * zoom + camera.viewHeight * 0.5,
  };
}

export function worldLengthToScreen(camera, worldLength) {
  return worldLength * camera.zoom;
}

export function getVisibleWorldBounds(camera) {
  const halfW = camera.viewWidth / (2 * camera.zoom);
  const halfH = camera.viewHeight / (2 * camera.zoom);
  return {
    minX: camera.x - halfW,
    minY: camera.y - halfH,
    maxX: camera.x + halfW,
    maxY: camera.y + halfH,
  };
}

export function isChunkVisible(chunk, chunkSize, visibleBounds) {
  const chunkMinX = chunk.cx * chunkSize;
  const chunkMinY = chunk.cy * chunkSize;
  const chunkMaxX = chunkMinX + chunkSize;
  const chunkMaxY = chunkMinY + chunkSize;
  return (
    chunkMaxX > visibleBounds.minX &&
    chunkMinX < visibleBounds.maxX &&
    chunkMaxY > visibleBounds.minY &&
    chunkMinY < visibleBounds.maxY
  );
}
