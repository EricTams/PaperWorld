import {
  createInputState,
  attachInputListeners,
  consumeDebugToggle,
  consumeChunkGridToggle,
  consumeCollisionOverlayToggle,
  consumeCycleBiomes,
  consumeZoomToggle,
  readMovementAxis,
} from "./input/input-state.js";
import {
  createPlayer,
  updatePlayerMovement,
  updatePlayerAnimation,
  drawPlayer,
} from "./entities/player.js";
import { loadAtlas } from "./render/sprite/atlas-loader.js";
import {
  createCamera,
  resizeCamera,
  updateCameraFollow,
  worldToScreen,
  worldLengthToScreen,
  setCameraZoom,
} from "./render/camera.js";
import { invalidateAllChunkCanvases } from "./render/chunk-canvas-cache.js";
import {
  createDebugHudState,
  drawDebugHud,
  toggleDebugHud,
  updateDebugHudMetrics,
} from "./render/debug-hud.js";
import { WORLD_CHUNK_SIZE, worldToChunkCoord } from "./world/chunks.js";
import { BIOME_IDS } from "./world/biome-defs.js";
import { sampleBiomeIdAtWorld } from "./world/biome-map.js";
import { createChunkCache, updateChunkStreaming } from "./world/chunk-generate.js";
import { drawGroundLayer, drawChunkGridOverlay } from "./render/layers/ground-layer.js";
import { drawDecorNonBlockingLayer } from "./render/layers/decor/nonblocking-layer.js";
import { drawDecorBlockingLayer } from "./render/layers/decor/blocking-layer.js";
import { resolvePlayerBlockingCollision, drawCollisionDebugOverlay } from "./sim/collision.js";
import { createEnemySpawner, updateEnemySpawner, drawEnemies } from "./entities/enemy-spawner.js";

const FIXED_DT_SECONDS = 1 / 60;
const MAX_FRAME_SECONDS = 0.25;
const CAMERA_ZOOM_CLOSE = 2.5;
const CAMERA_ZOOM_FAR = 1;
const EVICT_BUFFER_CHUNKS = 2;
const BASE_WORLD_SEED = "phase2-seed";

const gameState = createGameState();
initGame(gameState);
requestAnimationFrame((timeMs) => frameLoop(gameState, timeMs));

function createGameState() {
  const canvas = document.getElementById("game-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Expected #game-canvas to be an HTMLCanvasElement.");
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  const input = createInputState();
  const player = createPlayer(0, 0);
  const camera = createCamera(window.innerWidth, window.innerHeight);
  const debugHud = createDebugHudState();
  return {
    canvas,
    ctx,
    input,
    player,
    camera,
    debugHud,
    world: {
      chunkSize: WORLD_CHUNK_SIZE,
      seed: BASE_WORLD_SEED,
      seedOffset: 0,
      cache: createChunkCache(),
      loadedChunks: [],
      currentChunk: { x: 0, y: 0 },
    },
    time: {
      lastFrameMs: 0,
      accumulator: 0,
      fpsSampleSeconds: 0,
      frameCounter: 0,
      fps: 0,
    },
    debug: {
      lastAxisLog: "0,0",
      chunkGridEnabled: false,
      collisionOverlayEnabled: false,
    },
    lastCachedZoom: 0,
    playerAtlas: null,
    enemyAtlas: null,
    enemySpawner: createEnemySpawner(),
  };
}

function initGame(state) {
  attachInputListeners(state.input, window);
  setCameraZoom(state.camera, CAMERA_ZOOM_CLOSE);
  updateCameraFollow(state.camera, state.player.x, state.player.y);
  updateWorldStreaming(state);
  validateBiomeDefinitionCount();
  resizeCanvas(state);
  window.addEventListener("resize", () => resizeCanvas(state));
  loadAtlas("assets/player/alienPink.xml", "assets/player/alienPink.png").then((atlas) => {
    state.playerAtlas = atlas;
  });
  loadAtlas("assets/enemies/enemies.xml", "assets/enemies/enemies.png").then((atlas) => {
    state.enemyAtlas = atlas;
  });
  console.log("AIDEV-NOTE: Initial game state", state);
}

function resizeCanvas(state) {
  state.canvas.width = window.innerWidth;
  state.canvas.height = window.innerHeight;
  resizeCamera(state.camera, state.canvas.width, state.canvas.height);
  invalidateAllChunkCanvases(state.world.loadedChunks);
}

function frameLoop(state, frameMs) {
  const frameSeconds = getFrameDeltaSeconds(state, frameMs);
  state.time.accumulator += frameSeconds;
  const axis = readInput(state);
  while (state.time.accumulator >= FIXED_DT_SECONDS) {
    simulate(state, axis, FIXED_DT_SECONDS);
    state.time.accumulator -= FIXED_DT_SECONDS;
  }

  render(state);
  updateFps(state, frameSeconds);
  requestAnimationFrame((nextFrameMs) => frameLoop(state, nextFrameMs));
}

function getFrameDeltaSeconds(state, frameMs) {
  if (state.time.lastFrameMs === 0) {
    state.time.lastFrameMs = frameMs;
    return 0;
  }

  const deltaMs = frameMs - state.time.lastFrameMs;
  state.time.lastFrameMs = frameMs;
  return Math.min(deltaMs / 1000, MAX_FRAME_SECONDS);
}

