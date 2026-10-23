import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, X, PenLine } from "lucide-react";
import { useStore } from "../lib/store";

export function CartLines({ compact = false, onProductClick = null }) {
  const { cart, updateQty, updateItemInstruction, removeItem, format, getProduct } = useStore();
  const navigate = useNavigate();
  const [activeInstructionKey, setActiveInstructionKey] = useState(null);

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}>
      {cart.map((item) => {
        const p = getProduct(item.productId);
        if (!p) return null;

        const productUrl = `/product/${p._id || p.id}`;

        const handleItemClick = () => {
          if (onProductClick) onProductClick();
          navigate(productUrl);
        };

        const hasCustomInstruction = Boolean(item.specialinstruction && item.specialinstruction.trim());
        const isEditingInstruction = activeInstructionKey === item.key;

        return (
          <li
            key={item.key}
            style={{
              display: "flex",
              gap: compact ? "14px" : "20px",
              padding: compact ? "18px 0" : "24px 0",
              borderBottom: "1px solid #EDE8DE",
              alignItems: "flex-start"
            }}
          >
            {/* Thumbnail */}
            <div
              onClick={handleItemClick}
              style={{
                width: compact ? "76px" : "clamp(88px, 16vw, 110px)",
                height: compact ? "76px" : "clamp(88px, 16vw, 110px)",
                aspectRatio: "1 / 1",
                borderRadius: "10px",
                backgroundColor: "#FAF9F6",
                border: "1px solid #ECE7DD",
                overflow: "hidden",
                flexShrink: 0,
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>

            {/* Info and Actions */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4
                    onClick={handleItemClick}
                    title={p.name}
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: compact ? "0.95rem" : "clamp(1.02rem, 2.2vw, 1.25rem)",
                      lineHeight: 1.3,
                      margin: 0,
                      fontWeight: 500,
                      color: "#182015",
                      cursor: "pointer",
                      display: "-webkit-box",
                      WebkitLineClamp: compact ? 2 : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#182015")}
                  >
                    {p.name}
                  </h4>

                  {/* Specifications Line */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "3px 6px",
                      fontSize: "0.74rem",
                      color: "#6b7566",
                      marginTop: "4px",
                      lineHeight: 1.4
                    }}
                  >
                    {item.metal && <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{item.metal}</span>}
                    {item.stone && <span>• {item.stone}</span>}
                    {item.carat && <span>• {item.carat}</span>}
                    {(item.shape || item.shapename) && <span>• {item.shape || item.shapename}</span>}
                    {(item.clarity || item.clarityname) && <span>• {item.clarity || item.clarityname}</span>}
                    {item.diamondcolor && <span>• {item.diamondcolor}</span>}
                    {item.bandcolor && <span>• Band: {item.bandcolor}</span>}
                    {item.size && <span>• Size {item.size}</span>}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  aria-label="Remove item"
                  title="Remove from bag"
                  style={{
                    color: "var(--muted-foreground)",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                    transition: "all 0.2s",
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#d93838";
                    e.currentTarget.style.backgroundColor = "#fff1f1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--muted-foreground)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <X size={15} strokeWidth={1.7} />
                </button>
              </div>

              {/* Price and Quantity Stepper Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "10px"
                }}
              >
                {/* Quantity Stepper */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    border: "1px solid #EDE8DE",
                    borderRadius: "6px",
                    backgroundColor: "#FAF9F6",
                    height: "30px"
                  }}
                >
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => updateQty(item.key, item.qty - 1)}
                    style={{
                      width: "28px",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      color: "var(--foreground)",
                      background: "transparent",
                      border: "none",
                      padding: 0
                    }}
                  >
                    <Minus size={11} />
                  </button>
                  <span style={{ width: "24px", textAlign: "center", fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)" }}>
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateQty(item.key, item.qty + 1)}
                    style={{
                      width: "28px",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                      color: "var(--foreground)",
                      background: "transparent",
                      border: "none",
                      padding: 0
                    }}
                  >
                    <Plus size={11} />
                  </button>
                </div>

                {/* Total Price */}
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--primary)" }}>
                    {format((item.price ?? p.price) * item.qty)}
                  </span>
                  {item.qty > 1 && (
                    <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>
                      {format(item.price ?? p.price)} each
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible Bespoke Note / Engraving */}
              <div style={{ marginTop: "8px", paddingTop: "6px" }}>
                {isEditingInstruction || hasCustomInstruction ? (
                  <div style={{ marginTop: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <label
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: "var(--foreground)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <PenLine size={11} color="var(--primary)" />
                        Custom Note / Engraving
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          updateItemInstruction(item.key, "");
                          setActiveInstructionKey(null);
                        }}
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--muted-foreground)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.specialinstruction || ""}
                      onChange={(e) => updateItemInstruction(item.key, e.target.value)}
                      placeholder="e.g. Ring engraving 'Forever', gift note..."
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        fontSize: "0.78rem",
                        border: "1px solid #E5DFD3",
                        borderRadius: "6px",
                        backgroundColor: "#FAF9F6",
                        color: "var(--foreground)",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "all 0.2s"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--primary)";
                        e.target.style.backgroundColor = "#ffffff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E5DFD3";
                        e.target.style.backgroundColor = "#FAF9F6";
                      }}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveInstructionKey(item.key)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "0.72rem",
                      color: "var(--primary)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 0",
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    <PenLine size={11} />
                    <span>+ Add Bespoke Note or Engraving</span>
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default CartLines;