import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  MapPin,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Home,
  Building,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Gift
} from "lucide-react";
import { Country, State, City } from "country-state-city";
import { useStore } from "../lib/store";
import { formatPhoneNumber } from "../lib/formatters";
import { CartLines } from "../components/CartLines";
import PayPalCheckoutModal from "../components/cart/PayPalCheckoutModal";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    subtotal,
    format,
    clearCart,
    showToast,
    user,
    getAddresses,
    addAddress,
    getProduct,
    storeCurrency
  } = useStore();

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(() => Boolean(user));
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressError, setAddressError] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paypalModalOpen, setPaypalModalOpen] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);

  // Modal State for adding new address
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("Home");
  const [customTitle, setCustomTitle] = useState("");
  const [addressText, setAddressText] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [modalErrors, setModalErrors] = useState({});

  const total = subtotal;

  // Countries from country-state-city
  const countries = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      isoCode: c.isoCode,
      name: c.name
    }));
  }, []);

  // States dependent on selectedCountry
  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry).map((s) => ({
      isoCode: s.isoCode,
      name: s.name
    }));
  }, [selectedCountry]);

  // Cities dependent on selectedCountry & selectedState
  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState).map((c) => ({
      name: c.name
    }));
  }, [selectedCountry, selectedState]);

  // Load customer addresses on user change
  useEffect(() => {
    let isMounted = true;
    if (!user) return;

    getAddresses()
      .then((list) => {
        if (!isMounted) return;
        const validList = Array.isArray(list) ? list : [];
        setAddresses(validList);

        // Auto-select: default address or first address
        setSelectedAddressId((prev) => {
          if (prev && validList.some((a) => a.addressid === prev)) {
            return prev;
          }
          const defaultAddr = validList.find((a) => a.isDefault);
          if (defaultAddr) return defaultAddr.addressid;
          if (validList.length > 0) return validList[0].addressid;
          return null;
        });
      })
      .catch((err) => {
        console.error("Failed to load customer addresses:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingAddresses(false);
      });

    return () => {
      isMounted = false;
    };
  }, [getAddresses, user]);

  const handleSelectAddress = (addrId) => {
    setSelectedAddressId(addrId);
    setAddressError("");
  };

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => a.addressid === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  const openAddModal = () => {
    setTitle("Home");
    setCustomTitle("");
    setAddressText("");
    setPostalCode("");
    const defaultCountry =
      Country.getAllCountries().find((c) => c.isoCode === "IN")?.isoCode ||
      countries[0]?.isoCode ||
      "";
    setSelectedCountry(defaultCountry);
    setSelectedState("");
    setSelectedCity("");
    setIsDefault(addresses.length === 0);
    setModalErrors({});
    setModalOpen(true);
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!addressText.trim()) newErrors.address = "Address is required";
    if (!postalCode.trim()) newErrors.postalCode = "Pincode is required";
    if (!selectedCountry) newErrors.country = "Country is required";
    if (!selectedState) newErrors.state = "State is required";
    if (!selectedCity.trim()) newErrors.city = "City is required";

    if (Object.keys(newErrors).length > 0) {
      setModalErrors(newErrors);
      return;
    }

    const countryObj = Country.getCountryByCode(selectedCountry);
    const stateObj = State.getStateByCodeAndCountry(selectedState, selectedCountry);
    const finalTitle = title === "Other" && customTitle.trim() ? customTitle.trim() : title;

    const payload = {
      title: finalTitle,
      address: addressText.trim(),
      pincode: postalCode.trim(),
      countryname: countryObj?.name || selectedCountry,
      countrycode: selectedCountry,
      statename: stateObj?.name || selectedState,
      statecode: selectedState,
      cityname: selectedCity.trim(),
      isDefault
    };

    setSubmittingAddress(true);
    const res = await addAddress(payload);
    setSubmittingAddress(false);

    if (res.success) {
      setModalOpen(false);
      const list = await getAddresses();
      const validList = Array.isArray(list) ? list : [];
      setAddresses(validList);

      if (res.address && res.address.addressid) {
        setSelectedAddressId(res.address.addressid);
      } else if (validList.length > 0) {
        setSelectedAddressId(validList[validList.length - 1].addressid);
      }
      setAddressError("");
    }
  };

  const handleProceedToCheckout = async () => {
    if (!user) {
      showToast("Please sign in to your account to proceed to checkout.", "error");
      navigate("/profile");
      return;
    }

    if (!addresses || addresses.length === 0) {
      setAddressError("Please add a delivery address to complete your order.");
      showToast("Delivery address required. Please add an address to continue.", "error");
      document.getElementById("delivery-address-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
      openAddModal();
      return;
    }

    if (!selectedAddressId) {
      setAddressError("Please select a delivery address before placing your order.");
      showToast("Required: Please select a delivery address before proceeding.", "error");
      document.getElementById("delivery-address-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const chosenAddress = addresses.find((a) => a.addressid === selectedAddressId);
    if (!chosenAddress) {
      setAddressError("Selected delivery address could not be found. Please select again.");
      return;
    }

    // Format all cart items with full details matching model
    const orderItems = cart.map((item) => {
      const p = getProduct(item.productId);
      const numericItemId = p?.rawId !== undefined && p?.rawId !== null
        ? Number(p.rawId)
        : (p?.itemid !== undefined && !isNaN(p?.itemid)
          ? Number(p.itemid)
          : (!isNaN(item.productId) ? Number(item.productId) : 1));
      return {
        itemid: numericItemId,
        productId: item.productId,
        itemname: p?.name || "Fine Jewelry Piece",
        image: p?.image || "",
        metalname: item.metal || "",
        stonename: item.stone || "",
        diamondsize: item.carat || "",
        shapename: item.shapename || item.shape || "",
        clarityname: item.clarityname || item.clarity || "",
        diamondcolor: item.diamondcolor || "",
        bandcolor: item.bandcolor || "",
        specialinstruction: item.specialinstruction || "",
        price: Number(item.price ?? p?.price ?? 0),
        qty: Number(item.qty || 1),
        totalprice: Number(item.price ?? p?.price ?? 0) * Number(item.qty || 1)
      };
    });

    setSubmittingOrder(false);
    setPendingOrderData({
      items: orderItems,
      shippingaddress: chosenAddress,
      subtotal,
      total,
      currencydetails: storeCurrency,
      currency: storeCurrency?.currency || "USD"
    });
    setPaypalModalOpen(true);
  };

  const handlePaymentSuccess = (confirmedOrderData) => {
    setPaypalModalOpen(false);
    setConfirmedOrder(confirmedOrderData);
    clearCart();
    showToast(
      `Order #${confirmedOrderData.ordernumber || confirmedOrderData.orderNumber} placed successfully! Thank you for your purchase.`,
      "success"
    );
  };

  const handlePaymentError = (errMsg) => {
    showToast(errMsg || "Payment was not completed. No order was placed.", "error");
  };

  // If order was successfully placed, display the luxurious confirmation view
  if (confirmedOrder) {
    const orderShippingAddr = confirmedOrder.shippingaddress || confirmedOrder.shippingAddress;
    const orderNum = confirmedOrder.ordernumber || confirmedOrder.orderNumber;
    const orderItemsList = confirmedOrder.items || [];
    const orderItemCount = confirmedOrder.totalitems || confirmedOrder.totalItems || orderItemsList.length;

    return (
      <div className="container-luxury" style={{ maxWidth: "780px", padding: "60px 20px 100px", margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            padding: "48px 32px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.04)"
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-soft)",
              color: "var(--primary)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 20px"
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <p className="eyebrow" style={{ color: "var(--primary)", marginBottom: "8px" }}>
            Payment Confirmed · Order Stored in Database
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 4vw, 3rem)", margin: 0 }}>
            Thank You for Your Order
          </h1>

          <p
            style={{
              marginTop: "14px",
              fontSize: "0.95rem",
              color: "var(--muted-foreground)",
              maxWidth: "520px",
              margin: "14px auto 0"
            }}
          >
            Your order has been recorded in the database and registered with our fine atelier for shipment.
          </p>

          <div
            style={{
              marginTop: "26px",
              display: "inline-block",
              backgroundColor: "var(--secondary)",
              padding: "12px 28px",
              borderRadius: "3px",
              border: "1px solid var(--border)"
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Order Reference Number
            </span>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2px" }}>
              {orderNum}
            </div>
          </div>

          {/* Delivery & Order Details Summary */}
          <div
            style={{
              marginTop: "36px",
              textAlign: "left",
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "3px",
              padding: "24px"
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.25rem",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Truck size={18} style={{ color: "var(--primary)" }} /> Shipping & Delivery Details
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                fontSize: "0.88rem"
              }}
            >
              <div>
                <span style={{ color: "var(--muted-foreground)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Delivering To
                </span>
                <p style={{ fontWeight: 600, marginTop: "4px" }}>
                  {orderShippingAddr?.title} ({confirmedOrder.customername || confirmedOrder.customerName || user?.fullname || "Customer"})
                </p>
                <p style={{ color: "var(--muted-foreground)", marginTop: "2px", lineHeight: 1.5 }}>
                  {orderShippingAddr?.address}
                  <br />
                  {orderShippingAddr?.cityname}, {orderShippingAddr?.statename} - {orderShippingAddr?.pincode}
                  <br />
                  {orderShippingAddr?.countryname}
                </p>
                {(orderShippingAddr?.phone || confirmedOrder.customerphone || user?.phone) && (
                  <p style={{ color: "var(--muted-foreground)", marginTop: "6px", fontSize: "0.84rem" }}>
                    Contact: <strong style={{ color: "var(--foreground)" }}>{formatPhoneNumber(orderShippingAddr?.phone || confirmedOrder.customerphone || user?.phone)}</strong>
                  </p>
                )}
              </div>

              <div>
                <span style={{ color: "var(--muted-foreground)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Summary & Status
                </span>
                <p style={{ fontWeight: 600, marginTop: "4px" }}>
                  {orderItemCount} {orderItemCount === 1 ? "Item" : "Items"} · {format(confirmedOrder.total)}
                </p>
                <p style={{ color: "var(--muted-foreground)", marginTop: "2px" }}>
                  Order Status: <strong style={{ color: "var(--primary)" }}>{confirmedOrder.orderstatus || confirmedOrder.orderStatus}</strong>
                </p>
                <p style={{ color: "var(--muted-foreground)", marginTop: "2px" }}>
                  Payment: <strong style={{ color: "var(--primary)" }}>{confirmedOrder.paymentstatus || confirmedOrder.paymentStatus}</strong> via {confirmedOrder.paymentmethod || confirmedOrder.paymentMethod}
                </p>
              </div>
            </div>

            {/* Item Thumbnails Preview */}
            {orderItemsList.length > 0 && (
              <div style={{ marginTop: "24px", borderTop: "1px solid var(--border)", paddingTop: "18px" }}>
                <h4 style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)", marginBottom: "12px" }}>
                  Ordered Items ({orderItemsList.length})
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {orderItemsList.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", fontSize: "0.88rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.itemname || item.name}
                            style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "2px", border: "1px solid var(--border)" }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.itemname || item.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                            {[item.metalname || item.metal, item.stonename || item.stone, item.diamondsize || item.carat, item.size ? `Size ${item.size}` : null].filter(Boolean).join(" · ")}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 600 }}>{format(item.totalprice || item.totalPrice || item.price * item.qty)}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Qty: {item.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "32px", display: "flex", gap: "14px", justifyContent: "center" }}>
            <Link
              to="/collections"
              className="eyebrow"
              style={{
                display: "inline-block",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                padding: "14px 32px",
                borderRadius: "2px"
              }}
            >
              Continue Browsing Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="container-luxury" style={{ maxWidth: "780px", padding: "100px 20px 140px", textAlign: "center" }}>
        <div
          style={{
            width: "84px",
            height: "84px",
            borderRadius: "50%",
            backgroundColor: "rgba(85, 104, 50, 0.08)",
            border: "1px solid rgba(85, 104, 50, 0.16)",
            color: "var(--primary)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 24px"
          }}
        >
          <ShoppingBag size={40} strokeWidth={1.4} />
        </div>
        <span
          className="eyebrow"
          style={{ color: "var(--primary)", letterSpacing: "0.22em", fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "8px" }}
        >
          HAUTE JOAILLERIE ATELIER
        </span>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.4rem, 4.5vw, 3.4rem)",
            margin: "0 0 16px",
            fontWeight: 600,
            color: "var(--foreground)"
          }}
        >
          Your Shopping Bag is Empty
        </h1>
        <p
          style={{
            fontSize: "0.98rem",
            color: "var(--muted-foreground)",
            maxWidth: "500px",
            margin: "0 auto 36px",
            lineHeight: 1.6
          }}
        >
          Discover timeless heirloom pieces handcrafted with certified diamonds, designed to be cherished for generations.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/collections"
            className="eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              padding: "15px 34px",
              borderRadius: "8px",
              boxShadow: "0 6px 20px rgba(85, 104, 50, 0.28)",
              transition: "all 0.2s ease"
            }}
          >
            <span>Explore Fine Collections</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const totalItemCount = cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);

  return (
    <div className="container-luxury" style={{ maxWidth: "1340px", paddingTop: "36px", paddingBottom: "110px" }}>
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.8rem",
          color: "var(--muted-foreground)",
          marginBottom: "18px"
        }}
      >
        <Link to="/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>
          Home
        </Link>
        <span>/</span>
        <Link to="/collections" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>
          Collections
        </Link>
        <span>/</span>
        <span style={{ color: "var(--foreground)", fontWeight: 600 }}>Shopping Bag</span>
      </nav>

      {/* Header Row: Title & Flow Steps */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "20px",
          paddingBottom: "22px",
          borderBottom: "1px solid #EDE8DE",
          marginBottom: "28px"
        }}
      >
        <div>
          <span
            className="eyebrow"
            style={{
              color: "var(--primary)",
              letterSpacing: "0.2em",
              fontSize: "0.7rem",
              fontWeight: 700,
              display: "block",
              marginBottom: "4px"
            }}
          >
            ATELIER SHOPPING EXPERIENCE
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                margin: 0,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "var(--foreground)"
              }}
            >
              Shopping Bag
            </h1>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                padding: "3px 11px",
                borderRadius: "999px",
                backgroundColor: "rgba(85, 104, 50, 0.1)",
                color: "var(--primary)",
                letterSpacing: "0.02em"
              }}
            >
              {totalItemCount} {totalItemCount === 1 ? "Creation" : "Creations"}
            </span>
          </div>
        </div>

        {/* Checkout Flow Step Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.78rem",
            backgroundColor: "#FAF9F6",
            padding: "8px 18px",
            borderRadius: "999px",
            border: "1px solid #EDE8DE"
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: 700 }}>
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontSize: "0.68rem",
                display: "grid",
                placeItems: "center"
              }}
            >
              1
            </span>
            Bag Review
          </span>
          <span style={{ color: "#D1C9BC" }}>—</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: selectedAddress ? "var(--primary)" : "var(--foreground)",
              fontWeight: selectedAddress ? 700 : 500
            }}
          >
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: selectedAddress ? "var(--primary)" : "#EAE5DC",
                color: selectedAddress ? "#ffffff" : "var(--foreground)",
                fontSize: "0.68rem",
                display: "grid",
                placeItems: "center"
              }}
            >
              2
            </span>
            Delivery Address
          </span>
          <span style={{ color: "#D1C9BC" }}>—</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted-foreground)" }}>
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#EAE5DC",
                color: "var(--muted-foreground)",
                fontSize: "0.68rem",
                display: "grid",
                placeItems: "center"
              }}
            >
              3
            </span>
            Payment
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="cart-checkout-layout">
        {/* Left Column: Cart Items Card & Delivery Address Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {/* Card 1: Selected Line Items */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #EDE8DE",
              borderRadius: "10px",
              padding: "24px 28px",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)"
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "16px",
                borderBottom: "1px solid #F0EDE6",
                marginBottom: "8px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ShoppingBag size={18} style={{ color: "var(--primary)" }} />
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.3rem",
                    margin: 0,
                    fontWeight: 600,
                    color: "var(--foreground)"
                  }}
                >
                  Selected Creations ({totalItemCount})
                </h2>
              </div>
              <Link
                to="/collections"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.8rem",
                  color: "var(--primary)",
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={14} />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Cart Item Lines */}
            <CartLines />

            {/* Complimentary Gift Packaging Perk Strip */}
            <div
              style={{
                marginTop: "20px",
                padding: "14px 18px",
                backgroundColor: "rgba(85, 104, 50, 0.05)",
                border: "1px solid rgba(85, 104, 50, 0.12)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px"
              }}
            >
              <Gift size={20} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--foreground)" }}>Complimentary Signature Velvet Packaging Included</strong>
                <p style={{ margin: "2px 0 0", color: "var(--muted-foreground)" }}>
                  Each fine jewelry creation is presented in our handcrafted velvet gift box, tied with ribbon and accompanied by official certification.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Delivery Address Selection Section */}
          <section
            id="delivery-address-section"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #EDE8DE",
              borderRadius: "10px",
              padding: "24px 28px",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                paddingBottom: "16px",
                borderBottom: "1px solid #F0EDE6",
                marginBottom: "20px"
              }}
            >
              <div>
                <span
                  className="eyebrow"
                  style={{
                    color: "var(--primary)",
                    letterSpacing: "0.18em",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "3px"
                  }}
                >
                  STEP 2 OF 3
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <MapPin size={20} style={{ color: "var(--primary)" }} />
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", margin: 0, fontWeight: 600 }}>
                    Shipping & Delivery Address
                  </h2>
                </div>
                <p style={{ fontSize: "0.84rem", color: "var(--muted-foreground)", marginTop: "4px", marginBottom: 0 }}>
                  Select or add a destination for fully insured armoured courier delivery.
                </p>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="eyebrow"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "rgba(85, 104, 50, 0.08)",
                    color: "var(--primary)",
                    border: "1px solid rgba(85, 104, 50, 0.25)",
                    padding: "9px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.74rem",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(85, 104, 50, 0.08)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                >
                  <Plus size={15} /> Add New Address
                </button>
              )}
            </div>

            {/* Error Message if Checkout was attempted without address */}
            {addressError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#fff5f5",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  marginBottom: "20px",
                  fontSize: "0.85rem"
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>{addressError}</span>
              </div>
            )}

            {/* If user is not logged in */}
            {!user ? (
              <div
                style={{
                  backgroundColor: "#FAF9F6",
                  border: "1px dashed #EDE8DE",
                  padding: "36px 24px",
                  textAlign: "center",
                  borderRadius: "8px"
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(85, 104, 50, 0.08)",
                    color: "var(--primary)",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 14px"
                  }}
                >
                  <MapPin size={26} />
                </div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", margin: "0 0 6px", fontWeight: 600 }}>
                  Sign in to Select Delivery Address
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", maxWidth: "440px", margin: "0 auto 20px", lineHeight: 1.5 }}>
                  Please sign in to access your saved addresses or add a new shipping destination before finalizing your fine jewelry order.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="eyebrow"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "var(--primary)",
                    color: "#ffffff",
                    padding: "13px 28px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 14px rgba(85, 104, 50, 0.25)"
                  }}
                >
                  <span>Sign In to Continue</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : loadingAddresses ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--muted-foreground)", fontSize: "0.88rem" }}>
                Loading saved delivery addresses...
              </div>
            ) : addresses.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FAF9F6",
                  border: "1px dashed #EDE8DE",
                  padding: "36px 24px",
                  textAlign: "center",
                  borderRadius: "8px"
                }}
              >
                <MapPin size={34} style={{ color: "var(--muted-foreground)", margin: "0 auto 12px", display: "block" }} />
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", marginBottom: "6px", fontWeight: 600 }}>
                  No Saved Delivery Address
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", maxWidth: "420px", margin: "0 auto 20px" }}>
                  A verified shipping address is required for armoured courier delivery. Add your address to proceed.
                </p>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="eyebrow"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "var(--primary)",
                    color: "#ffffff",
                    padding: "13px 26px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 14px rgba(85, 104, 50, 0.25)"
                  }}
                >
                  <Plus size={16} /> Add Delivery Address
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px"
                }}
              >
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.addressid;
                  const isDef = Boolean(addr.isDefault);

                  return (
                    <div
                      key={addr.addressid}
                      onClick={() => handleSelectAddress(addr.addressid)}
                      style={{
                        border: isSelected ? "2px solid var(--primary)" : "1px solid #EDE8DE",
                        backgroundColor: isSelected ? "rgba(85, 104, 50, 0.05)" : "#ffffff",
                        padding: "18px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        position: "relative",
                        transition: "all 0.2s ease",
                        boxShadow: isSelected ? "0 4px 18px rgba(85, 104, 50, 0.12)" : "0 2px 8px rgba(0,0,0,0.02)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        {/* Header: Radio check + Title + Default badge */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {isSelected ? (
                              <CheckCircle2 size={20} style={{ color: "var(--primary)", flexShrink: 0 }} />
                            ) : (
                              <Circle size={20} style={{ color: "#C8C2B6", flexShrink: 0 }} />
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              {addr.title === "Home" && <Home size={15} style={{ color: "var(--primary)" }} />}
                              {addr.title === "Office" && <Building size={15} style={{ color: "var(--primary)" }} />}
                              {!["Home", "Office"].includes(addr.title) && (
                                <MapPin size={15} style={{ color: "var(--primary)" }} />
                              )}
                              <span style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--foreground)" }}>
                                {addr.title || "Address"}
                              </span>
                            </div>
                          </div>

                          {isDef && (
                            <span
                              className="eyebrow"
                              style={{
                                backgroundColor: "rgba(85, 104, 50, 0.1)",
                                color: "var(--primary)",
                                padding: "2px 8px",
                                borderRadius: "999px",
                                fontSize: "0.62rem",
                                fontWeight: 700
                              }}
                            >
                              Default
                            </span>
                          )}
                        </div>

                        {/* Address Details */}
                        <p
                          style={{
                            fontSize: "0.85rem",
                            lineHeight: 1.5,
                            color: "var(--foreground)",
                            marginBottom: "4px",
                            whiteSpace: "pre-line",
                            paddingLeft: "30px"
                          }}
                        >
                          {addr.address}
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", paddingLeft: "30px", margin: "2px 0 0" }}>
                          {addr.cityname}, {addr.statename} {addr.pincode ? `· ${addr.pincode}` : ""}
                        </p>
                        <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", paddingLeft: "30px", marginTop: "2px", marginBottom: "4px" }}>
                          {addr.countryname}
                        </p>
                        {addr.phone && (
                          <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", paddingLeft: "30px", marginTop: "4px" }}>
                            Contact: <strong style={{ color: "var(--foreground)" }}>{formatPhoneNumber(addr.phone)}</strong>
                          </p>
                        )}
                      </div>

                      {/* Bottom Selection Indicator */}
                      <div
                        style={{
                          marginTop: "14px",
                          paddingLeft: "30px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        {isSelected ? (
                          <span
                            style={{
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              color: "var(--primary)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            ✓ Selected for delivery
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "0.74rem",
                              color: "var(--muted-foreground)",
                              opacity: 0.8
                            }}
                          >
                            Click to select
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <aside
          style={{
            border: "1px solid #EDE8DE",
            backgroundColor: "#FAF9F6",
            padding: "26px 26px 28px",
            boxShadow: "0 10px 32px rgba(0,0,0,0.04)",
            borderRadius: "10px",
            position: "sticky",
            top: "100px",
            boxSizing: "border-box"
          }}
        >
          <span
            className="eyebrow"
            style={{
              color: "var(--primary)",
              letterSpacing: "0.18em",
              fontSize: "0.68rem",
              fontWeight: 700,
              display: "block",
              marginBottom: "4px"
            }}
          >
            ATELIER CHECKOUT
          </span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.65rem", fontWeight: 600, margin: 0, color: "var(--foreground)" }}>
            Order Summary
          </h2>

          <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.88rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted-foreground)" }}>Items Subtotal ({totalItemCount} {totalItemCount === 1 ? "piece" : "pieces"})</span>
              <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{format(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted-foreground)" }}>Insured Armoured Transit</span>
              <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.78rem" }}>COMPLIMENTARY</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted-foreground)" }}>Atelier Velvet Presentation Box</span>
              <span style={{ color: "var(--foreground)", fontWeight: 600, fontSize: "0.78rem" }}>INCLUDED</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted-foreground)" }}>Lifetime Authenticity Certificate</span>
              <span style={{ color: "var(--foreground)", fontWeight: 600, fontSize: "0.78rem" }}>INCLUDED</span>
            </div>
          </div>

          {/* Total Price Row */}
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #EDE8DE",
              paddingTop: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline"
            }}
          >
            <div>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 600, color: "var(--foreground)", display: "block" }}>
                Total
              </span>
              <span style={{ fontSize: "0.74rem", color: "var(--muted-foreground)" }}>
                All taxes &amp; insurance included
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.85rem", color: "var(--primary)", fontWeight: 700 }}>
              {format(total)}
            </span>
          </div>

          {/* Selected Delivery Address Status Box */}
          <div style={{ marginTop: "20px" }}>
            {selectedAddress ? (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(85, 104, 50, 0.08)",
                  border: "1px solid rgba(85, 104, 50, 0.2)",
                  fontSize: "0.82rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={16} /> Delivering to: {selectedAddress.title}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("delivery-address-section")?.scrollIntoView({ behavior: "smooth" })
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      textDecoration: "underline",
                      fontSize: "0.74rem",
                      cursor: "pointer",
                      fontWeight: 700
                    }}
                  >
                    Change
                  </button>
                </div>
                <p
                  style={{
                    color: "var(--foreground)",
                    fontSize: "0.78rem",
                    margin: 0,
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {selectedAddress.address}, {selectedAddress.cityname} - {selectedAddress.pincode}
                </p>
              </div>
            ) : (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  fontSize: "0.82rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#92400E" }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "2px", color: "#D97706" }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>Address Selection Required</div>
                    <div style={{ fontSize: "0.76rem", marginTop: "2px", color: "#B45309", lineHeight: 1.4 }}>
                      Please select a delivery address below before placing your order.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!user) {
                          navigate("/profile");
                        } else if (addresses.length === 0) {
                          openAddModal();
                        } else {
                          document.getElementById("delivery-address-section")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      style={{
                        marginTop: "8px",
                        background: "#92400E",
                        color: "#ffffff",
                        border: "none",
                        padding: "5px 12px",
                        borderRadius: "4px",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {!user ? "Sign In Now" : addresses.length === 0 ? "+ Add Address" : "Select Address Below ↓"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checkout CTA Button */}
          <button
            onClick={handleProceedToCheckout}
            disabled={submittingOrder}
            className="eyebrow"
            style={{
              width: "100%",
              marginTop: "20px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: submittingOrder ? "not-allowed" : "pointer",
              opacity: submittingOrder ? 0.75 : 1,
              letterSpacing: "0.14em",
              fontWeight: 700,
              fontSize: "0.8rem",
              boxShadow: "0 6px 22px rgba(85, 104, 50, 0.28)",
              transition: "all 0.25s ease"
            }}
            onMouseEnter={(e) => {
              if (!submittingOrder) {
                e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 26px rgba(85, 104, 50, 0.35)";
              }
            }}
            onMouseLeave={(e) => {
              if (!submittingOrder) {
                e.currentTarget.style.backgroundColor = "var(--primary)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 22px rgba(85, 104, 50, 0.28)";
              }
            }}
          >
            <Lock size={15} />
            <span>{submittingOrder ? "Processing Order..." : "Proceed to Secure Checkout"}</span>
            <ArrowRight size={15} />
          </button>

          {/* Payment Badges */}
          <div style={{ marginTop: "18px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px" }}>
            {["PayPal", "Visa", "Mastercard", "AMEX", "Apple Pay"].map((p) => (
              <span
                key={p}
                style={{
                  border: "1px solid #E5DFD3",
                  backgroundColor: "#ffffff",
                  borderRadius: "4px",
                  padding: "3px 8px",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  color: "var(--foreground)"
                }}
              >
                {p}
              </span>
            ))}
          </div>

          {/* Micro Trust Row */}
          <div
            style={{
              marginTop: "16px",
              paddingTop: "14px",
              borderTop: "1px dashed #EDE8DE",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "0.72rem",
              color: "var(--muted-foreground)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <span>256-Bit SSL Encrypted &amp; PCI-DSS Compliant</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <span>Lifetime Authenticity &amp; Gemological Warranty</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Truck size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <span>100% Insured Armoured Transit to Your Doorstep</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Add New Address Modal */}
      {modalOpen && (
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
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "92vh",
              overflowY: "auto",
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              padding: "32px",
              position: "relative",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              borderRadius: "4px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close"
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

            <p className="eyebrow" style={{ color: "var(--primary)" }}>
              Shipping Details
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", marginTop: "4px", marginBottom: "20px" }}>
              Add Delivery Address
            </h2>

            <form onSubmit={handleSaveNewAddress} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Title / Tag Selection */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px" }}>
                  Address Type
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["Home", "Office", "Other"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTitle(t)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        fontSize: "0.85rem",
                        borderRadius: "2px",
                        border: title === t ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                        backgroundColor: title === t ? "var(--primary-soft)" : "transparent",
                        color: title === t ? "var(--primary)" : "var(--foreground)",
                        fontWeight: title === t ? 600 : 400,
                        cursor: "pointer"
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {title === "Other" && (
                  <input
                    type="text"
                    placeholder="e.g. Vacation Villa, Parents' House"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      padding: "10px 14px",
                      border: "1px solid var(--border)",
                      borderRadius: "2px",
                      fontSize: "0.88rem",
                      backgroundColor: "var(--card)"
                    }}
                  />
                )}
              </div>

              {/* Street Address */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px" }}>
                  Street Address *
                </label>
                <textarea
                  rows={3}
                  placeholder="Flat / House No., Building Name, Street / Locality"
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: modalErrors.address ? "1px solid #ef4444" : "1px solid var(--border)",
                    borderRadius: "2px",
                    fontSize: "0.88rem",
                    backgroundColor: "var(--card)",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                />
                {modalErrors.address && (
                  <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "4px" }}>
                    {modalErrors.address}
                  </p>
                )}
              </div>

              {/* Country & State */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px" }}>
                    Country *
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedState("");
                      setSelectedCity("");
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: modalErrors.country ? "1px solid #ef4444" : "1px solid var(--border)",
                      borderRadius: "2px",
                      fontSize: "0.88rem",
                      backgroundColor: "var(--card)"
                    }}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {modalErrors.country && (
                    <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "4px" }}>
                      {modalErrors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px" }}>
                    State / Region *
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity("");
                    }}
                    disabled={!selectedCountry}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: modalErrors.state ? "1px solid #ef4444" : "1px solid var(--border)",
                      borderRadius: "2px",
                      fontSize: "0.88rem",
                      backgroundColor: "var(--card)"
                    }}
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {modalErrors.state && (
                    <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "4px" }}>
                      {modalErrors.state}
                    </p>
                  )}
                </div>
              </div>

              {/* City & Pincode */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px" }}>
                    City *
                  </label>
                  {cities.length > 0 ? (
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: modalErrors.city ? "1px solid #ef4444" : "1px solid var(--border)",
                        borderRadius: "2px",
                        fontSize: "0.88rem",
                        backgroundColor: "var(--card)"
                      }}
                    >
                      <option value="">Select City</option>
                      {cities.map((ci) => (
                        <option key={ci.name} value={ci.name}>
                          {ci.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: modalErrors.city ? "1px solid #ef4444" : "1px solid var(--border)",
                        borderRadius: "2px",
                        fontSize: "0.88rem",
                        backgroundColor: "var(--card)"
                      }}
                    />
                  )}
                  {modalErrors.city && (
                    <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "4px" }}>
                      {modalErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px" }}>
                    Postal / PIN Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 395006"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: modalErrors.postalCode ? "1px solid #ef4444" : "1px solid var(--border)",
                      borderRadius: "2px",
                      fontSize: "0.88rem",
                      backgroundColor: "var(--card)"
                    }}
                  />
                  {modalErrors.postalCode && (
                    <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "4px" }}>
                      {modalErrors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Set as Default Checkbox */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  marginTop: "4px"
                }}
              >
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  style={{ accentColor: "var(--primary)" }}
                />
                <span>Set as primary default address</span>
              </label>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "1px solid var(--border)",
                    backgroundColor: "transparent",
                    color: "var(--foreground)",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    borderRadius: "2px"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAddress}
                  className="eyebrow"
                  style={{
                    flex: 2,
                    padding: "12px",
                    border: "none",
                    backgroundColor: "var(--primary)",
                    color: "#ffffff",
                    cursor: submittingAddress ? "not-allowed" : "pointer",
                    borderRadius: "2px",
                    opacity: submittingAddress ? 0.7 : 1
                  }}
                >
                  {submittingAddress ? "Saving..." : "Save & Select Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PayPal Checkout Gateway Modal */}
      <PayPalCheckoutModal
        isOpen={paypalModalOpen}
        onClose={() => setPaypalModalOpen(false)}
        orderData={pendingOrderData}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}
