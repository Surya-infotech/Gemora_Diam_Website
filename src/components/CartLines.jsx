import { Minus, Plus, X } from "lucide-react";
import { useStore } from "../lib/store";

export function CartLines({ compact = false }) {
  const { cart, updateQty, removeItem, format, getProduct } = useStore();

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
                    border: "1px solid var(--input)",
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
                  {format(p.price * item.qty)}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
