import fs from "fs"
import path from "path"
import Jimp from "jimp"

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
  const uriDir = "./uri"
  if (!fs.existsSync(uriDir)) {
    fs.mkdirSync(uriDir)
  }

  let uris: string[] = []
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  for (let i = 0; i < n; i++) {
    const color = generateRandomColor()
    const colorDir = `${dir}/${color.r}_${color.g}_${color.b}`
    if (!fs.existsSync(colorDir)) {
      fs.mkdirSync(colorDir)
    }
    const fileName = `${colorDir}/${color.r}_${color.g}_${color.b}.png`
    await createImage(fileName, 250, 250, color)

    const data = {
      name: `${color.r}_${color.g}_${color.b}`,
      symbol: "RGB",
      description: "Random RGB Color",
      seller_fee_basis_points: 0,
      image: `https://raw.githubusercontent.com/ZYJLiu/rgb-png-generator/master/assets/${color.r}_${color.g}_${color.b}/${color.r}_${color.g}_${color.b}.png`,
      attributes: [
        {
          trait_type: "R",
          value: color.r.toString(),
        },
        {
          trait_type: "G",
          value: color.g.toString(),
        },
        {
          trait_type: "B",
          value: color.b.toString(),
        },
      ],
    }

    fs.writeFile(
      `${colorDir}/${color.r}_${color.g}_${color.b}.json`,
      JSON.stringify(data, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing file:", err)
        }
      }
    )

    uris.push(
      `https://raw.githubusercontent.com/ZYJLiu/rgb-png-generator/master/assets/${color.r}_${color.g}_${color.b}/${color.r}_${color.g}_${color.b}.json`
    )
  }

  fs.writeFile(
    `${uriDir}/uri.ts`,
    `export const uris = ${JSON.stringify(uris, null, 2)}`,
    (err) => {
      if (err) {
        console.error("Error writing URIs to file:", err)
      }
    }
  )
}

generateImages(10, "./assets")
