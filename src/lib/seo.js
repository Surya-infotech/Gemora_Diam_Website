import { useEffect } from "react";

export const SITE_URL = "https://gemoradiam.com";
export const SITE_NAME = "Gemora Diam";
export const DEFAULT_TITLE = "GEMORA DIAM | Luxury & Fine Jewelry";
export const DEFAULT_DESCRIPTION =
  "Heirloom fine jewelry and rare certified diamonds crafted in our design studio with conflict-free Kimberley gems and 100% recycled gold.";
export const DEFAULT_IMAGE = `${SITE_URL}/GEMORALOGO.png`;
export const DEFAULT_ROBOTS = "index, follow, max-image-preview:large";

/**
 * Normalizes canonical URLs onto the primary https://gemoradiam.com host
 * so www/non-www URLs never split Search Console indexing signals.
 */
export function normalizeCanonicalUrl(rawUrl = "", fallbackPath = "/") {
  const safePath = fallbackPath === "/" ? "/" : `/${String(fallbackPath || "/").replace(/^\/+|\/+$/g, "")}`;
  const fallback = safePath === "/" ? `${SITE_URL}/` : `${SITE_URL}${safePath}`;
  const trimmed = String(rawUrl || "").trim();
  if (!trimmed) return fallback;

  try {
    const parsed = new URL(trimmed, SITE_URL);
    if (parsed.hostname === "www.gemoradiam.com" || parsed.hostname === "gemoradiam.com") {
      const normalizedPath =
        parsed.pathname === "/" ? "/" : `/${parsed.pathname.replace(/^\/+|\/+$/g, "")}`;
      return normalizedPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`;
    }
    return parsed.toString();
  } catch {
    return fallback;
  }
}

export function upsertMetaTag(attrName, attrValue, content) {
  if (typeof document === "undefined" || !content) return;
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function upsertLinkTag(rel, href) {
  if (typeof document === "undefined" || !href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function upsertJsonLd(id, schemaObj) {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(id);
  if (!schemaObj) {
    if (existing) existing.remove();
    return;
  }
  const script = existing || document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.textContent = JSON.stringify(schemaObj);
  if (!existing) {
    document.head.appendChild(script);
  }
}

export function usePageSeo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = "/",
  canonicalUrl = "",
  robots = DEFAULT_ROBOTS,
  ogType = "website",
  image = DEFAULT_IMAGE,
  keywords = "",
  jsonLd = null
} = {}) {
  const serializedSchema = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const resolvedTitle = title || DEFAULT_TITLE;
    const resolvedDesc = description || DEFAULT_DESCRIPTION;
    const resolvedCanonical = normalizeCanonicalUrl(canonicalUrl, canonicalPath);
    const resolvedImage = image || DEFAULT_IMAGE;
    const resolvedRobots = robots || DEFAULT_ROBOTS;

    document.title = resolvedTitle;
    upsertMetaTag("name", "description", resolvedDesc);
    upsertMetaTag("name", "robots", resolvedRobots);
    if (keywords) {
      upsertMetaTag("name", "keywords", keywords);
    }

    upsertLinkTag("canonical", resolvedCanonical);

    upsertMetaTag("property", "og:site_name", SITE_NAME);
    upsertMetaTag("property", "og:type", ogType);
    upsertMetaTag("property", "og:title", resolvedTitle);
    upsertMetaTag("property", "og:description", resolvedDesc);
    upsertMetaTag("property", "og:url", resolvedCanonical);
    upsertMetaTag("property", "og:image", resolvedImage);

    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", resolvedTitle);
    upsertMetaTag("name", "twitter:description", resolvedDesc);
    upsertMetaTag("name", "twitter:image", resolvedImage);

    if (serializedSchema) {
      upsertJsonLd("page-jsonld-schema", JSON.parse(serializedSchema));
    } else {
      upsertJsonLd("page-jsonld-schema", null);
    }

    return () => {
      if (serializedSchema) {
        upsertJsonLd("page-jsonld-schema", null);
      }
    };
  }, [title, description, canonicalPath, canonicalUrl, robots, ogType, image, keywords, serializedSchema]);
}
