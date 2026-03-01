export function drawSprite(ctx, atlas, frameName, screenX, screenY, screenWidth, screenHeight, flipX) {
  const region = atlas.frames.get(frameName);
  if (!region) {
    return false;
  }

  if (flipX) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(screenX + screenWidth, screenY);
    ctx.scale(-1, 1);
    ctx.drawImage(
      atlas.image,
      region.x, region.y, region.width, region.height,
      0, 0, screenWidth, screenHeight
    );
    ctx.restore();
  } else {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      atlas.image,
      region.x, region.y, region.width, region.height,
      screenX, screenY, screenWidth, screenHeight
    );
  }

  return true;
}
