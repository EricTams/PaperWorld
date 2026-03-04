export function createInputState() {
  return {
    heldKeys: new Set(),
    toggleDebugRequested: false,
    toggleChunkGridRequested: false,
    toggleCollisionOverlayRequested: false,
    cycleBiomesRequested: false,
    toggleZoomRequested: false,
    toggleInventoryRequested: false,
    hotbarSlotRequested: -1,
    mouseX: 0,
    mouseY: 0,
    mouseClickX: -1,
    mouseClickY: -1,
    mouseReleaseX: -1,
    mouseReleaseY: -1,
    cancelPlaceRequested: false,
    interactRequested: false,
    toggleGrimoireRequested: false,
    rightClickRequested: false,
  };
}

export function attachInputListeners(inputState, eventTarget = window) {
  eventTarget.addEventListener("keydown", (event) => {
    inputState.heldKeys.add(event.code);
    if (event.code === "F3") {
      inputState.toggleDebugRequested = true;
      event.preventDefault();
    }
    if (event.code === "F4") {
      inputState.toggleChunkGridRequested = true;
      event.preventDefault();
    }
    if (event.code === "F5") {
      inputState.toggleCollisionOverlayRequested = true;
      event.preventDefault();
    }
    if (event.code === "Equal") {
      inputState.cycleBiomesRequested = true;
      event.preventDefault();
    }
    if (event.code === "KeyZ") {
      inputState.toggleZoomRequested = true;
      event.preventDefault();
    }
    if (event.code === "Tab") {
      inputState.toggleInventoryRequested = true;
      event.preventDefault();
    }
    if (event.code === "Escape") {
      inputState.cancelPlaceRequested = true;
    }
    if (event.code === "KeyE") {
      inputState.interactRequested = true;
    }
    if (event.code === "KeyG") {
      inputState.toggleGrimoireRequested = true;
    }
    if (event.code >= "Digit1" && event.code <= "Digit9") {
      inputState.hotbarSlotRequested = parseInt(event.code.charAt(5), 10) - 1;
      event.preventDefault();
    }
  });

  eventTarget.addEventListener("keyup", (event) => {
    inputState.heldKeys.delete(event.code);
  });

  eventTarget.addEventListener("blur", () => {
    inputState.heldKeys.clear();
  });

  eventTarget.addEventListener("mousemove", (event) => {
    inputState.mouseX = event.clientX;
    inputState.mouseY = event.clientY;
  });

  eventTarget.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
      inputState.mouseClickX = event.clientX;
      inputState.mouseClickY = event.clientY;
    }
    if (event.button === 2) {
      inputState.rightClickRequested = true;
    }
  });

  eventTarget.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  eventTarget.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
      inputState.mouseReleaseX = event.clientX;
      inputState.mouseReleaseY = event.clientY;
    }
  });
}

export function readMovementAxis(inputState) {
  const x = axisFromKeys(inputState.heldKeys, ["KeyA", "ArrowLeft"], ["KeyD", "ArrowRight"]);
  const y = axisFromKeys(inputState.heldKeys, ["KeyW", "ArrowUp"], ["KeyS", "ArrowDown"]);
  return { x, y };
}

export function consumeDebugToggle(inputState) {
  const requested = inputState.toggleDebugRequested;
  inputState.toggleDebugRequested = false;
  return requested;
}

export function consumeChunkGridToggle(inputState) {
  const requested = inputState.toggleChunkGridRequested;
  inputState.toggleChunkGridRequested = false;
  return requested;
}

export function consumeCollisionOverlayToggle(inputState) {
  const requested = inputState.toggleCollisionOverlayRequested;
  inputState.toggleCollisionOverlayRequested = false;
  return requested;
}

export function consumeCycleBiomes(inputState) {
  const requested = inputState.cycleBiomesRequested;
  inputState.cycleBiomesRequested = false;
  return requested;
}

export function consumeZoomToggle(inputState) {
  const requested = inputState.toggleZoomRequested;
  inputState.toggleZoomRequested = false;
  return requested;
}

export function consumeInventoryToggle(inputState) {
  const requested = inputState.toggleInventoryRequested;
  inputState.toggleInventoryRequested = false;
  return requested;
}

export function consumeHotbarSlot(inputState) {
  const slot = inputState.hotbarSlotRequested;
  inputState.hotbarSlotRequested = -1;
  return slot;
}

export function consumeMouseClick(inputState) {
  const x = inputState.mouseClickX;
  const y = inputState.mouseClickY;
  inputState.mouseClickX = -1;
  inputState.mouseClickY = -1;
  if (x < 0 || y < 0) {
    return null;
  }
  return { x, y };
}

export function consumeCancelPlace(inputState) {
  const requested = inputState.cancelPlaceRequested;
  inputState.cancelPlaceRequested = false;
  return requested;
}

export function consumeGrimoireToggle(inputState) {
  const requested = inputState.toggleGrimoireRequested;
  inputState.toggleGrimoireRequested = false;
  return requested;
}

export function consumeInteract(inputState) {
  const requested = inputState.interactRequested;
  inputState.interactRequested = false;
  return requested;
}

export function consumeMouseRelease(inputState) {
  const x = inputState.mouseReleaseX;
  const y = inputState.mouseReleaseY;
  inputState.mouseReleaseX = -1;
  inputState.mouseReleaseY = -1;
  if (x < 0 || y < 0) {
    return null;
  }
  return { x, y };
}

export function consumeRightClick(inputState) {
  const requested = inputState.rightClickRequested;
  inputState.rightClickRequested = false;
  return requested;
}

function axisFromKeys(heldKeys, negativeKeys, positiveKeys) {
  const negative = negativeKeys.some((code) => heldKeys.has(code)) ? -1 : 0;
  const positive = positiveKeys.some((code) => heldKeys.has(code)) ? 1 : 0;
  return negative + positive;
}
