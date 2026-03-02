import { getItemDef } from "../../items/item-defs.js";
import { drawItemIcon } from "./item-icons.js";

const HINT_SIZE = 40;
const HINT_PADDING = 6;
const HINT_CORNER_RADIUS = 6;
const HINT_BG = "rgba(30, 25, 20, 0.72)";
const HINT_BORDER = "rgba(140, 100, 200, 0.5)";
const HINT_BORDER_WIDTH = 1.5;
const HINT_BOTTOM_MARGIN = 12;
const HOTBAR_SLOT_SIZE = 40;
const HOTBAR_SLOT_GAP = 4;
const HOTBAR_SLOT_COUNT = 9;
const HOTBAR_PADDING = 6;
const KEY_BADGE_OFFSET_Y = 4;

const KEY_BG = "rgba(30, 30, 30, 0.85)";
const KEY_BORDER = "rgba(140, 100, 200, 0.6)";
const KEY_COLOR = "#e0d0f0";
const KEY_FONT = "bold 10px monospace";
const KEY_BADGE_R = 3;

export function drawGrimoireHint(ctx, canvasWidth, canvasHeight) {
  const hotbarWidth = HOTBAR_SLOT_COUNT * HOTBAR_SLOT_SIZE + (HOTBAR_SLOT_COUNT - 1) * HOTBAR_SLOT_GAP + HOTBAR_PADDING * 2;
  const boxW = HINT_SIZE + HINT_PADDING * 2;
  const boxH = HINT_SIZE + HINT_PADDING * 2;
  const hotbarX = Math.floor((canvasWidth - hotbarWidth) * 0.5);
  const boxX = hotbarX + hotbarWidth + 8;
  const boxY = canvasHeight - boxH - HINT_BOTTOM_MARGIN;

  ctx.fillStyle = HINT_BG;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, HINT_CORNER_RADIUS);
  ctx.fill();

  ctx.strokeStyle = HINT_BORDER;
  ctx.lineWidth = HINT_BORDER_WIDTH;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, HINT_CORNER_RADIUS);
  ctx.stroke();

  const iconCx = boxX + boxW * 0.5;
  const iconCy = boxY + boxH * 0.5;
  const grimDef = getItemDef("grimoire");
  drawItemIcon(ctx, grimDef, iconCx, iconCy, HINT_SIZE * 0.7);

  const keyText = "G";
  ctx.font = KEY_FONT;
  const keyW = ctx.measureText(keyText).width + 8;
  const keyH = 14;
  const keyX = boxX + boxW - keyW * 0.5 - 2;
  const keyY = boxY + boxH - keyH + KEY_BADGE_OFFSET_Y;

  ctx.fillStyle = KEY_BG;
  ctx.beginPath();
  ctx.roundRect(keyX - keyW * 0.5, keyY, keyW, keyH, KEY_BADGE_R);
  ctx.fill();

  ctx.strokeStyle = KEY_BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(keyX - keyW * 0.5, keyY, keyW, keyH, KEY_BADGE_R);
  ctx.stroke();

  ctx.fillStyle = KEY_COLOR;
  ctx.font = KEY_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(keyText, keyX, keyY + keyH * 0.5);
}
