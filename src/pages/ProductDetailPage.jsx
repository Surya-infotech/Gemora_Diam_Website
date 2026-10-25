import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
  Play,
  Share2,
  Sparkles,
  ArrowLeft,
  MessageCircle,
  Check
} from "lucide-react";
import { useStore } from "../lib/store";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";



function getMetalGradient(metalName = "") {
  const lower = (metalName || "").toLowerCase();
  if (lower.includes("rose")) {
    return "linear-gradient(135deg, #fcd3c7 0%, #e8a999 50%, #c97e6e 100%)";
  }
  if (lower.includes("white")) {
    return "linear-gradient(135deg, #ffffff 0%, #e3e7e8 50%, #bdc4c7 100%)";
  }
  if (lower.includes("plat")) {
    return "linear-gradient(135deg, #ffffff 0%, #eaeded 50%, #cbd2d5 100%)";
  }
  if (lower.includes("silver") || lower.includes("sliver")) {
    return "linear-gradient(135deg, #f0f0f0 0%, #d8d8d8 50%, #b0b0b0 100%)";
  }
  return "linear-gradient(135deg, #f3db7b 0%, #d4af37 50%, #a88722 100%)";
}

function getMetalTextColor(metalName = "") {
  const lower = (metalName || "").toLowerCase();
  if (lower.includes("rose")) return "#4a221b";
  if (lower.includes("white") || lower.includes("plat") || lower.includes("silver") || lower.includes("sliver")) {
    return "#1f272a";
  }
  return "#3b2e04";
}

function getMetalType(metalName = "", product = null) {
  if (product?.pricing) {
    const list1 = product.pricing.metalWithStoneDiamondCaratPrices || [];
    const found1 = list1.find(
      (m) => (m.metalname || "").trim().toLowerCase() === metalName.trim().toLowerCase()
    );
    if (found1?.metaltype && String(found1.metaltype).trim()) {
      return String(found1.metaltype).trim();
    }

    const list2 = product.pricing.metalWisePrices || [];
    const found2 = list2.find(
      (m) => (m.metalname || "").trim().toLowerCase() === metalName.trim().toLowerCase()
    );
    if (found2?.metaltype && String(found2.metaltype).trim()) {
      return String(found2.metaltype).trim();
    }
  }

  const match = metalName.match(/(10k|14k|18k|22k|24k|925|pt|plat|silver|gold)/i);
  if (match) {
    const val = match[1].toUpperCase();
    if (val === "PLAT") return "PT";
    if (val === "SILVER") return "SL";
    return val;
  }
  return metalName.split(" ")[0] || metalName.slice(0, 3).toUpperCase();
}

