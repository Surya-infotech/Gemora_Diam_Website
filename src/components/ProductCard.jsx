import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, X, Play, ShoppingBag } from "lucide-react";
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

export function MetalPills({ value, onChange, metals = [] }) {
  if (!metals || metals.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
      {metals.map((m) => (
        <button
          key={m}
          aria-label={m}
          title={m}
          onClick={() => onChange(m)}
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: metalSwatch[m] || "#c5a059",
            border: value === m ? "2px solid var(--primary)" : "1px solid rgba(0,0,0,0.15)",
            transform: value === m ? "scale(1.2)" : "scale(1)",
            transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
            cursor: "pointer",
            boxShadow: value === m ? "0 0 0 2px #FAF9F6" : "none"
          }}
        />
      ))}
    </div>
  );
}

export function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist, format, getItemPrice, notify } = useStore();
  const availableMetals = product.metals || [];
  const [metal, setMetal] = useState(availableMetals[0] || "");

  const matchedPricing = useMemo(() => {
    if (product?.pricing?.priceType === "metal_with_stone_diamond_carat") {
      return (
        product.pricing.metalWithStoneDiamondCaratPrices?.find(
          (m) => (m.metalname || "").toLowerCase() === (metal || "").toLowerCase()
        ) || product.pricing.metalWithStoneDiamondCaratPrices?.[0]
      );
    }
    return null;
  }, [product, metal]);

  const activeCaratPrices = useMemo(() => {
    const raw = matchedPricing?.caratPrices || [];
    return [...raw].sort((a, b) => {
      const numA = parseFloat(String(a.diamondsize || "").replace(/[^0-9.]/g, "")) || 0;
      const numB = parseFloat(String(b.diamondsize || "").replace(/[^0-9.]/g, "")) || 0;
      if (numA !== numB) return numA - numB;
      return String(a.diamondsize || "").localeCompare(String(b.diamondsize || ""));
    });
  }, [matchedPricing]);
  const [selectedCarat, setSelectedCarat] = useState("");
  const carat =
    activeCaratPrices.length > 0
      ? activeCaratPrices.some((c) => c.diamondsize === selectedCarat)
        ? selectedCarat
        : activeCaratPrices[0]?.diamondsize || ""
      : "";

  const currentPrice = getItemPrice(product, metal, carat);

  const allMedia = useMemo(() => {
    const list = [];
    const seenUrls = new Set();
    if (product?.image) {
      list.push({ type: "image", url: product.image });
      seenUrls.add(product.image);
    }
    if (product?.video && !seenUrls.has(product.video)) {
      list.push({ type: "video", url: product.video });
      seenUrls.add(product.video);
    }
    if (Array.isArray(product?.galleryVideos)) {
      product.galleryVideos.forEach((vUrl) => {
        if (vUrl && !seenUrls.has(vUrl)) {
          list.push({ type: "video", url: vUrl });
          seenUrls.add(vUrl);
        }
      });
    }
    if (Array.isArray(product?.galleryImages)) {
      product.galleryImages.forEach((url) => {
        if (url && !seenUrls.has(url)) {
          list.push({ type: "image", url });
          seenUrls.add(url);
        }
      });
    }
    return list;
  }, [product]);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [quick, setQuick] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const liked = wishlist.includes(product.id);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: "#FAF9F6",
        borderRadius: "4px",
        overflow: "hidden",
        border: "1px solid #EDE7DC",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.03)"
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.boxShadow = "0 14px 34px rgba(85, 104, 50, 0.12)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.borderColor = "#EDE7DC";
        e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.03)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image Stage Container */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1/1",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #F0EBE0"
        }}
      >
        <Link to={`/product/${product._id || product.id}`} style={{ display: "block", width: "100%", height: "100%", padding: "16px" }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: isHovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle wishlist"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: liked ? "var(--primary)" : "var(--foreground)",
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
            backgroundColor: "#ffffff",
            border: "1px solid #ECE7DD",
            transition: "all 0.2s ease",
            cursor: "pointer",
            zIndex: 2
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>

        {/* Quick Actions Bar on Hover */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "12px",
            right: "12px",
            display: "flex",
            gap: "8px",
            transform: isHovered ? "translateY(0)" : "translateY(20px)",
            opacity: isHovered ? 1 : 0,
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 3
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product.id, metal, "", carat, currentPrice);
              notify("Added to Bag", `1x ${product.name} (${format(currentPrice)})`);
            }}
            className="eyebrow"
            style={{
              flex: 1,
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              padding: "11px 14px",
              textAlign: "center",
              borderRadius: "2px",
              boxShadow: "0 4px 14px rgba(85, 104, 50, 0.35)",
              fontSize: "0.74rem",
              letterSpacing: "0.14em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
          >
            <ShoppingBag size={14} />
            <span>Quick Add</span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuick(true);
            }}
            aria-label="Quick view"
            style={{
              width: "42px",
              display: "grid",
              placeItems: "center",
              borderRadius: "2px",
              backgroundColor: "#ffffff",
              color: "var(--foreground)",
              border: "1px solid #ECE7DD",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary-soft)";
              e.currentTarget.style.color = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "var(--foreground)";
            }}
          >
            <Eye size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Info Details Container */}
      <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p className="eyebrow" style={{ color: "var(--gold-deep)", fontSize: "0.7rem", letterSpacing: "0.14em", marginBottom: "4px" }}>
          {product.category}{product.sku ? ` &bull; ${product.sku}` : ""}
        </p>

        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.12rem",
            marginTop: "2px",
            lineHeight: 1.3,
            fontWeight: 500
          }}
        >
          <Link
            to={`/product/${product._id || product.id}`}
            style={{ color: "var(--foreground)", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
          >
            {product.name}
          </Link>
        </h3>

        {/* Metal Swatches Row */}
        {availableMetals.length > 0 && (
          <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
            <MetalPills value={metal} onChange={setMetal} metals={availableMetals} />
            <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
              {metal}
            </span>
          </div>
        )}

        {/* Price & View Details Link */}
        <div style={{ marginTop: "auto", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--primary)" }}>
            {format(currentPrice)}
          </span>

          <Link
            to={`/product/${product._id || product.id}`}
            className="eyebrow"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              color: "var(--foreground)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
          >
            Explore
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {quick && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(22, 30, 18, 0.72)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(8px, 3vw, 20px)",
            animation: "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
          onClick={() => setQuick(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              maxWidth: "820px",
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              borderRadius: "4px",
              boxShadow: "var(--shadow-luxury)",
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              border: "1px solid #EAE3D5"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuick(false)}
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 10,
                color: "var(--foreground)",
                padding: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                borderRadius: "50%"
              }}
            >
              <X size={22} strokeWidth={1.5} />
            </button>

            {/* Media Gallery Left */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "24px", backgroundColor: "#FAF9F6" }}>
              <div style={{ width: "100%", minHeight: "340px", maxHeight: "380px", display: "grid", placeItems: "center", backgroundColor: "#ffffff", borderRadius: "3px", overflow: "hidden", border: "1px solid #ECE7DD" }}>
                {allMedia[activeMediaIndex]?.type === "video" ? (
                  <video
                    key={allMedia[activeMediaIndex].url}
                    src={allMedia[activeMediaIndex].url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", maxHeight: "380px", objectFit: "contain", pointerEvents: "none" }}
                  />
                ) : (
                  <img
                    key={allMedia[activeMediaIndex]?.url || product.image}
                    src={allMedia[activeMediaIndex]?.url || product.image}
                    alt={product.name}
                    style={{ width: "100%", maxHeight: "380px", objectFit: "contain", padding: "12px" }}
                  />
                )}
              </div>

              {allMedia.length > 1 && (
                <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
                  {allMedia.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      style={{
                        width: "54px",
                        height: "54px",
                        flexShrink: 0,
                        borderRadius: "2px",
                        border: activeMediaIndex === idx ? "2px solid var(--primary)" : "1px solid #DED7C8",
                        padding: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                        backgroundColor: "#ffffff"
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
                            overflow: "hidden"
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
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <Play size={10} fill="#1e2419" color="#1e2419" style={{ marginLeft: "1px" }} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Selection Right */}
            <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column" }}>
              <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>
                {product.category}{product.subcategory ? ` &bull; ${product.subcategory}` : ""} {product.sku ? `&bull; SKU: ${product.sku}` : ""}
              </p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: "8px 0 10px 0", lineHeight: 1.2 }}>
                {product.name}
              </h2>
              <p style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--primary)", margin: "0 0 16px 0" }}>
                {format(currentPrice)}
              </p>
              {product.description ? (
                <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", lineHeight: 1.7, margin: "0 0 20px 0" }}>
                  {product.description}
                </p>
              ) : null}

              {/* Stone Information */}
              {matchedPricing?.stonename && (
                <div style={{ marginBottom: "14px", fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
                  <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Stone:</span> {matchedPricing.stonename}
                  {matchedPricing.stonePricingType === "fixed" && " &bull; Fixed Price"}
                </div>
              )}

              {/* Diamond Carat Size Options */}
              {activeCaratPrices.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <p className="eyebrow" style={{ marginBottom: "8px" }}>Diamond Size</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {activeCaratPrices.map((cp) => (
                      <button
                        key={cp.diamondsize}
                        onClick={() => setSelectedCarat(cp.diamondsize)}
                        style={{
                          fontSize: "0.8rem",
                          border: carat === cp.diamondsize ? "1.5px solid var(--primary)" : "1px solid #DED7C8",
                          backgroundColor: carat === cp.diamondsize ? "var(--primary-soft)" : "#FAF9F6",
                          color: carat === cp.diamondsize ? "var(--primary)" : "var(--foreground)",
                          padding: "6px 14px",
                          borderRadius: "2px",
                          cursor: "pointer",
                          fontWeight: carat === cp.diamondsize ? 600 : 400
                        }}
                      >
                        {cp.diamondsize}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Precious Metal Selector */}
              {availableMetals.length > 0 && (
                <div style={{ marginBottom: "22px" }}>
                  <p className="eyebrow" style={{ marginBottom: "8px" }}>
                    Precious Metal: <span style={{ color: "var(--primary)" }}>{metal}</span>
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {availableMetals.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMetal(m)}
                        style={{
                          fontSize: "0.8rem",
                          border: metal === m ? "1.5px solid var(--primary)" : "1px solid #DED7C8",
                          backgroundColor: metal === m ? "var(--primary-soft)" : "#FAF9F6",
                          color: metal === m ? "var(--primary)" : "var(--foreground)",
                          padding: "6px 14px",
                          borderRadius: "2px",
                          cursor: "pointer",
                          fontWeight: metal === m ? 600 : 400
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Bag Action */}
              <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                <button
                  onClick={() => {
                    addToCart(product.id, metal, "", carat, currentPrice);
                    setQuick(false);
                  }}
                  className="eyebrow"
                  style={{
                    width: "100%",
                    backgroundColor: "var(--primary)",
                    color: "#ffffff",
                    padding: "16px",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    letterSpacing: "0.18em",
                    fontWeight: 600,
                    boxShadow: "0 6px 20px rgba(85, 104, 50, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag &bull; {format(currentPrice)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}