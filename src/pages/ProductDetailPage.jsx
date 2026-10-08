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
  ChevronRight
} from "lucide-react";
import { useStore } from "../lib/store";

const metalSwatch = {
  "18k Yellow Gold": "#c5a059",
  "14k Yellow Gold": "#d4af37",
  "Yellow Gold": "#c5a059",
  "Rose Gold": "#e8a999",
  "14k Rose Gold": "#e8a999",
  "18k Rose Gold": "#d98f7e",
  Platinum: "#dce1d4",
  "14k White Gold": "#e5e8e8",
  "18k White Gold": "#e5e8e8",
  "10K White Gold": "#e5e8e8",
  "White Gold": "#e5e8e8",
  "925 Sliver": "#c0c0c0",
  Silver: "#c0c0c0"
};

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
  const [ringSize, setRingSize] = useState(product?.ringSizes?.[0] || "");
  const [selectedCarat, setSelectedCarat] = useState("");
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [copied, setCopied] = useState(false);

  const matchedPricing = useMemo(() => {
    if (!product || product.pricing?.priceType !== "metal_with_stone_diamond_carat") {
      return null;
    }
    return (
      product.pricing.metalWithStoneDiamondCaratPrices?.find(
        (m) => (m.metalname || "").toLowerCase() === (metal || "").toLowerCase()
      ) || product.pricing.metalWithStoneDiamondCaratPrices?.[0]
    );
  }, [product, metal]);

  const activeCaratPrices = matchedPricing?.caratPrices || [];
  const carat =
    activeCaratPrices.length > 0
      ? activeCaratPrices.some((c) => c.diamondsize === selectedCarat)
        ? selectedCarat
        : activeCaratPrices[0]?.diamondsize || ""
      : "";

  const currentPrice = useMemo(() => {
    return getItemPrice(product, metal, carat);
  }, [getItemPrice, product, metal, carat]);

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
    return products
      .filter((p) => String(p.id) !== String(product.id) && (p.category === product.category || !product.category))
      .slice(0, 4);
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
      addToCart(product.id, metal, ringSize, carat, currentPrice);
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
                  {product.sku ? ` • SKU: ${product.sku}` : ""}
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

              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginTop: "14px" }}>
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
                <span style={{ fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
                  Tax included. Complimentary luxury shipping.
                </span>
              </div>
            </div>

            {/* Short Description */}
            {product.description && (
              <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", lineHeight: 1.7 }}>
                {product.description}
              </p>
            )}

            <div style={{ height: "1px", backgroundColor: "var(--border-subtle)" }} />

            {/* Metal Selector */}
            {availableMetals.length > 0 && (
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: "10px", color: "var(--foreground)" }}>
                  Select Metal: <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>{metal}</span>
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {availableMetals.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMetal(m)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 16px",
                        border: metal === m ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                        backgroundColor: metal === m ? "var(--primary-soft)" : "#ffffff",
                        color: metal === m ? "var(--primary)" : "var(--foreground)",
                        borderRadius: "2px",
                        fontSize: "0.82rem",
                        fontWeight: metal === m ? 600 : 400,
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                    >
                      <span
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: metalSwatch[m] || "#c5a059",
                          border: "1px solid rgba(0,0,0,0.15)"
                        }}
                      />
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Diamond Carat Sizes from Backend */}
            {activeCaratPrices.length > 0 && (
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: "10px", color: "var(--foreground)" }}>
                  Diamond Size: <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>{carat}</span>
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {activeCaratPrices.map((cp) => (
                    <button
                      key={cp.diamondsize}
                      type="button"
                      onClick={() => setSelectedCarat(cp.diamondsize)}
                      style={{
                        padding: "8px 16px",
                        border: carat === cp.diamondsize ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                        backgroundColor: carat === cp.diamondsize ? "var(--primary-soft)" : "#ffffff",
                        color: carat === cp.diamondsize ? "var(--primary)" : "var(--foreground)",
                        borderRadius: "2px",
                        fontSize: "0.82rem",
                        fontWeight: carat === cp.diamondsize ? 600 : 400,
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                    >
                      {cp.diamondsize} • {format(cp.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stone Info if present in pricing */}
            {matchedPricing?.stonename && (
              <div style={{ padding: "10px 14px", backgroundColor: "#fafbf8", border: "1px solid var(--border-subtle)", borderRadius: "3px", fontSize: "0.84rem" }}>
                <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Stone:</span>{" "}
                <span style={{ color: "var(--muted-foreground)" }}>{matchedPricing.stonename}</span>
                {matchedPricing.stonePricingType === "fixed" && (
                  <span style={{ marginLeft: "8px", fontSize: "0.75rem", backgroundColor: "var(--primary-soft)", color: "var(--primary)", padding: "2px 6px", borderRadius: "2px" }}>
                    Fixed Price
                  </span>
                )}
              </div>
            )}

            {/* Ring Sizes from Backend */}
            {product.ringSizes && product.ringSizes.length > 0 && (
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: "10px", color: "var(--foreground)" }}>
                  Ring Size: <span style={{ fontWeight: 400, color: "var(--muted-foreground)" }}>{ringSize}</span>
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {product.ringSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRingSize(s)}
                      style={{
                        minWidth: "40px",
                        height: "36px",
                        padding: "0 10px",
                        border: ringSize === s ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                        backgroundColor: ringSize === s ? "var(--primary-soft)" : "#ffffff",
                        color: ringSize === s ? "var(--primary)" : "var(--foreground)",
                        borderRadius: "2px",
                        fontSize: "0.82rem",
                        fontWeight: ringSize === s ? 600 : 400,
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Attribute Badges */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {product.shapes?.map((sh) => (
                <span key={sh} style={{ fontSize: "0.76rem", backgroundColor: "#f4f6f0", color: "#3a4433", padding: "5px 10px", borderRadius: "2px" }}>
                  Shape: {sh}
                </span>
              ))}
              {product.clarities?.map((cl) => (
                <span key={cl} style={{ fontSize: "0.76rem", backgroundColor: "#f4f6f0", color: "#3a4433", padding: "5px 10px", borderRadius: "2px" }}>
                  Clarity: {cl}
                </span>
              ))}
              {product.stones?.map((st) => (
                <span key={st} style={{ fontSize: "0.76rem", backgroundColor: "#f4f6f0", color: "#3a4433", padding: "5px 10px", borderRadius: "2px" }}>
                  Stone: {st}
                </span>
              ))}
              {product.diamondColors?.map((dc) => (
                <span key={dc} style={{ fontSize: "0.76rem", backgroundColor: "#f4f6f0", color: "#3a4433", padding: "5px 10px", borderRadius: "2px" }}>
                  Color: {dc}
                </span>
              ))}
              {product.styles?.map((sy) => (
                <span key={sy} style={{ fontSize: "0.76rem", backgroundColor: "#f4f6f0", color: "#3a4433", padding: "5px 10px", borderRadius: "2px" }}>
                  Style: {sy}
                </span>
              ))}
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
            <button
              onClick={() => setActiveTab("description")}
              style={{
                paddingBottom: "14px",
                fontSize: "0.92rem",
                fontWeight: activeTab === "description" ? 600 : 400,
                color: activeTab === "description" ? "var(--primary)" : "var(--muted-foreground)",
                borderBottom: activeTab === "description" ? "2px solid var(--primary)" : "2px solid transparent",
                cursor: "pointer"
              }}
            >
              Description & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              style={{
                paddingBottom: "14px",
                fontSize: "0.92rem",
                fontWeight: activeTab === "specifications" ? 600 : 400,
                color: activeTab === "specifications" ? "var(--primary)" : "var(--muted-foreground)",
                borderBottom: activeTab === "specifications" ? "2px solid var(--primary)" : "2px solid transparent",
                cursor: "pointer"
              }}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              style={{
                paddingBottom: "14px",
                fontSize: "0.92rem",
                fontWeight: activeTab === "delivery" ? 600 : 400,
                color: activeTab === "delivery" ? "var(--primary)" : "var(--muted-foreground)",
                borderBottom: activeTab === "delivery" ? "2px solid var(--primary)" : "2px solid transparent",
                cursor: "pointer"
              }}
            >
              Delivery & Returns
            </button>
          </div>

          <div style={{ padding: "32px 0", maxWidth: "800px", lineHeight: 1.8, fontSize: "0.94rem", color: "var(--muted-foreground)" }}>
            {activeTab === "description" && (
              <div>
                <p style={{ marginBottom: "16px" }}>
                  {product.description ||
                    `${product.name} embodies the utmost in Haute Joaillerie excellence, meticulously shaped by master diamond setters using ethical gemstones and high-grade precious metals.`}
                </p>
                <p>
                  Each diamond and gemstone is strictly checked for cut, symmetry, and brilliance to guarantee optimal light refraction.
                  Delivered in our bespoke signature velvet jewelry box with an official certificate of appraisal.
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.88rem" }}>
                <div style={{ padding: "10px 14px", backgroundColor: "#fafbf8", border: "1px solid var(--border-subtle)" }}>
                  <strong style={{ color: "var(--foreground)" }}>SKU:</strong> {product.sku || "N/A"}
                </div>
                <div style={{ padding: "10px 14px", backgroundColor: "#fafbf8", border: "1px solid var(--border-subtle)" }}>
                  <strong style={{ color: "var(--foreground)" }}>Category:</strong> {product.category}
                </div>
                {product.subcategory && (
                  <div style={{ padding: "10px 14px", backgroundColor: "#fafbf8", border: "1px solid var(--border-subtle)" }}>
                    <strong style={{ color: "var(--foreground)" }}>Subcategory:</strong> {product.subcategory}
                  </div>
                )}
                {metal && (
                  <div style={{ padding: "10px 14px", backgroundColor: "#fafbf8", border: "1px solid var(--border-subtle)" }}>
                    <strong style={{ color: "var(--foreground)" }}>Metal:</strong> {metal}
                  </div>
                )}
                {carat && (
                  <div style={{ padding: "10px 14px", backgroundColor: "#fafbf8", border: "1px solid var(--border-subtle)" }}>
                    <strong style={{ color: "var(--foreground)" }}>Diamond Size:</strong> {carat}
                  </div>
                )}
                {product.shapes?.length > 0 && (
                  <div style={{ padding: "10px 14px", backgroundColor: "#fafbf8", border: "1px solid var(--border-subtle)" }}>
                    <strong style={{ color: "var(--foreground)" }}>Shapes:</strong> {product.shapes.join(", ")}
                  </div>
                )}
                {product.clarities?.length > 0 && (
                  <div style={{ padding: "10px 14px", backgroundColor: "#fafbf8", border: "1px solid var(--border-subtle)" }}>
                    <strong style={{ color: "var(--foreground)" }}>Clarities:</strong> {product.clarities.join(", ")}
                  </div>
                )}
                {product.stones?.length > 0 && (
                  <div style={{ padding: "10px 14px", backgroundColor: "#fafbf8", border: "1px solid var(--border-subtle)" }}>
                    <strong style={{ color: "var(--foreground)" }}>Stones:</strong> {product.stones.join(", ")}
                  </div>
                )}
              </div>
            )}

            {activeTab === "delivery" && (
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
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "28px"
              }}
            >
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/product/${rel.id}`)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.25s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div
                    style={{
                      aspectRatio: "1/1",
                      backgroundColor: "#f7f7f7",
                      borderRadius: "2px",
                      overflow: "hidden",
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <div style={{ paddingTop: "14px" }}>
                    <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#888888", fontWeight: 600 }}>
                      {rel.category}
                    </span>
                    <h4
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "1.05rem",
                        marginTop: "4px",
                        lineHeight: 1.3,
                        color: "var(--foreground)"
                      }}
                    >
                      {rel.name}
                    </h4>
                    <span style={{ fontSize: "0.96rem", fontWeight: 700, color: "var(--primary)", marginTop: "6px", display: "inline-block" }}>
                      {format(rel.price)}
                    </span>
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
    return (
      products.find(
        (p) =>
          String(p.id) === String(id) ||
          String(p._id) === String(id) ||
          String(p.rawId) === String(id)
      ) || null
    );
  }, [products, id]);

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
