import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
const OUNCE_G = 31.1034768
const TOLA_G = 11.664
const TOlaPerOunce = TOLA_G / OUNCE_G

function extractXauPkrFromHtml(html: string): number | null {
  // `valuta.exchange` HTML sometimes wraps parts with tags, so parse from plain text.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')

  // Example text on the page:
  // "1 XAU = 1239331.38 PKR" OR "1 Gold (XAU) = 1239331.38 Pakistani Rupee (PKR)"
  const m1 = text.match(/1\s*XAU\s*=\s*([0-9,]*\.?[0-9]+)/i)
  if (m1) {
    const raw = m1[1].replace(/,/g, '')
    const num = Number(raw)
    return Number.isFinite(num) ? num : null
  }

  const m2 = text.match(/\bGold\s*\(XAU\)\s*=\s*([0-9,]*\.?[0-9]+)/i)
  if (m2) {
    const raw = m2[1].replace(/,/g, '')
    const num = Number(raw)
    return Number.isFinite(num) ? num : null
  }

  // Fallback: the page often renders as "XAU / PKR <number>".
  const m3 = text.match(/XAU\s*\/\s*PKR\s*([0-9,]*\.?[0-9]+)/i)
  if (m3) {
    const raw = m3[1].replace(/,/g, '')
    const num = Number(raw)
    return Number.isFinite(num) ? num : null
  }

  return null
}

function goldRateProxyPlugin() {
  return {
    name: 'gold-rate-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/gold-rate', async (req: any, res: any) => {
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        try {
          const resp = await fetch('https://valuta.exchange/xau-to-pkr?amount=1')
          if (!resp.ok) {
            res.statusCode = 502
            res.end('Upstream failed')
            return
          }
          const html = await resp.text()
          const xauPkr = extractXauPkrFromHtml(html)
          if (!xauPkr) {
            res.statusCode = 502
            res.end('Could not parse rate')
            return
          }

          const pkrPerTola = xauPkr * TOlaPerOunce
          const pkrPerGram = pkrPerTola / TOLA_G

          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(
            JSON.stringify({
              pkrPerTola,
              pkrPerGram,
              xauPkr,
              updatedAt: new Date().toISOString(),
            }),
          )
        } catch {
          res.statusCode = 500
          res.end('Gold rate fetch failed')
        }
      })
    },
  }
}

const EXTERNAL_GOLD_ASSETS_DIR =
  'C:\\Users\\Yousuf Traders\\.cursor\\projects\\c-Users-Yousuf-Traders-Desktop-E-Commerce-2\\assets'

function listExternalGoldAssetFiles() {
  try {
    return fs
      .readdirSync(EXTERNAL_GOLD_ASSETS_DIR)
      .filter((f) => f.toLowerCase().endsWith('.png'))
  } catch {
    return []
  }
}

function goldAssetsPlugin() {
  const files = listExternalGoldAssetFiles()

  const contentTypeByExt: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
  }

  return {
    name: 'gold-assets',
    configureServer(server: any) {
      server.middlewares.use('/gold-assets', async (req: any, res: any, next: any) => {
        try {
          const url: string = req.url || ''
          const match = url.match(/^\/([^?]+)/)
          const filename = match?.[1]
          if (!filename) return next()

          if (!files.includes(filename)) return next()

          const filePath = path.join(EXTERNAL_GOLD_ASSETS_DIR, filename)
          const ext = path.extname(filePath).toLowerCase()
          const ct = contentTypeByExt[ext] ?? 'application/octet-stream'

          const buf = fs.readFileSync(filePath)
          res.setHeader('Content-Type', ct)
          res.end(buf)
        } catch {
          next()
        }
      })
    },
    buildStart() {
      // no-op; files list is already computed.
    },
    generateBundle() {
      // emit assets so they exist in production build too.
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const pluginContext: any = this
      for (const filename of files) {
        const filePath = path.join(EXTERNAL_GOLD_ASSETS_DIR, filename)
        const buf = fs.readFileSync(filePath)
        pluginContext.emitFile({
          type: 'asset',
          fileName: `gold-assets/${filename}`,
          source: buf,
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), goldRateProxyPlugin(), goldAssetsPlugin()],
})
