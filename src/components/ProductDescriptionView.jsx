import React, { useMemo } from "react";
import DOMPurify from "dompurify";

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

export default function ProductDescriptionView({ description }) {
  const sanitizedHtml = useMemo(() => formatToLuxuryHtml(description), [description]);

  return (
    <div className="product-luxury-description-full">
      <div
        className="luxury-html-content"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
}