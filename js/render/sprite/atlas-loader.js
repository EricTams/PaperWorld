export async function loadAtlas(xmlPath, imagePath) {
  try {
    const [frames, image] = await Promise.all([
      fetchAndParseXml(xmlPath),
      loadImage(imagePath),
    ]);
    console.log(`AIDEV-NOTE: Atlas loaded (${frames.size} frames) from ${imagePath}`);
    return { image, frames };
  } catch (err) {
    console.warn(`Atlas load failed: ${err.message}. Falling back to placeholder.`);
    return null;
  }
}

async function fetchAndParseXml(xmlPath) {
  const response = await fetch(xmlPath);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${xmlPath}: ${response.status}`);
  }

  const text = await response.text();
  const doc = new DOMParser().parseFromString(text, "text/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error(`XML parse error in ${xmlPath}`);
  }

  const frames = new Map();
  for (const sub of doc.querySelectorAll("SubTexture")) {
    const rawName = sub.getAttribute("name") || "";
    const name = rawName.replace(/\.png$/i, "");
    frames.set(name, {
      x: parseInt(sub.getAttribute("x"), 10),
      y: parseInt(sub.getAttribute("y"), 10),
      width: parseInt(sub.getAttribute("width"), 10),
      height: parseInt(sub.getAttribute("height"), 10),
    });
  }

  return frames;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image failed to load: ${src}`));
    img.src = src;
  });
}
