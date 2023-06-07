import fs from "fs"
import path from "path"

// Directory with PNG files
const dir = "./images"

// Directory for JSON files
const jsonDir = "./json"

// Create JSON directory if it doesn't exist
if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir)
}

fs.readdir(dir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err)
    return
  }

  files.forEach((file) => {
    if (path.extname(file) === ".png") {
      const baseName = path.basename(file, ".png")
      const [r, g, b] = baseName.split("_")

      const data = {
        name: baseName,
        symbol: "RGB",
        description: "Random RGB Color",
        seller_fee_basis_points: 0,
        image: `https://raw.githubusercontent.com/ZYJLiu/rgb-png-generator/master/images/${baseName}.png`,
        attributes: [
          {
            trait_type: "R",
            value: r,
          },
          {
            trait_type: "G",
            value: g,
          },
          {
            trait_type: "B",
            value: b,
          },
        ],
      }

      fs.writeFile(
        `./json/${baseName}.json`,
        JSON.stringify(data, null, 2),
        (err) => {
          if (err) {
            console.error("Error writing file:", err)
          }
        }
      )
    }
  })
})
