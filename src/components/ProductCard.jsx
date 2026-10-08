import { useState, useMemo, useEffect } from "react";
import { Heart, Eye, X } from "lucide-react";
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
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: metalSwatch[m] || "#c5a059",
            border: value === m ? "2px solid var(--primary)" : "1px solid rgba(0,0,0,0.15)",
            transform: value === m ? "scale(1.2)" : "scale(1)",
            transition: "all 0.15s ease",
            cursor: "pointer",
            boxShadow: value === m ? "0 0 0 2px var(--background)" : "none"
          }}
        />
      ))}
    </div>
  );
}

export function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist, format, getItemPrice } = useStore();
  const availableMetals = product.metals || [];
  const [metal, setMetal] = useState(availableMetals[0] || "");
  const [ringSize, setRingSize] = useState(product.ringSizes?.[0] || "");

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

  const activeCaratPrices = matchedPricing?.caratPrices || [];

  const [carat, setCarat] = useState(() => activeCaratPrices[0]?.diamondsize || "");

  useEffect(() => {
    if (activeCaratPrices.length > 0) {
      if (!activeCaratPrices.some((c) => c.diamondsize === carat)) {
        setCarat(activeCaratPrices[0]?.diamondsize || "");
      }
    } else {
      setCarat("");
    }
  }, [metal, activeCaratPrices]);

  const currentPrice = getItemPrice(product, metal, carat);

  const allMedia = useMemo(() => {
    const list = [];
    if (product?.image) list.push({ type: "image", url: product.image });
    if (Array.isArray(product?.galleryImages)) {
      product.galleryImages.forEach((url) => {
        if (url && url !== product.image) list.push({ type: "image", url });
      });
    }
    if (product?.video) list.push({ type: "video", url: product.video });
    return list;
  }, [product]);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const [quick, setQuick] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const liked = wishlist.includes(product.id);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div
        style={{
          position: "relative",
          aspectRatio: "4/5",
          overflow: "hidden",
          backgroundColor: "var(--muted)",
          borderRadius: "2px"
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle wishlist"
          className="glass"
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            transition: "all 0.2s ease"
          }}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} strokeWidth={1.4} />
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
            transform: isHovered ? "translateY(0)" : "translateY(16px)",
            opacity: isHovered ? 1 : 0,
            transition: "all 0.35s ease"
          }}
        >
          <button
            onClick={() => addToCart(product.id, metal, ringSize, carat, currentPrice)}
            className="eyebrow"
            style={{
              flex: 1,
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              padding: "12px 14px",
              textAlign: "center",
              borderRadius: "2px",
              boxShadow: "0 4px 14px rgba(85, 104, 50, 0.35)"
            }}
          >
            Quick Add
          </button>

          <button
            onClick={() => setQuick(true)}
            aria-label="Quick view"
            className="glass"
            style={{
              width: "44px",
              display: "grid",
              placeItems: "center",
              borderRadius: "2px",
              color: "var(--foreground)"
            }}
          >
            <Eye size={16} strokeWidth={1.4} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div>
          <p className="eyebrow" style={{ color: "var(--muted-foreground)" }}>
            {product.category}
          </p>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", marginTop: "4px", lineHeight: 1.25 }}>
            {product.name}
          </h3>
        </div>
        <p style={{ fontSize: "0.95rem", fontWeight: 600, whiteSpace: "nowrap" }}>
          {format(currentPrice)}
        </p>
      </div>

      {availableMetals.length > 0 && (
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <MetalPills value={metal} onChange={setMetal} metals={availableMetals} />
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            {metal}
          </span>
        </div>
      )}

      {/* Quick View Modal */}
      {quick && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(24, 31, 19, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.2s ease-out"
          }}
          onClick={() => setQuick(false)}
        >
          <div
            style={{
              backgroundColor: "var(--background)",
              maxWidth: "780px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "2px",
              boxShadow: "var(--shadow-soft)",
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuick(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 10,
                color: "var(--foreground)",
                padding: "4px",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              <X size={20} strokeWidth={1.4} />
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px" }}>
              <div style={{ width: "100%", minHeight: "340px", maxHeight: "380px", display: "grid", placeItems: "center", backgroundColor: "#f7f7f7", borderRadius: "2px", overflow: "hidden" }}>
                {allMedia[activeMediaIndex]?.type === "video" ? (
                  <video
                    src={allMedia[activeMediaIndex].url}
                    controls
                    autoPlay
                    muted
                    style={{ width: "100%", maxHeight: "380px", objectFit: "contain" }}
                  />
                ) : (
                  <img
                    src={allMedia[activeMediaIndex]?.url || product.image}
                    alt={product.name}
                    style={{ width: "100%", maxHeight: "380px", objectFit: "contain" }}
                  />
                )}
              </div>

              {allMedia.length > 1 && (
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                  {allMedia.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      style={{
                        width: "50px",
                        height: "50px",
                        flexShrink: 0,
                        borderRadius: "2px",
                        border: activeMediaIndex === idx ? "2px solid var(--primary)" : "1px solid var(--border)",
                        padding: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                        backgroundColor: "#f5f5f5"
                      }}
                    >
                      {m.type === "video" ? (
                        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: "0.65rem", fontWeight: 700, backgroundColor: "#222", color: "#fff" }}>
                          PLAY
                        </div>
                      ) : (
                        <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: "36px", display: "flex", flexDirection: "column" }}>
              <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>
                {product.category}{product.subcategory ? ` • ${product.subcategory}` : ""} {product.sku ? `• SKU: ${product.sku}` : ""}
              </p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: "8px 0 10px 0" }}>
                {product.name}
              </h2>
              <p style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--primary)", margin: "0 0 16px 0" }}>
                {format(currentPrice)}
              </p>
              {product.description ? (
                <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", lineHeight: 1.7, margin: "0 0 16px 0" }}>
                  {product.description}
                </p>
              ) : null}

              {/* Stone Information for Selected Metal */}
              {matchedPricing?.stonename && (
                <div style={{ marginBottom: "14px", fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
                  <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Stone:</span> {matchedPricing.stonename}
                  {matchedPricing.stonePricingType === "fixed" && " • Fixed Price"}
                </div>
              )}

              {/* Diamond Carat Size Options from Backend */}
              {activeCaratPrices.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <p className="eyebrow" style={{ marginBottom: "6px" }}>Diamond Size</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {activeCaratPrices.map((cp) => (
                      <button
                        key={cp.diamondsize}
                        onClick={() => setCarat(cp.diamondsize)}
                        style={{
                          fontSize: "0.78rem",
                          border: carat === cp.diamondsize ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                          backgroundColor: carat === cp.diamondsize ? "var(--primary-soft)" : "transparent",
                          color: carat === cp.diamondsize ? "var(--primary)" : "var(--foreground)",
                          padding: "6px 12px",
                          borderRadius: "2px",
                          cursor: "pointer"
                        }}
                      >
                        {cp.diamondsize} ({format(cp.price)})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ring Sizes from Backend */}
              {product.ringSizes && product.ringSizes.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <p className="eyebrow" style={{ marginBottom: "6px" }}>Ring Size</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {product.ringSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setRingSize(s)}
                        style={{
                          fontSize: "0.78rem",
                          border: ringSize === s ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                          backgroundColor: ringSize === s ? "var(--primary-soft)" : "transparent",
                          padding: "4px 10px",
                          borderRadius: "2px",
                          cursor: "pointer"
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Backend Attributes */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                {product.shapes?.map((sh) => (
                  <span key={sh} style={{ fontSize: "0.72rem", backgroundColor: "var(--muted)", padding: "4px 8px", borderRadius: "2px" }}>
                    Shape: {sh}
                  </span>
                ))}
                {product.clarities?.map((cl) => (
                  <span key={cl} style={{ fontSize: "0.72rem", backgroundColor: "var(--muted)", padding: "4px 8px", borderRadius: "2px" }}>
                    Clarity: {cl}
                  </span>
                ))}
                {product.stones?.map((st) => (
                  <span key={st} style={{ fontSize: "0.72rem", backgroundColor: "var(--muted)", padding: "4px 8px", borderRadius: "2px" }}>
                    Stone: {st}
                  </span>
                ))}
                {product.diamondColors?.map((dc) => (
                  <span key={dc} style={{ fontSize: "0.72rem", backgroundColor: "var(--muted)", padding: "4px 8px", borderRadius: "2px" }}>
                    Diamond: {dc}
                  </span>
                ))}
                {product.styles?.map((sy) => (
                  <span key={sy} style={{ fontSize: "0.72rem", backgroundColor: "var(--muted)", padding: "4px 8px", borderRadius: "2px" }}>
                    {sy}
                  </span>
                ))}
              </div>

              {availableMetals.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <p className="eyebrow" style={{ marginBottom: "8px" }}>
                    Precious Metal — {metal}
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {availableMetals.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMetal(m)}
                        style={{
                          fontSize: "0.78rem",
                          border: metal === m ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                          backgroundColor: metal === m ? "var(--primary-soft)" : "transparent",
                          padding: "6px 12px",
                          borderRadius: "2px",
                          cursor: "pointer"
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                <button
                  onClick={() => {
                    addToCart(product.id, metal, ringSize, carat, currentPrice);
                    setQuick(false);
                  }}
                  className="eyebrow"
                  style={{
                    width: "100%",
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                    padding: "16px",
                    borderRadius: "2px",
                    cursor: "pointer"
                  }}
                >
                  Add to Bag • {format(currentPrice)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}