/**
 * Downloads the stock-photo placeholders used across the site.
 *   PEXELS_API_KEY=... node scripts/fetch-images.mjs
 *
 * Photos are pinned by Pexels ID, not by search position — Pexels reorders search
 * results between calls, so index-based picking silently swaps images.
 *
 * The hero and six flavour shots come from DESERV'D's own photography (hand-cropped
 * to remove the baked-in packshot text) and are not managed here. Everything below
 * is a placeholder to be replaced with real product photography — see IMAGE-TODO.md.
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const KEY = process.env.PEXELS_API_KEY
if (!KEY) {
  console.error('Missing PEXELS_API_KEY environment variable.')
  process.exit(1)
}

const ROOT = path.resolve(import.meta.dirname, '..')

const SLOTS = [
  { file: 'cookies/classic-chocolate-chip', id: 31323236, w: 900, h: 900 },
  { file: 'cookies/marble-cookie',          id: 14571330, w: 900, h: 900 },
  { file: 'cookies/xx-chocolate-chip',      id: 10688029, w: 900, h: 900 },
  { file: 'cookies/xx-triple-chocolate',    id: 23948783, w: 900, h: 900 },
  { file: 'editorial/bakery-kitchen',       id: 5964505, w: 2000, h: 900 },
  { file: 'editorial/ingredients',          id: 27850071, w: 1400, h: 1050 },
]

const credits = []
for (const slot of SLOTS) {
  const res = await fetch(`https://api.pexels.com/v1/photos/${slot.id}`, { headers: { Authorization: KEY } })
  if (!res.ok) throw new Error(`Pexels ${res.status} for photo ${slot.id}`)
  const photo = await res.json()
  const src = `${photo.src.original}?auto=compress&cs=tinysrgb&fit=crop&w=${slot.w}&h=${slot.h}`
  const buf = Buffer.from(await (await fetch(src)).arrayBuffer())
  const out = path.join(ROOT, 'public/images', `${slot.file}.jpg`)
  await fs.mkdir(path.dirname(out), { recursive: true })
  await fs.writeFile(out, buf)
  credits.push({ file: `${slot.file}.jpg`, id: photo.id, photographer: photo.photographer, url: photo.url, alt: photo.alt })
  console.log(`${slot.file}.jpg  ${(buf.length / 1024).toFixed(0)}kb  by ${photo.photographer}`)
}

await fs.writeFile(
  path.join(ROOT, 'public/images/CREDITS.json'),
  JSON.stringify({ source: 'Pexels', license: 'https://www.pexels.com/license/', photos: credits }, null, 2) + '\n'
)
console.log(`\nDone. ${credits.length} placeholder images + CREDITS.json`)
