import { useState } from "react";
import { Check, Download, X } from "lucide-react";
import { ORDERS, STATUSES } from "../lib/orders";
import { useStore } from "../lib/store";
import { StatusBadge } from "../components/StatusBadge";

export default function OrdersPage() {
  const { format } = useStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const active = ORDERS.filter((o) => o.status !== "Delivered");
  const done = ORDERS.filter((o) => o.status === "Delivered");

  return (
    <div className="container-luxury" style={{ maxWidth: "1000px", paddingTop: "60px", paddingBottom: "100px" }}>
      <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Your Account</p>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.6rem, 5vw, 3.8rem)", marginTop: "12px" }}>
        Orders & Tracking
      </h1>

      {active.length === 0 && done.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--foreground)" }}>
            No Orders Found
          </p>
          <p style={{ marginTop: "12px", fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
            You haven't placed any orders yet. Discover our latest fine jewelry collections.
          </p>
          <a
            href="/shop"
            className="eyebrow"
            style={{
              display: "inline-block",
              marginTop: "28px",
              padding: "14px 32px",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "2px"
            }}
          >
            Explore Collection
          </a>
        </div>
      ) : (
        <>
          {/* Active Orders */}
          {active.length > 0 && (
            <>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", marginTop: "50px" }}>
                Active Orders
              </h2>
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {active.map((o) => (
                  <OrderRow key={o.id} order={o} onSelect={() => setSelectedOrder(o)} format={format} />
                ))}
              </div>
            </>
          )}

          {/* Completed Orders */}
          {done.length > 0 && (
            <>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", marginTop: "50px" }}>
                Past Orders
              </h2>
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {done.map((o) => (
                  <OrderRow key={o.id} order={o} onSelect={() => setSelectedOrder(o)} format={format} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

function OrderRow({ order, onSelect, format }) {
  const { getProduct } = useStore();
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "24px",
        border: "1px solid var(--border)",
        backgroundColor: "var(--card)",
        padding: "24px",
        textAlign: "left",
        cursor: "pointer",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Overlapping Thumbnails */}
      <div style={{ display: "flex", marginLeft: "8px" }}>
        {order.items.map((it, idx) => {
          const p = getProduct(it.productId);
          return (
            <img
              key={idx}
              src={p?.image}
              alt=""
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "2px solid var(--card)",
                objectFit: "cover",
                marginLeft: idx === 0 ? "0" : "-16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            />
          );
        })}
      </div>

      <div style={{ flex: 1, minWidth: "180px" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", color: "var(--foreground)" }}>
          Order {order.id}
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "4px" }}>
          Placed {new Date(order.date).toLocaleDateString("en-US", { dateStyle: "long" })} · {order.items.length} item(s)
        </p>
      </div>

      <p style={{ fontSize: "1rem", fontWeight: 500, color: "var(--foreground)" }}>
        {format(order.total)}
      </p>

      <StatusBadge s={order.status} />
    </button>
  );
}

function OrderDetailModal({ order, onClose }) {
  const { format, getProduct, generalSettings } = useStore();
  const brandName = generalSettings?.softwarename || "GEMORA DIAM";
  const addressLine = [generalSettings?.address, generalSettings?.cityname, generalSettings?.statename, generalSettings?.countryname].filter(Boolean).join(", ");
  const currentStepIdx = STATUSES.indexOf(order.status);

  const printInvoice = () => {
    const rows = order.items
      .map((it) => {
        const p = getProduct(it.productId);
        return `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #EFECE6;">
              <strong>${p?.name || it.productId}</strong><br>
              <span style="font-size: 0.85em; color: #666;">${it.metal}</span>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #EFECE6; text-align: center;">${it.qty}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #EFECE6; text-align: right;">${format((p?.price || 0) * it.qty)}</td>
          </tr>
        `;
      })
      .join("");

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${order.id} - ${brandName}</title>
          <style>
            body { font-family: 'Georgia', serif; padding: 48px; color: #1c2211; max-width: 800px; margin: 0 auto; }
            h1 { letter-spacing: 0.35em; font-size: 26px; text-transform: uppercase; color: #556832; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 32px; }
            th { text-align: left; padding-bottom: 8px; border-bottom: 2px solid #556832; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
            .total { text-align: right; margin-top: 24px; font-size: 20px; font-family: sans-serif; font-weight: 600; }
          </style>
        </head>
        <body>
          <h1>${brandName}</h1>
          <p style="font-size: 14px; color: #666;">Official Order Invoice</p>
          <p style="margin-top: 24px; font-size: 13px;"><strong>Order ID:</strong> ${order.id}<br><strong>Date:</strong> ${order.date}<br><strong>Tracking:</strong> ${order.tracking || "Insured Courier"}</p>
          <table>
            <thead>
              <tr>
                <th>Piece & Spec</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="total">Total: ${format(order.total)}</div>
          <p style="margin-top: 48px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            ${brandName} Fine Jewelry${addressLine ? ` · ${addressLine}` : ""} · Certified Fine Jewelry
          </p>
          <script>window.print()</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          padding: "36px",
          position: "relative",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            color: "var(--muted-foreground)",
            cursor: "pointer"
          }}
        >
          <X size={20} />
        </button>

        <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Order Details</p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", marginTop: "4px" }}>
          Order {order.id}
        </h2>
        {order.tracking && (
          <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", marginTop: "4px" }}>
            Insured Courier Tracking: <strong style={{ color: "var(--foreground)" }}>{order.tracking}</strong>
          </p>
        )}

        {/* Multi-step Timeline */}
        <div style={{ marginTop: "32px", paddingLeft: "16px", borderLeft: "2px solid var(--border)", display: "flex", flexDirection: "column", gap: "24px" }}>
          {STATUSES.map((step, idx) => {
            const isPassed = idx <= currentStepIdx;
            return (
              <div key={step} style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "-25px",
                    top: "0px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor: isPassed ? "var(--primary)" : "var(--border)",
                    backgroundColor: isPassed ? "var(--primary)" : "var(--background)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--primary-foreground)"
                  }}
                >
                  {isPassed && <Check size={10} />}
                </span>
                <p style={{ fontSize: "0.95rem", fontWeight: isPassed ? 600 : 400, color: isPassed ? "var(--foreground)" : "var(--muted-foreground)" }}>
                  {step}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: "2px" }}>
                  {step === "Processing" && "Order verified and jewelry preparation started"}
                  {step === "Crafted" && "Handcrafted, polished, and quality certified"}
                  {step === "Shipped" && "Dispatched with tracked insured delivery"}
                  {step === "Delivered" && "Safely delivered to your address"}
                </p>
              </div>
            );
          })}
        </div>

        {/* Item List */}
        <div style={{ marginTop: "32px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "16px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
          {order.items.map((it, idx) => {
            const p = getProduct(it.productId);
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <img
                  src={p?.image}
                  alt={p?.name}
                  style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "2px" }}
                />
                <div style={{ flex: 1, fontSize: "0.9rem" }}>
                  <p style={{ fontWeight: 500 }}>{p?.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                    {it.metal} · Qty {it.qty}
                  </p>
                </div>
                <span style={{ fontSize: "0.9rem" }}>{format((p?.price || 0) * it.qty)}</span>
              </div>
            );
          })}
        </div>

        {/* Footer with Total and Invoice button */}
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>{format(order.total)}</span>
          <button
            onClick={printInvoice}
            className="eyebrow"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid var(--foreground)",
              backgroundColor: "transparent",
              padding: "10px 18px",
              cursor: "pointer"
            }}
          >
            <Download size={14} /> Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
