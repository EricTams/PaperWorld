import { getItemDef } from "../../items/item-defs.js";
import { getSlot, HOTBAR_START_INDEX } from "../../items/inventory.js";
import { drawItemIcon } from "./item-icons.js";
import { drawCraftingPanel, getCraftingPanelHeight } from "./crafting-panel.js";

const COLS = 9;
const MAIN_ROWS = 3;
const HOTBAR_ROWS = 1;
const CONTAINER_ROWS = 3;
const CONTAINER_COLS = 9;

export const SLOT_SIZE = 40;
export const SLOT_GAP = 4;
const SECTION_GAP = 12;
const PANEL_PADDING = 14;
const PANEL_CORNER_RADIUS = 8;
const SLOT_CORNER_RADIUS = 4;
const COLUMN_GAP = 18;
const CRAFT_PANEL_WIDTH = 220;

const OVERLAY_COLOR = "rgba(0, 0, 0, 0.45)";
const PANEL_BG_COLOR = "rgba(40, 35, 28, 0.92)";
const SLOT_BG_COLOR = "rgba(60, 55, 45, 0.6)";
const SLOT_BORDER_COLOR = "rgba(120, 110, 90, 0.5)";
const SLOT_HOVER_BG = "rgba(90, 80, 55, 0.7)";
const SLOT_HOVER_BORDER = "#e8d8a0";
const HOTBAR_SELECTED_BORDER = "#e8d8a0";
const NORMAL_BORDER_WIDTH = 1;
const SELECTED_BORDER_WIDTH = 2.5;
const HOVER_BORDER_WIDTH = 2;

const LABEL_FONT = "12px monospace";
const LABEL_COLOR = "rgba(200, 190, 170, 0.85)";
const COUNT_FONT = "bold 11px monospace";
const COUNT_COLOR = "#ffffff";
const COUNT_SHADOW_COLOR = "rgba(0, 0, 0, 0.7)";

const TOOLTIP_FONT = "12px monospace";
const TOOLTIP_COLOR = "#f0e8d8";
const TOOLTIP_BG = "rgba(20, 18, 14, 0.92)";
const TOOLTIP_BORDER = "rgba(160, 145, 110, 0.6)";
const TOOLTIP_PAD_X = 8;
const TOOLTIP_PAD_Y = 5;
const TOOLTIP_OFFSET_Y = 10;
const TOOLTIP_CORNER_RADIUS = 4;

