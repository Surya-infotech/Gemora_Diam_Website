import { useState } from "react";
import { Heart, Eye, X } from "lucide-react";
import { METALS } from "../lib/products";
import { useStore } from "../lib/store";

const metalSwatch = {
  "18k Yellow Gold": "#c5a059",
  "Rose Gold": "#e8a999",
  Platinum: "#dce1d4"
};

export function MetalPills({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {METALS.map((m) => (
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
  const { addToCart, toggleWishlist, wishlist, format } = useStore();
  const [metal, setMetal] = useState("18k Yellow Gold");
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
          onClick={() => toggleWishlist(product.id)}
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
            onClick={() => addToCart(product.id, metal)}
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
          {format(product.price)}
        </p>
      </div>

      <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
        <MetalPills value={metal} onChange={setMetal} />
        <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
          {metal}
        </span>
      </div>

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
              borderRadius: "2px",
              overflow: "hidden",
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
                padding: "4px"
              }}
            >
              <X size={20} strokeWidth={1.4} />
            </button>

            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "100%", minHeight: "360px", objectFit: "cover" }}
            />

            <div style={{ padding: "36px", display: "flex", flexDirection: "column" }}>
              <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>
                {product.category}
              </p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: "8px 0 10px 0" }}>
                {product.name}
              </h2>
              <p style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--primary)" }}>
                {format(product.price)}
              </p>
              <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", lineHeight: 1.7, margin: "16px 0 24px 0" }}>
                {product.description}
              </p>

              {product.carat && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                  <span style={{ fontSize: "0.72rem", backgroundColor: "var(--muted)", padding: "4px 8px", borderRadius: "2px" }}>
                    {product.carat}
                  </span>
                  <span style={{ fontSize: "0.72rem", backgroundColor: "var(--muted)", padding: "4px 8px", borderRadius: "2px" }}>
                    Color {product.color}
                  </span>
                  <span style={{ fontSize: "0.72rem", backgroundColor: "var(--muted)", padding: "4px 8px", borderRadius: "2px" }}>
                    Clarity {product.clarity}
                  </span>
                  {product.certification && (
                    <span style={{ fontSize: "0.72rem", backgroundColor: "var(--primary-soft)", color: "var(--primary)", padding: "4px 8px", borderRadius: "2px", fontWeight: 600 }}>
                      ★ {product.certification}
                    </span>
                  )}
                </div>
              )}

              <p className="eyebrow" style={{ marginBottom: "10px" }}>
                Precious Metal — {metal}
              </p>
              <MetalPills value={metal} onChange={setMetal} />

              <div style={{ marginTop: "auto", paddingTop: "28px" }}>
                <button
                  onClick={() => {
                    addToCart(product.id, metal);
                    setQuick(false);
                  }}
                  className="eyebrow"
                  style={{
                    width: "100%",
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                    padding: "16px",
                    borderRadius: "2px"
                  }}
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
