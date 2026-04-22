const DPAD_RADIUS = 54;
const DPAD_KNOB_RADIUS = 24;
const DPAD_DEAD_ZONE = 8;
const DPAD_MARGIN_X = 28;
const DPAD_MARGIN_Y = 28;

const BTN_RADIUS = 26;
const BTN_MARGIN_X = 28;
const BTN_MARGIN_Y = 28;
const BTN_GAP = 14;

const BG_COLOR = "rgba(255, 255, 255, 0.10)";
const BG_STROKE = "rgba(255, 255, 255, 0.20)";
const KNOB_COLOR = "rgba(255, 255, 255, 0.30)";
const KNOB_ACTIVE = "rgba(255, 255, 255, 0.50)";
const BTN_COLOR = "rgba(255, 255, 255, 0.12)";
const BTN_STROKE = "rgba(255, 255, 255, 0.25)";
const BTN_ACTIVE_COLOR = "rgba(255, 255, 255, 0.35)";
const BTN_LABEL_COLOR = "rgba(255, 255, 255, 0.55)";
const BTN_LABEL_ACTIVE = "rgba(255, 255, 255, 0.85)";
const BTN_FONT = "bold 13px sans-serif";

export function createVirtualGamepad() {
  return {
    active: false,
    dpad: {
      cx: 0,
      cy: 0,
      touchId: null,
      ax: 0,
      ay: 0,
    },
    buttons: [],
    layout: null,
  };
}

const BUTTON_DEFS = [
  { id: "attack", label: "ATK" },
  { id: "interact", label: "USE" },
  { id: "inventory", label: "BAG" },
];

export function layoutGamepad(gamepad, canvasWidth, canvasHeight, insets) {
  const safeLeft = (insets && insets.left) || 0;
  const safeRight = (insets && insets.right) || 0;
  const safeBottom = (insets && insets.bottom) || 0;

  const dpadCx = safeLeft + DPAD_MARGIN_X + DPAD_RADIUS;
  const dpadCy = canvasHeight - safeBottom - DPAD_MARGIN_Y - DPAD_RADIUS;
  gamepad.dpad.cx = dpadCx;
  gamepad.dpad.cy = dpadCy;

  const btnCount = BUTTON_DEFS.length;
  const totalBtnHeight = btnCount * (BTN_RADIUS * 2) + (btnCount - 1) * BTN_GAP;
  const btnBaseX = canvasWidth - safeRight - BTN_MARGIN_X - BTN_RADIUS;
  const btnBaseY = canvasHeight - safeBottom - BTN_MARGIN_Y - totalBtnHeight + BTN_RADIUS;

  gamepad.buttons = BUTTON_DEFS.map((def, i) => ({
    id: def.id,
    label: def.label,
    cx: btnBaseX,
    cy: btnBaseY + i * (BTN_RADIUS * 2 + BTN_GAP),
    radius: BTN_RADIUS,
    touchId: null,
    pressed: false,
    justPressed: false,
  }));

  gamepad.layout = { canvasWidth, canvasHeight };
}

export function attachTouchListeners(gamepad, canvas, inputState) {
  canvas.addEventListener("touchstart", (e) => onTouchStart(gamepad, inputState, e), { passive: false });
  canvas.addEventListener("touchmove", (e) => onTouchMove(gamepad, inputState, e), { passive: false });
  canvas.addEventListener("touchend", (e) => onTouchEnd(gamepad, inputState, e), { passive: false });
  canvas.addEventListener("touchcancel", (e) => onTouchEnd(gamepad, inputState, e), { passive: false });
  gamepad.active = true;
}

function onTouchStart(gamepad, inputState, e) {
  e.preventDefault();
  for (const touch of e.changedTouches) {
    const tx = touch.clientX;
    const ty = touch.clientY;

    if (tryDpadStart(gamepad, touch.identifier, tx, ty)) {
      continue;
    }
    if (tryButtonStart(gamepad, touch.identifier, tx, ty)) {
      continue;
    }
    if (inputState) {
      inputState.mouseX = tx;
      inputState.mouseY = ty;
      inputState.mouseClickX = tx;
      inputState.mouseClickY = ty;
    }
  }
}

