import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function productSeoPlugin() {
  let cachedItems = null
  let cacheTime = 0

  async function getActiveItems() {
    const now = Date.now()
    if (cachedItems && now - cacheTime < 30000) {
      return cachedItems
    }
    try {
      const res = await fetch('http://localhost:8085/Products/GetActiveItems')
      if (res.ok) {
        cachedItems = await res.json()
        cacheTime = now
        return cachedItems
      }
    } catch {
      // fallback
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
      const canonical = item.seo?.canonicalUrl?.trim() || `https://gemoradiam.com/product/${item.seo?.slug || item._id}`
      const image = item.image || ''

      let modified = html
      if (title) {
        modified = modified.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
      }
      if (desc) {
        modified = modified.replace(
          /<meta name="description" content=".*?" \/>/i,
          `<meta name="description" content="${desc.replace(/"/g, '&quot;')}" />`
        )
      }

      const tags = [
        keywords ? `<meta name="keywords" content="${keywords.replace(/"/g, '&quot;')}" />` : '',
        canonical ? `<link rel="canonical" href="${canonical}" />` : '',
        `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`,
        desc ? `<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />` : '',
        `<meta property="og:url" content="${canonical}" />`,
        image ? `<meta property="og:image" content="${image}" />` : '',
        `<meta property="og:type" content="product" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />`,
        desc ? `<meta name="twitter:description" content="${desc.replace(/"/g, '&quot;')}" />` : '',
        image ? `<meta name="twitter:image" content="${image}" />` : ''
      ]
        .filter(Boolean)
        .join('\n    ')

      return modified.replace('</head>', `    ${tags}\n  </head>`)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), productSeoPlugin()],
  server: {
    port: 5178,
  },
  optimizeDeps: {
    include: ['country-state-city', 'lucide-react', 'react-router-dom'],
  },
})