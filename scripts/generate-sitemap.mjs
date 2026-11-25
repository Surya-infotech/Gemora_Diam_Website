import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const PROD_SITE_URL = "https://gemoradiam.com";
const PROD_BACKEND_URL = "https://backend.gemoradiam.com";

function isLocalUrl(url = "") {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(String(url).trim());
}

function resolveSiteUrl() {
  const envUrl = process.env.SITEMAP_SITE_URL || process.env.VITE_URL || "";
  if (envUrl && !isLocalUrl(envUrl)) {
    return envUrl.replace(/\/+$/, "").replace(/^https:\/\/www\.gemoradiam\.com$/i, PROD_SITE_URL);
  }
  return PROD_SITE_URL;
}

function resolveBackendUrl() {
  if (process.env.SITEMAP_BACKEND_URL) {
    return process.env.SITEMAP_BACKEND_URL.replace(/\/+$/, "");
  }
  const envBackend = process.env.VITE_BACKEND_URL || "";
  if (envBackend && !isLocalUrl(envBackend)) {
    return envBackend.replace(/\/+$/, "");
  }
  return PROD_BACKEND_URL;
}

function slugify(name) {
  if (!name) return "";
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toCollectionPath(rawSlug) {
  const str = typeof rawSlug === "object" && rawSlug !== null
    ? (rawSlug.value || rawSlug.label || rawSlug.slug || "")
    : (rawSlug || "");
  const clean = String(str).trim().toLowerCase().replace(/^\/+/, "");
  if (!clean || clean === "collection" || clean === "collections") return "/collections";
  if (clean.startsWith("collection/")) return `/${clean}`;
  if (clean.startsWith("collections/")) return `/collection/${clean.replace(/^collections\//, "")}`;
  if (
    clean.startsWith("http") ||
    clean.startsWith("policy/") ||
    clean === "about" ||
    clean === "contact" ||
    clean === "faq" ||
    clean === "cart" ||
    clean === "orders" ||
    clean === "profile"
  ) {
    return clean.startsWith("http") ? "" : `/${clean}`;
  }
  return `/collection/${clean}`;
}

function escapeXml(val = "") {
  return String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(dateInput) {
  if (!dateInput) return new Date().toISOString().split("T")[0];
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
  return d.toISOString().split("T")[0];
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      console.warn(`[sitemap] HTTP ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[sitemap] Fetch failed for ${url}:`, err?.message || err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function extractArray(data, keys = []) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    for (const k of keys) {
      if (Array.isArray(data[k])) return data[k];
    }
    if (Array.isArray(data.value)) return data.value;
  }
  return [];
}

export async function generateSitemap({ outPath = path.join(ROOT_DIR, "public", "sitemap.xml") } = {}) {
  const siteUrl = resolveSiteUrl();
  const backendUrl = resolveBackendUrl();
  const today = new Date().toISOString().split("T")[0];

  const [itemsData, categoriesData, menusData, policiesData] = await Promise.all([
    fetchJson(`${backendUrl}/Products/GetActiveItems`),
    fetchJson(`${backendUrl}/Attributes/GetActiveCategories`),
    fetchJson(`${backendUrl}/Support/GetActiveMenus`),
    fetchJson(`${backendUrl}/Support/GetActivePolicies`)
  ]);

  const items = extractArray(itemsData);
  const categories = extractArray(categoriesData, ["categories"]);
  const menus = extractArray(menusData);
  const policies = extractArray(policiesData);

  // If offline and an existing sitemap already exists, preserve it instead of overwriting catalog URLs
  if (items.length === 0 && categories.length === 0 && menus.length === 0) {
    try {
      const existing = await fs.readFile(outPath, "utf8");
      if (existing.includes("<urlset") && existing.includes("<loc>")) {
        console.warn("[sitemap] Backend unreachable; preserving existing public/sitemap.xml");
        return { count: 0, preserved: true, outPath };
      }
    } catch {
      // Proceed to write static core URLs
    }
  }

  const urlMap = new Map();
  const addUrl = (locPath, { changefreq = "weekly", priority = "0.7", lastmod = today, image = "", imageTitle = "" } = {}) => {
    if (!locPath) return;
    const normalizedPath = locPath === "/" ? "/" : `/${locPath.replace(/^\/+|\/+$/g, "")}`;
    const fullLoc = normalizedPath === "/" ? `${siteUrl}/` : `${siteUrl}${normalizedPath}`;
    if (!urlMap.has(fullLoc)) {
      urlMap.set(fullLoc, { loc: fullLoc, changefreq, priority, lastmod, image, imageTitle });
    }
  };

  // 1. Core static routes
  addUrl("/", { changefreq: "daily", priority: "1.0", lastmod: today });
  addUrl("/collections", { changefreq: "daily", priority: "0.9", lastmod: today });
  addUrl("/about", { changefreq: "monthly", priority: "0.8", lastmod: today });
  addUrl("/contact", { changefreq: "monthly", priority: "0.8", lastmod: today });
  addUrl("/faq", { changefreq: "weekly", priority: "0.7", lastmod: today });

  // 2. Category collection pages
  for (const cat of categories) {
    const name = typeof cat === "string" ? cat : cat?.categoryname;
    if (!name || cat?.status === false) continue;
    const catSlug = slugify(name);
    if (catSlug) {
      addUrl(`/collection/${catSlug}`, {
        changefreq: "weekly",
        priority: "0.85",
        lastmod: formatDate(cat?.updatedAt || cat?.createdAt)
      });
    }
  }

  // 3. Dynamic menu collection pages
  for (const menu of menus) {
    if (!menu || menu.status === false) continue;
    const menuDate = formatDate(menu.updatedAt || menu.createdAt);
    const topPath = toCollectionPath(menu.slug || menu.title);
    if (topPath && !["/cart", "/orders", "/profile"].includes(topPath)) {
      addUrl(topPath, { changefreq: "weekly", priority: "0.8", lastmod: menuDate });
    }
    const cols = [menu.column1, menu.column2, menu.column3];
    for (const col of cols) {
      const colItems = Array.isArray(col?.items) ? col.items : [];
      for (const it of colItems) {
        const subPath = toCollectionPath(it?.slug);
        if (subPath && !["/cart", "/orders", "/profile"].includes(subPath)) {
          addUrl(subPath, { changefreq: "weekly", priority: "0.75", lastmod: menuDate });
        }
      }
    }
  }

  // 4. Active legal policy pages
  for (const pol of policies) {
    if (!pol || !pol.policyname || pol.status === false) continue;
    const pSlug = slugify(pol.policyname);
    if (pSlug) {
      addUrl(`/${pSlug}`, {
        changefreq: "monthly",
        priority: "0.4",
        lastmod: formatDate(pol.updatedAt || pol.createdAt)
      });
    }
  }

  // 5. Active product detail pages
  for (const item of items) {
    if (!item || item.status === false) continue;
    const id = item._id || item.itemid;
    if (!id) continue;
    const rawImg = item.image || item.galleryimages?.[0]?.imageUrl || item.galleryimages?.[0] || "";
    const imageUrl = typeof rawImg === "string" && /^https?:\/\//i.test(rawImg.trim()) ? rawImg.trim() : "";
    addUrl(`/product/${id}`, {
      changefreq: "weekly",
      priority: "0.9",
      lastmod: formatDate(item.updatedAt || item.createdAt),
      image: imageUrl,
      imageTitle: item.itemname || ""
    });
  }

  const entries = Array.from(urlMap.values());
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
  ];

  for (const entry of entries) {
    xmlLines.push("  <url>");
    xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    if (entry.lastmod) {
      xmlLines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    }
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority}</priority>`);
    if (entry.image) {
      xmlLines.push("    <image:image>");
      xmlLines.push(`      <image:loc>${escapeXml(entry.image)}</image:loc>`);
      if (entry.imageTitle) {
        xmlLines.push(`      <image:title>${escapeXml(entry.imageTitle)}</image:title>`);
      }
      xmlLines.push("    </image:image>");
    }
    xmlLines.push("  </url>");
  }

  xmlLines.push("</urlset>");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, `${xmlLines.join("\n")}\n`, "utf8");

  console.log(`[sitemap] Generated ${entries.length} URLs -> ${path.relative(ROOT_DIR, outPath)}`);
  return { count: entries.length, preserved: false, outPath };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateSitemap().catch((err) => {
    console.error("[sitemap] Failed to generate sitemap:", err);
    process.exitCode = 1;
  });
}
