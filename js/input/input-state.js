export function createInputState() {
  return {
    heldKeys: new Set(),
    toggleDebugRequested: false,
    toggleChunkGridRequested: false,
    toggleCollisionOverlayRequested: false,
    cycleBiomesRequested: false,
    toggleZoomRequested: false,
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
  });

  eventTarget.addEventListener("keyup", (event) => {
    inputState.heldKeys.delete(event.code);
  });

  eventTarget.addEventListener("blur", () => {
    inputState.heldKeys.clear();
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

function axisFromKeys(heldKeys, negativeKeys, positiveKeys) {
  const negative = negativeKeys.some((code) => heldKeys.has(code)) ? -1 : 0;
  const positive = positiveKeys.some((code) => heldKeys.has(code)) ? 1 : 0;
  return negative + positive;
}
