export const ENEMY_TYPES = {
  slime: {
    animations: {
      idle: { frames: ["slime"], frameDuration: 1 },
      walk: { frames: ["slime", "slime_walk"], frameDuration: 0.25 },
    },
    size: 18,
    collisionRadius: 7,
    speed: 40,
  },
  snail: {
    animations: {
      idle: { frames: ["snail"], frameDuration: 1 },
      walk: { frames: ["snail", "snail_walk"], frameDuration: 0.3 },
    },
    size: 20,
    collisionRadius: 8,
    speed: 25,
  },
  mouse: {
    animations: {
      idle: { frames: ["mouse"], frameDuration: 1 },
      walk: { frames: ["mouse", "mouse_walk"], frameDuration: 0.15 },
    },
    size: 18,
    collisionRadius: 7,
    speed: 60,
  },
  bat: {
    animations: {
      idle: { frames: ["bat", "bat_fly"], frameDuration: 0.2 },
      walk: { frames: ["bat", "bat_fly"], frameDuration: 0.2 },
    },
    size: 22,
    collisionRadius: 8,
    speed: 55,
    alwaysAnimate: true,
  },
  bee: {
    animations: {
      idle: { frames: ["bee", "bee_fly"], frameDuration: 0.15 },
      walk: { frames: ["bee", "bee_fly"], frameDuration: 0.15 },
    },
    size: 18,
    collisionRadius: 7,
    speed: 50,
    alwaysAnimate: true,
  },
  fly: {
    animations: {
      idle: { frames: ["fly", "fly_fly"], frameDuration: 0.15 },
      walk: { frames: ["fly", "fly_fly"], frameDuration: 0.15 },
    },
    size: 18,
    collisionRadius: 7,
    speed: 55,
    alwaysAnimate: true,
  },
  frog: {
    animations: {
      idle: { frames: ["frog"], frameDuration: 1 },
      walk: { frames: ["frog", "frog_leap"], frameDuration: 0.3 },
    },
    size: 20,
    collisionRadius: 8,
    speed: 45,
  },
  ladyBug: {
    animations: {
      idle: { frames: ["ladyBug"], frameDuration: 1 },
      walk: { frames: ["ladyBug", "ladyBug_walk"], frameDuration: 0.2 },
    },
    size: 18,
    collisionRadius: 7,
    speed: 35,
  },
  spider: {
    animations: {
      idle: { frames: ["spider"], frameDuration: 1 },
      walk: { frames: ["spider_walk1", "spider_walk2"], frameDuration: 0.2 },
    },
    size: 24,
    collisionRadius: 9,
    speed: 45,
  },
  snake: {
    animations: {
      idle: { frames: ["snake"], frameDuration: 1 },
      walk: { frames: ["snake", "snake_walk"], frameDuration: 0.2 },
    },
    size: 18,
    collisionRadius: 7,
    speed: 50,
  },
};

export const ENEMY_TYPE_NAMES = Object.keys(ENEMY_TYPES);
