import fs from "fs"
import Jimp from "jimp"

const gitHubName = "Unboxed-Software"

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
  // Delete directories if they exist
  if (fs.existsSync(uriDir)) {
    fs.rmSync(uriDir, { recursive: true, force: true })
  }

  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  // Recreate the directories
  fs.mkdirSync(uriDir)
  fs.mkdirSync(dir)

  let uris: string[] = []
  let colorSet: Set<string> = new Set()

  while (colorSet.size < n) {
    const color = generateRandomColor()
    const colorKey = `${color.r}_${color.g}_${color.b}`
    // If this color is unique, create an image
    if (!colorSet.has(colorKey)) {
      colorSet.add(colorKey)
      const colorDir = `${dir}/${colorKey}`
      if (!fs.existsSync(colorDir)) {
        fs.mkdirSync(colorDir)
      }
      const fileName = `${colorDir}/${colorKey}.png`
      await createImage(fileName, 250, 250, color)

      const data = {
        name: colorKey,
        symbol: "RGB",
        description: "Random RGB Color",
        seller_fee_basis_points: 0,
        image: `https://raw.githubusercontent.com/${gitHubName}/rgb-png-generator/master/assets/${colorKey}/${colorKey}.png`,
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
        `${colorDir}/${colorKey}.json`,
        JSON.stringify(data, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing file:", err)
          }
        }
      )

      uris.push(
        `https://raw.githubusercontent.com/${gitHubName}/rgb-png-generator/master/assets/${colorKey}/${colorKey}.json`
      )
    }
  }

  console.log(`Generated ${colorSet.size} unique assets.`)

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

generateImages(10_000, "./assets")