export function drawInventoryPanel(
  ctx, canvasWidth, canvasHeight,
  inventory, selectedHotbarSlot, container,
  recipes, mouseX, mouseY, heldItem,
  craftingLabel,
) {
  ctx.fillStyle = OVERLAY_COLOR;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const gridWidth = COLS * SLOT_SIZE + (COLS - 1) * SLOT_GAP;
  const hasContainer = container !== null;
  const hasRecipes = recipes && recipes.length > 0;

  const mainHeight = MAIN_ROWS * SLOT_SIZE + (MAIN_ROWS - 1) * SLOT_GAP;
  const hotbarHeight = SLOT_SIZE;
  const containerHeight = hasContainer
    ? CONTAINER_ROWS * SLOT_SIZE + (CONTAINER_ROWS - 1) * SLOT_GAP
    : 0;

  const labelHeight = 16;
  let leftContentHeight = labelHeight + mainHeight + SECTION_GAP + labelHeight + hotbarHeight;
  if (hasContainer) {
    leftContentHeight = labelHeight + containerHeight + SECTION_GAP + leftContentHeight;
  }

  const craftContentHeight = hasRecipes
    ? labelHeight + getCraftingPanelHeight(recipes.length)
    : 0;

  const contentHeight = Math.max(leftContentHeight, craftContentHeight);
  const rightColumnWidth = hasRecipes ? COLUMN_GAP + CRAFT_PANEL_WIDTH : 0;

  const panelW = gridWidth + rightColumnWidth + PANEL_PADDING * 2;
  const panelH = contentHeight + PANEL_PADDING * 2;
  const panelX = Math.floor((canvasWidth - panelW) * 0.5);
  const panelY = Math.floor((canvasHeight - panelH) * 0.5);

  ctx.fillStyle = PANEL_BG_COLOR;
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelW, panelH, PANEL_CORNER_RADIUS);
  ctx.fill();

  let cursorY = panelY + PANEL_PADDING;
  const gridX = panelX + PANEL_PADDING;

  const slotGrids = [];
  const hoveredSlot = hitTestInventorySlot(mouseX, mouseY, null);

  if (hasContainer) {
    drawSectionLabel(ctx, gridX, cursorY, "Container");
    cursorY += labelHeight;
    const grid = { x: gridX, y: cursorY, cols: CONTAINER_COLS, rows: CONTAINER_ROWS, baseIndex: 0, isContainer: true };
    slotGrids.push(grid);
    cursorY += containerHeight + SECTION_GAP;
  }

  drawSectionLabel(ctx, gridX, cursorY, "Inventory");
  cursorY += labelHeight;
  const mainGrid = { x: gridX, y: cursorY, cols: COLS, rows: MAIN_ROWS, baseIndex: 0, isContainer: false };
  slotGrids.push(mainGrid);
  cursorY += mainHeight + SECTION_GAP;

  drawSectionLabel(ctx, gridX, cursorY, "Hotbar");
  cursorY += labelHeight;
  const hotbarGrid = { x: gridX, y: cursorY, cols: COLS, rows: HOTBAR_ROWS, baseIndex: HOTBAR_START_INDEX, isContainer: false };
  slotGrids.push(hotbarGrid);

  const hovered = hitTestInventorySlot(mouseX, mouseY, slotGrids);

  for (const grid of slotGrids) {
    const inv = grid.isContainer ? container : inventory;
    drawSlotGrid(ctx, grid, inv, selectedHotbarSlot, hovered, heldItem);
  }

  let craftBounds = null;
  if (hasRecipes) {
    const craftX = gridX + gridWidth + COLUMN_GAP;
    const craftTopY = panelY + PANEL_PADDING;
    const craftRowsY = craftTopY + labelHeight;
    drawSectionLabel(ctx, craftX, craftTopY, craftingLabel || "Crafting");
    drawCraftingPanel(ctx, craftX, craftRowsY, CRAFT_PANEL_WIDTH, recipes, inventory, mouseX, mouseY);
    craftBounds = { craftX, craftY: craftRowsY, craftWidth: CRAFT_PANEL_WIDTH };
  }

  if (heldItem) {
    drawDraggedItem(ctx, heldItem, mouseX, mouseY);
  } else if (hovered) {
    const inv = hovered.isContainer ? container : inventory;
    const slot = getSlot(inv, hovered.slotIndex);
    if (slot) {
      const def = getItemDef(slot.itemId);
      drawTooltip(ctx, mouseX, mouseY, def.name, canvasWidth);
    }
  }

  return { slotGrids, craftBounds };
}

export function hitTestInventorySlot(mx, my, slotGrids) {
  if (!slotGrids) {
    return null;
  }
  for (const grid of slotGrids) {
    for (let row = 0; row < grid.rows; row += 1) {
      for (let col = 0; col < grid.cols; col += 1) {
        const sx = grid.x + col * (SLOT_SIZE + SLOT_GAP);
        const sy = grid.y + row * (SLOT_SIZE + SLOT_GAP);
        if (mx >= sx && mx < sx + SLOT_SIZE && my >= sy && my < sy + SLOT_SIZE) {
          return {
            isContainer: grid.isContainer,
            slotIndex: grid.baseIndex + row * grid.cols + col,
          };
        }
      }
    }
  }
  return null;
}

