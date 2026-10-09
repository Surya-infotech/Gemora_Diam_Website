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
      {/* Page Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--gold)" }} />
          <p className="eyebrow" style={{ color: "var(--gold-deep)", margin: 0 }}>Client Concierge • Atelier Orders</p>
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", margin: "8px 0 12px 0", letterSpacing: "-0.01em" }}>
          Orders &amp; Tracking
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem", maxWidth: "600px", margin: 0 }}>
          Follow the craftsmanship journey of your fine jewelry commissions, live courier delivery, and certified invoices.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              border: "2px solid #EAE4D7",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              margin: "0 auto 20px",
              animation: "spin 0.9s linear infinite"
            }}
          />
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.92rem", letterSpacing: "0.05em" }}>
            Retrieving your fine jewelry orders...
          </p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            backgroundColor: "#FAF9F6",
            border: "1px solid #EDE8DE",
            borderRadius: "6px"
          }}
        >
          <div
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-soft)",
              border: "1px solid rgba(197, 160, 89, 0.3)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 24px",
              color: "var(--primary)"
            }}
          >
            <Package size={34} strokeWidth={1.4} />
          </div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--foreground)", margin: "0 0 12px 0" }}>
            No Orders on Record
          </p>
          <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", maxWidth: "460px", marginInline: "auto", lineHeight: 1.6 }}>
            {user
              ? "You have not placed any orders yet. Discover our latest ethically crafted fine jewelry collections and atelier pieces."
              : "Please sign in to view your orders, live courier tracking, and authenticated invoices."}
          </p>
          <div style={{ marginTop: "32px", display: "flex", justifyContent: "center", gap: "14px" }}>
            {user ? (
              <Link
                to="/shop"
                className="eyebrow"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 34px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "2px",
                  textDecoration: "none",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  boxShadow: "0 6px 18px rgba(85, 104, 50, 0.25)"
                }}
              >
                Explore Collection ✦
              </Link>
            ) : (
              <Link
                to="/profile"
                className="eyebrow"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 34px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "2px",
                  textDecoration: "none",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  boxShadow: "0 6px 18px rgba(85, 104, 50, 0.25)"
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
            <div style={{ marginBottom: "50px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", borderBottom: "1px solid #EDE8DE", paddingBottom: "14px", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", margin: 0 }}>
                  Active Orders
                </h2>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-deep)" }}>
                  ({active.length} In Progress)
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {active.map((o) => (
                  <OrderRow
                    key={o._id || o.orderid || o.id}
                    order={o}
                    onSelect={() => setSelectedOrder(o)}
                    format={format}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past / Completed Orders */}
          {done.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", borderBottom: "1px solid #EDE8DE", paddingBottom: "14px", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", margin: 0 }}>
                  Past Orders
                </h2>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
                  ({done.length} Delivered / Archived)
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {done.map((o) => (
                  <OrderRow
                    key={o._id || o.orderid || o.id}
                    order={o}
                    onSelect={() => setSelectedOrder(o)}
                    format={format}
                  />
                ))}
              </div>
            </div>
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
    <div
      onClick={onSelect}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "24px",
        border: "1px solid #EDE8DE",
        backgroundColor: "#FAF9F6",
        padding: "24px 28px",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        position: "relative"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(85,104,50,0.08)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#EDE8DE";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Product Thumbnails with Gold Border Rings */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {orderItems.slice(0, 4).map((it, idx) => {
          const imgSrc = it.image || getProduct(it.itemid || it.productId)?.image;
          return (
            <div
              key={idx}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "2px solid #FAF9F6",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                backgroundColor: "#ffffff",
                marginLeft: idx === 0 ? "0" : "-16px",
                overflow: "hidden",
                zIndex: 4 - idx,
                flexShrink: 0
              }}
            >
              <img
                src={imgSrc}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
          );
        })}
        {orderItems.length > 4 && (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-soft)",
              color: "var(--primary)",
              fontSize: "0.72rem",
              fontWeight: 700,
              display: "grid",
              placeItems: "center",
              marginLeft: "-10px",
              border: "2px solid #FAF9F6",
              zIndex: 0
            }}
          >
            +{orderItems.length - 4}
          </div>
        )}
      </div>

      {/* Order info */}
      <div style={{ flex: 1, minWidth: "200px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 600, color: "var(--foreground)" }}>
            Order #{orderNum}
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "2px 8px",
              borderRadius: "2px",
              backgroundColor: "rgba(197, 160, 89, 0.12)",
              color: "var(--gold-deep)"
            }}
          >
            {orderItems.length} {orderItems.length === 1 ? "Piece" : "Pieces"}
          </span>
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", marginTop: "4px", margin: 0 }}>
          Commissioned on {dateFormatted}
        </p>
      </div>

      {/* Price & Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "0.02em" }}>
          {format(order.total)}
        </span>

        <StatusBadge s={status} />

        <span
          className="eyebrow"
          style={{
            fontSize: "0.7rem",
            color: "var(--primary)",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          Details →
        </span>
      </div>
    </div>
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
            <td style="padding: 14px 0; border-bottom: 1px solid #ECE7DD;">
              <strong style="font-size: 15px; color: #1c2211;">${it.itemname || "Fine Jewelry Piece"}</strong><br>
              ${specs ? `<span style="font-size: 12px; color: #666; display: inline-block; margin-top: 3px;">${specs}</span><br>` : ""}
              ${it.specialinstruction ? `<span style="font-size: 11px; color: #556832; font-style: italic; display: inline-block; margin-top: 3px;">Special Note: "${it.specialinstruction}"</span>` : ""}
            </td>
            <td style="padding: 14px 0; border-bottom: 1px solid #ECE7DD; text-align: center; font-size: 14px;">${it.qty || 1}</td>
            <td style="padding: 14px 0; border-bottom: 1px solid #ECE7DD; text-align: right; font-size: 15px; font-weight: 600; color: #1c2211;">${format(it.totalprice || (it.price * (it.qty || 1)))}</td>
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
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 48px; color: #1c2211; max-width: 820px; margin: 0 auto; background: #ffffff; }
            h1 { font-family: 'Playfair Display', serif; letter-spacing: 0.15em; font-size: 28px; text-transform: uppercase; color: #556832; margin: 0 0 4px 0; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #556832; padding-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 36px; }
            th { text-align: left; padding-bottom: 10px; border-bottom: 1.5px solid #556832; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #556832; }
            .total { text-align: right; margin-top: 24px; font-size: 22px; font-family: 'Playfair Display', serif; font-weight: 700; color: #1c2211; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>${brandName}</h1>
              <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #c5a059; margin: 0;">Haute Joaillerie Atelier • Official Invoice</p>
            </div>
            <div style="text-align: right; font-size: 13px; color: #555;">
              <strong>Order #:</strong> ${orderNum}<br>
              <strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}<br>
              <strong>Status:</strong> ${status}
            </div>
          </div>
          ${shippingAddr ? `
            <div style="margin-top: 24px; padding: 16px; background: #FAF9F6; border: 1px solid #ECE7DD; font-size: 13px; line-height: 1.6;">
              <strong style="color: #556832; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">Delivered To:</strong>
              ${order.customername ? `<strong>${order.customername}</strong><br>` : ""}
              ${shippingAddr.address}, ${shippingAddr.cityname}, ${shippingAddr.statename}, ${shippingAddr.countryname} - ${shippingAddr.pincode}
            </div>
          ` : ""}
          <table>
            <thead>
              <tr>
                <th>Piece &amp; Atelier Specifications</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="total">Grand Total: ${format(order.total)}</div>
          <p style="margin-top: 48px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 24px; line-height: 1.6;">
            ${brandName} Fine Jewelry${addressLine ? ` · ${addressLine}` : ""}<br>
            Ethically Sourced · GIA/IGI Certified Lab Diamonds · Lifetime Craftsmanship Guarantee
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
        backgroundColor: "rgba(20, 24, 14, 0.7)",
        backdropFilter: "blur(8px)",
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
          maxWidth: "700px",
          maxHeight: "92vh",
          overflowY: "auto",
          backgroundColor: "#FAF9F6",
          border: "1px solid #EDE8DE",
          padding: "36px",
          position: "relative",
          borderRadius: "6px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.22)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "#ffffff",
            border: "1px solid #EDE8DE",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: "var(--foreground)",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.color = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#EDE8DE";
            e.currentTarget.style.color = "var(--foreground)";
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Top Header */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "var(--gold)" }} />
            <span className="eyebrow" style={{ color: "var(--gold-deep)" }}>Atelier Dossier • Order Record</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginTop: "4px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", margin: 0, letterSpacing: "-0.01em" }}>
              Order #{orderNum}
            </h2>
            <StatusBadge s={status} />
          </div>
          <p style={{ fontSize: "0.84rem", color: "var(--muted-foreground)", marginTop: "6px", margin: 0 }}>
            Commissioned on {order.createdAt ? new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" }) : "Recently"}
            {order.paymentstatus ? ` · Payment: ${order.paymentstatus}` : ""}
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div style={{ marginTop: "32px", padding: "20px", backgroundColor: "#ffffff", borderRadius: "6px", border: "1px solid #EDE8DE" }}>
          <p className="eyebrow" style={{ color: "var(--gold-deep)", fontSize: "0.68rem", marginBottom: "16px" }}>
            Courier &amp; Craftsmanship Progress
          </p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${ORDER_STEPS.length}, 1fr)`, position: "relative" }}>
            {/* Horizontal Track line */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "10%",
                right: "10%",
                height: "2px",
                backgroundColor: "#EAE4D7",
                zIndex: 0
              }}
            />
            {ORDER_STEPS.map((step, idx) => {
              const isPassed = idx <= currentStepIdx;
              return (
                <div key={step} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: isPassed ? "var(--primary)" : "#EAE4D7",
                      backgroundColor: isPassed ? "var(--primary)" : "#ffffff",
                      color: isPassed ? "#ffffff" : "var(--muted-foreground)",
                      margin: "0 auto 8px",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      boxShadow: isPassed ? "0 2px 8px rgba(85, 104, 50, 0.3)" : "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {isPassed ? <Check size={14} strokeWidth={2.4} /> : idx + 1}
                  </div>
                  <span
                    style={{
                      fontSize: "0.76rem",
                      fontWeight: isPassed ? 600 : 400,
                      color: isPassed ? "var(--foreground)" : "var(--muted-foreground)",
                      letterSpacing: "0.02em"
                    }}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Destination */}
        {shippingAddr && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px 20px",
              borderRadius: "4px",
              backgroundColor: "#ffffff",
              border: "1px solid #EDE8DE",
              fontSize: "0.86rem"
            }}
          >
            <p style={{ fontWeight: 600, color: "var(--foreground)", display: "flex", alignItems: "center", gap: "8px", margin: "0 0 6px 0" }}>
              <MapPin size={16} style={{ color: "var(--primary)" }} /> Delivery Destination ({shippingAddr.title || "Primary"})
            </p>
            <p style={{ color: "var(--muted-foreground)", margin: 0, lineHeight: 1.6 }}>
              {shippingAddr.address}, {shippingAddr.cityname}, {shippingAddr.statename}, {shippingAddr.countryname} - {shippingAddr.pincode}
            </p>
          </div>
        )}

        {/* Ordered Item List */}
        <div style={{ marginTop: "24px", backgroundColor: "#ffffff", borderRadius: "6px", border: "1px solid #EDE8DE", padding: "20px" }}>
          <p className="eyebrow" style={{ color: "var(--gold-deep)", fontSize: "0.7rem", marginBottom: "14px" }}>
            Commissioned Creations ({orderItems.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    paddingBottom: idx < orderItems.length - 1 ? "16px" : "0",
                    borderBottom: idx < orderItems.length - 1 ? "1px solid #F2EEE6" : "none"
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={it.itemname}
                    style={{
                      width: "68px",
                      height: "68px",
                      objectFit: "cover",
                      borderRadius: "3px",
                      backgroundColor: "#FAF9F6",
                      border: "1px solid #EDE8DE",
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1, fontSize: "0.88rem" }}>
                    <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 600, margin: 0, color: "var(--foreground)" }}>
                      {it.itemname || "Fine Jewelry Piece"}
                    </p>
                    {specs && (
                      <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", margin: "4px 0 0 0" }}>
                        {specs} · Qty {it.qty || 1}
                      </p>
                    )}
                    {it.specialinstruction && (
                      <p
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--primary)",
                          margin: "6px 0 0 0",
                          fontStyle: "italic",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          backgroundColor: "var(--primary-soft)",
                          padding: "3px 8px",
                          borderRadius: "2px"
                        }}
                      >
                        <Sparkles size={12} /> Note: "{it.specialinstruction}"
                      </p>
                    )}
                  </div>
                  <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", whiteSpace: "nowrap" }}>
                    {format(it.totalprice || (it.price * (it.qty || 1)))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Total and Invoice download button */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #EDE8DE",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", display: "block" }}>
              Total Order Investment
            </span>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, color: "var(--foreground)" }}>
              {format(order.total)}
            </span>
          </div>

          {String(status || "").toLowerCase() === "delivered" && (
            <button
              onClick={printInvoice}
              className="eyebrow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid var(--primary)",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                padding: "12px 24px",
                cursor: "pointer",
                borderRadius: "2px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 14px rgba(85, 104, 50, 0.2)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                e.currentTarget.style.borderColor = "var(--primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary)";
                e.currentTarget.style.borderColor = "var(--primary)";
              }}
            >
              <Download size={15} /> Download Official Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
