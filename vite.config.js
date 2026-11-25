import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { generateSitemap } from './scripts/generate-sitemap.mjs'

function normalizeCanonical(rawUrl, fallbackPath) {
  const siteUrl = 'https://gemoradiam.com'
  const fallback = `${siteUrl}${fallbackPath}`
  const trimmed = String(rawUrl || '').trim()
  if (!trimmed) return fallback
  try {
    const parsed = new URL(trimmed, siteUrl)
    if (parsed.hostname === 'www.gemoradiam.com' || parsed.hostname === 'gemoradiam.com') {
      const cleanPath = parsed.pathname === '/' ? '/' : `/${parsed.pathname.replace(/^\/+|\/+$/g, '')}`
      return `${siteUrl}${cleanPath}`
    }
    return parsed.toString()
  } catch {
    return fallback
  }
}

function escapeAttr(val = '') {
  return String(val).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function productSeoPlugin() {
  let cachedItems = null
  let cacheTime = 0

  async function getActiveItems() {
    const now = Date.now()
    if (cachedItems && now - cacheTime < 30000) {
      return cachedItems
    }
    for (const endpoint of [
      'http://localhost:8085/Products/GetActiveItems',
      'https://backend.gemoradiam.com/Products/GetActiveItems',
    ]) {
      try {
        const res = await fetch(endpoint)
        if (res.ok) {
          cachedItems = await res.json()
          cacheTime = now
          return cachedItems
        }
      } catch {
        // try next endpoint
      }
    }
    return cachedItems || []
  }

  return {
    name: 'vite-plugin-product-seo',
    async transformIndexHtml(html, ctx) {
      const rawUrl = ctx.originalUrl || ctx.url || ''
      const match = rawUrl.match(/\/product\/([a-zA-Z0-9_-]+)/)
      if (!match) return html

      const productId = match[1]
      const items = await getActiveItems()
      const strId = String(productId).trim().toLowerCase()
      const item = items.find(
        (p) =>
          (p._id && String(p._id).toLowerCase() === strId) ||
          (p.itemid !== undefined && String(p.itemid) === strId) ||
          (p.seo?.slug && String(p.seo.slug).toLowerCase() === strId)
      )

      if (!item) return html

      const title = item.seo?.metaTitle?.trim() || `${item.itemname} | Gemora Diam Luxury Jewelry`
      const desc = item.seo?.metaDescription?.trim() || item.description?.trim() || ''
      const keywords = item.seo?.metaKeywords?.trim() || ''
      const canonical = normalizeCanonical(item.seo?.canonicalUrl, `/product/${item._id || productId}`)
      const image = item.image || 'https://gemoradiam.com/GEMORALOGO.png'

      let modified = html
      modified = modified.replace(/<title>.*?<\/title>/i, `<title>${escapeAttr(title)}</title>`)
      if (desc) {
        modified = modified.replace(
          /<meta name="description" content=".*?"\s*\/?>/i,
          `<meta name="description" content="${escapeAttr(desc)}" />`
        )
      }
      modified = modified.replace(
        /<link rel="canonical" href=".*?"\s*\/?>/i,
        `<link rel="canonical" href="${escapeAttr(canonical)}" />`
      )
      modified = modified.replace(
        /<meta property="og:type" content=".*?"\s*\/?>/i,
        `<meta property="og:type" content="product" />`
      )
      modified = modified.replace(
        /<meta property="og:title" content=".*?"\s*\/?>/i,
        `<meta property="og:title" content="${escapeAttr(title)}" />`
      )
      if (desc) {
        modified = modified.replace(
          /<meta property="og:description" content=".*?"\s*\/?>/i,
          `<meta property="og:description" content="${escapeAttr(desc)}" />`
        )
        modified = modified.replace(
          /<meta name="twitter:description" content=".*?"\s*\/?>/i,
          `<meta name="twitter:description" content="${escapeAttr(desc)}" />`
        )
      }
      modified = modified.replace(
        /<meta property="og:url" content=".*?"\s*\/?>/i,
        `<meta property="og:url" content="${escapeAttr(canonical)}" />`
      )
      modified = modified.replace(
        /<meta property="og:image" content=".*?"\s*\/?>/i,
        `<meta property="og:image" content="${escapeAttr(image)}" />`
      )
      modified = modified.replace(
        /<meta name="twitter:title" content=".*?"\s*\/?>/i,
        `<meta name="twitter:title" content="${escapeAttr(title)}" />`
      )
      modified = modified.replace(
        /<meta name="twitter:image" content=".*?"\s*\/?>/i,
        `<meta name="twitter:image" content="${escapeAttr(image)}" />`
      )

      if (keywords) {
        modified = modified.replace(
          '</head>',
          `    <meta name="keywords" content="${escapeAttr(keywords)}" />\n  </head>`
        )
      }
      return modified
    }
  }
}

function sitemapBuildPlugin() {
  return {
    name: 'vite-plugin-sitemap',
    apply: 'build',
    async buildStart() {
      await generateSitemap()
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), productSeoPlugin(), sitemapBuildPlugin()],
  server: {
    port: 5178,
  },
  optimizeDeps: {
    include: ['country-state-city', 'lucide-react', 'react-router-dom'],
  },
})