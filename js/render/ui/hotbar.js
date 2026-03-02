import { getItemDef } from "../../items/item-defs.js";
import { getSlot, HOTBAR_START_INDEX } from "../../items/inventory.js";
import { drawItemIcon } from "./item-icons.js";

const SLOT_SIZE = 40;
const SLOT_GAP = 4;
const SLOT_COUNT = 9;
const BAR_PADDING = 6;
const BAR_BOTTOM_MARGIN = 12;
const BAR_CORNER_RADIUS = 6;

const BAR_BG_COLOR = "rgba(30, 25, 20, 0.72)";
const SLOT_BG_COLOR = "rgba(60, 55, 45, 0.6)";
const SLOT_SELECTED_BORDER = "#e8d8a0";
const SLOT_BORDER_COLOR = "rgba(120, 110, 90, 0.5)";
const SLOT_CORNER_RADIUS = 4;
const SELECTED_BORDER_WIDTH = 2.5;
const NORMAL_BORDER_WIDTH = 1;

const COUNT_FONT = "bold 11px monospace";
const COUNT_COLOR = "#ffffff";
const COUNT_SHADOW_COLOR = "rgba(0, 0, 0, 0.7)";

export function drawHotbar(ctx, canvasWidth, canvasHeight, inventory, selectedSlot) {
  const barWidth = SLOT_COUNT * SLOT_SIZE + (SLOT_COUNT - 1) * SLOT_GAP + BAR_PADDING * 2;
  const barHeight = SLOT_SIZE + BAR_PADDING * 2;
  const barX = Math.floor((canvasWidth - barWidth) * 0.5);
  const barY = canvasHeight - barHeight - BAR_BOTTOM_MARGIN;

  drawBarBackground(ctx, barX, barY, barWidth, barHeight);

  for (let i = 0; i < SLOT_COUNT; i += 1) {
    const slotX = barX + BAR_PADDING + i * (SLOT_SIZE + SLOT_GAP);
    const slotY = barY + BAR_PADDING;
    const isSelected = i === selectedSlot;
    drawSlot(ctx, slotX, slotY, isSelected);

    const invIndex = HOTBAR_START_INDEX + i;
    const slot = getSlot(inventory, invIndex);
    if (slot) {
      const def = getItemDef(slot.itemId);
      const iconCx = slotX + SLOT_SIZE * 0.5;
      const iconCy = slotY + SLOT_SIZE * 0.5;
      drawItemIcon(ctx, def, iconCx, iconCy, SLOT_SIZE * 0.75);
      if (slot.count > 1) {
        drawStackCount(ctx, slotX, slotY, slot.count);
      }
    }
  }
}

function drawBarBackground(ctx, x, y, w, h) {
  ctx.fillStyle = BAR_BG_COLOR;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, BAR_CORNER_RADIUS);
  ctx.fill();
}

function drawSlot(ctx, x, y, isSelected) {
  ctx.fillStyle = SLOT_BG_COLOR;
  ctx.beginPath();
  ctx.roundRect(x, y, SLOT_SIZE, SLOT_SIZE, SLOT_CORNER_RADIUS);
  ctx.fill();

  ctx.strokeStyle = isSelected ? SLOT_SELECTED_BORDER : SLOT_BORDER_COLOR;
  ctx.lineWidth = isSelected ? SELECTED_BORDER_WIDTH : NORMAL_BORDER_WIDTH;
  ctx.beginPath();
  ctx.roundRect(x, y, SLOT_SIZE, SLOT_SIZE, SLOT_CORNER_RADIUS);
  ctx.stroke();
}

function drawStackCount(ctx, slotX, slotY, count) {
  const text = String(count);
  const tx = slotX + SLOT_SIZE - 4;
  const ty = slotY + SLOT_SIZE - 4;

  ctx.font = COUNT_FONT;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";

  ctx.fillStyle = COUNT_SHADOW_COLOR;
  ctx.fillText(text, tx + 1, ty + 1);

  ctx.fillStyle = COUNT_COLOR;
  ctx.fillText(text, tx, ty);
}