function drawSlotGrid(ctx, grid, inventory, selectedHotbarSlot, hovered, heldItem) {
  for (let row = 0; row < grid.rows; row += 1) {
    for (let col = 0; col < grid.cols; col += 1) {
      const slotX = grid.x + col * (SLOT_SIZE + SLOT_GAP);
      const slotY = grid.y + row * (SLOT_SIZE + SLOT_GAP);
      const invIndex = grid.baseIndex + row * grid.cols + col;
      const isSelected = !grid.isContainer && selectedHotbarSlot >= 0 && invIndex === HOTBAR_START_INDEX + selectedHotbarSlot;
      const isHovered = heldItem && hovered && hovered.isContainer === grid.isContainer && hovered.slotIndex === invIndex;

      drawSlot(ctx, slotX, slotY, isSelected, isHovered);

      const slot = getSlot(inventory, invIndex);
      if (slot) {
        const def = getItemDef(slot.itemId);
        drawItemIcon(ctx, def, slotX + SLOT_SIZE * 0.5, slotY + SLOT_SIZE * 0.5, SLOT_SIZE * 0.75);
        if (slot.count > 1) {
          drawStackCount(ctx, slotX, slotY, slot.count);
        }
      }
    }
  }
}

function drawSlot(ctx, x, y, isSelected, isHovered) {
  ctx.fillStyle = isHovered ? SLOT_HOVER_BG : SLOT_BG_COLOR;
  ctx.beginPath();
  ctx.roundRect(x, y, SLOT_SIZE, SLOT_SIZE, SLOT_CORNER_RADIUS);
  ctx.fill();

  if (isHovered) {
    ctx.strokeStyle = SLOT_HOVER_BORDER;
    ctx.lineWidth = HOVER_BORDER_WIDTH;
  } else {
    ctx.strokeStyle = isSelected ? HOTBAR_SELECTED_BORDER : SLOT_BORDER_COLOR;
    ctx.lineWidth = isSelected ? SELECTED_BORDER_WIDTH : NORMAL_BORDER_WIDTH;
  }
  ctx.beginPath();
  ctx.roundRect(x, y, SLOT_SIZE, SLOT_SIZE, SLOT_CORNER_RADIUS);
  ctx.stroke();
}

function drawDraggedItem(ctx, heldItem, mouseX, mouseY) {
  const def = getItemDef(heldItem.itemId);
  ctx.save();
  ctx.globalAlpha = 0.85;
  drawItemIcon(ctx, def, mouseX, mouseY, SLOT_SIZE * 0.85);
  ctx.restore();
  if (heldItem.count > 1) {
    drawStackCount(ctx, mouseX - SLOT_SIZE * 0.5, mouseY - SLOT_SIZE * 0.5, heldItem.count);
  }
}

function drawTooltip(ctx, mouseX, mouseY, text, canvasWidth) {
  ctx.font = TOOLTIP_FONT;
  const textWidth = ctx.measureText(text).width;
  const boxW = textWidth + TOOLTIP_PAD_X * 2;
  const boxH = 14 + TOOLTIP_PAD_Y * 2;
  let boxX = mouseX - boxW * 0.5;
  const boxY = mouseY - boxH - TOOLTIP_OFFSET_Y;

  if (boxX < 4) {
    boxX = 4;
  } else if (boxX + boxW > canvasWidth - 4) {
    boxX = canvasWidth - 4 - boxW;
  }

  ctx.fillStyle = TOOLTIP_BG;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, TOOLTIP_CORNER_RADIUS);
  ctx.fill();

  ctx.strokeStyle = TOOLTIP_BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, TOOLTIP_CORNER_RADIUS);
  ctx.stroke();

  ctx.fillStyle = TOOLTIP_COLOR;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, boxX + boxW * 0.5, boxY + boxH * 0.5);
}

function drawSectionLabel(ctx, x, y, text) {
  ctx.font = LABEL_FONT;
  ctx.fillStyle = LABEL_COLOR;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
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
