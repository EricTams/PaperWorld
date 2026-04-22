import {
  createInputState,
  attachInputListeners,
  consumeDebugToggle,
  consumeChunkGridToggle,
  consumeCollisionOverlayToggle,
  consumeCycleBiomes,
  consumeZoomToggle,
  consumeInventoryToggle,
  consumeHotbarSlot,
  consumeMouseClick,
  consumeMouseRelease,
  consumeCancelPlace,
  consumeInteract,
  consumeGrimoireToggle,
  consumeRightClick,
  readMovementAxis,
} from "./input/input-state.js";
import { isTouchDevice } from "./input/touch-detect.js";
import {
  createVirtualGamepad,
  attachTouchListeners,
  layoutGamepad,
  consumeButtonPress,
  readDpadAxis,
  drawVirtualGamepad,
} from "./input/virtual-gamepad.js";
import {
  createPlayer,
  updatePlayerMovement,
  updatePlayerAnimation,
  startAttack,
  updateAttack,
  drawPlayer,
} from "./entities/player.js";
import { resolveAttackHits } from "./sim/combat.js";
import { drawAttack } from "./render/layers/attack-layer.js";
import { loadAtlas } from "./render/sprite/atlas-loader.js";
import {
  createCamera,
  resizeCamera,
  updateCameraFollow,
  worldToScreen,
  worldLengthToScreen,
  setCameraZoom,
  screenToWorld,
} from "./render/camera.js";
import { invalidateAllChunkCanvases, invalidateChunkCanvases } from "./render/chunk-canvas-cache.js";
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
import { resolvePlayerBlockingCollision, drawCollisionDebugOverlay, collectBlockingCircleColliders, isCollidingAt } from "./sim/collision.js";
import { createEnemySpawner, updateEnemySpawner, drawEnemies } from "./entities/enemy-spawner.js";
import { createInventory, addItem, removeItem, removeItemById, getSlot, PLAYER_SLOT_COUNT, HOTBAR_START_INDEX } from "./items/inventory.js";
import { getItemDef } from "./items/item-defs.js";
import { drawHotbar } from "./render/ui/hotbar.js";
import { drawInventoryPanel, hitTestInventorySlot } from "./render/ui/inventory-panel.js";
import { POCKET_RECIPES, MORTAR_RECIPES, DRYING_RACK_RECIPES, GRIMOIRE_RECIPES, MAGIC_CIRCLE_RECIPES, CAMPFIRE_RECIPES, CAULDRON_RECIPES } from "./items/recipe-defs.js";
import { doCraft, canCraft } from "./items/crafting.js";
import { hitTestCraftingPanel } from "./render/ui/crafting-panel.js";
import { createPlacedObjectStore, addPlacedObject, getPlacedObjectColliders, snapToPlaceGrid } from "./world/placed-objects.js";
import { drawPlacedObjects, drawPlacementIndicator } from "./render/layers/placed-object-layer.js";
import { findHoveredObject, findInteractableObject } from "./sim/interaction.js";
import { drawHoverHighlight, drawInteractionTooltip, drawDecorPickupTooltip } from "./render/ui/interaction-indicator.js";
import { findPickupableDecor, removeDecorInstance } from "./sim/decor-pickup.js";
import { drawGrimoireHint } from "./render/ui/grimoire-hint.js";

const FIXED_DT_SECONDS = 1 / 60;
const MAX_FRAME_SECONDS = 0.25;
const CAMERA_ZOOM_CLOSE = 2.5;
const CAMERA_ZOOM_FAR = 1;
const MOBILE_ZOOM = 1.4;
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
    inventory: createInventory(PLAYER_SLOT_COUNT),
    hotbarSelection: 0,
    inventoryOpen: false,
    openContainer: null,
    heldItem: null,
    panelLayout: null,
    placeMode: { active: false, itemId: null },
    placedObjects: createPlacedObjectStore(),
    interaction: { hoveredObject: null, interactableObject: null, pickupableDecor: null },
    activeRecipes: null,
    craftingLabel: null,
    hasGrimoire: false,
    touchActive: false,
    gamepad: createVirtualGamepad(),
  };
}

