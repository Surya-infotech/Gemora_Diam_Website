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
              gap: "18px",
              padding: "22px 0",
              borderBottom: "1px solid #EDE8DE"
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: compact ? "84px" : "116px",
                height: compact ? "100px" : "138px",
                objectFit: "contain",
                padding: "8px",
                borderRadius: "4px",
                backgroundColor: "#FAF9F6",
                border: "1px solid #ECE7DD",
                flexShrink: 0
              }}
            />

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: compact ? "1.1rem" : "1.3rem",
                      lineHeight: 1.25,
                      margin: 0,
                      fontWeight: 500
                    }}
                  >
                    {p.name}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: "4px", lineHeight: 1.5 }}>
                    {item.metal}
                    {item.stone ? ` &bull; ${item.stone}` : ""}
                    {item.carat ? ` &bull; ${item.carat}` : ""}
                    {item.shape || item.shapename ? ` &bull; ${item.shape || item.shapename}` : ""}
                    {item.clarity || item.clarityname ? ` &bull; ${item.clarity || item.clarityname}` : ""}
                    {item.diamondcolor ? ` &bull; Dia: ${item.diamondcolor}` : ""}
                    {item.bandcolor ? ` &bull; Band: ${item.bandcolor}` : ""}
                    {item.size ? ` &bull; Size: ${item.size}` : ""}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600, marginTop: "2px" }}>
                    {format(item.price ?? p.price)} each
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.key)}
                  aria-label="Remove item"
                  style={{ color: "var(--muted-foreground)", padding: "4px", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--destructive)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted-foreground)")}
                >
                  <X size={17} strokeWidth={1.5} />
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
                    border: "1px solid #EDE8DE",
                    borderRadius: "3px",
                    backgroundColor: "#FAF9F6"
                  }}
                >
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => updateQty(item.key, item.qty - 1)}
                    style={{ padding: "6px 10px", display: "flex", alignItems: "center", cursor: "pointer", color: "var(--foreground)" }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ width: "32px", textAlign: "center", fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)" }}>
                    {item.qty}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => updateQty(item.key, item.qty + 1)}
                    style={{ padding: "6px 10px", display: "flex", alignItems: "center", cursor: "pointer", color: "var(--foreground)" }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--primary)" }}>
                  {format((item.price ?? p.price) * item.qty)}
                </span>
              </div>

              {/* Item-wise Special Instruction Option */}
              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "10px",
                  borderTop: "1px dashed #EDE8DE"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <label
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em"
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
                    border: "1px solid #EDE8DE",
                    borderRadius: "3px",
                    backgroundColor: "#FAF9F6",
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
                    e.target.style.borderColor = "#EDE8DE";
                    e.target.style.backgroundColor = "#FAF9F6";
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
