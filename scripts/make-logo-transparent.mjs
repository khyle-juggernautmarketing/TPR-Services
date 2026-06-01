import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const input = path.join(root, 'public/logo.png')
const output = path.join(root, 'public/logo-transparent.png')

/** Corner samples from logo.png — sky-blue plate behind wordmark */
const BG = { r: 41, g: 169, b: 246 }
const TOLERANCE = 48

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const dist = Math.hypot(r - BG.r, g - BG.g, b - BG.b)
  if (dist <= TOLERANCE) {
    data[i + 3] = 0
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(output)

console.log('Wrote', output)