function readInput(state) {
  if (consumeDebugToggle(state.input)) {
    toggleDebugHud(state.debugHud);
  }
  if (consumeChunkGridToggle(state.input)) {
    state.debug.chunkGridEnabled = !state.debug.chunkGridEnabled;
  }
  if (consumeCollisionOverlayToggle(state.input)) {
    state.debug.collisionOverlayEnabled = !state.debug.collisionOverlayEnabled;
  }
  if (consumeCycleBiomes(state.input)) {
    cycleBiomeSeed(state);
  }
  if (consumeZoomToggle(state.input)) {
    const nextZoom = state.camera.zoom === CAMERA_ZOOM_CLOSE ? CAMERA_ZOOM_FAR : CAMERA_ZOOM_CLOSE;
    setCameraZoom(state.camera, nextZoom);
  }

  const axis = readMovementAxis(state.input);
  logMovementAxis(state, axis);
  return axis;
}

function logMovementAxis(state, axis) {
  const axisLabel = `${axis.x},${axis.y}`;
  if (axisLabel === state.debug.lastAxisLog) {
    return;
  }

  state.debug.lastAxisLog = axisLabel;
  console.log(`AIDEV-NOTE: Movement axis ${axisLabel}`);
}

function simulate(state, axis, dtSeconds) {
  const previousPosition = { x: state.player.x, y: state.player.y };
  updatePlayerMovement(state.player, axis, dtSeconds);
  resolvePlayerBlockingCollision(state.player, previousPosition, state.world.loadedChunks);
  updatePlayerAnimation(state.player, axis, dtSeconds);
  updateCameraFollow(state.camera, state.player.x, state.player.y);
  updateEnemySpawner(state.enemySpawner, state.camera, state.player, state.world.loadedChunks, dtSeconds);
  updateWorldStreaming(state);
}

function render(state) {
  if (state.camera.zoom !== state.lastCachedZoom) {
    invalidateAllChunkCanvases(state.world.loadedChunks);
    state.lastCachedZoom = state.camera.zoom;
  }
  clearFrame(state);
  drawGroundLayer(state.ctx, state.camera, state.world.loadedChunks, state.world.chunkSize);
  drawDecorNonBlockingLayer(state.ctx, state.camera, state.world.loadedChunks, state.world.chunkSize);
  if (state.debug.chunkGridEnabled) {
    drawChunkGridOverlay(state.ctx, state.camera, state.world.loadedChunks, state.world.chunkSize);
  }
  drawEnemies(state.ctx, state.camera, state.enemySpawner, worldToScreen, worldLengthToScreen, state.enemyAtlas);
  drawPlayer(state.ctx, state.camera, state.player, worldToScreen, worldLengthToScreen, state.playerAtlas);
  drawDecorBlockingLayer(state.ctx, state.camera, state.world.loadedChunks, state.world.chunkSize);
  if (state.debug.collisionOverlayEnabled) {
    drawCollisionDebugOverlay(
      state.ctx,
      state.camera,
      worldToScreen,
      worldLengthToScreen,
      state.player,
      state.world.loadedChunks
    );
  }
  updateHud(state);
  drawDebugHud(state.ctx, state.debugHud);
}

function clearFrame(state) {
  state.ctx.fillStyle = "#1b1e28";
  state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
}

function updateHud(state) {
  const chunk = worldToChunkCoord(state.player.x, state.player.y, state.world.chunkSize);
  const biomeId = sampleBiomeIdAtWorld(state.world.seed, state.player.x, state.player.y);
  updateDebugHudMetrics(state.debugHud, {
    fps: state.time.fps,
    playerX: state.player.x,
    playerY: state.player.y,
    chunkX: chunk.x,
    chunkY: chunk.y,
    biomeId,
    loadedChunkCount: state.world.loadedChunks.length,
    chunkGridEnabled: state.debug.chunkGridEnabled,
    collisionOverlayEnabled: state.debug.collisionOverlayEnabled,
  });
}

function computeChunkStreamRadius(camera, chunkSize) {
  const halfW = camera.viewWidth / (2 * camera.zoom);
  const halfH = camera.viewHeight / (2 * camera.zoom);
  const maxViewDist = Math.max(halfW, halfH);
  return Math.ceil(maxViewDist / chunkSize) + 1;
}

function updateWorldStreaming(state) {
  const streamRadius = computeChunkStreamRadius(state.camera, state.world.chunkSize);
  const stream = updateChunkStreaming(
    state.world.cache,
    state.world.seed,
    state.player.x,
    state.player.y,
    streamRadius,
    state.world.chunkSize,
    streamRadius + EVICT_BUFFER_CHUNKS
  );
  state.world.currentChunk = stream.centerChunk;
  state.world.loadedChunks = stream.loadedChunks;
}

function cycleBiomeSeed(state) {
  state.world.seedOffset += 1;
  state.world.seed = `${BASE_WORLD_SEED}-${state.world.seedOffset}`;
  state.world.cache = createChunkCache();
  invalidateAllChunkCanvases(state.world.loadedChunks);
  updateWorldStreaming(state);
  console.log(`AIDEV-NOTE: Biome seed cycled to "${state.world.seed}"`);
}

function validateBiomeDefinitionCount() {
  if (BIOME_IDS.length !== 10) {
    throw new Error(`Expected 10 biome IDs, received ${BIOME_IDS.length}.`);
  }
}

function updateFps(state, frameSeconds) {
  state.time.fpsSampleSeconds += frameSeconds;
  state.time.frameCounter += 1;
  if (state.time.fpsSampleSeconds < 1) {
    return;
  }

  state.time.fps = state.time.frameCounter / state.time.fpsSampleSeconds;
  console.log(`AIDEV-NOTE: FPS ${state.time.fps.toFixed(1)}`);
  state.time.fpsSampleSeconds = 0;
  state.time.frameCounter = 0;
}
