import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Download, X, Package, Clock, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { useStore } from "../lib/store";
import { StatusBadge } from "../components/StatusBadge";

const ORDER_STEPS = ["Confirmed", "Processing", "Shipped", "Delivered"];

export default function OrdersPage() {
  const { format, getCustomerOrders, user } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getCustomerOrders()
      .then((data) => {
        if (isMounted) {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load customer orders:", err);
        if (isMounted) {
          setOrders([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [getCustomerOrders, user]);

  const active = orders.filter(
    (o) => (o.orderstatus || o.status) !== "Delivered" && (o.orderstatus || o.status) !== "Cancelled"
  );
  const done = orders.filter(
    (o) => (o.orderstatus || o.status) === "Delivered" || (o.orderstatus || o.status) === "Cancelled"
  );

  return (
    <div className="container-luxury" style={{ maxWidth: "1000px", paddingTop: "60px", paddingBottom: "100px" }}>
      <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Your Account</p>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.6rem, 5vw, 3.8rem)", marginTop: "12px" }}>
        Orders & Tracking
      </h1>

      {loading ? (
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              border: "3px solid var(--border)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 0.9s linear infinite"
            }}
          />
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Loading your fine jewelry orders...
          </p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-soft)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 24px",
              color: "var(--primary)"
            }}
          >
            <Package size={34} strokeWidth={1.5} />
          </div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--foreground)" }}>
            No Orders Found
          </p>
          <p style={{ marginTop: "12px", fontSize: "0.95rem", color: "var(--muted-foreground)", maxWidth: "460px", marginInline: "auto" }}>
            {user
              ? "You haven't placed any orders yet. Discover our latest ethically crafted fine jewelry collections."
              : "Please sign in to view your orders, live courier tracking, and certificates."}
          </p>
          <div style={{ marginTop: "28px", display: "flex", justifyContent: "center", gap: "12px" }}>
            {user ? (
              <Link
                to="/shop"
                className="eyebrow"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  borderRadius: "2px",
                  textDecoration: "none"
                }}
              >
                Explore Collection
              </Link>
            ) : (
              <Link
                to="/profile"
                className="eyebrow"
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  borderRadius: "2px",
                  textDecoration: "none"
                }}
              >
                Sign In to Account
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Active Orders */}
          {active.length > 0 && (
            <>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", marginTop: "50px" }}>
                Active Orders ({active.length})
              </h2>
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {active.map((o) => (
                  <OrderRow
                    key={o._id || o.orderid || o.id}
                    order={o}
                    onSelect={() => setSelectedOrder(o)}
                    format={format}
                  />
                ))}
              </div>
            </>
          )}

          {/* Past / Completed Orders */}
          {done.length > 0 && (
            <>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", marginTop: "50px" }}>
                Past Orders ({done.length})
              </h2>
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {done.map((o) => (
                  <OrderRow
                    key={o._id || o.orderid || o.id}
                    order={o}
                    onSelect={() => setSelectedOrder(o)}
                    format={format}
                  />
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
  const orderNum = order.ordernumber || order.orderid || order.id;
  const orderItems = order.items || [];
  const status = order.orderstatus || order.status || "Confirmed";
  const dateFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })
    : (order.date || "Recent");

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
        borderRadius: "4px",
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
      {/* Thumbnails */}
      <div style={{ display: "flex", marginLeft: "8px" }}>
        {orderItems.map((it, idx) => {
          const imgSrc = it.image || getProduct(it.itemid || it.productId)?.image;
          return (
            <img
              key={idx}
              src={imgSrc}
              alt=""
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "2px solid var(--card)",
                objectFit: "cover",
                marginLeft: idx === 0 ? "0" : "-16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                backgroundColor: "#f5f5f4"
              }}
            />
          );
        })}
      </div>

      <div style={{ flex: 1, minWidth: "180px" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", color: "var(--foreground)" }}>
          Order #{orderNum}
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "4px" }}>
          Placed {dateFormatted} · {orderItems.length} item(s)
        </p>
      </div>

      <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--foreground)" }}>
        {format(order.total)}
      </p>

      <StatusBadge s={status} />
    </button>
  );
}

