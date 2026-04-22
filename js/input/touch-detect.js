let touchSupported = null;

export function isTouchDevice() {
  if (touchSupported !== null) {
    return touchSupported;
  }
  touchSupported =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;
  return touchSupported;
}
