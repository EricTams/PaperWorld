import { getItemDef } from "../../items/item-defs.js";
import { canCraft } from "../../items/crafting.js";
import { countItem } from "../../items/inventory.js";
import { drawItemIcon } from "./item-icons.js";

const ROW_HEIGHT = 48;
const ROW_GAP = 4;
const ICON_SIZE = 30;
const ROW_PADDING_X = 6;
const ROW_CORNER_RADIUS = 4;

const ROW_BG_COLOR = "rgba(60, 55, 45, 0.4)";
const ROW_HOVER_BG = "rgba(90, 80, 55, 0.7)";
const ROW_HOVER_BORDER = "#e8d8a0";
const ROW_DIM_ALPHA = 0.35;
const HOVER_BORDER_WIDTH = 2;

const NAME_FONT = "12px monospace";
const NAME_COLOR = "#e0d8c8";
const INGREDIENT_FONT = "10px monospace";
const INGREDIENT_MET_COLOR = "rgba(140, 200, 120, 0.85)";
const INGREDIENT_UNMET_COLOR = "rgba(220, 120, 100, 0.85)";
const INGREDIENT_SEP_COLOR = "rgba(200, 190, 170, 0.6)";

export function drawCraftingPanel(ctx, x, y, width, recipes, inventory, mouseX, mouseY) {
  const hoveredIndex = hitTestCraftingPanel(mouseX, mouseY, x, y, width, recipes.length);

  for (let i = 0; i < recipes.length; i += 1) {
    const recipe = recipes[i];
    const rowY = y + i * (ROW_HEIGHT + ROW_GAP);
    const craftable = canCraft(inventory, recipe);
    const isHovered = i === hoveredIndex && craftable;
    drawRecipeRow(ctx, x, rowY, width, recipe, inventory, craftable, isHovered);
  }
}

export function hitTestCraftingPanel(mouseX, mouseY, panelX, panelY, width, recipeCount) {
  if (mouseX < panelX || mouseX > panelX + width) {
    return -1;
  }
  for (let i = 0; i < recipeCount; i += 1) {
    const rowY = panelY + i * (ROW_HEIGHT + ROW_GAP);
    if (mouseY >= rowY && mouseY <= rowY + ROW_HEIGHT) {
      return i;
    }
  }
  return -1;
}

export function getCraftingPanelHeight(recipeCount) {
  if (recipeCount <= 0) {
    return 0;
  }
  return recipeCount * ROW_HEIGHT + (recipeCount - 1) * ROW_GAP;
}

function drawRecipeRow(ctx, x, y, width, recipe, inventory, craftable, isHovered) {
  ctx.save();
  if (!craftable) {
    ctx.globalAlpha = ROW_DIM_ALPHA;
  }

  ctx.fillStyle = isHovered ? ROW_HOVER_BG : ROW_BG_COLOR;
  ctx.beginPath();
  ctx.roundRect(x, y, width, ROW_HEIGHT, ROW_CORNER_RADIUS);
  ctx.fill();

  if (isHovered) {
    ctx.strokeStyle = ROW_HOVER_BORDER;
    ctx.lineWidth = HOVER_BORDER_WIDTH;
    ctx.beginPath();
    ctx.roundRect(x, y, width, ROW_HEIGHT, ROW_CORNER_RADIUS);
    ctx.stroke();
  }

  ctx.restore();

  const iconCx = x + ROW_PADDING_X + ICON_SIZE * 0.5;
  const iconCy = y + ROW_HEIGHT * 0.5;
  const outputDef = getItemDef(recipe.output.itemId);

  ctx.save();
  if (!craftable) {
    ctx.globalAlpha = ROW_DIM_ALPHA;
  }
  drawItemIcon(ctx, outputDef, iconCx, iconCy, ICON_SIZE);
  ctx.restore();

  const textX = x + ROW_PADDING_X + ICON_SIZE + 8;

  ctx.save();
  if (!craftable) {
    ctx.globalAlpha = ROW_DIM_ALPHA + 0.15;
  }
  ctx.font = NAME_FONT;
  ctx.fillStyle = NAME_COLOR;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(recipe.name, textX, y + 8);
  ctx.restore();

  ctx.save();
  ctx.font = INGREDIENT_FONT;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  drawIngredientLine(ctx, textX, y + 26, recipe.ingredients, inventory);
  ctx.restore();
}

function drawIngredientLine(ctx, x, y, ingredients, inventory) {
  let cursorX = x;
  for (let i = 0; i < ingredients.length; i += 1) {
    if (i > 0) {
      ctx.fillStyle = INGREDIENT_SEP_COLOR;
      ctx.fillText(" + ", cursorX, y);
      cursorX += ctx.measureText(" + ").width;
    }
    const ing = ingredients[i];
    const def = getItemDef(ing.itemId);
    const have = countItem(inventory, ing.itemId);
    const met = have >= ing.count;
    const text = `${ing.count}x ${def.name}`;

    ctx.fillStyle = met ? INGREDIENT_MET_COLOR : INGREDIENT_UNMET_COLOR;
    ctx.fillText(text, cursorX, y);
    cursorX += ctx.measureText(text).width;
  }
}
