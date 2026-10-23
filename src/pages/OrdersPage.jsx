import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Download,
  X,
  Package,
  MapPin,
  Sparkles,
  Loader2,
  AlertCircle,
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
  User,
  ShoppingBag,
  Truck,
  CreditCard
} from "lucide-react";
import { useStore } from "../lib/store";
import { formatPhoneNumber } from "../lib/formatters";
import { StatusBadge } from "../components/StatusBadge";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ORDER_STEPS = ["Confirmed", "Processing", "Shipped", "Delivered"];

export default function OrdersPage() {
  const { format, getCustomerOrders, user } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

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

  const displayedOrders = activeTab === "active" ? active : activeTab === "completed" ? done : orders;

  return (
    <div className="container-luxury" style={{ maxWidth: "1340px", paddingTop: "40px", paddingBottom: "100px" }}>
      {/* Atelier Client Concierge Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
          paddingBottom: "26px",
          borderBottom: "1px solid #EDE8DE"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Concierge Crest */}
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "rgba(85, 104, 50, 0.08)",
              border: "1.5px solid rgba(85, 104, 50, 0.25)",
              color: "var(--primary)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(85, 104, 50, 0.08)"
            }}
          >
            <Package size={26} strokeWidth={1.6} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
              <span
                className="eyebrow"
                style={{
                  color: "var(--primary)",
                  letterSpacing: "0.2em",
                  fontSize: "0.7rem",
                  fontWeight: 700
                }}
              >
                MAISON PRIVÉE · CLIENT CONCIERGE
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 9px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(85, 104, 50, 0.1)",
                  color: "var(--primary)",
                  fontSize: "0.7rem",
                  fontWeight: 700
                }}
              >
                <Truck size={11} /> Live Courier Tracking
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                margin: 0,
                letterSpacing: "-0.01em",
                color: "var(--foreground)",
                fontWeight: 600
              }}
            >
              Orders &amp; Tracking
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.88rem", marginTop: "4px", margin: 0 }}>
              Follow the craftsmanship journey of your fine jewelry commissions, live courier delivery, and certified invoices.
            </p>
          </div>
        </div>

        {/* Action Button: Link to Profile */}
        <Link
          to="/profile"
          className="eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#FAF9F6",
            color: "var(--foreground)",
            border: "1px solid #EDE8DE",
            padding: "11px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.76rem",
            letterSpacing: "0.12em",
            textDecoration: "none",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--primary)";
            e.currentTarget.style.color = "var(--primary)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#EDE8DE";
            e.currentTarget.style.color = "var(--foreground)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <User size={15} />
          <span>Client Atelier</span>
        </Link>
      </div>

      {/* Commission Tabs Navigation */}
      {orders.length > 0 && (
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #EDE8DE",
            marginTop: "32px",
            marginBottom: "32px",
            gap: "8px"
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "28px",
              overflowX: "auto",
              scrollbarWidth: "none"
            }}
          >
            {[
              { id: "all", label: "All Commissions", icon: Package, count: orders.length },
              { id: "active", label: "Active In Progress", icon: Clock, count: active.length },
              { id: "completed", label: "Completed & Delivered", icon: CheckCircle2, count: done.length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="eyebrow"
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: isActive ? "2.5px solid var(--primary)" : "2.5px solid transparent",
                    padding: "0 4px 14px 4px",
                    color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "0.14em",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Icon size={14} style={{ color: isActive ? "var(--primary)" : "inherit" }} />
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "999px",
                      backgroundColor: isActive ? "rgba(85, 104, 50, 0.12)" : "#EDE8DE",
                      color: isActive ? "var(--primary)" : "var(--muted-foreground)"
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
            backgroundColor: "#ffffff",
            border: "1px solid #EDE8DE",
            borderRadius: "14px",
            boxShadow: "0 2px 14px rgba(0, 0, 0, 0.02)"
          }}
        >
          <div
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "50%",
              backgroundColor: "rgba(85, 104, 50, 0.08)",
              border: "1px solid rgba(85, 104, 50, 0.2)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 22px",
              color: "var(--primary)"
            }}
          >
            <Package size={34} strokeWidth={1.5} />
          </div>
          <span
            className="eyebrow"
            style={{ color: "var(--primary)", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "6px" }}
          >
            ATELIER COMMISSIONS
          </span>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--foreground)", margin: "0 0 10px 0", fontWeight: 600 }}>
            No Orders on Record
          </h3>
          <p style={{ fontSize: "0.92rem", color: "var(--muted-foreground)", maxWidth: "460px", margin: "0 auto 28px", lineHeight: 1.6 }}>
            {user
              ? "You have not placed any orders yet. Discover our latest ethically crafted fine jewelry collections and bespoke atelier pieces."
              : "Please sign in to view your orders, live courier tracking, and authenticated invoices."}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
            {user ? (
              <Link
                to="/collections"
                className="eyebrow"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 32px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.76rem",
                  letterSpacing: "0.14em",
                  boxShadow: "0 4px 16px rgba(85, 104, 50, 0.25)"
                }}
              >
                <span>Explore Collections</span>
                <ArrowRight size={15} />
              </Link>
            ) : (
              <Link
                to="/profile"
                className="eyebrow"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 32px",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.76rem",
                  letterSpacing: "0.14em",
                  boxShadow: "0 4px 16px rgba(85, 104, 50, 0.25)"
                }}
              >
                <span>Sign In to Account</span>
                <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>
      ) : displayedOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted-foreground)", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #EDE8DE" }}>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>No orders in this status category.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {displayedOrders.map((o) => (
            <OrderRow
              key={o._id || o.orderid || o.id}
              order={o}
              onSelect={() => setSelectedOrder(o)}
              format={format}
            />
          ))}
        </div>
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
  const [isHovered, setIsHovered] = useState(false);
  const orderNum = order.ordernumber || order.orderid || order.id;
  const orderItems = order.items || [];
  const status = order.orderstatus || order.status || "Confirmed";
  const dateFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })
    : (order.date || "Recent");

  const primaryItem = orderItems[0];
  const primaryItemName = primaryItem?.itemname || primaryItem?.name || "Fine Jewelry Piece";
  const primarySpecs = [primaryItem?.metalname, primaryItem?.diamondsize, primaryItem?.shapename].filter(Boolean).join(" · ");

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "24px",
        border: isHovered ? "1px solid #D8D1C5" : "1px solid #EDE8DE",
        backgroundColor: "#ffffff",
        padding: "22px 28px",
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: isHovered ? "0 12px 30px rgba(85, 104, 50, 0.08)" : "0 2px 10px rgba(0, 0, 0, 0.02)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: "1 1 360px", minWidth: 0 }}>
        {/* Product Preview Stage with Gold/Olive Borders */}
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {orderItems.slice(0, 3).map((it, idx) => {
            const imgSrc = it.image || getProduct(it.itemid || it.productId)?.image;
            return (
              <div
                key={idx}
                style={{
                  width: "66px",
                  height: "66px",
                  borderRadius: "12px",
                  border: "1.5px solid #EDE8DE",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  backgroundColor: "#FAF9F6",
                  marginLeft: idx === 0 ? "0" : "-20px",
                  overflow: "hidden",
                  zIndex: 3 - idx,
                  flexShrink: 0,
                  transition: "transform 0.2s ease"
                }}
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.nextSibling) {
                        e.currentTarget.nextSibling.style.display = "grid";
                      }
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: imgSrc ? "none" : "grid",
                    width: "100%",
                    height: "100%",
                    placeItems: "center",
                    backgroundColor: "#FAF9F6",
                    color: "var(--primary)"
                  }}
                >
                  <Sparkles size={20} strokeWidth={1.5} />
                </div>
              </div>
            );
          })}
          {orderItems.length > 3 && (
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                backgroundColor: "rgba(85, 104, 50, 0.1)",
                color: "var(--primary)",
                fontSize: "0.76rem",
                fontWeight: 700,
                display: "grid",
                placeItems: "center",
                marginLeft: "-14px",
                border: "2px solid #ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                zIndex: 0
              }}
            >
              +{orderItems.length - 3}
            </div>
          )}
        </div>

        {/* Order Details */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", fontWeight: 600, color: "var(--foreground)" }}>
              Order #{orderNum}
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "3px 9px",
                borderRadius: "999px",
                backgroundColor: "rgba(85, 104, 50, 0.1)",
                color: "var(--primary)"
              }}
            >
              {orderItems.length} {orderItems.length === 1 ? "Piece" : "Pieces"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--muted-foreground)", marginBottom: "5px" }}>
            <Calendar size={13} style={{ color: "var(--primary)" }} />
            <span>Commissioned on {dateFormatted}</span>
            {String(status || "").toLowerCase() === "cancelled" && (order.cancelledat || order.cancelreason) && (
              <span style={{ color: "#dc2626", fontWeight: 600, marginLeft: "6px" }}>
                · Cancelled
              </span>
            )}
          </div>

          {/* Primary Item Name & Specs Preview */}
          <div style={{ fontSize: "0.84rem", color: "var(--foreground)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            <span>{primaryItemName}</span>
            {primarySpecs && (
              <span style={{ color: "var(--muted-foreground)", fontWeight: 400, marginLeft: "6px" }}>
                ({primarySpecs})
              </span>
            )}
            {orderItems.length > 1 && (
              <span style={{ color: "var(--primary)", fontWeight: 600, marginLeft: "6px" }}>
                &amp; {orderItems.length - 1} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Price, StatusBadge, Action Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "22px", flexWrap: "wrap" }}>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted-foreground)", display: "block" }}>
            Total Value
          </span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", fontWeight: 700, color: "var(--foreground)" }}>
            {format(order.total)}
          </span>
        </div>

        <StatusBadge s={status} />

        <div
          className="eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            backgroundColor: isHovered ? "var(--primary)" : "rgba(85, 104, 50, 0.08)",
            color: isHovered ? "#ffffff" : "var(--primary)",
            border: isHovered ? "1px solid var(--primary)" : "1px solid rgba(85, 104, 50, 0.25)",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "0.74rem",
            letterSpacing: "0.1em",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: isHovered ? "translateX(2px)" : "none"
          }}
        >
          <span>View Dossier</span>
          <ArrowRight
            size={13}
            style={{
              transform: isHovered ? "translateX(3px)" : "none",
              transition: "transform 0.2s ease"
            }}
          />
        </div>
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
  const isDelivered =
    String(status || "").trim().toLowerCase() === "delivered" ||
    String(order.orderstatus || "").trim().toLowerCase() === "delivered" ||
    String(order.status || "").trim().toLowerCase() === "delivered";

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
    if (!order || downloadingInvoice || !isDelivered) return;
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
              ${customerPhone ? `<div style="font-size: 12px; color: #475569;">Phone: ${escapeHtml(formatPhoneNumber(customerPhone))}</div>` : ""}
              ${shippingAddressParts ? `<div style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.4;">${shippingAddressParts}</div>` : ""}
            </div>

            <div style="flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; background: #ffffff;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #044e39; font-weight: 700; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #f1f5f9;">
                Issued By
              </div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${escapeHtml(brandName)}</div>
              ${brandEmail ? `<div style="font-size: 12px; color: #475569;">Email: ${escapeHtml(brandEmail)}</div>` : ""}
              ${brandPhone ? `<div style="font-size: 12px; color: #475569;">Phone: ${escapeHtml(formatPhoneNumber(brandPhone))}</div>` : ""}
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
        backgroundColor: "rgba(18, 22, 14, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: "20px 16px",
        animation: "modalFadeIn 0.25s ease-out"
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .atelier-modal-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .atelier-modal-scroll::-webkit-scrollbar-track {
          background: #FAF9F6;
        }
        .atelier-modal-scroll::-webkit-scrollbar-thumb {
          background: #D8D1C5;
          border-radius: 999px;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "860px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ffffff",
          border: "1px solid #EDE8DE",
          borderRadius: "18px",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(85, 104, 50, 0.05)",
          animation: "modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Banner */}
        <div
          style={{
            background: "linear-gradient(180deg, #F9F7F3 0%, #FFFFFF 100%)",
            padding: "20px 28px 16px 28px",
            borderBottom: "1px solid #EDE8DE",
            position: "relative",
            flexShrink: 0
          }}
        >
          {/* Eyebrow & Status Badge Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "6px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(85, 104, 50, 0.1)",
                  color: "var(--primary)",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <Sparkles size={12} />
              </div>
              <span
                className="eyebrow"
                style={{
                  color: "var(--primary)",
                  letterSpacing: "0.2em",
                  fontSize: "0.7rem",
                  fontWeight: 700
                }}
              >
                MAISON PRIVÉE · ATELIER COMMISSION DOSSIER
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <StatusBadge s={status} />
              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  background: "#ffffff",
                  border: "1px solid #EDE8DE",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(85, 104, 50, 0.1)";
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.color = "var(--primary)";
                  e.currentTarget.style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#EDE8DE";
                  e.currentTarget.style.color = "var(--foreground)";
                  e.currentTarget.style.transform = "rotate(0deg)";
                }}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Heading */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.2rem",
                margin: 0,
                letterSpacing: "-0.01em",
                color: "var(--foreground)",
                fontWeight: 600
              }}
            >
              Order <span style={{ fontVariantNumeric: "lining-nums tabular-nums", color: "var(--primary)" }}>#{orderNum}</span>
            </h2>
            <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", fontWeight: 500 }}>
              {orderItems.length} {orderItems.length === 1 ? "Bespoke Creation" : "Bespoke Creations"}
            </span>
          </div>

          {/* Meta Info Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              flexWrap: "wrap",
              marginTop: "8px",
              fontSize: "0.82rem",
              color: "var(--muted-foreground)"
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={13} style={{ color: "var(--primary)" }} />
              <span>Commissioned on {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "long" }) : "Recently"}</span>
            </div>
            {order.paymentstatus && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} style={{ color: "var(--primary)" }} />
                <span>Payment: <strong style={{ color: "var(--foreground)" }}>{order.paymentstatus}</strong></span>
              </div>
            )}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: 600 }}>
              <Truck size={13} />
              <span>Fully Insured Direct Courier</span>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div
          className="atelier-modal-scroll"
          style={{
            padding: "20px 28px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          {/* Stepper Progress Bar (Hidden when order is cancelled) */}
          {!isCancelled ? (
            <div
              style={{
                padding: "20px 24px",
                backgroundColor: "#FAF9F6",
                borderRadius: "14px",
                border: "1px solid #EDE8DE"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <span
                  className="eyebrow"
                  style={{
                    color: "var(--primary)",
                    letterSpacing: "0.16em",
                    fontSize: "0.7rem",
                    fontWeight: 700
                  }}
                >
                  COURIER &amp; CRAFTSMANSHIP TIMELINE
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--primary)",
                    backgroundColor: "rgba(85, 104, 50, 0.1)",
                    padding: "3px 10px",
                    borderRadius: "999px"
                  }}
                >
                  Phase {currentStepIdx + 1} of {ORDER_STEPS.length}: {ORDER_STEPS[currentStepIdx]}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: `repeat(${ORDER_STEPS.length}, 1fr)`, position: "relative" }}>
                {/* Background Track line */}
                <div
                  style={{
                    position: "absolute",
                    top: "17px",
                    left: "12%",
                    right: "12%",
                    height: "2px",
                    backgroundColor: "#EDE8DE",
                    zIndex: 0
                  }}
                />
                {/* Active Track line */}
                <div
                  style={{
                    position: "absolute",
                    top: "17px",
                    left: "12%",
                    width: currentStepIdx === 0 ? "0%" : `${(currentStepIdx / (ORDER_STEPS.length - 1)) * 76}%`,
                    height: "2px",
                    backgroundColor: "var(--primary)",
                    zIndex: 0,
                    transition: "width 0.4s ease"
                  }}
                />

                {ORDER_STEPS.map((step, idx) => {
                  const isPassed = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const isCompletedOrCurrent = idx <= currentStepIdx;

                  const stepDescriptions = [
                    "Atelier Logged",
                    "Master Setting",
                    "Insured Transit",
                    "Hand Delivered"
                  ];

                  return (
                    <div key={step} style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 4px" }}>
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          border: "2px solid",
                          borderColor: isCompletedOrCurrent ? "var(--primary)" : "#D8D1C5",
                          backgroundColor: isCompletedOrCurrent ? "var(--primary)" : "#ffffff",
                          color: isCompletedOrCurrent ? "#ffffff" : "var(--muted-foreground)",
                          margin: "0 auto 8px",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          boxShadow: isCurrent
                            ? "0 0 0 5px rgba(85, 104, 50, 0.18)"
                            : isPassed
                            ? "0 2px 8px rgba(85, 104, 50, 0.25)"
                            : "none",
                          transition: "all 0.3s ease"
                        }}
                      >
                        {isPassed ? (
                          <Check size={16} strokeWidth={2.6} />
                        ) : isCurrent ? (
                          <Clock size={16} strokeWidth={2.4} />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: isCurrent ? 700 : isPassed ? 600 : 500,
                          color: isCompletedOrCurrent ? "var(--foreground)" : "var(--muted-foreground)",
                          letterSpacing: "0.01em"
                        }}
                      >
                        {step}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: isCurrent ? "var(--primary)" : "var(--muted-foreground)",
                          marginTop: "2px",
                          fontWeight: isCurrent ? 600 : 400
                        }}
                      >
                        {stepDescriptions[idx]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Order Cancellation Details Notice */
            <div
              style={{
                backgroundColor: "#FFF8F8",
                border: "1px solid #F5C6CB",
                borderRadius: "14px",
                padding: "20px 24px"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    backgroundColor: "#FEE2E2",
                    border: "1px solid #FECACA",
                    display: "grid",
                    placeItems: "center",
                    color: "#B91C1C",
                    flexShrink: 0
                  }}
                >
                  <AlertCircle size={20} strokeWidth={2.2} />
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
                      Commission Cancelled
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
          {shippingAddr ? (
            <div
              style={{
                padding: "18px 22px",
                borderRadius: "14px",
                backgroundColor: "#FAF9F6",
                border: "1px solid #EDE8DE"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(85, 104, 50, 0.1)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--primary)"
                    }}
                  >
                    <MapPin size={15} />
                  </div>
                  <span
                    className="eyebrow"
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "var(--foreground)"
                    }}
                  >
                    DELIVERY DESTINATION ({shippingAddr.title || "PRIMARY"})
                  </span>
                </div>
                <p style={{ fontSize: "0.88rem", color: "var(--foreground)", fontWeight: 600, margin: "0 0 4px 0" }}>
                  {shippingAddr.name || order.customername || "Valued Patron"}
                </p>
                <p style={{ color: "var(--muted-foreground)", margin: 0, lineHeight: 1.5, fontSize: "0.84rem" }}>
                  {[shippingAddr.address, shippingAddr.cityname, shippingAddr.statename, shippingAddr.countryname].filter(Boolean).join(", ")}
                  {shippingAddr.pincode ? ` - ${shippingAddr.pincode}` : ""}
                </p>
                {(order.customerphone || shippingAddr.phone) && (
                  <p style={{ color: "var(--muted-foreground)", margin: "8px 0 0 0", fontSize: "0.82rem" }}>
                    Contact: <strong style={{ color: "var(--foreground)" }}>{formatPhoneNumber(order.customerphone || shippingAddr.phone)}</strong>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: "18px 22px",
                borderRadius: "14px",
                backgroundColor: "#FAF9F6",
                border: "1px solid #EDE8DE"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <MapPin size={16} style={{ color: "var(--primary)" }} />
                <span className="eyebrow" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em" }}>
                  DELIVERY DESTINATION
                </span>
              </div>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.84rem", margin: 0 }}>
                Digital order confirmation or boutique atelier pickup.
              </p>
            </div>
          )}

          {/* Ordered Item List */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #EDE8DE",
              padding: "20px 24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #EDE8DE" }}>
              <span
                className="eyebrow"
                style={{
                  color: "var(--primary)",
                  letterSpacing: "0.16em",
                  fontSize: "0.72rem",
                  fontWeight: 700
                }}
              >
                COMMISSIONED CREATIONS ({orderItems.length})
              </span>
              <span style={{ fontSize: "0.76rem", color: "var(--muted-foreground)", fontWeight: 500 }}>
                {orderItems.reduce((acc, it) => acc + (it.qty || 1), 0)} Total {orderItems.reduce((acc, it) => acc + (it.qty || 1), 0) === 1 ? "Piece" : "Pieces"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {orderItems.map((it, idx) => {
                const imgSrc = it.image || getProduct(it.itemid || it.productId)?.image;
                const specsList = [
                  it.metalname && { label: "Metal", val: it.metalname },
                  it.diamondsize && { label: "Carat", val: it.diamondsize },
                  it.shapename && { label: "Shape", val: it.shapename },
                  it.clarityname && { label: "Clarity", val: it.clarityname },
                  it.stonename && { label: "Stone", val: it.stonename },
                  it.size && { label: "Size", val: it.size },
                  it.diamondcolor && { label: "Color", val: it.diamondcolor },
                  it.bandcolor && { label: "Band", val: it.bandcolor }
                ].filter(Boolean);

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "18px",
                      paddingBottom: idx < orderItems.length - 1 ? "16px" : "0",
                      borderBottom: idx < orderItems.length - 1 ? "1px solid #F4F1EA" : "none"
                    }}
                  >
                    {/* Image Frame */}
                    <div
                      style={{
                        width: "78px",
                        height: "78px",
                        borderRadius: "12px",
                        border: "1.5px solid #EDE8DE",
                        backgroundColor: "#FAF9F6",
                        overflow: "hidden",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
                      }}
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={it.itemname}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.nextSibling) {
                              e.currentTarget.nextSibling.style.display = "grid";
                            }
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          display: imgSrc ? "none" : "grid",
                          width: "100%",
                          height: "100%",
                          placeItems: "center",
                          color: "var(--primary)"
                        }}
                      >
                        <Sparkles size={24} strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                        <div>
                          <h4
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: "1.2rem",
                              fontWeight: 600,
                              margin: 0,
                              color: "var(--foreground)"
                            }}
                          >
                            {it.itemname || "Fine Jewelry Piece"}
                          </h4>
                          <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", marginTop: "3px" }}>
                            Quantity: <strong style={{ color: "var(--foreground)" }}>{it.qty || 1}</strong>
                            {it.qty > 1 && ` · ${formatPrice(it.price)} each`}
                          </div>
                        </div>

                        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: "1.25rem",
                              fontWeight: 700,
                              color: "var(--foreground)"
                            }}
                          >
                            {formatPrice(it.totalprice || (it.price * (it.qty || 1)))}
                          </span>
                        </div>
                      </div>

                      {/* Spec tags */}
                      {specsList.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                          {specsList.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 500,
                                padding: "3px 9px",
                                borderRadius: "6px",
                                backgroundColor: "#FAF9F6",
                                border: "1px solid #EDE8DE",
                                color: "#4A463F"
                              }}
                            >
                              <span style={{ color: "var(--muted-foreground)", marginRight: "4px" }}>{spec.label}:</span>
                              {spec.val}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bespoke instruction */}
                      {it.specialinstruction && (
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--primary)",
                            marginTop: "10px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "rgba(85, 104, 50, 0.08)",
                            border: "1px solid rgba(85, 104, 50, 0.2)",
                            padding: "4px 10px",
                            borderRadius: "6px"
                          }}
                        >
                          <Sparkles size={12} />
                          <span>Bespoke Engraving / Note: "{it.specialinstruction}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Total and Invoice Download Action */}
        <div
          style={{
            background: "#FAF9F6",
            padding: "16px 28px",
            borderTop: "1px solid #EDE8DE",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px",
            flexShrink: 0
          }}
        >
          <div>
            <span
              className="eyebrow"
              style={{
                fontSize: "0.68rem",
                color: "var(--muted-foreground)",
                letterSpacing: "0.14em",
                display: "block",
                marginBottom: "2px"
              }}
            >
              TOTAL COMMISSION INVESTMENT
            </span>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.1rem",
                fontWeight: 700,
                color: "var(--foreground)",
                letterSpacing: "-0.01em"
              }}
            >
              {formatPrice(order.total)}
            </span>
            <div style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", marginTop: "2px" }}>
              All taxes, duties &amp; complimentary armed courier delivery included
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            {isDelivered && (
              <button
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice}
                className="eyebrow"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  backgroundColor: downloadingInvoice ? "#839463" : "var(--primary)",
                  color: "#ffffff",
                  border: "none",
                  padding: "13px 26px",
                  cursor: downloadingInvoice ? "not-allowed" : "pointer",
                  borderRadius: "8px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  fontSize: "0.76rem",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 4px 16px rgba(85, 104, 50, 0.25)",
                  opacity: downloadingInvoice ? 0.85 : 1
                }}
                onMouseEnter={(e) => {
                  if (!downloadingInvoice) {
                    e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(85, 104, 50, 0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!downloadingInvoice) {
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(85, 104, 50, 0.25)";
                  }
                }}
              >
                {downloadingInvoice ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    <span>Generating Invoice PDF...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download Official Invoice</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
