import { getItemDef } from "../../items/item-defs.js";
import { worldToScreen, worldLengthToScreen } from "../camera.js";
import { drawItemIcon } from "../ui/item-icons.js";

const INDICATOR_VALID_FILL = "rgba(80, 200, 80, 0.18)";
const INDICATOR_VALID_STROKE = "rgba(80, 200, 80, 0.7)";
const INDICATOR_BLOCKED_FILL = "rgba(220, 60, 60, 0.18)";
const INDICATOR_BLOCKED_STROKE = "rgba(220, 60, 60, 0.7)";
const INDICATOR_LINE_WIDTH = 2;
const INDICATOR_ICON_ALPHA = 0.55;

export function drawPlacedObjects(ctx, camera, store) {
  for (let i = 0; i < store.objects.length; i += 1) {
    const obj = store.objects[i];
    const def = getItemDef(obj.itemId);
    const screen = worldToScreen(camera, obj.x, obj.y);
    const screenSize = worldLengthToScreen(camera, obj.radius * 1.8);
    drawItemIcon(ctx, def, screen.x, screen.y, screenSize);
  }
}

export function drawPlacementIndicator(ctx, camera, worldX, worldY, itemDef, isValid) {
  const screen = worldToScreen(camera, worldX, worldY);
  const screenRadius = worldLengthToScreen(camera, itemDef.placeRadius);
  const screenIconSize = worldLengthToScreen(camera, itemDef.placeRadius * 1.8);

  ctx.fillStyle = isValid ? INDICATOR_VALID_FILL : INDICATOR_BLOCKED_FILL;
  ctx.beginPath();
  ctx.arc(screen.x, screen.y, screenRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isValid ? INDICATOR_VALID_STROKE : INDICATOR_BLOCKED_STROKE;
  ctx.lineWidth = INDICATOR_LINE_WIDTH;
  ctx.beginPath();
  ctx.arc(screen.x, screen.y, screenRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.save();
  ctx.globalAlpha = INDICATOR_ICON_ALPHA;
  drawItemIcon(ctx, itemDef, screen.x, screen.y, screenIconSize);
  ctx.restore();
}
