import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useStore } from "../lib/store";

function getMetalColor(metalName = "") {
  const lower = String(metalName).toLowerCase();
  if (lower.includes("yellow") || (lower.includes("gold") && !lower.includes("white") && !lower.includes("rose"))) {
    return "#d4af37";
  }
  if (lower.includes("white") || lower.includes("platinum") || lower.includes("silver")) {
    return "#e5e8e8";
  }
  if (lower.includes("rose")) {
    return "#e8a999";
  }
  return "#c5a059";
}

export function MetalPills({ value, onChange, metals = [] }) {
  if (!metals || metals.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {metals.map((m) => {
        const name = typeof m === "object" && m !== null ? m.name || m.metalname : String(m);
        const color = getMetalColor(name);
        const isSelected = value === name;
        return (
          <button
            key={name}
            aria-label={name}
            title={name}
            type="button"
            className="swatch-dot"
            onClick={(e) => {
              e.stopPropagation();
              onChange(name);
            }}
            style={{
              width: "10px",
              height: "10px",
              minWidth: "10px",
              minHeight: "10px",
              maxWidth: "10px",
              maxHeight: "10px",
              borderRadius: "50%",
              backgroundColor: color,
              border: "none",
              padding: 0,
              margin: 0,
              cursor: "pointer",
              outline: "none",
              flexShrink: 0,
              boxShadow: isSelected ? "0 0 0 1.5px #ffffff, 0 0 0 2.5px var(--primary)" : "none",
              transition: "transform 0.15s ease"
            }}
          />
        );
      })}
    </div>
  );
}

export function ProductCard({ product }) {
  const navigate = useNavigate();
  const { toggleWishlist, wishlist, format, getItemPrice } = useStore();

  const metals = useMemo(() => {
    const rawMetals = product?.metals || [];
    return rawMetals.map((m) => {
      if (typeof m === "object" && m !== null) {
        const name = m.name || m.metalname || "";
        return { name, color: m.color || getMetalColor(name) };
      }
      return { name: String(m), color: getMetalColor(m) };
    });
  }, [product?.metals]);

  const [activeMetal, setActiveMetal] = useState(metals[0]?.name || "");
  const isLiked = wishlist.includes(product?.id);

  const currentPrice = getItemPrice
    ? getItemPrice(product, activeMetal)
    : (product?.price || 0);

  const itemImage = product?.image || product?.galleryImages?.[0] || product?.gallery?.[0] || "";

  const handleMetalSelect = (metalName, e) => {
    e.stopPropagation();
    setActiveMetal(metalName);
  };

  const handleCardClick = () => {
    navigate(`/product/${product?._id || product?.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid #ebe5da",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 14px 34px rgba(28, 34, 23, 0.08)";
        e.currentTarget.style.borderColor = "#dcd4c7";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#ebe5da";
      }}
    >
      {/* Product Image Stage */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          backgroundColor: "#f8f7f4",
          overflow: "hidden"
        }}
      >
        {itemImage ? (
          <img
            src={itemImage}
            alt={product?.name || "Jewelry piece"}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              objectPosition: "center",
              display: "block",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#bbb", fontSize: "12px" }}>
            No Image
          </div>
        )}

        {/* Top-Right: Circular Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product?.id);
          }}
          aria-label="Toggle wishlist"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 2,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(220, 215, 205, 0.6)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            display: "grid",
            placeItems: "center",
            color: isLiked ? "var(--primary)" : "var(--foreground)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)")}
        >
          <Heart size={14} fill={isLiked ? "currentColor" : "none"} strokeWidth={1.6} />
        </button>

        {/* Bottom-Right: Subtle Gold Atelier Monogram */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 36 36"
          fill="none"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "12px",
            zIndex: 1,
            opacity: 0.35,
            color: "var(--gold)",
            pointerEvents: "none"
          }}
        >
          <path
            d="M18 3L32 10.5V19C32 26.5 25.5 32.5 18 34.5C10.5 32.5 4 26.5 4 19V10.5L18 3Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M18 8L26 14L18 29L10 14L18 8Z" stroke="currentColor" strokeWidth="1" />
          <path d="M10 14H26M18 8V29" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Product Meta & Swatches */}
      <div style={{ padding: "14px 14px 16px 14px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Row 1: Title */}
        <h3
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.84rem",
            fontWeight: 500,
            lineHeight: 1.35,
            color: "#1a1a1a",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.3em",
            width: "100%"
          }}
        >
          {product?.name}
        </h3>

        {/* Row 2: Price dynamically updated by selected metal & Circular Swatches */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", gap: "6px" }}>
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "#222222",
              transition: "color 0.2s ease",
              whiteSpace: "nowrap"
            }}
          >
            {format ? format(currentPrice) : `$${currentPrice?.toLocaleString()}`}
          </div>

          {/* Circular Metal Color Swatches */}
          {metals.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                flexShrink: 0
              }}
            >
              {metals.map((metal) => {
                const isSelected = activeMetal === metal.name;
                return (
                  <button
                    key={metal.name}
                    type="button"
                    className="swatch-dot"
                    title={metal.name}
                    onClick={(e) => handleMetalSelect(metal.name, e)}
                    style={{
                      width: "10px",
                      height: "10px",
                      minWidth: "10px",
                      minHeight: "10px",
                      maxWidth: "10px",
                      maxHeight: "10px",
                      borderRadius: "50%",
                      backgroundColor: metal.color,
                      border: "none",
                      padding: 0,
                      margin: 0,
                      cursor: "pointer",
                      outline: "none",
                      flexShrink: 0,
                      boxShadow: isSelected
                        ? "0 0 0 1.5px #ffffff, 0 0 0 2.5px var(--primary)"
                        : "none",
                      transition: "transform 0.15s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;