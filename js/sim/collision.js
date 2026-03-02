import { getDecorDefById } from "../world/decor/defs.js";

const HEAD_ON_APPROACH_THRESHOLD = 0.9;
const MAX_SEPARATION_PASSES = 4;
const SEPARATION_EPSILON = 0.001;

export function resolvePlayerBlockingCollision(player, previousPosition, chunks, extraColliders) {
  const colliders = collectBlockingCircleColliders(chunks);
  if (extraColliders) {
    for (let i = 0; i < extraColliders.length; i += 1) {
      colliders.push(extraColliders[i]);
    }
  }
  const movement = {
    x: player.x - previousPosition.x,
    y: player.y - previousPosition.y,
  };
  const resolved = resolveCircleMovement(previousPosition, movement, player.collisionRadius, colliders);
  player.x = resolved.x;
  player.y = resolved.y;
}

export function drawCollisionDebugOverlay(ctx, camera, worldToScreen, worldLengthToScreen, player, chunks, extraColliders) {
  const colliders = collectBlockingCircleColliders(chunks);
  if (extraColliders) {
    for (let i = 0; i < extraColliders.length; i += 1) {
      colliders.push(extraColliders[i]);
    }
  }
  drawBlockingColliders(ctx, camera, worldToScreen, worldLengthToScreen, colliders);
  drawPlayerCollisionBody(ctx, camera, worldToScreen, worldLengthToScreen, player);
}

function resolveCircleMovement(previousPosition, movement, playerRadius, colliders) {
  const movementLength = Math.hypot(movement.x, movement.y);
  let candidate = {
    x: previousPosition.x + movement.x,
    y: previousPosition.y + movement.y,
  };
  candidate = separateFromColliders(candidate, playerRadius, colliders);
  if (!isCollidingAt(candidate.x, candidate.y, playerRadius, colliders)) {
    return candidate;
  }
  if (movementLength === 0) {
    return previousPosition;
  }

  const movementDir = {
    x: movement.x / movementLength,
    y: movement.y / movementLength,
  };
  const collision = findFirstCollision(candidate.x, candidate.y, playerRadius, colliders);
  if (!collision) {
    return candidate;
  }

  const normal = getCollisionNormal(candidate.x, candidate.y, collision, movementDir);
  const approach = -dot(movementDir, normal);
  if (approach >= HEAD_ON_APPROACH_THRESHOLD) {
    return previousPosition;
  }

  const slideVector = projectMovementToTangent(movement, normal);
  const slideCandidate = {
    x: previousPosition.x + slideVector.x,
    y: previousPosition.y + slideVector.y,
  };
  const resolvedSlide = separateFromColliders(slideCandidate, playerRadius, colliders);
  if (isCollidingAt(resolvedSlide.x, resolvedSlide.y, playerRadius, colliders)) {
    return previousPosition;
  }
  return resolvedSlide;
}

export function collectBlockingCircleColliders(chunks) {
  const colliders = [];
  chunks.forEach((chunk) => appendChunkBlockingColliders(colliders, chunk));
  return colliders;
}

function drawBlockingColliders(ctx, camera, worldToScreen, worldLengthToScreen, colliders) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 70, 70, 0.9)";
  ctx.lineWidth = 2;
  colliders.forEach((collider) => {
    const center = worldToScreen(camera, collider.x, collider.y);
    const radius = worldLengthToScreen(camera, collider.radius);
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();
}

function drawPlayerCollisionBody(ctx, camera, worldToScreen, worldLengthToScreen, player) {
  const center = worldToScreen(camera, player.x, player.y);
  const radius = worldLengthToScreen(camera, player.collisionRadius);
  ctx.save();
  ctx.strokeStyle = "rgba(85, 180, 255, 0.95)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function appendChunkBlockingColliders(colliders, chunk) {
  if (!chunk.decorBlocking) {
    return;
  }
  chunk.decorBlocking.forEach((instance) => colliders.push(toCircleCollider(instance)));
}

function toCircleCollider(instance) {
  const decorDef = getDecorDefById(instance.decorId);
  if (decorDef.footprint.kind !== "circle") {
    throw new Error(`Unsupported footprint kind "${decorDef.footprint.kind}".`);
  }
  return {
    x: instance.x,
    y: instance.y,
    radius: decorDef.footprint.radius,
  };
}

export function isCollidingAt(playerX, playerY, radius, colliders) {
  for (let i = 0; i < colliders.length; i += 1) {
    if (intersectsCircleCircle(playerX, playerY, radius, colliders[i])) {
      return true;
    }
  }
  return false;
}

function intersectsCircleCircle(x, y, radius, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  const sumRadius = radius + circle.radius;
  return dx * dx + dy * dy < sumRadius * sumRadius;
}

function findFirstCollision(x, y, radius, colliders) {
  for (let i = 0; i < colliders.length; i += 1) {
    if (intersectsCircleCircle(x, y, radius, colliders[i])) {
      return colliders[i];
    }
  }
  return null;
}

function getCollisionNormal(x, y, circle, movementDir) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  const distance = Math.hypot(dx, dy);
  if (distance > SEPARATION_EPSILON) {
    return { x: dx / distance, y: dy / distance };
  }
  return { x: -movementDir.x, y: -movementDir.y };
}

function projectMovementToTangent(movement, normal) {
  const alongNormal = dot(movement, normal);
  return {
    x: movement.x - normal.x * alongNormal,
    y: movement.y - normal.y * alongNormal,
  };
}

export function separateFromColliders(position, radius, colliders) {
  const resolved = { x: position.x, y: position.y };
  for (let pass = 0; pass < MAX_SEPARATION_PASSES; pass += 1) {
    let adjusted = false;
    for (let i = 0; i < colliders.length; i += 1) {
      const separation = getSeparationVector(resolved.x, resolved.y, radius, colliders[i]);
      if (!separation) {
        continue;
      }
      resolved.x += separation.x;
      resolved.y += separation.y;
      adjusted = true;
    }
    if (!adjusted) {
      break;
    }
  }
  return resolved;
}

function getSeparationVector(x, y, radius, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  const distance = Math.hypot(dx, dy);
  const minDistance = radius + circle.radius;
  if (distance >= minDistance) {
    return null;
  }
  if (distance <= SEPARATION_EPSILON) {
    return { x: minDistance + SEPARATION_EPSILON, y: 0 };
  }
  const pushDistance = minDistance - distance + SEPARATION_EPSILON;
  return {
    x: (dx / distance) * pushDistance,
    y: (dy / distance) * pushDistance,
  };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}