function initGame(state) {
  attachInputListeners(state.input, window);
  state.touchActive = isTouchDevice();
  if (state.touchActive) {
    document.documentElement.classList.add("touch-device");
    attachTouchListeners(state.gamepad, state.canvas, state.input);
    tryLockLandscape();
  }
  const startZoom = state.touchActive ? MOBILE_ZOOM : CAMERA_ZOOM_CLOSE;
  setCameraZoom(state.camera, startZoom);
  updateCameraFollow(state.camera, state.player.x, state.player.y);
  updateWorldStreaming(state);
  validateBiomeDefinitionCount();
  resizeCanvas(state);
  window.addEventListener("resize", () => resizeCanvas(state));
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => resizeCanvas(state));
  }
  loadAtlas("assets/player/alienPink.xml", "assets/player/alienPink.png").then((atlas) => {
    state.playerAtlas = atlas;
  });
  loadAtlas("assets/enemies/enemies.xml", "assets/enemies/enemies.png").then((atlas) => {
    state.enemyAtlas = atlas;
  });
  addItem(state.inventory, "stick", 12);
  addItem(state.inventory, "stone", 12);
  addItem(state.inventory, "herb", 3);
  console.log("AIDEV-NOTE: Initial game state", state);
}

function resizeCanvas(state) {
  const dpr = window.devicePixelRatio || 1;
  const vp = window.visualViewport;
  const cssW = vp ? vp.width : window.innerWidth;
  const cssH = vp ? vp.height : window.innerHeight;
  state.canvas.width = cssW * dpr;
  state.canvas.height = cssH * dpr;
  state.canvas.style.width = cssW + "px";
  state.canvas.style.height = cssH + "px";
  state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  resizeCamera(state.camera, cssW, cssH);
  invalidateAllChunkCanvases(state.world.loadedChunks);
  if (state.touchActive) {
    const insets = getSafeAreaInsets();
    layoutGamepad(state.gamepad, cssW, cssH, insets);
  }
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
  if (consumeZoomToggle(state.input) && !state.touchActive) {
    const nextZoom = state.camera.zoom === CAMERA_ZOOM_CLOSE ? CAMERA_ZOOM_FAR : CAMERA_ZOOM_CLOSE;
    setCameraZoom(state.camera, nextZoom);
  }
  if (consumeCancelPlace(state.input)) {
    state.placeMode.active = false;
  }
  if (consumeGrimoireToggle(state.input)) {
    if (state.hasGrimoire) {
      if (state.inventoryOpen && state.activeRecipes === GRIMOIRE_RECIPES) {
        state.inventoryOpen = false;
        returnHeldItem(state);
        state.openContainer = null;
        state.panelLayout = null;
        state.activeRecipes = null;
        state.craftingLabel = null;
      } else {
        state.inventoryOpen = true;
        state.placeMode.active = false;
        state.activeRecipes = GRIMOIRE_RECIPES;
        state.craftingLabel = "Grimoire";
        state.openContainer = null;
      }
    }
  }
  if (consumeInventoryToggle(state.input)) {
    state.inventoryOpen = !state.inventoryOpen;
    state.placeMode.active = false;
    if (state.inventoryOpen) {
      state.activeRecipes = getPocketRecipes(state);
      state.craftingLabel = null;
    } else {
      returnHeldItem(state);
      state.openContainer = null;
      state.panelLayout = null;
      state.activeRecipes = null;
      state.craftingLabel = null;
    }
  }
  if (consumeRightClick(state.input)) {
    state.hotbarSelection = -1;
    state.placeMode.active = false;
  }

  const hotbarSlot = consumeHotbarSlot(state.input);
  if (hotbarSlot >= 0) {
    if (hotbarSlot === state.hotbarSelection && state.placeMode.active) {
      state.placeMode.active = false;
    } else {
      state.hotbarSelection = hotbarSlot;
      tryEnterPlaceMode(state);
    }
  }

  const press = consumeMouseClick(state.input);
  const release = consumeMouseRelease(state.input);

  const interactPressed = consumeInteract(state.input) ||
    (state.touchActive && consumeButtonPress(state.gamepad, "interact"));

  if (state.touchActive && consumeButtonPress(state.gamepad, "inventory")) {
    state.inventoryOpen = !state.inventoryOpen;
    state.placeMode.active = false;
    if (state.inventoryOpen) {
      state.activeRecipes = getPocketRecipes(state);
      state.craftingLabel = null;
    } else {
      returnHeldItem(state);
      state.openContainer = null;
      state.panelLayout = null;
      state.activeRecipes = null;
      state.craftingLabel = null;
    }
  }

  const attackPressed = state.touchActive && consumeButtonPress(state.gamepad, "attack");

  if (state.inventoryOpen) {
    handleInventoryPress(state, press);
    handleInventoryRelease(state, release);
    return { x: 0, y: 0 };
  }

  if (interactPressed) {
    handleInteraction(state);
  }

  if (state.placeMode.active && press) {
    handlePlaceModeClick(state, press);
  } else if ((press || attackPressed) && !state.player.attack.active) {
    handleAttackClick(state);
  }

  const kbAxis = readMovementAxis(state.input);
  const axis = state.touchActive
    ? mergeAxes(kbAxis, readDpadAxis(state.gamepad))
    : kbAxis;
  logMovementAxis(state, axis);
  return axis;
}

