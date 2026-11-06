import React, { useMemo } from "react";
import DOMPurify from "dompurify";
import { Sparkles, ShieldCheck, Check, Truck } from "lucide-react";

/**
 * Strips emoji characters from text for clean, elegant typography.
 */
function stripEmojis(text = "") {
  return String(text)
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1FA00}-\u{1FAFF}]/gu, "")
    .trim();
}

/**
 * Converts dynamic plain-text or unicode-formatted descriptions into semantic luxury HTML.
 * If the input already contains HTML tags (e.g. from rich text editor), it preserves them directly.
 */
function formatToLuxuryHtml(rawInput = "") {
  if (!rawInput) return "";
  const trimmed = String(rawInput).trim();

  // If already formatted HTML, let DOMPurify sanitize and return it directly
  if (/<(p|div|h[1-6]|ul|ol|table|blockquote|section|article)[^>]*>/i.test(trimmed)) {
    return DOMPurify.sanitize(trimmed);
  }

  // Intelligently transform raw dynamic text lines into clean HTML elements
  const lines = trimmed.split("\n").map((l) => l.normalize("NFKD").trim());
  const htmlParts = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      htmlParts.push("</ul>");
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine) {
      closeList();
      continue;
    }

    const clean = stripEmojis(rawLine);
    if (!clean) continue;

    // 1. Detect dynamic Section Headings (All-caps, markdown headings, or short lines ending with colon)
    const isMarkdownHeading = /^#{1,6}\s/.test(clean);
    const endsWithColonHeading = clean.endsWith(":") && clean.length < 55 && !clean.includes("http");
    const isAllCapsHeading = (() => {
      const letters = clean.replace(/[^A-Za-z]/g, "");
      return clean.length < 65 && letters.length >= 3 && letters === letters.toUpperCase();
    })();

    if (isMarkdownHeading || endsWithColonHeading || isAllCapsHeading) {
      closeList();
      const title = clean.replace(/^#{1,6}\s*/, "").replace(/:$/, "").trim();
      htmlParts.push(`<h4 class="luxury-html-heading">${escapeHtml(title)}</h4>`);
      continue;
    }

    // 2. Detect Callout / Artisan Notes
    if (/^NOTE:?/i.test(clean) || clean.toLowerCase().startsWith("note:-")) {
      closeList();
      const noteText = clean.replace(/^NOTE:?\s*-?\s*/i, "").trim();
      htmlParts.push(
        `<div class="luxury-html-note"><strong class="note-label">Artisan Note:</strong> ${escapeHtml(noteText)}</div>`
      );
      continue;
    }

    // 3. Detect Bullet points and Key-Value specification lines
    const isBulletLine = /^[\u27A4\u2022\-\*•➤\u2705\uD83D\uDEAB]/.test(rawLine);
    const colonIdx = clean.indexOf(":");
    const isKeyValue = colonIdx > 1 && colonIdx < 35 && !clean.startsWith("http");

    if (isBulletLine || isKeyValue) {
      if (!inList) {
        htmlParts.push('<ul class="luxury-html-list">');
        inList = true;
      }

      if (isKeyValue) {
        const key = clean.slice(0, colonIdx).replace(/^[\u27A4\u2022\-\*•➤\s]+/, "").trim();
        const val = clean.slice(colonIdx + 1).replace(/^\[|\]$/g, "").trim();
        htmlParts.push(
          `<li><span class="luxury-bullet-dot">✦</span><span class="spec-key">${escapeHtml(key)}:</span> <span class="spec-value">${escapeHtml(val)}</span></li>`
        );
      } else {
        const itemText = clean.replace(/^[\u27A4\u2022\-\*•➤\s]+/, "").trim();
        htmlParts.push(
          `<li><span class="luxury-bullet-dot">✦</span><span class="spec-value">${escapeHtml(itemText)}</span></li>`
        );
      }
      continue;
    }

    // 4. Default Prose Paragraph
    closeList();
    htmlParts.push(`<p class="luxury-html-para">${escapeHtml(clean)}</p>`);
  }

  closeList();
  return DOMPurify.sanitize(htmlParts.join("\n"));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function ProductDescriptionView({ description, product }) {
  const sanitizedHtml = useMemo(() => formatToLuxuryHtml(description), [description]);

  return (
    <div className="product-luxury-description-layout">
      {/* LEFT: Dynamic HTML / Typography Description Container */}
      <div className="product-luxury-description-body">
        <div
          className="luxury-html-content"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>

      {/* RIGHT: Sticky Craftsmanship Standard Card */}
      <div className="product-luxury-description-sidebar">
        <div className="craftsmanship-sticky-card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-soft)",
                display: "grid",
                placeItems: "center",
                color: "var(--primary)"
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", margin: 0, color: "var(--foreground)", fontWeight: 600 }}>
                Craftsmanship Standard
              </h4>
              <span style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Gemora Fine Jewelry
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #EDE8DE", paddingTop: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: "3px" }} />
              <div style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--foreground)" }}>Certified Ethical Origin:</strong> Hand-selected Type IIa lab-grown stones crafted to highest diamond color &amp; clarity parameters.
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <Check size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: "3px" }} />
              <div style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--foreground)" }}>Master Artisan Setting:</strong> Secured with precision micro-prongs individually hand-examined under 10x gemological magnification.
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <Truck size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: "3px" }} />
              <div style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--foreground)" }}>Signature Presentation:</strong> Delivered in our bespoke illuminated velvet presentation box with certificate of authenticity.
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #EDE8DE", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.76rem", color: "var(--muted-foreground)" }}>Have bespoke questions?</span>
            <a
              href={`https://wa.me/917845120369?text=${encodeURIComponent(`Hello, I have questions regarding the craftsmanship of ${product?.name || "this ring"}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}
            >
              Ask Concierge &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}