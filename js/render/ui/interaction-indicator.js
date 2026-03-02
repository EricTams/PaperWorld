import { worldToScreen, worldLengthToScreen } from "../camera.js";
import { getItemDef } from "../../items/item-defs.js";

const HIGHLIGHT_FILL = "rgba(80, 200, 80, 0.18)";
const HIGHLIGHT_STROKE = "rgba(80, 200, 80, 0.7)";
const HIGHLIGHT_LINE_WIDTH = 2;

const TOOLTIP_BG = "rgba(30, 30, 30, 0.82)";
const TOOLTIP_BORDER = "rgba(80, 200, 80, 0.7)";
const TOOLTIP_KEY_COLOR = "#ffffff";
const TOOLTIP_NAME_COLOR = "rgba(220, 220, 220, 0.9)";
const TOOLTIP_CORNER_RADIUS = 4;
const TOOLTIP_PADDING_X = 8;
const TOOLTIP_PADDING_Y = 4;
const TOOLTIP_KEY_FONT = "bold 13px monospace";
const TOOLTIP_NAME_FONT = "11px sans-serif";
const TOOLTIP_OFFSET_Y = 12;
const TOOLTIP_GAP = 3;

export function drawHoverHighlight(ctx, camera, object) {
  const screen = worldToScreen(camera, object.x, object.y);
  const screenRadius = worldLengthToScreen(camera, object.radius);

  ctx.fillStyle = HIGHLIGHT_FILL;
  ctx.beginPath();
  ctx.arc(screen.x, screen.y, screenRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = HIGHLIGHT_STROKE;
  ctx.lineWidth = HIGHLIGHT_LINE_WIDTH;
  ctx.beginPath();
  ctx.arc(screen.x, screen.y, screenRadius, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawInteractionTooltip(ctx, camera, object) {
  const def = getItemDef(object.itemId);
  const screen = worldToScreen(camera, object.x, object.y);
  const screenRadius = worldLengthToScreen(camera, object.radius);
  const anchorY = screen.y - screenRadius - TOOLTIP_OFFSET_Y;

  ctx.save();

  ctx.font = TOOLTIP_KEY_FONT;
  const keyText = "E";
  const keyMetrics = ctx.measureText(keyText);
  const keyW = keyMetrics.width + TOOLTIP_PADDING_X * 2;
  const keyH = 18 + TOOLTIP_PADDING_Y * 2;

  ctx.font = TOOLTIP_NAME_FONT;
  const nameText = def.name;
  const nameMetrics = ctx.measureText(nameText);
  const nameW = nameMetrics.width + TOOLTIP_PADDING_X * 2;
  const nameH = 14 + TOOLTIP_PADDING_Y * 2;

  const nameY = anchorY;
  const keyY = nameY - TOOLTIP_GAP - keyH;

  drawRoundedBadge(ctx, screen.x, keyY, keyW, keyH, TOOLTIP_BG, TOOLTIP_BORDER);
  ctx.fillStyle = TOOLTIP_KEY_COLOR;
  ctx.font = TOOLTIP_KEY_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(keyText, screen.x, keyY + keyH * 0.5);

  drawRoundedBadge(ctx, screen.x, nameY, nameW, nameH, TOOLTIP_BG, null);
  ctx.fillStyle = TOOLTIP_NAME_COLOR;
  ctx.font = TOOLTIP_NAME_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(nameText, screen.x, nameY + nameH * 0.5);

  ctx.restore();
}

function drawRoundedBadge(ctx, cx, top, width, height, fillColor, strokeColor) {
  const left = cx - width * 0.5;
  const r = Math.min(TOOLTIP_CORNER_RADIUS, width * 0.5, height * 0.5);

  ctx.beginPath();
  ctx.moveTo(left + r, top);
  ctx.lineTo(left + width - r, top);
  ctx.arcTo(left + width, top, left + width, top + r, r);
  ctx.lineTo(left + width, top + height - r);
  ctx.arcTo(left + width, top + height, left + width - r, top + height, r);
  ctx.lineTo(left + r, top + height);
  ctx.arcTo(left, top + height, left, top + height - r, r);
  ctx.lineTo(left, top + r);
  ctx.arcTo(left, top, left + r, top, r);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();

  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}
