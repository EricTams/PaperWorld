import { DEFAULT_ANIMATION } from "./animation-defs.js";

export function createAnimationState() {
  return {
    currentAnim: DEFAULT_ANIMATION,
    frameIndex: 0,
    elapsed: 0,
    flipX: false,
  };
}

export function updateAnimation(animState, animName, dtSeconds, animationDefs) {
  if (animName !== animState.currentAnim) {
    animState.currentAnim = animName;
    animState.frameIndex = 0;
    animState.elapsed = 0;
  }

  const clip = animationDefs[animState.currentAnim];
  if (!clip) {
    return;
  }

  animState.elapsed += dtSeconds;
  while (animState.elapsed >= clip.frameDuration) {
    animState.elapsed -= clip.frameDuration;
    animState.frameIndex = (animState.frameIndex + 1) % clip.frames.length;
  }
}

export function getCurrentFrame(animState, animationDefs) {
  const clip = animationDefs[animState.currentAnim];
  if (!clip) {
    return null;
  }

  return clip.frames[animState.frameIndex];
}
