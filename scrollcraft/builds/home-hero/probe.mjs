import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(path.join(process.cwd(), 'package.json'))
const { chromium } = require('playwright-core')

const URL = process.env.URL || 'http://localhost:5173'
const CHROME = '/usr/bin/google-chrome'
const POS = [0, 0.15, 0.45, 0.8, 1]

const browser = await chromium.launch({ executablePath: CHROME, headless: true })

async function probe(width, height, tag, reduced = false) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.hero-loading', { state: 'detached', timeout: 45000 })
  await page.evaluate(() => document.fonts.ready)

  const rows = await page.evaluate(async (poss) => {
    const sec = document.querySelector('section[aria-label]')
    const top = sec.getBoundingClientRect().top + scrollY
    const range = Math.max(0, sec.offsetHeight - (innerHeight - 64))

    // Load all frames into the probe context and fingerprint the hero canvas
    // against each one to learn which frame is actually painted.
    const W = 464, H = 1038
    const imgs = await Promise.all(
      Array.from({ length: 64 }, (_, i) => {
        const im = new Image()
        im.src = `/hero/model/m_${String(i + 1).padStart(3, '0')}.webp`
        return im.decode().then(() => im)
      })
    )
    const tmp = document.createElement('canvas')
    tmp.width = W
    tmp.height = H
    const tg = tmp.getContext('2d', { willReadFrequently: true })
    const hero = document.querySelector('canvas')
    const hg = hero.getContext('2d', { willReadFrequently: true })
    const samples = []
    for (let y = 20; y < H; y += 60) for (let x = 20; x < W; x += 40) samples.push(y * W + x)
    const frameIdx = () => {
      const heroData = hg.getImageData(0, 0, W, H).data
      let best = -1, bestMiss = Infinity
      for (let f = 0; f < 64; f++) {
        tg.clearRect(0, 0, W, H)
        tg.drawImage(imgs[f], 0, 0)
        const d = tg.getImageData(0, 0, W, H).data
        let miss = 0
        for (const s of samples) {
          const i = s * 4
          if (
            Math.abs(d[i] - heroData[i]) > 24 ||
            Math.abs(d[i + 1] - heroData[i + 1]) > 24 ||
            Math.abs(d[i + 2] - heroData[i + 2]) > 24
          ) miss++
          if (miss > bestMiss) break
        }
        if (miss < bestMiss) { bestMiss = miss; best = f }
      }
      return best
    }

    const out = []
    for (const p of poss) {
      scrollTo({ top: Math.round(top - 64 + p * range), behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 500))
      const h1 = document.querySelector('h1')
      const btns = [...document.querySelectorAll('a.nb-btn')].filter((a) => a.textContent.match(/Shop|WhatsApp/))
      const props = [...document.querySelectorAll('img[src^="/hero/"]')].filter((i) =>
        i.src.includes('sunglasses') || i.src.includes('handbag') || i.src.includes('heels') ||
        i.src.includes('scarf') || i.src.includes('hanger') || i.src.includes('hoodie')
      )
      const stickerEls = [...document.querySelectorAll('img[src^="/hero/"]')].filter(
        (i) => !props.includes(i)
      )
      out.push({
        p,
        frame: frameIdx(),
        headOp: +getComputedStyle(h1).opacity,
        headLines: Math.round(h1.offsetHeight / parseFloat(getComputedStyle(h1).lineHeight)),
        btnOp: +getComputedStyle(btns[0].parentElement).opacity,
        btnRight: Math.round(Math.max(...btns.map((b) => b.getBoundingClientRect().right))),
        propsVisible: props.filter((el) => el.offsetParent && +getComputedStyle(el).opacity > 0.5).length,
        stickersVisible: stickerEls.filter((el) => el.offsetParent && +getComputedStyle(el).opacity > 0.5 && (() => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; })()).length,
        overflowX: document.documentElement.scrollWidth > innerWidth,
        vw: innerWidth,
      })
    }
    return out
  }, POS)

  console.log(`[${tag}]`)
  rows.forEach((r) => console.log('  ' + JSON.stringify(r)))
  await page.close()
}

await probe(1440, 900, 'desktop')
await probe(390, 844, 'mobile')
await probe(1440, 900, 'reduced', true)
await browser.close()
console.log('done')