function mergeAxes(a, b) {
  const x = Math.abs(a.x) > Math.abs(b.x) ? a.x : b.x;
  const y = Math.abs(a.y) > Math.abs(b.y) ? a.y : b.y;
  return { x, y };
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
  const placedColliders = getPlacedObjectColliders(state.placedObjects);
  resolvePlayerBlockingCollision(state.player, previousPosition, state.world.loadedChunks, placedColliders);
  updatePlayerAnimation(state.player, axis, dtSeconds);
  updateAttack(state.player, dtSeconds);
  resolveAttackHits(state.player, state.enemySpawner.enemies);
  updateCameraFollow(state.camera, state.player.x, state.player.y);
  updateEnemySpawner(state.enemySpawner, state.camera, state.player, state.world.loadedChunks, dtSeconds);
  updateWorldStreaming(state);
  updateInteractionTargets(state);
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
  drawAttack(state.ctx, state.camera, state.player, worldToScreen, worldLengthToScreen);
  drawDecorBlockingLayer(state.ctx, state.camera, state.world.loadedChunks, state.world.chunkSize);
  drawPlacedObjects(state.ctx, state.camera, state.placedObjects);
  if (state.interaction.hoveredObject) {
    drawHoverHighlight(state.ctx, state.camera, state.interaction.hoveredObject);
  }
  if (state.interaction.interactableObject) {
    drawInteractionTooltip(state.ctx, state.camera, state.interaction.interactableObject);
  } else if (state.interaction.pickupableDecor) {
    drawDecorPickupTooltip(state.ctx, state.camera, state.interaction.pickupableDecor);
  }
  if (state.placeMode.active) {
    const mouseWorld = screenToWorld(state.camera, state.input.mouseX, state.input.mouseY);
    const snapped = snapToPlaceGrid(mouseWorld.x, mouseWorld.y);
    const def = getItemDef(state.placeMode.itemId);
    const valid = isPlacementValid(state, snapped.x, snapped.y, def.placeRadius);
    drawPlacementIndicator(state.ctx, state.camera, snapped.x, snapped.y, def, valid);
  }
  if (state.debug.collisionOverlayEnabled) {
    const placedColliders = getPlacedObjectColliders(state.placedObjects);
    drawCollisionDebugOverlay(
      state.ctx,
      state.camera,
      worldToScreen,
      worldLengthToScreen,
      state.player,
      state.world.loadedChunks,
      placedColliders
    );
  }
  drawHotbar(state.ctx, state.camera.viewWidth, state.camera.viewHeight, state.inventory, state.hotbarSelection);
  if (state.hasGrimoire) {
    drawGrimoireHint(state.ctx, state.camera.viewWidth, state.camera.viewHeight);
  }
  if (state.inventoryOpen) {
    const containerInv = state.openContainer ? state.openContainer.inventory : null;
    state.panelLayout = drawInventoryPanel(
      state.ctx,
      state.camera.viewWidth,
      state.camera.viewHeight,
      state.inventory,
      state.hotbarSelection,
      containerInv,
      state.activeRecipes,
      state.input.mouseX,
      state.input.mouseY,
      state.heldItem,
      state.craftingLabel,
    );
  } else {
    state.panelLayout = null;
  }
  if (state.touchActive) {
    const onlyBtn = state.inventoryOpen ? "inventory" : null;
    drawVirtualGamepad(state.ctx, state.gamepad, onlyBtn);
  }
  updateHud(state);
  drawDebugHud(state.ctx, state.debugHud);
}

