/**
 * Downloads the ingredient-showcase photography used on the homepage.
 *   PEXELS_API_KEY=... node scripts/fetch-ingredients.mjs
 *
 * Pinned by Pexels photo ID (search-position picking is unstable — Pexels
 * reorders results between calls). Butter and Brown Sugar have no accurate
 * match in Pexels' library after several searches, so those two render as
 * icon tiles instead of a photo — see IMAGE-TODO.md.
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
  { file: 'protein-blend', id: 13779116 },
  { file: 'chocolate', id: 31443060 },
  { file: 'eggs', id: 9331862 },
  { file: 'milk', id: 37304947 },
  { file: 'flour', id: 4444068 },
  { file: 'oats', id: 13950821 },
  { file: 'sea-salt', id: 6755750 },
  { file: 'vanilla', id: 36188472 },
]

const credits = []
for (const slot of SLOTS) {
  const res = await fetch(`https://api.pexels.com/v1/photos/${slot.id}`, { headers: { Authorization: KEY } })
  if (!res.ok) throw new Error(`Pexels ${res.status} for photo ${slot.id}`)
  const photo = await res.json()
  const src = `${photo.src.original}?auto=compress&cs=tinysrgb&fit=crop&w=520&h=520`
  const buf = Buffer.from(await (await fetch(src)).arrayBuffer())
  const out = path.join(ROOT, 'public/images/ingredients', `${slot.file}.jpg`)
  await fs.mkdir(path.dirname(out), { recursive: true })
  await fs.writeFile(out, buf)
  credits.push({ file: `${slot.file}.jpg`, id: photo.id, photographer: photo.photographer, url: photo.url })
  console.log(`${slot.file}.jpg  ${(buf.length / 1024).toFixed(0)}kb  by ${photo.photographer}`)
}

await fs.writeFile(
  path.join(ROOT, 'public/images/ingredients/CREDITS.json'),
  JSON.stringify({ source: 'Pexels', license: 'https://www.pexels.com/license/', photos: credits }, null, 2) + '\n',
)
console.log(`\nDone. ${credits.length} ingredient images.`)
