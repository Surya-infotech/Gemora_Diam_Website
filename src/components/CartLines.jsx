import { Minus, Plus, X, PenLine } from "lucide-react";
import { useStore } from "../lib/store";

export function CartLines({ compact = false }) {
  const { cart, updateQty, updateItemInstruction, removeItem, format, getProduct } = useStore();

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {cart.map((item) => {
        const p = getProduct(item.productId);
        if (!p) return null;

        return (
          <li
            key={item.key}
            style={{
              display: "flex",
              gap: "16px",
              padding: "20px 0",
              borderBottom: "1px solid var(--border)"
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: compact ? "80px" : "110px",
                height: compact ? "96px" : "130px",
                objectFit: "cover",
                borderRadius: "2px",
                backgroundColor: "var(--muted)"
              }}
            />

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: compact ? "1.05rem" : "1.25rem",
                      lineHeight: 1.25,
                      margin: 0
                    }}
                  >
                    {p.name}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: "4px" }}>
                    {item.metal}
                    {item.stone ? ` • ${item.stone}` : ""}
                    {item.carat ? ` • ${item.carat}` : ""}
                    {item.shape || item.shapename ? ` • ${item.shape || item.shapename}` : ""}
                    {item.clarity || item.clarityname ? ` • ${item.clarity || item.clarityname}` : ""}
                    {item.diamondcolor ? ` • Dia: ${item.diamondcolor}` : ""}
                    {item.bandcolor ? ` • Band: ${item.bandcolor}` : ""}
                    {item.size ? ` • Size ${item.size}` : ""}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: "2px" }}>
                    {format(item.price ?? p.price)} each
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.key)}
                  aria-label="Remove item"
                  style={{ color: "var(--muted-foreground)", padding: "4px" }}
                >
                  <X size={16} strokeWidth={1.4} />
                </button>
              </div>

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid var(--border)",
                    borderRadius: "2px"
                  }}
                >
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => updateQty(item.key, item.qty - 1)}
                    style={{ padding: "6px 8px", display: "flex", alignItems: "center" }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ width: "32px", textAlign: "center", fontSize: "0.85rem", fontWeight: 600 }}>
                    {item.qty}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => updateQty(item.key, item.qty + 1)}
                    style={{ padding: "6px 8px", display: "flex", alignItems: "center" }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)" }}>
                  {format((item.price ?? p.price) * item.qty)}
                </span>
              </div>

              {/* Item-wise Special Instruction Option */}
              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "10px",
                  borderTop: "1px dashed var(--border)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <label
                    style={{
                      fontSize: "0.76rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em"
                    }}
                  >
                    <PenLine size={12} style={{ color: "var(--primary)" }} /> Special Instruction
                  </label>
                  {item.specialinstruction && (
                    <button
                      type="button"
                      onClick={() => updateItemInstruction(item.key, "")}
                      style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={item.specialinstruction || ""}
                  onChange={(e) => updateItemInstruction(item.key, e.target.value)}
                  placeholder="e.g. Custom engraving text, sizing note, gift message..."
                  style={{
                    width: "100%",
                    padding: compact ? "6px 10px" : "8px 12px",
                    fontSize: "0.8rem",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    backgroundColor: "#fafaf9",
                    color: "var(--foreground)",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, background-color 0.2s"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                    e.target.style.backgroundColor = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.backgroundColor = "#fafaf9";
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
