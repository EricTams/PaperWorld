const HUD_TEXT_COLOR = "#ffffff";
const HUD_BACKGROUND = "rgba(0, 0, 0, 0.6)";
const HUD_FONT = "14px monospace";
const HUD_PADDING = 12;
const HUD_LINE_HEIGHT = 18;

export function createDebugHudState() {
  return {
    enabled: true,
    fps: 0,
    playerX: 0,
    playerY: 0,
    chunkX: 0,
    chunkY: 0,
    biomeId: "unknown",
    loadedChunkCount: 0,
    chunkGridEnabled: false,
    collisionOverlayEnabled: false,
  };
}

export function toggleDebugHud(hudState) {
  hudState.enabled = !hudState.enabled;
}

export function updateDebugHudMetrics(hudState, metrics) {
  hudState.fps = metrics.fps;
  hudState.playerX = metrics.playerX;
  hudState.playerY = metrics.playerY;
  hudState.chunkX = metrics.chunkX;
  hudState.chunkY = metrics.chunkY;
  hudState.biomeId = metrics.biomeId;
  hudState.loadedChunkCount = metrics.loadedChunkCount;
  hudState.chunkGridEnabled = metrics.chunkGridEnabled;
  hudState.collisionOverlayEnabled = metrics.collisionOverlayEnabled;
}

export function drawDebugHud(ctx, hudState) {
  if (!hudState.enabled) {
    return;
  }

  const lines = buildHudLines(hudState);
  const width = 300;
  const height = HUD_PADDING * 2 + lines.length * HUD_LINE_HEIGHT;
  ctx.fillStyle = HUD_BACKGROUND;
  ctx.fillRect(16, 16, width, height);
  ctx.fillStyle = HUD_TEXT_COLOR;
  ctx.font = HUD_FONT;
  lines.forEach((line, index) => {
    const x = 16 + HUD_PADDING;
    const y = 16 + HUD_PADDING + (index + 1) * HUD_LINE_HEIGHT - 4;
    ctx.fillText(line, x, y);
  });
}

function buildHudLines(hudState) {
  return [
    "F3 Debug HUD",
    `F4 Chunk Grid: ${hudState.chunkGridEnabled ? "ON" : "OFF"}`,
    `F5 Collision Overlay: ${hudState.collisionOverlayEnabled ? "ON" : "OFF"}`,
    `FPS: ${hudState.fps.toFixed(1)}`,
    `Player: (${hudState.playerX.toFixed(1)}, ${hudState.playerY.toFixed(1)})`,
    `Chunk: (${hudState.chunkX}, ${hudState.chunkY})`,
    `Biome: ${hudState.biomeId}`,
    `Loaded chunks: ${hudState.loadedChunkCount}`,
  ];
}
