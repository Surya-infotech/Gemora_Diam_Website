import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Share2,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { useStore } from "../lib/store";



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

function ProductDetailContent({ product }) {
  const navigate = useNavigate();
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
  const [selectedRingSize, setSelectedRingSize] = useState("");
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

  const sortedRingSizes = useMemo(() => {
    if (!product?.ringSizes || !Array.isArray(product.ringSizes)) return [];
    // Sort ascending (lowest size to highest size)
    return [...product.ringSizes].sort((a, b) => {
      const numA = parseFloat(String(a).replace(/[^0-9.]/g, "")) || 0;
      const numB = parseFloat(String(b).replace(/[^0-9.]/g, "")) || 0;
      if (numA !== numB) return numA - numB;
      return String(a).localeCompare(String(b));
    });
  }, [product]);

  const ringSize = useMemo(() => {
    if (sortedRingSizes.length === 0) return "";
    if (selectedRingSize && sortedRingSizes.includes(selectedRingSize)) {
      return selectedRingSize;
    }
    return sortedRingSizes[0] || "";
  }, [sortedRingSizes, selectedRingSize]);

  const currentPrice = useMemo(() => {
    return getItemPrice(product, metal, activeStone, carat);
  }, [getItemPrice, product, metal, activeStone, carat]);

  const hasDescription = Boolean(product?.description && product.description.trim());
  const currentTab = useMemo(() => {
    if (!hasDescription) return "delivery";
    return activeTab === "delivery" ? "delivery" : "description";
  }, [hasDescription, activeTab]);

  const allMedia = useMemo(() => {
    if (!product) return [];
    const list = [];
    if (product.image) list.push({ type: "image", url: product.image });
    if (Array.isArray(product.galleryImages)) {
      product.galleryImages.forEach((url) => {
        if (url && url !== product.image) list.push({ type: "image", url });
      });
    }
    if (product.video) list.push({ type: "video", url: product.video });
    return list;
  }, [product]);

  const isLiked = useMemo(() => {
    if (!product) return false;
    return wishlist.includes(product.id) || wishlist.includes(product._id);
  }, [product, wishlist]);

  const relatedProducts = useMemo(() => {
    if (!product || !products) return [];
    const sameCategory = products.filter(
      (p) => String(p.id) !== String(product.id) && p.category === product.category
    );
    if (sameCategory.length > 0) return sameCategory.slice(0, 4);
    return products.filter((p) => String(p.id) !== String(product.id)).slice(0, 4);
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
    for (let i = 0; i < qty; i++) {
      addToCart(product.id, metal, ringSize, carat, currentPrice, activeStone);
    }
    notify("Added to Bag", `${qty}x ${product.name} (${format(currentPrice * qty)})`);
  };

  const currentMedia = allMedia[activeMediaIndex] || { type: "image", url: product.image };

  return (
    <div style={{ backgroundColor: "#ffffff", color: "var(--foreground)", paddingBottom: "100px" }}>
      {/* Breadcrumb Navigation */}
      <div style={{ borderBottom: "1px solid var(--border-subtle)", backgroundColor: "#fafbf8" }}>
        <div className="container-luxury" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
            <Link to="/" style={{ color: "inherit", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}>
              Home
            </Link>
            <ChevronRight size={13} />
            <Link to="/shop" style={{ color: "inherit", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")} onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}>
              {product.category || "Fine Jewelry"}
            </Link>
            {product.subcategory && (
              <>
                <ChevronRight size={13} />
                <span>{product.subcategory}</span>
              </>
            )}
            <ChevronRight size={13} />
            <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="container-luxury" style={{ marginTop: "40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "56px",
            alignItems: "start"
          }}
        >
          {/* LEFT: Media Gallery */}
          <div style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Main Stage */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "520px",
                backgroundColor: "#f7f7f7",
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                display: "grid",
                placeItems: "center"
              }}
            >
              {currentMedia.type === "video" ? (
                <video
                  src={currentMedia.url}
                  controls
                  autoPlay
                  muted
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <img
                  src={currentMedia.url}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transition: "transform 0.4s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                  backdropFilter: "blur(6px)",
                  display: "grid",
                  placeItems: "center",
                  color: isLiked ? "var(--primary)" : "#333",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Thumbnail Rail */}
            {allMedia.length > 1 && (
              <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "6px" }}>
                {allMedia.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    style={{
                      width: "74px",
                      height: "74px",
                      flexShrink: 0,
                      borderRadius: "3px",
                      border: activeMediaIndex === idx ? "2px solid var(--primary)" : "1px solid var(--border)",
                      backgroundColor: "#f7f7f7",
                      padding: "2px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "border-color 0.2s"
                    }}
                  >
                    {m.type === "video" ? (
                      <div style={{ width: "100%", height: "100%", backgroundColor: "#1e2419", color: "#fff", display: "grid", placeItems: "center", fontSize: "0.72rem", fontWeight: 700 }}>
                        VIDEO
                      </div>
                    ) : (
                      <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details & Purchase Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span className="eyebrow" style={{ color: "var(--primary)", letterSpacing: "0.22em" }}>
                  {product.category || (generalSettings?.softwarename || "Gemora Diam")}
                  {product.subcategory ? ` • ${product.subcategory}` : ""}
                </span>

                <button
                  onClick={handleShare}
                  aria-label="Share product"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.78rem",
                    color: "var(--muted-foreground)",
                    cursor: "pointer"
                  }}
                >
                  <Share2 size={14} />
                  <span>{copied ? "Copied!" : "Share"}</span>
                </button>
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "var(--foreground)"
                }}
              >
                {product.name}
              </h1>

              <div style={{ marginTop: "14px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.1rem",
                    fontWeight: 600,
                    color: "var(--primary)"
                  }}
                >
                  {format(currentPrice)}
                </span>
              </div>
            </div>

            <div style={{ height: "1px", backgroundColor: "var(--border-subtle)" }} />

            {/* Metal Selector */}
            {availableMetals.length > 0 && (
              <div>
                <label
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    display: "block",
                    marginBottom: "22px",
                    color: "var(--foreground)"
                  }}
                >
                  Select Metal
                </label>
                <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", padding: "6px 2px" }}>
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
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: getMetalGradient(m),
                            border: "1px solid rgba(0,0,0,0.18)",
                            boxShadow: isSelected
                              ? "0 0 0 2px #ffffff, 0 0 0 4px var(--primary)"
                              : isHovered
                                ? "0 0 0 2px #ffffff, 0 0 0 3px rgba(0,0,0,0.25)"
                                : "0 1px 3px rgba(0,0,0,0.08)",
                            transform: isSelected || isHovered ? "scale(1.08)" : "scale(1)",
                            cursor: "pointer",
                            transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
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
                        {/* Hover Tooltip with metal name */}
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
                              borderRadius: "3px",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              letterSpacing: "0.04em",
                              whiteSpace: "nowrap",
                              pointerEvents: "none",
                              zIndex: 50,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                              animation: "fadeIn 0.15s ease-out"
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

            {/* Stone, Diamond Size & Ring Size Dropdowns (Side by Side) */}
            {(availableStones.length > 0 ||
              (hasCarat && activeCaratPrices.length > 0) ||
              sortedRingSizes.length > 0) && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "16px",
                    alignItems: "start"
                  }}
                >
                  {/* Stone Dropdown */}
                  {availableStones.length > 0 && (
                    <div>
                      <label
                        htmlFor="stone-select"
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          display: "block",
                          marginBottom: "8px",
                          color: "var(--foreground)"
                        }}
                      >
                        Stone
                      </label>
                      <div style={{ position: "relative" }}>
                        <select
                          id="stone-select"
                          value={activeStone}
                          onChange={(e) => setSelectedStone(e.target.value)}
                          style={{
                            width: "100%",
                            height: "44px",
                            padding: "0 36px 0 14px",
                            border: "1px solid var(--border)",
                            borderRadius: "2px",
                            backgroundColor: "#ffffff",
                            color: "var(--foreground)",
                            fontSize: "0.84rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            appearance: "none",
                            WebkitAppearance: "none",
                            outline: "none",
                            transition: "all 0.2s"
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "var(--primary)";
                            e.currentTarget.style.boxShadow = "0 0 0 1px var(--primary)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          {availableStones.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            color: "var(--muted-foreground)"
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Diamond Size Dropdown */}
                  {hasCarat && activeCaratPrices.length > 0 && (
                    <div>
                      <label
                        htmlFor="carat-select"
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          display: "block",
                          marginBottom: "8px",
                          color: "var(--foreground)"
                        }}
                      >
                        Diamond Size
                      </label>
                      <div style={{ position: "relative" }}>
                        <select
                          id="carat-select"
                          value={carat}
                          onChange={(e) => setSelectedCarat(e.target.value)}
                          style={{
                            width: "100%",
                            height: "44px",
                            padding: "0 36px 0 14px",
                            border: "1px solid var(--border)",
                            borderRadius: "2px",
                            backgroundColor: "#ffffff",
                            color: "var(--foreground)",
                            fontSize: "0.84rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            appearance: "none",
                            WebkitAppearance: "none",
                            outline: "none",
                            transition: "all 0.2s"
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "var(--primary)";
                            e.currentTarget.style.boxShadow = "0 0 0 1px var(--primary)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          {activeCaratPrices.map((cp) => (
                            <option key={cp.diamondsize} value={cp.diamondsize}>
                              {cp.diamondsize}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            color: "var(--muted-foreground)"
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Ring Size Dropdown */}
                  {sortedRingSizes.length > 0 && (
                    <div>
                      <label
                        htmlFor="ringsize-select"
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          display: "block",
                          marginBottom: "8px",
                          color: "var(--foreground)"
                        }}
                      >
                        Ring Size
                      </label>
                      <div style={{ position: "relative" }}>
                        <select
                          id="ringsize-select"
                          value={ringSize}
                          onChange={(e) => setSelectedRingSize(e.target.value)}
                          style={{
                            width: "100%",
                            height: "44px",
                            padding: "0 36px 0 14px",
                            border: "1px solid var(--border)",
                            borderRadius: "2px",
                            backgroundColor: "#ffffff",
                            color: "var(--foreground)",
                            fontSize: "0.84rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            appearance: "none",
                            WebkitAppearance: "none",
                            outline: "none",
                            transition: "all 0.2s"
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "var(--primary)";
                            e.currentTarget.style.boxShadow = "0 0 0 1px var(--primary)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          {sortedRingSizes.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            color: "var(--muted-foreground)"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Attribute Groups (Single Label Per Group) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Shape & Clarity in One Row */}
              {((product.shapes && product.shapes.length > 0) ||
                (product.clarities && product.clarities.length > 0)) && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        product.shapes?.length > 0 && product.clarities?.length > 0
                          ? "repeat(auto-fit, minmax(200px, 1fr))"
                          : "1fr",
                      gap: "20px",
                      alignItems: "start"
                    }}
                  >
                    {product.shapes && product.shapes.length > 0 && (
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: "8px", color: "var(--foreground)" }}>
                          Shape: <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>{selectedShape || product.shapes[0]}</span>
                        </label>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {product.shapes.map((sh) => (
                            <button
                              key={sh}
                              type="button"
                              onClick={() => setSelectedShape(sh)}
                              style={{
                                padding: "6px 14px",
                                border: (selectedShape || product.shapes[0]) === sh ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                                backgroundColor: (selectedShape || product.shapes[0]) === sh ? "var(--primary-soft)" : "#ffffff",
                                color: (selectedShape || product.shapes[0]) === sh ? "var(--primary)" : "var(--foreground)",
                                borderRadius: "2px",
                                fontSize: "0.82rem",
                                fontWeight: (selectedShape || product.shapes[0]) === sh ? 600 : 400,
                                cursor: "pointer",
                                transition: "all 0.15s"
                              }}
                            >
                              {sh}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.clarities && product.clarities.length > 0 && (
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: "8px", color: "var(--foreground)" }}>
                          Clarity: <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>{selectedClarity || product.clarities[0]}</span>
                        </label>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {product.clarities.map((cl) => (
                            <button
                              key={cl}
                              type="button"
                              onClick={() => setSelectedClarity(cl)}
                              style={{
                                padding: "6px 14px",
                                border: (selectedClarity || product.clarities[0]) === cl ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                                backgroundColor: (selectedClarity || product.clarities[0]) === cl ? "var(--primary-soft)" : "#ffffff",
                                color: (selectedClarity || product.clarities[0]) === cl ? "var(--primary)" : "var(--foreground)",
                                borderRadius: "2px",
                                fontSize: "0.82rem",
                                fontWeight: (selectedClarity || product.clarities[0]) === cl ? 600 : 400,
                                cursor: "pointer",
                                transition: "all 0.15s"
                              }}
                            >
                              {cl}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}



              {/* Diamond Color & Band Color in One Row */}
              {((product.diamondColors && product.diamondColors.length > 0) ||
                (product.bandColors && product.bandColors.length > 0)) && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        product.diamondColors?.length > 0 && product.bandColors?.length > 0
                          ? "repeat(auto-fit, minmax(200px, 1fr))"
                          : "1fr",
                      gap: "20px",
                      alignItems: "start"
                    }}
                  >
                    {product.diamondColors && product.diamondColors.length > 0 && (
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: "8px", color: "var(--foreground)" }}>
                          Diamond Color: <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>{selectedDiamondColor || product.diamondColors[0]}</span>
                        </label>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {product.diamondColors.map((dc) => (
                            <button
                              key={dc}
                              type="button"
                              onClick={() => setSelectedDiamondColor(dc)}
                              style={{
                                padding: "6px 14px",
                                border: (selectedDiamondColor || product.diamondColors[0]) === dc ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                                backgroundColor: (selectedDiamondColor || product.diamondColors[0]) === dc ? "var(--primary-soft)" : "#ffffff",
                                color: (selectedDiamondColor || product.diamondColors[0]) === dc ? "var(--primary)" : "var(--foreground)",
                                borderRadius: "2px",
                                fontSize: "0.82rem",
                                fontWeight: (selectedDiamondColor || product.diamondColors[0]) === dc ? 600 : 400,
                                cursor: "pointer",
                                transition: "all 0.15s"
                              }}
                            >
                              {dc}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.bandColors && product.bandColors.length > 0 && (
                      <div>
                        <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: "8px", color: "var(--foreground)" }}>
                          Band Color: <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>{selectedBandColor || product.bandColors[0]}</span>
                        </label>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {product.bandColors.map((bc) => (
                            <button
                              key={bc}
                              type="button"
                              onClick={() => setSelectedBandColor(bc)}
                              style={{
                                padding: "6px 14px",
                                border: (selectedBandColor || product.bandColors[0]) === bc ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                                backgroundColor: (selectedBandColor || product.bandColors[0]) === bc ? "var(--primary-soft)" : "#ffffff",
                                color: (selectedBandColor || product.bandColors[0]) === bc ? "var(--primary)" : "var(--foreground)",
                                borderRadius: "2px",
                                fontSize: "0.82rem",
                                fontWeight: (selectedBandColor || product.bandColors[0]) === bc ? 600 : 400,
                                cursor: "pointer",
                                transition: "all 0.15s"
                              }}
                            >
                              {bc}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Quantity & Add to Cart Action */}
            <div style={{ display: "flex", gap: "14px", alignItems: "center", marginTop: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                  height: "52px"
                }}
              >
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ width: "42px", height: "100%", display: "grid", placeItems: "center", cursor: "pointer", fontSize: "1.1rem" }}
                >
                  -
                </button>
                <span style={{ width: "44px", textAlign: "center", fontWeight: 600, fontSize: "0.95rem" }}>
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  style={{ width: "42px", height: "100%", display: "grid", placeItems: "center", cursor: "pointer", fontSize: "1.1rem" }}
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
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "background-color 0.2s",
                  boxShadow: "0 6px 20px rgba(85, 104, 50, 0.25)"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
              >
                <ShoppingBag size={18} />
                <span>Add To Bag • {format(currentPrice * qty)}</span>
              </button>
            </div>

            {/* Trust Assurances */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
                padding: "20px",
                backgroundColor: "#fafbf8",
                border: "1px solid var(--border-subtle)",
                borderRadius: "3px",
                marginTop: "12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.82rem" }}>
                <Truck size={18} color="var(--primary)" />
                <span>Complimentary Insured Shipping</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.82rem" }}>
                <ShieldCheck size={18} color="var(--primary)" />
                <span>Certified Authenticity</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.82rem" }}>
                <RotateCcw size={18} color="var(--primary)" />
                <span>30-Day Effortless Returns</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.82rem" }}>
                <Sparkles size={18} color="var(--primary)" />
                <span>Lifetime Warranty & Polish</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Story, Specifications, Shipping */}
        <div style={{ marginTop: "70px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: "32px", borderBottom: "1px solid var(--border-subtle)", paddingTop: "20px" }}>
            {hasDescription && (
              <button
                onClick={() => setActiveTab("description")}
                style={{
                  paddingBottom: "14px",
                  fontSize: "0.92rem",
                  fontWeight: currentTab === "description" ? 600 : 400,
                  color: currentTab === "description" ? "var(--primary)" : "var(--muted-foreground)",
                  borderBottom: currentTab === "description" ? "2px solid var(--primary)" : "2px solid transparent",
                  cursor: "pointer"
                }}
              >
                Description & Craftsmanship
              </button>
            )}
            <button
              onClick={() => setActiveTab("delivery")}
              style={{
                paddingBottom: "14px",
                fontSize: "0.92rem",
                fontWeight: currentTab === "delivery" ? 600 : 400,
                color: currentTab === "delivery" ? "var(--primary)" : "var(--muted-foreground)",
                borderBottom: currentTab === "delivery" ? "2px solid var(--primary)" : "2px solid transparent",
                cursor: "pointer"
              }}
            >
              Delivery & Returns
            </button>
          </div>

          <div style={{ padding: "32px 0", maxWidth: "800px", lineHeight: 1.8, fontSize: "0.94rem", color: "var(--muted-foreground)" }}>
            {hasDescription && currentTab === "description" && (
              <div>
                <p>
                  {product.description}
                </p>
              </div>
            )}

            {currentTab === "delivery" && (
              <div>
                <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <li><strong>Complimentary Insured Delivery:</strong> Shipped securely via armoured courier with signature confirmation required upon delivery.</li>
                  <li><strong>Delivery Timelines:</strong> In-stock pieces are dispatched within 2 business days. Customized pieces require 7-10 business days.</li>
                  <li><strong>30-Day Returns:</strong> If you are not entirely mesmerized by your jewel, return it in its unworn condition within 30 days for a full refund or exchange.</li>
                  <li><strong>Lifetime Warranty:</strong> Includes complimentary annual prong inspection, sonic cleaning, and surface polishing.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like Recommendations */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "70px", paddingTop: "50px", borderTop: "1px solid var(--border)" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <p className="eyebrow" style={{ color: "var(--primary)" }}>
                Curated Recommendations
              </p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", marginTop: "6px" }}>
                You May Also Like
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 300px))",
                gap: "28px",
                justifyContent: "flex-start"
              }}
            >
              {relatedProducts.map((rel) => (
                <div
                  key={rel._id || rel.id}
                  onClick={() => navigate(`/product/${rel._id || rel.id}`)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "300px",
                    width: "100%",
                    borderRadius: "4px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "#ffffff",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.03)";
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "1/1",
                      backgroundColor: "#f9f9f9",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px"
                    }}
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        transition: "transform 0.5s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>

                  <div style={{ padding: "18px 18px 20px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted-foreground)", fontWeight: 600 }}>
                      {rel.category || "Fine Jewelry"}
                    </span>
                    <h4
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.08rem",
                        fontWeight: 500,
                        lineHeight: 1.3,
                        color: "var(--foreground)",
                        margin: 0
                      }}
                    >
                      {rel.name}
                    </h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                      <span style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--primary)" }}>
                        {format(rel.price)}
                      </span>
                      <span style={{ fontSize: "0.76rem", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                        View Details &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
    const strId = String(id).trim();
    return (
      products.find(
        (p) =>
          (p._id && String(p._id) === strId) ||
          (p.id && String(p.id) === strId) ||
          (p.rawId !== undefined && String(p.rawId) === strId) ||
          (p.itemid !== undefined && String(p.itemid) === strId)
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
            Haute Joaillerie
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
              to="/shop"
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