function clearFrame(state) {
  state.ctx.fillStyle = "#1b1e28";
  state.ctx.fillRect(0, 0, state.camera.viewWidth, state.camera.viewHeight);
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

function handleInventoryPress(state, press) {
  if (!press) {
    return;
  }
  if (state.heldItem) {
    return;
  }

  const layout = state.panelLayout;
  if (!layout) {
    return;
  }

  if (layout.craftBounds) {
    const b = layout.craftBounds;
    const recipeIdx = hitTestCraftingPanel(press.x, press.y, b.craftX, b.craftY, b.craftWidth, state.activeRecipes.length);
    if (recipeIdx >= 0) {
      const recipe = state.activeRecipes[recipeIdx];
      if (canCraft(state.inventory, recipe)) {
        doCraft(state.inventory, recipe);
        if (recipe.output.itemId === "grimoire") {
          removeItemById(state.inventory, "grimoire", 1);
          state.hasGrimoire = true;
        }
      }
      return;
    }
  }

  const hit = hitTestInventorySlot(press.x, press.y, layout.slotGrids);
  if (!hit) {
    return;
  }
  const inv = hit.isContainer && state.openContainer ? state.openContainer.inventory : state.inventory;
  const slot = getSlot(inv, hit.slotIndex);
  if (slot) {
    state.heldItem = { itemId: slot.itemId, count: slot.count };
    inv.slots[hit.slotIndex] = null;
  }
}

function handleInventoryRelease(state, release) {
  if (!release || !state.heldItem) {
    return;
  }

  const layout = state.panelLayout;
  if (!layout) {
    returnHeldItem(state);
    return;
  }

  const hit = hitTestInventorySlot(release.x, release.y, layout.slotGrids);
  if (!hit) {
    return;
  }

  const inv = hit.isContainer && state.openContainer ? state.openContainer.inventory : state.inventory;
  const target = getSlot(inv, hit.slotIndex);

  if (!target) {
    inv.slots[hit.slotIndex] = { itemId: state.heldItem.itemId, count: state.heldItem.count };
    state.heldItem = null;
  } else if (target.itemId === state.heldItem.itemId) {
    const def = getItemDef(state.heldItem.itemId);
    const space = def.stackLimit - target.count;
    const transfer = Math.min(space, state.heldItem.count);
    target.count += transfer;
    state.heldItem.count -= transfer;
    if (state.heldItem.count <= 0) {
      state.heldItem = null;
    }
  } else {
    const temp = { itemId: target.itemId, count: target.count };
    inv.slots[hit.slotIndex] = { itemId: state.heldItem.itemId, count: state.heldItem.count };
    state.heldItem = temp;
  }
}

function tryEnterPlaceMode(state) {
  if (state.hotbarSelection < 0) {
    state.placeMode.active = false;
    return;
  }
  const slotIndex = HOTBAR_START_INDEX + state.hotbarSelection;
  const slot = getSlot(state.inventory, slotIndex);
  if (!slot) {
    state.placeMode.active = false;
    return;
  }
  const def = getItemDef(slot.itemId);
  if (def.placeable) {
    state.placeMode.active = true;
    state.placeMode.itemId = slot.itemId;
  } else {
    state.placeMode.active = false;
  }
}

function handlePlaceModeClick(state, press) {
  const mouseWorld = screenToWorld(state.camera, press.x, press.y);
  const snapped = snapToPlaceGrid(mouseWorld.x, mouseWorld.y);
  const def = getItemDef(state.placeMode.itemId);
  if (!isPlacementValid(state, snapped.x, snapped.y, def.placeRadius)) {
    return;
  }
  const slotIndex = HOTBAR_START_INDEX + state.hotbarSelection;
  const slot = getSlot(state.inventory, slotIndex);
  if (!slot || slot.itemId !== state.placeMode.itemId) {
    state.placeMode.active = false;
    return;
  }
  addPlacedObject(state.placedObjects, state.placeMode.itemId, snapped.x, snapped.y);
  removeItem(state.inventory, slotIndex, 1);
  state.placeMode.active = false;
}

function handleAttackClick(state) {
  let type = "swipe";
  let damage = 1;
  let range = 30;

  if (state.hotbarSelection >= 0) {
    const slotIndex = HOTBAR_START_INDEX + state.hotbarSelection;
    const slot = getSlot(state.inventory, slotIndex);
    if (slot) {
      const def = getItemDef(slot.itemId);
      if (def.weapon) {
        type = def.attackShape || "swipe";
        damage = def.damage || 1;
        range = def.attackRange || 30;
      }
    }
  }

  startAttack(state.player, type, damage, range);
}

function isPlacementValid(state, worldX, worldY, radius) {
  const chunkColliders = collectBlockingCircleColliders(state.world.loadedChunks);
  const placedColliders = getPlacedObjectColliders(state.placedObjects);
  const allColliders = chunkColliders.concat(placedColliders);
  return !isCollidingAt(worldX, worldY, radius, allColliders);
}

function returnHeldItem(state) {
  if (!state.heldItem) {
    return;
  }
  addItem(state.inventory, state.heldItem.itemId, state.heldItem.count);
  state.heldItem = null;
}

function updateInteractionTargets(state) {
  const mouseWorld = screenToWorld(state.camera, state.input.mouseX, state.input.mouseY);
  state.interaction.hoveredObject = findHoveredObject(mouseWorld.x, mouseWorld.y, state.placedObjects);
  state.interaction.interactableObject = findInteractableObject(state.player, state.placedObjects);
  state.interaction.pickupableDecor = state.interaction.interactableObject
    ? null
    : findPickupableDecor(state.player, state.world.loadedChunks, state.inventory);
}

function handleInteraction(state) {
  const target = state.interaction.interactableObject;
  if (target) {
    const def = getItemDef(target.itemId);
    if (def.useAction === "container" && target.container) {
      state.openContainer = target.container;
      state.activeRecipes = getPocketRecipes(state);
      state.inventoryOpen = true;
    } else if (def.useAction === "station-mortar") {
      state.activeRecipes = MORTAR_RECIPES;
      state.craftingLabel = "Mortar and Pestle";
      state.inventoryOpen = true;
    } else if (def.useAction === "station-drying-rack") {
      state.activeRecipes = DRYING_RACK_RECIPES;
      state.craftingLabel = "Drying Rack";
      state.inventoryOpen = true;
    } else if (def.useAction === "station-magic-circle") {
      state.activeRecipes = MAGIC_CIRCLE_RECIPES;
      state.craftingLabel = "Magic Circle";
      state.inventoryOpen = true;
    } else if (def.useAction === "station-campfire") {
      state.activeRecipes = CAMPFIRE_RECIPES;
      state.craftingLabel = "Campfire";
      state.inventoryOpen = true;
    } else if (def.useAction === "station-cauldron") {
      state.activeRecipes = CAULDRON_RECIPES;
      state.craftingLabel = "Cauldron";
      state.inventoryOpen = true;
    }
    return;
  }

  const pickup = state.interaction.pickupableDecor;
  if (pickup) {
    handleDecorPickup(state, pickup);
  }
}

function handleDecorPickup(state, pickup) {
  const { instance, decorDef, chunk } = pickup;
  const { itemId, count } = decorDef.pickup;
  const remaining = addItem(state.inventory, itemId, count);
  if (remaining > 0) {
    return;
  }
  removeDecorInstance(chunk, instance);
  invalidateChunkCanvases(chunk);
  state.interaction.pickupableDecor = null;
}

function getPocketRecipes(state) {
  if (state.hasGrimoire) {
    return POCKET_RECIPES.filter((r) => r.output.itemId !== "grimoire");
  }
  return POCKET_RECIPES;
}

function tryLockLandscape() {
  const orientation = screen.orientation;
  if (orientation && typeof orientation.lock === "function") {
    orientation.lock("landscape").catch(() => {});
  }
}

function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);
  const get = (prop) => parseFloat(style.getPropertyValue(prop)) || 0;
  return {
    top: get("--sai-top"),
    right: get("--sai-right"),
    bottom: get("--sai-bottom"),
    left: get("--sai-left"),
  };
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