function LuxuryDropdownSelector({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "Select option"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((opt) => (typeof opt === "string" ? opt : opt.value) === value);
  const displayLabel = typeof selectedOption === "string"
    ? selectedOption
    : selectedOption?.label || value || placeholder;

  return (
    <div style={{ position: "relative", width: "100%", zIndex: isOpen ? 60 : 1 }} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: "0.76rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            display: "block",
            marginBottom: "8px",
            color: "var(--foreground)"
          }}
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          width: "100%",
          height: "44px",
          minHeight: "44px",
          padding: "0 14px",
          border: isOpen ? "1px solid var(--primary)" : "1px solid #E5DFD3",
          borderRadius: "8px",
          backgroundColor: "#FAF9F6",
          color: "var(--foreground)",
          fontSize: "0.85rem",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: isOpen ? "0 0 0 1px var(--primary)" : "none",
          transition: "all 0.2s ease",
          outline: "none",
          boxSizing: "border-box"
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = "#c4bcae";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = "#E5DFD3";
        }}
      >
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "left",
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "var(--foreground)",
            fontWeight: 500
          }}
        >
          {displayLabel}
        </span>
        <ChevronDown
          size={16}
          style={{
            color: "var(--muted-foreground)",
            flexShrink: 0,
            marginLeft: "8px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        />
      </button>

      {/* Floating Luxury Dropdown List */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 5px)",
            left: 0,
            right: 0,
            width: "100%",
            backgroundColor: "#ffffff",
            border: "1px solid #EDE8DE",
            borderRadius: "10px",
            boxShadow: "0 14px 35px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)",
            zIndex: 70,
            maxHeight: "220px",
            overflowY: "auto",
            padding: "6px",
            boxSizing: "border-box"
          }}
        >
          {options.map((opt) => {
            const optVal = typeof opt === "string" ? opt : opt.value;
            const optLabel = typeof opt === "string" ? opt : opt.label;
            const isSelected = optVal === value;

            return (
              <div
                key={optVal}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? "var(--primary)" : "var(--foreground)",
                  backgroundColor: isSelected ? "var(--primary-soft)" : "transparent",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                  fontFamily: "var(--font-sans)",
                  boxSizing: "border-box",
                  minHeight: "40px"
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "#F4F6F0";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span>{optLabel}</span>
                {isSelected && (
                  <Check size={15} style={{ color: "var(--primary)", flexShrink: 0, marginLeft: "8px" }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductDetailContent({ product }) {
  const {
    products,
    addToCart,
    notify,
    format,
    getItemPrice,
    toggleWishlist,
    wishlist,
    generalSettings
  } = useStore();

  const availableMetals = product?.metals || [];
  const [qty, setQty] = useState(1);
  const [metal, setMetal] = useState(availableMetals[0] || "");
  const [hoveredMetal, setHoveredMetal] = useState(null);
  const [selectedStone, setSelectedStone] = useState("");
  const [selectedCarat, setSelectedCarat] = useState("");
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [copied, setCopied] = useState(false);
  const [selectedShape, setSelectedShape] = useState(product?.shapes?.[0] || "");
  const [selectedClarity, setSelectedClarity] = useState(product?.clarities?.[0] || "");
  const [selectedDiamondColor, setSelectedDiamondColor] = useState(product?.diamondColors?.[0] || "");
  const [selectedBandColor, setSelectedBandColor] = useState(product?.bandColors?.[0] || "");

  // Available stones for selected metal from backend pricing
  const availableStones = useMemo(() => {
    if (!product) return [];
    if (product.pricing?.priceType === "metal_with_stone_diamond_carat") {
      const list = product.pricing.metalWithStoneDiamondCaratPrices || [];
      const forMetal = list.filter(
        (m) => (m.metalname || "").trim().toLowerCase() === (metal || "").trim().toLowerCase()
      );
      const stonesFromPricing = (forMetal.length > 0 ? forMetal : list)
        .map((m) => m.stonename)
        .filter(Boolean);
      const unique = Array.from(new Set(stonesFromPricing));
      if (unique.length > 0) return unique;
    }
    return product.stones || [];
  }, [product, metal]);

  const activeStone = useMemo(() => {
    if (availableStones.length === 0) return "";
    if (selectedStone && availableStones.includes(selectedStone)) {
      return selectedStone;
    }
    return availableStones[0] || "";
  }, [availableStones, selectedStone]);

  const matchedPricing = useMemo(() => {
    if (!product || product.pricing?.priceType !== "metal_with_stone_diamond_carat") {
      return null;
    }
    const list = product.pricing.metalWithStoneDiamondCaratPrices || [];
    // 1. Match both metal and active stone
    const exact = list.find(
      (m) =>
        (m.metalname || "").trim().toLowerCase() === (metal || "").trim().toLowerCase() &&
        (m.stonename || "").trim().toLowerCase() === (activeStone || "").trim().toLowerCase()
    );
    if (exact) return exact;

    // 2. Fallback matching metal
    const metalMatch = list.find(
      (m) => (m.metalname || "").trim().toLowerCase() === (metal || "").trim().toLowerCase()
    );
    if (metalMatch) return metalMatch;

    return list[0] || null;
  }, [product, metal, activeStone]);

  const activeCaratPrices = useMemo(() => {
    const hasCaratPricing =
      matchedPricing?.hasCarat !== false && matchedPricing?.stonePricingType !== "fixed";
    const rawList =
      hasCaratPricing && Array.isArray(matchedPricing?.caratPrices)
        ? matchedPricing.caratPrices
        : [];
    // Sort ascending (lowest carat to highest carat)
    return [...rawList].sort((a, b) => {
      const numA = parseFloat(String(a.diamondsize || "").replace(/[^0-9.]/g, "")) || 0;
      const numB = parseFloat(String(b.diamondsize || "").replace(/[^0-9.]/g, "")) || 0;
      if (numA !== numB) return numA - numB;
      return String(a.diamondsize || "").localeCompare(String(b.diamondsize || ""));
    });
  }, [matchedPricing]);

  const hasCarat = activeCaratPrices.length > 0;

  const carat = useMemo(() => {
    if (!hasCarat || activeCaratPrices.length === 0) return "";
    if (selectedCarat && activeCaratPrices.some((c) => c.diamondsize === selectedCarat)) {
      return selectedCarat;
    }
    return activeCaratPrices[0]?.diamondsize || "";
  }, [hasCarat, activeCaratPrices, selectedCarat]);

  const currentPrice = useMemo(() => {
    return getItemPrice(product, metal, activeStone, carat);
  }, [getItemPrice, product, metal, activeStone, carat]);

  const hasDescription = Boolean(
    (product?.description && product.description.trim()) ||
    (product?.seo?.metaDescription && product.seo.metaDescription.trim())
  );
  const currentTab = useMemo(() => {
    if (activeTab === "specifications") return "specifications";
    if (activeTab === "delivery") return "delivery";
    if (!hasDescription) return "specifications";
    return "description";
  }, [hasDescription, activeTab]);

  // Apply Item SEO content from the item table to Document Head
  useEffect(() => {
    if (!product) return;

    const previousTitle = document.title;
    const metaTitle = product.seo?.metaTitle?.trim() || `${product.name} | Gemora Diam Luxury Jewelry`;
    const metaDesc = product.seo?.metaDescription?.trim() || product.description?.trim() || "";
    const metaKeywords = product.seo?.metaKeywords?.trim() || "";
    const canonicalUrl = product.seo?.canonicalUrl?.trim() || window.location.href;
    const currentUrl = window.location.href;
    const imageUrl = product.image || "";

    // 1. Update Document Title
    document.title = metaTitle;

    // Helper to set or update meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return null;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      let created = false;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
        created = true;
      }
      const prevContent = el.getAttribute("content");
      el.setAttribute("content", content);
      return { el, prevContent, created };
    };

    // Helper to set or update link tag
    const setLinkTag = (rel, href) => {
      if (!href) return null;
      let el = document.querySelector(`link[rel="${rel}"]`);
      let created = false;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute(rel, href);
        document.head.appendChild(el);
        created = true;
      }
      const prevHref = el.getAttribute("href");
      el.setAttribute("href", href);
      return { el, prevHref, created };
    };

    const cleanups = [];

    // Description
    if (metaDesc) {
      const res = setMetaTag("name", "description", metaDesc);
      if (res) cleanups.push(() => (res.created ? res.el.remove() : res.el.setAttribute("content", res.prevContent || "")));
    }

    // Keywords
    if (metaKeywords) {
      const res = setMetaTag("name", "keywords", metaKeywords);
      if (res) cleanups.push(() => (res.created ? res.el.remove() : res.el.setAttribute("content", res.prevContent || "")));
    }

    // Canonical Link
    if (canonicalUrl) {
      const res = setLinkTag("canonical", canonicalUrl);
      if (res) cleanups.push(() => (res.created ? res.el.remove() : res.el.setAttribute("href", res.prevHref || "")));
    }

    // Open Graph Tags
    const ogTags = [
      { prop: "og:title", val: metaTitle },
      { prop: "og:description", val: metaDesc },
      { prop: "og:url", val: canonicalUrl || currentUrl },
      { prop: "og:type", val: "product" },
      { prop: "og:image", val: imageUrl },
      { prop: "og:site_name", val: "Gemora Diam" }
    ];
    ogTags.forEach(({ prop, val }) => {
      const res = setMetaTag("property", prop, val);
      if (res) cleanups.push(() => (res.created ? res.el.remove() : res.el.setAttribute("content", res.prevContent || "")));
    });

    // Twitter Card Tags
    const twitterTags = [
      { name: "twitter:card", val: "summary_large_image" },
      { name: "twitter:title", val: metaTitle },
      { name: "twitter:description", val: metaDesc },
      { name: "twitter:image", val: imageUrl }
    ];
    twitterTags.forEach(({ name, val }) => {
      const res = setMetaTag("name", name, val);
      if (res) cleanups.push(() => (res.created ? res.el.remove() : res.el.setAttribute("content", res.prevContent || "")));
    });

    // Schema.org JSON-LD Structured Data
    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "product-jsonld-schema";
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      image: imageUrl ? [imageUrl] : [],
      description: metaDesc,
      sku: product.sku || product.itemid || "",
      brand: {
        "@type": "Brand",
        name: "Gemora Diam"
      },
      offers: {
        "@type": "Offer",
        url: canonicalUrl || currentUrl,
        priceCurrency: "USD",
        price: product.price || 0,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition"
      }
    });
    document.head.appendChild(schemaScript);
    cleanups.push(() => schemaScript.remove());

    return () => {
      document.title = previousTitle;
      cleanups.forEach((fn) => fn());
    };
  }, [product]);

  const allMedia = useMemo(() => {
    if (!product) return [];
    const list = [];
    const seenUrls = new Set();

    // 1. First item image
    if (product.image) {
      list.push({ type: "image", url: product.image });
      seenUrls.add(product.image);
    }

    // 2. Item video(s)
    if (product.video && !seenUrls.has(product.video)) {
      list.push({ type: "video", url: product.video });
      seenUrls.add(product.video);
    }
    if (Array.isArray(product.galleryVideos)) {
      product.galleryVideos.forEach((vUrl) => {
        if (vUrl && !seenUrls.has(vUrl)) {
          list.push({ type: "video", url: vUrl });
          seenUrls.add(vUrl);
        }
      });
    }

    // 3. Item gallery images
    if (Array.isArray(product.galleryImages)) {
      product.galleryImages.forEach((url) => {
        if (url && !seenUrls.has(url)) {
          list.push({ type: "image", url });
          seenUrls.add(url);
        }
      });
    }

    return list;
  }, [product]);

  const isLiked = useMemo(() => {
    if (!product) return false;
    return wishlist.includes(product.id) || wishlist.includes(product._id);
  }, [product, wishlist]);

  const relatedProducts = useMemo(() => {
    if (!product || !products || products.length === 0) return [];
    const currentProdId = String(product._id || product.id || "");
    const otherProducts = products.filter(
      (p) => String(p._id || p.id) !== currentProdId
    );
    const sameCategory = otherProducts.filter(
      (p) =>
        p.category &&
        product.category &&
        String(p.category).trim().toLowerCase() === String(product.category).trim().toLowerCase()
    );
    if (sameCategory.length >= 4) {
      return sameCategory.slice(0, 4);
    }
    const remaining = otherProducts.filter(
      (p) => !sameCategory.some((sc) => String(sc._id || sc.id) === String(p._id || p.id))
    );
    return [...sameCategory, ...remaining].slice(0, 4);
  }, [product, products]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      notify("Link Copied", "Product link copied to clipboard");
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const finalShape = selectedShape || product?.shapes?.[0] || "";
    const finalClarity = selectedClarity || product?.clarities?.[0] || "";
    const finalDiamondColor = selectedDiamondColor || product?.diamondColors?.[0] || "";
    const finalBandColor = selectedBandColor || product?.bandColors?.[0] || "";

    for (let i = 0; i < qty; i++) {
      addToCart(product.id, metal, "", carat, currentPrice, activeStone, {
        shape: finalShape,
        shapename: finalShape,
        clarity: finalClarity,
        clarityname: finalClarity,
        diamondcolor: finalDiamondColor,
        bandcolor: finalBandColor
      });
    }
    notify("Added to Bag", `${qty}x ${product.name} (${format(currentPrice * qty)})`);
  };

  const currentMedia = allMedia[activeMediaIndex] || { type: "image", url: product.image };
  const truncatedBreadcrumbTitle = (product.name || "").length > 36
    ? `${product.name.slice(0, 34)}…`
    : product.name;

  return (
    <div className="pdp-page-container" style={{ backgroundColor: "#ffffff", color: "var(--foreground)", paddingBottom: "100px" }}>
      {/* Breadcrumb Navigation */}
      <div style={{ borderBottom: "1px solid rgba(237, 232, 222, 0.75)", backgroundColor: "#FAF9F6" }}>
        <div className="container-luxury" style={{ padding: "14px 20px" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", fontSize: "0.78rem", color: "var(--muted-foreground)", letterSpacing: "0.03em" }}>
            <Link to="/" style={{ color: "inherit", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}>
              Home
            </Link>
            <span style={{ color: "var(--gold-deep)", opacity: 0.6 }}>/</span>
            <Link to="/collections" style={{ color: "inherit", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}>
              {product.category || "Collections"}
            </Link>
            {product.subcategory && (
              <>
                <span style={{ color: "var(--gold-deep)", opacity: 0.6 }}>/</span>
                <span>{product.subcategory}</span>
              </>
            )}
            <span style={{ color: "var(--gold-deep)", opacity: 0.6 }}>/</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }} title={product.name}>
              {truncatedBreadcrumbTitle}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="container-luxury" style={{ marginTop: "36px" }}>
        <div className="product-showcase-grid">
          {/* LEFT: Media Gallery */}
          <div className="product-gallery-layout product-gallery-sticky">
            {/* Thumbnail Rail */}
            {allMedia.length > 1 && (
              <div className="product-gallery-thumbnails">
                {allMedia.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    aria-label={`Select media ${idx + 1}`}
                    style={{
                      width: "clamp(60px, 14vw, 74px)",
                      height: "clamp(60px, 14vw, 74px)",
                      flexShrink: 0,
                      borderRadius: "10px",
                      border: activeMediaIndex === idx ? "2px solid var(--primary)" : "1px solid #EDE8DE",
                      backgroundColor: "#FAF9F6",
                      padding: "3px",
                      overflow: "hidden",
                      cursor: "pointer",
                      opacity: activeMediaIndex === idx ? 1 : 0.75,
                      boxShadow: activeMediaIndex === idx ? "0 4px 12px rgba(85, 104, 50, 0.2)" : "none",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      if (activeMediaIndex !== idx) {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.borderColor = "var(--primary-light)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeMediaIndex !== idx) {
                        e.currentTarget.style.opacity = "0.75";
                        e.currentTarget.style.borderColor = "#EDE8DE";
                      }
                    }}
                  >
                    {m.type === "video" ? (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#111813",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          borderRadius: "6px"
                        }}
                      >
                        <video
                          src={m.url}
                          muted
                          playsInline
                          preload="metadata"
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            pointerEvents: "none"
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.35)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <div
                            style={{
                              width: "26px",
                              height: "26px",
                              borderRadius: "50%",
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                            }}
                          >
                            <Play size={12} fill="#1e2419" color="#1e2419" style={{ marginLeft: "2px" }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "fill", borderRadius: "6px" }} />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage */}
            <div className="product-main-stage">
              {currentMedia.type === "video" ? (
                <video
                  key={currentMedia.url}
                  src={currentMedia.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ pointerEvents: "none" }}
                />
              ) : (
                <img
                  key={currentMedia.url}
                  src={currentMedia.url}
                  alt={product.name}
                />
              )}

              {/* Floating Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Wishlist"
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(8px)",
                  display: "grid",
                  placeItems: "center",
                  color: isLiked ? "#e53e3e" : "#333",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: "1px solid rgba(255,255,255,0.6)",
                  zIndex: 2
                }}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* RIGHT: Product Details & Purchase Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="eyebrow" style={{ color: "var(--primary)", letterSpacing: "0.22em", fontSize: "0.74rem" }}>
                  {product.category || (generalSettings?.softwarename || "Gemora Diam")}
                  {product.subcategory ? ` • ${product.subcategory}` : ""}
                </span>

                <button
                  onClick={handleShare}
                  aria-label="Share product"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.76rem",
                    color: "var(--muted-foreground)",
                    cursor: "pointer",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    border: "1px solid #EDE8DE",
                    backgroundColor: "#FAF9F6",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#EDE8DE";
                    e.currentTarget.style.color = "var(--muted-foreground)";
                  }}
                >
                  <Share2 size={13} />
                  <span>{copied ? "Copied!" : "Share"}</span>
                </button>
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.65rem, 2.4vw, 2.25rem)",
                  fontWeight: 400,
                  lineHeight: 1.26,
                  color: "#1a2219",
                  letterSpacing: "-0.01em",
                  margin: "8px 0 12px 0",
                  wordBreak: "break-word"
                }}
              >
                {product.name}
              </h1>

              <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.1rem",
                    fontWeight: 600,
                    color: "var(--primary)",
                    letterSpacing: "-0.01em"
                  }}
                >
                  {format(currentPrice)}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", letterSpacing: "0.02em" }}>
                  (Includes complimentary insured shipping &amp; taxes)
                </span>
              </div>
            </div>

            <div style={{ height: "1px", backgroundColor: "#EDE8DE" }} />

            {/* Metal Selector */}
            {availableMetals.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <label
                    style={{
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "var(--foreground)"
                    }}
                  >
                    Select Metal:{" "}
                    <span style={{ color: "var(--primary)", fontWeight: 600, textTransform: "none", letterSpacing: "0.02em" }}>
                      {metal}
                    </span>
                  </label>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", letterSpacing: "0.03em" }}>
                    100% Solid Certified Metal
                  </span>
                </div>

                <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", padding: "8px 2px 4px 2px" }}>
                  {availableMetals.map((m) => {
                    const isSelected = metal === m;
                    const isHovered = hoveredMetal === m;
                    return (
                      <div key={m} style={{ position: "relative", display: "inline-flex" }}>
                        <button
                          type="button"
                          onClick={() => setMetal(m)}
                          onMouseEnter={() => setHoveredMetal(m)}
                          onMouseLeave={() => setHoveredMetal(null)}
                          title={m}
                          aria-label={m}
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: getMetalGradient(m),
                            border: "1px solid rgba(0,0,0,0.16)",
                            boxShadow: isSelected
                              ? "0 0 0 2px #ffffff, 0 0 0 4.5px var(--primary)"
                              : isHovered
                                ? "0 0 0 2px #ffffff, 0 0 0 3px rgba(85,104,50,0.4)"
                                : "0 2px 6px rgba(0,0,0,0.06)",
                            transform: isSelected ? "scale(1.08)" : isHovered ? "scale(1.04)" : "scale(1)",
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                            outline: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: getMetalTextColor(m),
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            letterSpacing: "0.02em"
                          }}
                        >
                          {getMetalType(m, product)}
                        </button>
                        {isHovered && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: "calc(100% + 9px)",
                              left: "50%",
                              transform: "translateX(-50%)",
                              backgroundColor: "#181818",
                              color: "#ffffff",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              letterSpacing: "0.03em",
                              whiteSpace: "nowrap",
                              pointerEvents: "none",
                              zIndex: 50,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
                            }}
                          >
                            {m}
                            <div
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 0,
                                height: 0,
                                borderLeft: "5px solid transparent",
                                borderRight: "5px solid transparent",
                                borderTop: "5px solid #181818"
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stone & Diamond Size Dropdowns */}
            {(availableStones.length > 0 || (hasCarat && activeCaratPrices.length > 0)) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "14px",
                  alignItems: "start"
                }}
              >
                {/* Stone Dropdown */}
                {availableStones.length > 0 && (
                  <LuxuryDropdownSelector
                    id="stone-select"
                    label="Diamond Type"
                    value={activeStone}
                    options={availableStones}
                    onChange={(val) => setSelectedStone(val)}
                  />
                )}

                {/* Diamond Size Dropdown */}
                {hasCarat && activeCaratPrices.length > 0 && (
                  <LuxuryDropdownSelector
                    id="carat-select"
                    label="Central Diamond Size"
                    value={carat}
                    options={activeCaratPrices.map((cp) => ({ label: cp.diamondsize, value: cp.diamondsize }))}
                    onChange={(val) => setSelectedCarat(val)}
                  />
                )}
              </div>
            )}

            {/* Attribute Groups */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Shape & Clarity */}
              {((product.shapes && product.shapes.length > 0) ||
                (product.clarities && product.clarities.length > 0)) && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      product.shapes?.length > 0 && product.clarities?.length > 0
                        ? "repeat(auto-fit, minmax(180px, 1fr))"
                        : "1fr",
                    gap: "16px",
                    alignItems: "start"
                  }}
                >
                  {product.shapes && product.shapes.length > 0 && (
                    <div>
                      <label style={{ fontSize: "0.76rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: "8px", color: "var(--foreground)" }}>
                        Shape: <span style={{ fontWeight: 600, color: "var(--primary)" }}>{selectedShape || product.shapes[0]}</span>
                      </label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {product.shapes.map((sh) => {
                          const isSelected = (selectedShape || product.shapes[0]) === sh;
                          return (
                            <button
                              key={sh}
                              type="button"
                              onClick={() => setSelectedShape(sh)}
                              style={{
                                padding: "7px 16px",
                                border: isSelected ? "1.5px solid var(--primary)" : "1px solid #E5DFD3",
                                backgroundColor: isSelected ? "var(--primary)" : "#FAF8F5",
                                color: isSelected ? "#ffffff" : "var(--foreground)",
                                borderRadius: "6px",
                                fontSize: "0.82rem",
                                fontWeight: isSelected ? 600 : 500,
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                boxShadow: isSelected ? "0 2px 8px rgba(85, 104, 50, 0.25)" : "none"
                              }}
                            >
                              {sh}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {product.clarities && product.clarities.length > 0 && (
                    <div>
                      <label style={{ fontSize: "0.76rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: "8px", color: "var(--foreground)" }}>
                        Clarity: <span style={{ fontWeight: 600, color: "var(--primary)" }}>{selectedClarity || product.clarities[0]}</span>
                      </label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {product.clarities.map((cl) => {
                          const isSelected = (selectedClarity || product.clarities[0]) === cl;
                          return (
                            <button
                              key={cl}
                              type="button"
                              onClick={() => setSelectedClarity(cl)}
                              style={{
                                padding: "7px 16px",
                                border: isSelected ? "1.5px solid var(--primary)" : "1px solid #E5DFD3",
                                backgroundColor: isSelected ? "var(--primary)" : "#FAF8F5",
                                color: isSelected ? "#ffffff" : "var(--foreground)",
                                borderRadius: "6px",
                                fontSize: "0.82rem",
                                fontWeight: isSelected ? 600 : 500,
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                boxShadow: isSelected ? "0 2px 8px rgba(85, 104, 50, 0.25)" : "none"
                              }}
                            >
                              {cl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Diamond Color & Band Color */}
              {((product.diamondColors && product.diamondColors.length > 0) ||
                (product.bandColors && product.bandColors.length > 0)) && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      product.diamondColors?.length > 0 && product.bandColors?.length > 0
                        ? "repeat(auto-fit, minmax(180px, 1fr))"
                        : "1fr",
                    gap: "16px",
                    alignItems: "start"
                  }}
                >
                  {product.diamondColors && product.diamondColors.length > 0 && (
                    <div>
                      <label style={{ fontSize: "0.76rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: "8px", color: "var(--foreground)" }}>
                        Diamond Color: <span style={{ fontWeight: 600, color: "var(--primary)" }}>{selectedDiamondColor || product.diamondColors[0]}</span>
                      </label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {product.diamondColors.map((dc) => {
                          const isSelected = (selectedDiamondColor || product.diamondColors[0]) === dc;
                          return (
                            <button
                              key={dc}
                              type="button"
                              onClick={() => setSelectedDiamondColor(dc)}
                              style={{
                                padding: "7px 16px",
                                border: isSelected ? "1.5px solid var(--primary)" : "1px solid #E5DFD3",
                                backgroundColor: isSelected ? "var(--primary)" : "#FAF8F5",
                                color: isSelected ? "#ffffff" : "var(--foreground)",
                                borderRadius: "6px",
                                fontSize: "0.82rem",
                                fontWeight: isSelected ? 600 : 500,
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                boxShadow: isSelected ? "0 2px 8px rgba(85, 104, 50, 0.25)" : "none"
                              }}
                            >
                              {dc}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {product.bandColors && product.bandColors.length > 0 && (
                    <div>
                      <label style={{ fontSize: "0.76rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: "8px", color: "var(--foreground)" }}>
                        Band Color: <span style={{ fontWeight: 600, color: "var(--primary)" }}>{selectedBandColor || product.bandColors[0]}</span>
                      </label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {product.bandColors.map((bc) => {
                          const isSelected = (selectedBandColor || product.bandColors[0]) === bc;
                          return (
                            <button
                              key={bc}
                              type="button"
                              onClick={() => setSelectedBandColor(bc)}
                              style={{
                                padding: "7px 16px",
                                border: isSelected ? "1.5px solid var(--primary)" : "1px solid #E5DFD3",
                                backgroundColor: isSelected ? "var(--primary)" : "#FAF8F5",
                                color: isSelected ? "#ffffff" : "var(--foreground)",
                                borderRadius: "6px",
                                fontSize: "0.82rem",
                                fontWeight: isSelected ? 600 : 500,
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                boxShadow: isSelected ? "0 2px 8px rgba(85, 104, 50, 0.25)" : "none"
                              }}
                            >
                              {bc}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart Action */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E5DFD3",
                  borderRadius: "8px",
                  height: "52px",
                  backgroundColor: "#FAF9F6"
                }}
              >
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  style={{ width: "40px", height: "100%", display: "grid", placeItems: "center", cursor: "pointer", fontSize: "1.1rem", color: "var(--foreground)", background: "transparent", border: "none" }}
                >
                  -
                </button>
                <span style={{ width: "36px", textAlign: "center", fontWeight: 600, fontSize: "0.95rem", color: "var(--foreground)" }}>
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  style={{ width: "40px", height: "100%", display: "grid", placeItems: "center", cursor: "pointer", fontSize: "1.1rem", color: "var(--foreground)", background: "transparent", border: "none" }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  height: "52px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  fontSize: "0.86rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 6px 20px rgba(85, 104, 50, 0.25)",
                  border: "1px solid rgba(197, 160, 89, 0.35)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(85, 104, 50, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--primary)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(85, 104, 50, 0.25)";
                }}
              >
                <ShoppingBag size={18} />
                <span>Add To Bag • {format(currentPrice * qty)}</span>
              </button>
            </div>

            {/* Concierge & Appointment Links */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <a
                href={`https://wa.me/917845120369?text=${encodeURIComponent(`Hello Gemora Studio, I would like to inquire about ${product.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  height: "44px",
                  borderRadius: "8px",
                  border: "1px solid #E5DFD3",
                  backgroundColor: "#FAF9F6",
                  color: "var(--foreground)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5DFD3";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
              >
                <MessageCircle size={15} color="var(--primary)" />
                <span>Studio Concierge</span>
              </a>
              <Link
                to="/contact"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  height: "44px",
                  borderRadius: "8px",
                  border: "1px solid #E5DFD3",
                  backgroundColor: "#FAF9F6",
                  color: "var(--foreground)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5DFD3";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
              >
                <Sparkles size={15} color="var(--gold-deep)" />
                <span>Book Appointment</span>
              </Link>
            </div>

            {/* Trust Assurances */}
            <div
              className="product-trust-grid"
              style={{
                padding: "20px 22px",
                backgroundColor: "#FAF8F5",
                border: "1px solid #EDE8DE",
                borderRadius: "12px",
                marginTop: "6px"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <Truck size={17} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)" }}>Complimentary Insured Delivery</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted-foreground)" }}>Direct to door via armoured courier</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <ShieldCheck size={17} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)" }}>Certified Authenticity</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted-foreground)" }}>100% Certified conflict-free stones</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <RotateCcw size={17} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)" }}>7-Day Bespoke Returns</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted-foreground)" }}>Hassle-free return &amp; exchange policy</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <Sparkles size={17} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)" }}>Lifetime Warranty</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted-foreground)" }}>Annual prong check &amp; ultrasonic polish</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Story, Specifications, Shipping */}
        <div style={{ marginTop: "70px", borderTop: "1px solid #EDE8DE" }}>
          <div
            className="no-scrollbar"
            style={{
              display: "flex",
              gap: "clamp(18px, 3.5vw, 32px)",
              borderBottom: "1px solid #EDE8DE",
              paddingTop: "20px",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {hasDescription && (
              <button
                onClick={() => setActiveTab("description")}
                style={{
                  paddingBottom: "14px",
                  fontSize: "0.92rem",
                  fontWeight: currentTab === "description" ? 600 : 500,
                  color: currentTab === "description" ? "var(--primary)" : "var(--muted-foreground)",
                  borderBottom: currentTab === "description" ? "2px solid var(--primary)" : "2px solid transparent",
                  cursor: "pointer",
                  background: "transparent",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  transition: "all 0.2s"
                }}
              >
                Story &amp; Craftsmanship
              </button>
            )}
            <button
              onClick={() => setActiveTab("specifications")}
              style={{
                paddingBottom: "14px",
                fontSize: "0.92rem",
                fontWeight: currentTab === "specifications" ? 600 : 500,
                color: currentTab === "specifications" ? "var(--primary)" : "var(--muted-foreground)",
                borderBottom: currentTab === "specifications" ? "2px solid var(--primary)" : "2px solid transparent",
                cursor: "pointer",
                background: "transparent",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                transition: "all 0.2s"
              }}
            >
              Piece Specifications
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              style={{
                paddingBottom: "14px",
                fontSize: "0.92rem",
                fontWeight: currentTab === "delivery" ? 600 : 500,
                color: currentTab === "delivery" ? "var(--primary)" : "var(--muted-foreground)",
                borderBottom: currentTab === "delivery" ? "2px solid var(--primary)" : "2px solid transparent",
                cursor: "pointer",
                background: "transparent",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                transition: "all 0.2s"
              }}
            >
              Delivery &amp; Returns
            </button>
          </div>

          <div style={{ padding: "32px 0", width: "100%", lineHeight: 1.8, fontSize: "0.94rem", color: "var(--foreground)" }}>
            {hasDescription && currentTab === "description" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
                  gap: "40px",
                  alignItems: "start"
                }}
              >
                {/* Left Column: Description Narrative */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.35rem",
                      fontWeight: 500,
                      color: "#182015",
                      margin: 0
                    }}
                  >
                    The Story &amp; Craftsmanship
                  </h3>
                  <p style={{ color: "var(--muted-foreground)", whiteSpace: "pre-line", fontSize: "0.94rem", lineHeight: 1.85, margin: 0 }}>
                    {product.description || product.seo?.metaDescription}
                  </p>
                </div>

                {/* Right Column: Atelier Standards & Presentation Card */}
                <div
                  style={{
                    backgroundColor: "#FAF9F6",
                    border: "1px solid #EAE4D7",
                    borderRadius: "14px",
                    padding: "26px 28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px"
                  }}
                >
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
                      href={`https://wa.me/917845120369?text=${encodeURIComponent(`Hello, I have questions regarding the craftsmanship of ${product.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}
                    >
                      Ask Concierge &rarr;
                    </a>
                  </div>
                </div>
              </div>
            )}

            {currentTab === "specifications" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "14px",
                  backgroundColor: "#FAF9F6",
                  padding: "26px",
                  borderRadius: "14px",
                  border: "1px solid #EDE8DE"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #EDE8DE", paddingBottom: "10px" }}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Selected Metal</span>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{metal || "Bespoke Gold"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #EDE8DE", paddingBottom: "10px" }}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Diamond / Stone</span>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{activeStone || "Lab Grown Diamond"}</span>
                </div>
                {carat && (
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #EDE8DE", paddingBottom: "10px" }}>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Diamond Weight</span>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{carat}</span>
                  </div>
                )}
                {product.shapes?.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #EDE8DE", paddingBottom: "10px" }}>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Diamond Shape</span>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{selectedShape || product.shapes[0]}</span>
                  </div>
                )}
                {product.clarities?.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #EDE8DE", paddingBottom: "10px" }}>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Clarity Grade</span>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{selectedClarity || product.clarities[0]}</span>
                  </div>
                )}
                {product.diamondColors?.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #EDE8DE", paddingBottom: "10px" }}>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Diamond Color</span>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{selectedDiamondColor || product.diamondColors[0]}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #EDE8DE", paddingBottom: "10px" }}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Craftsmanship Origin</span>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>Gemora Design Studio</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #EDE8DE", paddingBottom: "10px" }}>
                  <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>Certification</span>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--primary)" }}>Certified Authentic</span>
                </div>
              </div>
            )}

            {currentTab === "delivery" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
                  gap: "28px"
                }}
              >
                <div
                  style={{
                    backgroundColor: "#FAF9F6",
                    border: "1px solid #EDE8DE",
                    borderRadius: "14px",
                    padding: "24px"
                  }}
                >
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "12px", color: "var(--foreground)" }}>
                    Complimentary Armoured Delivery
                  </h4>
                  <ul style={{ paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "10px", color: "var(--muted-foreground)", fontSize: "0.86rem" }}>
                    <li><strong>Fully Insured Courier:</strong> Dispatched via specialized armored transport with required adult signature confirmation.</li>
                    <li><strong>Dispatch Timeline:</strong> In-stock creations ship within 48 hours. Custom metal &amp; carat variations require 7-10 business days.</li>
                    <li><strong>Discreet Packaging:</strong> Outer boxes are plain and unmarked to maintain surprise and security.</li>
                  </ul>
                </div>

                <div
                  style={{
                    backgroundColor: "#FAF9F6",
                    border: "1px solid #EDE8DE",
                    borderRadius: "14px",
                    padding: "24px"
                  }}
                >
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "12px", color: "var(--foreground)" }}>
                    7-Day Bespoke Returns &amp; Warranty
                  </h4>
                  <ul style={{ paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "10px", color: "var(--muted-foreground)", fontSize: "0.86rem" }}>
                    <li><strong>7-Day Returns:</strong> If you are not completely enchanted, return unworn in original presentation packaging within 7 days for full refund.</li>
                    <li><strong>Complimentary First Sizing:</strong> We offer one complimentary ring resizing within 60 days of delivery.</li>
                    <li><strong>Lifetime Warranty:</strong> Includes annual prong inspections, sonic deep-cleaning, and rhodium/gold repolishing.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like Recommendations */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "70px", paddingTop: "50px", borderTop: "1px solid #EDE8DE" }}>
            <SectionHeading
              eyebrow="Curated Pieces"
              title="You May Also Like"
              description="Complementary handcrafted pieces sculpted with identical diamond brilliance."
            />

            <div
              className="bestseller-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  relatedProducts.length < 4
                    ? "repeat(auto-fill, minmax(240px, 300px))"
                    : undefined,
                justifyContent: relatedProducts.length < 4 ? "start" : undefined
              }}
            >
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id || rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Purchase Bar (< 768px) */}
      <div className="product-mobile-bottom-bar">
        <div style={{ flex: "1 1 auto", minWidth: 0, paddingRight: "10px" }}>
          <div
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--foreground)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {product.name}
          </div>
          <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--primary)" }}>
            {format(currentPrice)}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          style={{
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(85, 104, 50, 0.3)"
          }}
        >
          <ShoppingBag size={15} />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useStore();

  const product = useMemo(() => {
    if (!products || products.length === 0) return null;
    const strId = String(id).trim().toLowerCase();
    return (
      products.find(
        (p) =>
          (p._id && String(p._id).toLowerCase() === strId) ||
          (p.id && String(p.id).toLowerCase() === strId) ||
          (p.rawId !== undefined && String(p.rawId).toLowerCase() === strId) ||
          (p.itemid !== undefined && String(p.itemid).toLowerCase() === strId) ||
          (p.seo?.slug && String(p.seo.slug).toLowerCase() === strId)
      ) || null
    );
  }, [products, id]);

  // If accessed via numeric itemid (e.g. /product/1), smoothly replace URL with /product/_id
  useEffect(() => {
    if (product && product._id && String(id) !== String(product._id)) {
      navigate(`/product/${product._id}`, { replace: true });
    }
  }, [product, id, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading && !product) {
    return (
      <div style={{ minHeight: "65vh", display: "grid", placeItems: "center", backgroundColor: "#ffffff" }}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p className="eyebrow" style={{ color: "var(--primary)", marginBottom: "12px" }}>
            Fine Jewelry
          </p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--foreground)" }}>
            Loading Product Details...
          </h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "65vh", display: "grid", placeItems: "center", padding: "60px 20px", textAlign: "center", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "460px" }}>
          <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>
            Item Not Found
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", margin: "14px 0" }}>
            Jewelry Piece Unavailable
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem", marginBottom: "28px" }}>
            The requested piece could not be located in our collection catalog.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                border: "1px solid var(--border)",
                borderRadius: "2px",
                cursor: "pointer",
                color: "var(--foreground)"
              }}
            >
              <ArrowLeft size={16} /> Go Back
            </button>
            <Link
              to="/collections"
              className="eyebrow"
              style={{
                padding: "12px 26px",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                borderRadius: "2px"
              }}
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetailContent key={product.id || id} product={product} />;
}