function OrderDetailModal({ order, onClose }) {
  const { format, getProduct, generalSettings } = useStore();
  const brandName = generalSettings?.softwarename || "GEMORA DIAM";
  const addressLine = [
    generalSettings?.address,
    generalSettings?.cityname,
    generalSettings?.statename,
    generalSettings?.countryname
  ]
    .filter(Boolean)
    .join(", ");

  const orderNum = order.ordernumber || order.orderid || order.id;
  const status = order.orderstatus || order.status || "Confirmed";
  const currentStepIdx = Math.max(0, ORDER_STEPS.indexOf(status));
  const orderItems = order.items || [];
  const shippingAddr = order.shippingaddress || null;

  const printInvoice = () => {
    const rows = orderItems
      .map((it) => {
        const specs = [
          it.metalname,
          it.stonename,
          it.diamondsize,
          it.shapename,
          it.clarityname,
          it.diamondcolor ? `Dia: ${it.diamondcolor}` : "",
          it.bandcolor ? `Band: ${it.bandcolor}` : ""
        ]
          .filter(Boolean)
          .join(" • ");

        return `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #EFECE6;">
              <strong>${it.itemname || "Fine Jewelry Piece"}</strong><br>
              ${specs ? `<span style="font-size: 0.82em; color: #666;">${specs}</span><br>` : ""}
              ${it.specialinstruction ? `<span style="font-size: 0.8em; color: #445428; font-style: italic;">Note: "${it.specialinstruction}"</span>` : ""}
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #EFECE6; text-align: center;">${it.qty || 1}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #EFECE6; text-align: right;">${format(it.totalprice || (it.price * (it.qty || 1)))}</td>
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
          <title>Invoice #${orderNum} - ${brandName}</title>
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
          <p style="margin-top: 24px; font-size: 13px;">
            <strong>Order #:</strong> ${orderNum}<br>
            <strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}<br>
            <strong>Customer:</strong> ${order.customername || ""}<br>
            <strong>Status:</strong> ${status}
          </p>
          ${shippingAddr ? `
            <div style="margin-top: 16px; padding: 12px; background: #fafaf9; font-size: 12px;">
              <strong>Delivery Destination:</strong> ${shippingAddr.address}, ${shippingAddr.cityname}, ${shippingAddr.statename}, ${shippingAddr.countryname} - ${shippingAddr.pincode}
            </div>
          ` : ""}
          <table>
            <thead>
              <tr>
                <th>Piece & Specifications</th>
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
            ${brandName} Fine Jewelry${addressLine ? ` · ${addressLine}` : ""} · Ethically Sourced & Certified Fine Jewelry
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
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
          padding: "36px",
          position: "relative",
          borderRadius: "4px",
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
            cursor: "pointer",
            padding: "4px"
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Order Details</p>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginTop: "4px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", margin: 0 }}>
            Order #{orderNum}
          </h2>
          <StatusBadge s={status} />
        </div>

        <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", marginTop: "6px" }}>
          Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" }) : "Recently"}
          {order.paymentstatus ? ` · Payment: ${order.paymentstatus}` : ""}
        </p>

        {/* Order Status Timeline */}
        <div style={{ marginTop: "28px", paddingLeft: "16px", borderLeft: "2px solid var(--border)", display: "flex", flexDirection: "column", gap: "20px" }}>
          {ORDER_STEPS.map((step, idx) => {
            const isPassed = idx <= currentStepIdx;
            return (
              <div key={step} style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "-25px",
                    top: "1px",
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
                <p style={{ fontSize: "0.92rem", fontWeight: isPassed ? 600 : 400, color: isPassed ? "var(--foreground)" : "var(--muted-foreground)", margin: 0 }}>
                  {step}
                </p>
              </div>
            );
          })}
        </div>

        {/* Delivery Destination */}
        {shippingAddr && (
          <div
            style={{
              marginTop: "28px",
              padding: "16px",
              borderRadius: "4px",
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              fontSize: "0.86rem"
            }}
          >
            <p style={{ fontWeight: 600, color: "var(--foreground)", display: "flex", alignItems: "center", gap: "6px", margin: "0 0 6px" }}>
              <MapPin size={14} style={{ color: "var(--primary)" }} /> Delivery Address ({shippingAddr.title || "Home"})
            </p>
            <p style={{ color: "var(--muted-foreground)", margin: 0, lineHeight: 1.5 }}>
              {shippingAddr.address}, {shippingAddr.cityname}, {shippingAddr.statename}, {shippingAddr.countryname} - {shippingAddr.pincode}
            </p>
          </div>
        )}

        {/* Ordered Item List */}
        <div style={{ marginTop: "28px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "18px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            Ordered Items ({orderItems.length})
          </p>
          {orderItems.map((it, idx) => {
            const imgSrc = it.image || getProduct(it.itemid || it.productId)?.image;
            const specs = [
              it.metalname,
              it.stonename,
              it.diamondsize,
              it.shapename,
              it.clarityname,
              it.diamondcolor ? `Dia: ${it.diamondcolor}` : "",
              it.bandcolor ? `Band: ${it.bandcolor}` : ""
            ]
              .filter(Boolean)
              .join(" • ");

            return (
              <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "8px 0", borderBottom: idx < orderItems.length - 1 ? "1px dashed var(--border)" : "none" }}>
                <img
                  src={imgSrc}
                  alt={it.itemname}
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "3px", backgroundColor: "#f5f5f4" }}
                />
                <div style={{ flex: 1, fontSize: "0.88rem" }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>{it.itemname || "Fine Jewelry Piece"}</p>
                  {specs && (
                    <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", margin: "4px 0 0" }}>
                      {specs} · Qty {it.qty || 1}
                    </p>
                  )}
                  {it.specialinstruction && (
                    <p style={{ fontSize: "0.76rem", color: "var(--primary)", margin: "4px 0 0", fontStyle: "italic", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Sparkles size={11} /> Note: "{it.specialinstruction}"
                    </p>
                  )}
                </div>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {format(it.totalprice || (it.price * (it.qty || 1)))}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer with Total and Invoice download button */}
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", display: "block" }}>Grand Total</span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", fontWeight: 600 }}>{format(order.total)}</span>
          </div>
          <button
            onClick={printInvoice}
            className="eyebrow"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid var(--foreground)",
              backgroundColor: "transparent",
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "2px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "inherit";
              e.currentTarget.style.borderColor = "var(--foreground)";
            }}
          >
            <Download size={14} /> Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
