import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Download, X, Package, MapPin, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useStore } from "../lib/store";
import { StatusBadge } from "../components/StatusBadge";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ORDER_STEPS = ["Confirmed", "Processing", "Shipped", "Delivered"];

export default function OrdersPage() {
  const { format, getCustomerOrders, user } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    let isMounted = true;

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
                to="/collections"
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
          {String(status || "").toLowerCase() === "cancelled" && (order.cancelledat || order.cancelreason) && (
            <span style={{ color: "#B91C1C", fontWeight: 500, marginLeft: "8px" }}>
              · Cancelled{order.cancelreason ? `: ${order.cancelreason}` : ""}
            </span>
          )}
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

const escapeHtml = (text) => {
  if (text == null) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

function formatCurrencyWithDetails(amount, details) {
  const num = typeof amount === "number" ? amount : parseFloat(amount) || 0;
  const {
    decimal = 2,
    thousandseparator = ",",
    decimalseparator = ".",
    currencysymbol = "$",
    currencyposition = "left"
  } = details || {};

  const decPlaces = decimal !== undefined && decimal !== null ? parseInt(decimal, 10) : 2;
  let [intPart, decPart] = num.toFixed(decPlaces).split(".");
  const sep = thousandseparator || ",";

  const last3 = intPart.slice(-3);
  const other = intPart.slice(0, -3);
  const formattedInt = other !== "" ? other.replace(/\B(?=(\d{2,3})+(?!\d))/g, sep) + sep + last3 : last3;

  const decSep = decimalseparator || ".";
  const formattedAmount = decPlaces > 0 && decPart !== undefined ? `${formattedInt}${decSep}${decPart}` : formattedInt;

  const symbol = currencysymbol || "";

  switch (currencyposition) {
    case "left":
      return `${symbol}${formattedAmount}`;
    case "left-space":
      return `${symbol} ${formattedAmount}`;
    case "right":
      return `${formattedAmount}${symbol}`;
    case "right-space":
      return `${formattedAmount} ${symbol}`;
    default:
      return `${symbol}${formattedAmount}`;
  }
}

function OrderDetailModal({ order, onClose }) {
  const { format, getProduct, generalSettings, notify } = useStore();
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [invoiceSettings, setInvoiceSettings] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    fetch(`${backendUrl}/System/GetInvoiceSetting_landingpage`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setInvoiceSettings({
            invoicePrefix: data.invoiceprefix || data.invoicePrefix || "INV-",
            notes: data.notes || ""
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const brandName = generalSettings?.softwarename || "GEMORA DIAM";

  const orderNum = order.ordernumber || order.orderid || order.id;
  const status = order.orderstatus || order.status || "Confirmed";
  const isCancelled =
    String(status || "").trim().toLowerCase() === "cancelled" ||
    String(order.orderstatus || "").trim().toLowerCase() === "cancelled" ||
    String(order.status || "").trim().toLowerCase() === "cancelled";

  const rawCancelledAt = order.cancelledat || order.canceledAt || (isCancelled ? order.updatedAt : null);
  const cancelledAtDisplay = rawCancelledAt
    ? new Date(rawCancelledAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })
    : null;
  const cancelReason = order.cancelreason || order.cancellationReason || order.cancelReason || "";
  const cancelledByDisplay = order.cancelledby || order.canceledBy || "";

  const currentStepIdx = Math.max(0, ORDER_STEPS.indexOf(status));
  const orderItems = order.items || [];
  const shippingAddr = order.shippingaddress || null;

  const formatPrice = (price) => {
    if (order.currencydetails) {
      return formatCurrencyWithDetails(price, order.currencydetails);
    }
    return format(price);
  };

  const handleDownloadInvoice = async () => {
    if (!order || downloadingInvoice) return;
    setDownloadingInvoice(true);

    try {
      const orderNumberDisplay = order.ordernumber != null ? order.ordernumber : (order.orderid || order.id);
      const prefix = invoiceSettings?.invoicePrefix || "INV-";
      const invoiceNumber = `${prefix}${orderNumberDisplay}`;
      const invoiceDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

      const brandEmail = generalSettings?.email || "";
      const brandPhone = generalSettings?.phone || "";
      const brandAddressParts = [
        generalSettings?.address,
        generalSettings?.cityname,
        generalSettings?.statename,
        generalSettings?.countryname,
        generalSettings?.postalcode
      ].filter(Boolean);
      const brandAddress = brandAddressParts.join(", ");

      const customerName = order.customername || order.shippingaddress?.name || "Valued Customer";
      const customerEmail = order.customeremail || "";
      const customerPhone = order.customerphone || order.shippingaddress?.phone || "";

      const shippingAddressParts = shippingAddr
        ? [
            shippingAddr.title ? `<strong>${escapeHtml(shippingAddr.title)}</strong>` : "",
            shippingAddr.address,
            shippingAddr.cityname,
            shippingAddr.statename,
            shippingAddr.countryname,
            shippingAddr.pincode ? `PIN: ${shippingAddr.pincode}` : ""
          ].filter(Boolean).join("<br>")
        : "";

      const items = order.items || [];
      const itemRows = items
        .map((item, idx) => {
          const specs = [
            item.metalname && `Metal: ${item.metalname}`,
            item.diamondsize && `Diamond: ${item.diamondsize}`,
            item.shapename && `Shape: ${item.shapename}`,
            item.clarityname && `Clarity: ${item.clarityname}`,
            item.stonename && `Stone: ${item.stonename}`,
            item.size && `Size: ${item.size}`,
            item.diamondcolor && `Color: ${item.diamondcolor}`,
            item.bandcolor && `Band: ${item.bandcolor}`
          ]
            .filter(Boolean)
            .join(" • ");

          const unitPriceStr = formatPrice(item.price);
          const totalPriceStr = formatPrice(item.totalprice || (item.price * (item.qty || 1)));
          const qty = item.qty || 1;

          return `
            <tr>
              <td style="padding: 12px 14px; border-bottom: 1px solid #eef2f6; vertical-align: top;">
                <div style="font-weight: 700; color: #0f172a; font-size: 13.5px; margin-bottom: 4px;">
                  ${idx + 1}. ${escapeHtml(item.itemname || "Fine Jewelry Piece")}
                </div>
                ${specs ? `<div style="font-size: 11.5px; color: #64748b; line-height: 1.5; margin-bottom: 4px;">${escapeHtml(specs)}</div>` : ""}
                ${item.specialinstruction ? `<div style="font-size: 11px; color: #047857; background: #ecfdf5; display: inline-block; padding: 2px 8px; border-radius: 4px; font-style: italic;">Special Note: ${escapeHtml(item.specialinstruction)}</div>` : ""}
              </td>
              <td style="padding: 12px 14px; border-bottom: 1px solid #eef2f6; text-align: center; vertical-align: top; font-weight: 600; font-size: 13.5px; color: #334155;">
                ${qty}
              </td>
              <td style="padding: 12px 14px; border-bottom: 1px solid #eef2f6; text-align: right; vertical-align: top; font-size: 13.5px; color: #334155; white-space: nowrap;">
                ${escapeHtml(unitPriceStr)}
              </td>
              <td style="padding: 12px 14px; border-bottom: 1px solid #eef2f6; text-align: right; vertical-align: top; font-weight: 700; font-size: 13.5px; color: #0f172a; white-space: nowrap;">
                ${escapeHtml(totalPriceStr)}
              </td>
            </tr>
          `;
        })
        .join("");

      const subtotalStr = formatPrice(order.subtotal ?? order.total);
      const grandTotalStr = formatPrice(order.total);
      const invoiceNotes =
        invoiceSettings?.notes ||
        "Thank you for choosing Gemora Diam. Each gemstone is ethically crafted, graded, and authenticated.";

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "794px";
      container.style.backgroundColor = "#ffffff";
      container.style.zIndex = "-9999";

      container.innerHTML = `
        <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #1e293b; padding: 36px 40px; width: 794px; box-sizing: border-box;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 2px solid #0f172a; margin-bottom: 22px;">
            <div>
              <div style="font-size: 26px; font-weight: 700; color: #044e39; letter-spacing: 0.05em; text-transform: uppercase;">
                ${escapeHtml(brandName)}
              </div>
              <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 0.08em; margin-top: 4px;">
                Official Invoice
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 20px; font-weight: 800; color: #0f172a; text-transform: uppercase;">
                Tax Invoice
              </div>
              <div style="font-size: 14px; font-weight: 700; color: #10b981; font-family: monospace; margin-top: 2px;">
                ${escapeHtml(invoiceNumber)}
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 18px; margin-bottom: 22px;">
            <div>
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: #64748b;">Invoice Date</div>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${escapeHtml(invoiceDate)}</div>
            </div>
            <div>
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: #64748b;">Order Number</div>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">#${escapeHtml(orderNumberDisplay)}</div>
            </div>
            <div>
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: #64748b;">Order Status</div>
              <div style="margin-top: 2px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: #dcfce7; color: #15803d;">
                  ${escapeHtml(order.orderstatus || status || "Delivered")}
                </span>
              </div>
            </div>
            <div>
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: #64748b;">Payment Status</div>
              <div style="margin-top: 2px;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: #dcfce7; color: #15803d;">
                  ${escapeHtml(order.paymentstatus || "Paid")}
                </span>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 18px; margin-bottom: 22px;">
            <div style="flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; background: #ffffff;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #044e39; font-weight: 700; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #f1f5f9;">
                Billed &amp; Delivered To
              </div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${escapeHtml(customerName)}</div>
              ${customerEmail ? `<div style="font-size: 12px; color: #475569;">Email: ${escapeHtml(customerEmail)}</div>` : ""}
              ${customerPhone ? `<div style="font-size: 12px; color: #475569;">Phone: ${escapeHtml(customerPhone)}</div>` : ""}
              ${shippingAddressParts ? `<div style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.4;">${shippingAddressParts}</div>` : ""}
            </div>

            <div style="flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; background: #ffffff;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #044e39; font-weight: 700; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #f1f5f9;">
                Issued By
              </div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${escapeHtml(brandName)}</div>
              ${brandEmail ? `<div style="font-size: 12px; color: #475569;">Email: ${escapeHtml(brandEmail)}</div>` : ""}
              ${brandPhone ? `<div style="font-size: 12px; color: #475569;">Phone: ${escapeHtml(brandPhone)}</div>` : ""}
              ${brandAddress ? `<div style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.4;">${escapeHtml(brandAddress)}</div>` : ""}
              <div style="font-size: 12px; color: #475569; margin-top: 6px;"><strong>Payment Method:</strong> ${escapeHtml(order.paymentmethod || "Credit/Debit Card")}</div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #334155; border-bottom: 2px solid #cbd5e1;">Product Details</th>
                <th style="text-align: center; width: 70px; padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #334155; border-bottom: 2px solid #cbd5e1;">Qty</th>
                <th style="text-align: right; width: 120px; padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #334155; border-bottom: 2px solid #cbd5e1;">Unit Rate</th>
                <th style="text-align: right; width: 120px; padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #334155; border-bottom: 2px solid #cbd5e1;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <div style="display: flex; justify-content: flex-end; margin-bottom: 22px;">
            <div style="width: 280px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px;">
              <div style="display: flex; justify-content: space-between; font-size: 13px; color: #475569; margin-bottom: 6px;">
                <span>Subtotal:</span>
                <span>${escapeHtml(subtotalStr)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 800; color: #0f172a; border-top: 2px solid #0f172a; padding-top: 8px; margin-top: 6px;">
                <span>Grand Total:</span>
                <span>${escapeHtml(grandTotalStr)}</span>
              </div>
            </div>
          </div>

          <div style="border-top: 1px dashed #cbd5e1; padding-top: 16px;">
            ${
              invoiceNotes
                ? `
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Notes</div>
                <div style="font-size: 12px; color: #475569; line-height: 1.5; margin-bottom: 12px;">${escapeHtml(invoiceNotes)}</div>
              `
                : ""
            }
            <div style="text-align: center; padding: 10px; background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 6px; font-size: 11px; color: #78716c;">
              Ethically Sourced • Certified Lab-Grown Diamonds • Lifetime Craftsmanship Guarantee
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 794
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pdfHeight;
      }

      const safeFilename = `Invoice-${String(invoiceNumber).replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
      pdf.save(safeFilename);
      if (notify) {
        notify("Invoice Downloaded", "Official invoice PDF downloaded successfully.");
      }
    } catch (err) {
      console.error("Failed to download invoice PDF:", err);
      if (notify) {
        notify("Download Failed", "Failed to download invoice PDF. Please try again.");
      }
    } finally {
      setDownloadingInvoice(false);
    }
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
            {isCancelled && cancelledAtDisplay ? ` · Cancelled: ${cancelledAtDisplay}` : ""}
          </p>
        </div>

        {/* Stepper Progress Bar (Hidden when order is cancelled) */}
        {!isCancelled ? (
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
        ) : (
          /* Order Cancellation Details Notice */
          <div
            style={{
              marginTop: "28px",
              backgroundColor: "#FFF8F8",
              border: "1px solid #F5C6CB",
              borderRadius: "6px",
              padding: "20px 24px"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#FEE2E2",
                  border: "1px solid #FECACA",
                  display: "grid",
                  placeItems: "center",
                  color: "#B91C1C",
                  flexShrink: 0
                }}
              >
                <AlertCircle size={18} strokeWidth={2.2} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "#991B1B",
                      margin: 0
                    }}
                  >
                    Order Cancelled
                  </h3>
                  {cancelledAtDisplay && (
                    <span style={{ fontSize: "0.78rem", color: "#B91C1C", fontWeight: 500 }}>
                      Cancelled on {cancelledAtDisplay}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: "0.85rem", color: "#7F1D1D", margin: 0, lineHeight: 1.5 }}>
                  {cancelReason
                    ? `Reason: "${cancelReason}"`
                    : "This commission has been cancelled. Courier dispatch and craftsmanship progress have ceased."}
                </p>

                {cancelledByDisplay && (
                  <p style={{ fontSize: "0.76rem", color: "#991B1B", margin: "6px 0 0 0", opacity: 0.85 }}>
                    Processed by: {cancelledByDisplay}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

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
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice}
              className="eyebrow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid var(--primary)",
                backgroundColor: downloadingInvoice ? "#839463" : "var(--primary)",
                color: "#ffffff",
                padding: "12px 24px",
                cursor: downloadingInvoice ? "not-allowed" : "pointer",
                borderRadius: "2px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 14px rgba(85, 104, 50, 0.2)",
                opacity: downloadingInvoice ? 0.85 : 1
              }}
              onMouseEnter={(e) => {
                if (!downloadingInvoice) {
                  e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                  e.currentTarget.style.borderColor = "var(--primary-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (!downloadingInvoice) {
                  e.currentTarget.style.backgroundColor = "var(--primary)";
                  e.currentTarget.style.borderColor = "var(--primary)";
                }
              }}
            >
              {downloadingInvoice ? (
                <>
                  <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Generating Invoice PDF...
                </>
              ) : (
                <>
                  <Download size={15} /> Download Official Invoice
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