function onTouchMove(gamepad, inputState, e) {
  e.preventDefault();
  for (const touch of e.changedTouches) {
    if (touch.identifier === gamepad.dpad.touchId) {
      updateDpadAxis(gamepad, touch.clientX, touch.clientY);
    } else if (inputState) {
      inputState.mouseX = touch.clientX;
      inputState.mouseY = touch.clientY;
    }
  }
}

function onTouchEnd(gamepad, inputState, e) {
  e.preventDefault();
  for (const touch of e.changedTouches) {
    if (touch.identifier === gamepad.dpad.touchId) {
      gamepad.dpad.touchId = null;
      gamepad.dpad.ax = 0;
      gamepad.dpad.ay = 0;
      continue;
    }
    let isButton = false;
    for (const btn of gamepad.buttons) {
      if (btn.touchId === touch.identifier) {
        btn.touchId = null;
        btn.pressed = false;
        isButton = true;
      }
    }
    if (!isButton && inputState) {
      inputState.mouseReleaseX = touch.clientX;
      inputState.mouseReleaseY = touch.clientY;
    }
  }
}

function tryDpadStart(gamepad, touchId, tx, ty) {
  const dx = tx - gamepad.dpad.cx;
  const dy = ty - gamepad.dpad.cy;
  const dist = Math.hypot(dx, dy);
  const hitRadius = DPAD_RADIUS * 1.4;
  if (dist > hitRadius) {
    return false;
  }
  gamepad.dpad.touchId = touchId;
  updateDpadAxis(gamepad, tx, ty);
  return true;
}

function updateDpadAxis(gamepad, tx, ty) {
  const dx = tx - gamepad.dpad.cx;
  const dy = ty - gamepad.dpad.cy;
  const dist = Math.hypot(dx, dy);
  if (dist < DPAD_DEAD_ZONE) {
    gamepad.dpad.ax = 0;
    gamepad.dpad.ay = 0;
    return;
  }
  gamepad.dpad.ax = clamp(dx / DPAD_RADIUS, -1, 1);
  gamepad.dpad.ay = clamp(dy / DPAD_RADIUS, -1, 1);
}

function tryButtonStart(gamepad, touchId, tx, ty) {
  for (const btn of gamepad.buttons) {
    const dx = tx - btn.cx;
    const dy = ty - btn.cy;
    if (Math.hypot(dx, dy) <= btn.radius * 1.5) {
      btn.touchId = touchId;
      btn.pressed = true;
      btn.justPressed = true;
      return true;
    }
  }
  return false;
}

export function consumeButtonPress(gamepad, buttonId) {
  for (const btn of gamepad.buttons) {
    if (btn.id === buttonId && btn.justPressed) {
      btn.justPressed = false;
      return true;
    }
  }
  return false;
}

export function readDpadAxis(gamepad) {
  return { x: gamepad.dpad.ax, y: gamepad.dpad.ay };
}

export function drawVirtualGamepad(ctx, gamepad, onlyButtonId) {
  if (!gamepad.active) {
    return;
  }
  if (!onlyButtonId) {
    drawDpad(ctx, gamepad.dpad);
  }
  for (const btn of gamepad.buttons) {
    if (!onlyButtonId || btn.id === onlyButtonId) {
      drawButton(ctx, btn);
    }
  }
}

function drawDpad(ctx, dpad) {
  const active = dpad.touchId !== null;

  ctx.beginPath();
  ctx.arc(dpad.cx, dpad.cy, DPAD_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = BG_COLOR;
  ctx.fill();
  ctx.strokeStyle = BG_STROKE;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const knobX = dpad.cx + dpad.ax * (DPAD_RADIUS - DPAD_KNOB_RADIUS);
  const knobY = dpad.cy + dpad.ay * (DPAD_RADIUS - DPAD_KNOB_RADIUS);
  ctx.beginPath();
  ctx.arc(knobX, knobY, DPAD_KNOB_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = active ? KNOB_ACTIVE : KNOB_COLOR;
  ctx.fill();
}

function drawButton(ctx, btn) {
  const active = btn.pressed;

  ctx.beginPath();
  ctx.arc(btn.cx, btn.cy, btn.radius, 0, Math.PI * 2);
  ctx.fillStyle = active ? BTN_ACTIVE_COLOR : BTN_COLOR;
  ctx.fill();
  ctx.strokeStyle = BTN_STROKE;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = BTN_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = active ? BTN_LABEL_ACTIVE : BTN_LABEL_COLOR;
  ctx.fillText(btn.label, btn.cx, btn.cy);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
