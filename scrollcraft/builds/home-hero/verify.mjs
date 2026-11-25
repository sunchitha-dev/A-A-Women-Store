import path from 'node:path'
import fs from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(path.join(process.cwd(), 'package.json'))
const { chromium } = require('playwright-core')

const URL = process.env.URL || 'http://localhost:5173'
const OUT = path.resolve('scrollcraft/builds/home-hero/lab')
const CHROME = '/usr/bin/google-chrome'
const POS = [0, 0.15, 0.45, 0.8, 1]

const browser = await chromium.launch({ executablePath: CHROME, headless: true })

async function shoot(width, height, tag, reduced = false) {
  fs.mkdirSync(path.join(OUT, tag), { recursive: true })
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  const failed = []
  page.on('requestfailed', (r) => failed.push(r.url()))

  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.hero-loading', { state: 'detached', timeout: 45000 })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)

  const info = await page.evaluate((poss) => {
    const sec = document.querySelector('section[aria-label]')
    const top = sec.getBoundingClientRect().top + scrollY
    const range = sec.offsetHeight - (innerHeight - 64)
    const h1 = document.querySelector('h1')
    const cs = getComputedStyle(h1)
    const lines = Math.round(h1.offsetHeight / parseFloat(cs.lineHeight))
    const btns = [...document.querySelectorAll('a.nb-btn')].map((a) => {
      const b = a.getBoundingClientRect()
      return { t: a.textContent.trim(), w: Math.round(b.width), right: Math.round(b.right) }
    })
    return {
      secH: sec.offsetHeight,
      range,
      ys: poss.map((p) => Math.round(Math.max(0, top - 64 + p * Math.max(0, range)))),
      h1: { fs: cs.fontSize, lh: cs.lineHeight, lines, w: h1.offsetWidth },
      btns,
      overflowX: document.documentElement.scrollWidth > innerWidth,
      vw: innerWidth,
    }
  }, POS)

  const shots = []
  for (let i = 0; i < POS.length; i++) {
    await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), info.ys[i])
    await page.waitForTimeout(400)
    const file = path.join(OUT, tag, `p${String(Math.round(POS[i] * 100)).padStart(3, '0')}.png`)
    await page.screenshot({ path: file })
    shots.push(path.relative(process.cwd(), file))
  }
  console.log(`[${tag}] ${JSON.stringify(info)}`)
  if (errors.length) console.log(`[${tag}] console errors:`, errors)
  if (failed.length) console.log(`[${tag}] failed requests:`, failed)
  await page.close()
  return shots
}

await shoot(1440, 900, 'desktop')
await shoot(390, 844, 'mobile')
await shoot(1440, 900, 'reduced', true)
await browser.close()
console.log('done')
