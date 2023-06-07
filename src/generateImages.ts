import Jimp from "jimp"
import fs from "fs"

async function createImage(
  fileName: string,
  width: number,
  height: number,
  color: { r: number; g: number; b: number }
) {
  const image = new Jimp(
    width,
    height,
    Jimp.rgbaToInt(color.r, color.g, color.b, 255)
  )
  await image.writeAsync(fileName)
}

function generateRandomColor() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

async function generateImages(n: number, dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  for (let i = 0; i < n; i++) {
    const color = generateRandomColor()
    const fileName = `${dir}/${color.r}_${color.g}_${color.b}.png`
    await createImage(fileName, 250, 250, color)
  }
}

generateImages(10, "./images")
