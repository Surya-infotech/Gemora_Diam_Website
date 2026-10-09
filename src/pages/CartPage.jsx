import { useState, useEffect, useCallback, useMemo } from "react";
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
  Truck,
  ShieldCheck
} from "lucide-react";
import { Country, State, City } from "country-state-city";
import { useStore } from "../lib/store";
import { CartLines } from "../components/CartLines";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, subtotal, format, clearCart, showToast, user, getAddresses, addAddress } = useStore();

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressError, setAddressError] = useState("");

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

  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 35;
  const total = subtotal + shipping;

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

  // Load customer addresses
  const loadAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setSelectedAddressId(null);
      return;
    }
    setLoadingAddresses(true);
    try {
      const list = await getAddresses();
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
    } catch (err) {
      console.error("Failed to load customer addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  }, [getAddresses, user]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

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

  const handleProceedToCheckout = () => {
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

    const chosen = addresses.find((a) => a.addressid === selectedAddressId);
    showToast(
      `Order placed successfully! Delivering to ${chosen?.title || "your selected address"}.`,
      "success"
    );
    clearCart();
  };

  if (!cart.length) {
    return (
      <div className="container-luxury" style={{ maxWidth: "600px", padding: "120px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 3.6rem)" }}>
          Your bag is empty
        </h1>
        <p style={{ marginTop: "16px", fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
          Discover timeless heirloom pieces made to be treasured across generations.
        </p>
        <Link
          to="/shop"
          className="eyebrow"
          style={{
            marginTop: "36px",
            display: "inline-block",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            padding: "16px 36px"
          }}
        >
          Shop the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxury" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 3.8rem)" }}>
        Shopping Bag
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "60px",
          marginTop: "40px",
          alignItems: "start"
        }}
      >
        {/* Left Column: Cart Items & Saved Delivery Addresses */}
        <div style={{ flex: 1 }}>
          {/* Cart Item Lines */}
          <CartLines />

          {/* Delivery Address Selection Section */}
          <section
            id="delivery-address-section"
            style={{
              marginTop: "50px",
              borderTop: "1px solid var(--border)",
              paddingTop: "36px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "20px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <MapPin size={22} style={{ color: "var(--primary)" }} />
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", margin: 0 }}>
                    Shipping & Delivery Address
                  </h2>
                </div>
                <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginTop: "4px" }}>
                  Select an address for insured courier delivery of your order.
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
                    backgroundColor: "var(--primary-soft)",
                    color: "var(--primary)",
                    border: "1px solid var(--primary)",
                    padding: "10px 18px",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary-soft)";
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
                  padding: "14px 18px",
                  borderRadius: "3px",
                  marginBottom: "20px",
                  fontSize: "0.88rem"
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 500 }}>{addressError}</span>
              </div>
            )}

            {/* If user is not logged in */}
            {!user ? (
              <div
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px dashed var(--border)",
                  padding: "36px",
                  textAlign: "center",
                  borderRadius: "4px"
                }}
              >
                <MapPin size={32} style={{ color: "var(--muted-foreground)", margin: "0 auto 12px", display: "block" }} />
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", marginBottom: "6px" }}>
                  Sign in to Select Delivery Address
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", maxWidth: "420px", margin: "0 auto 20px" }}>
                  Please sign in to view your saved addresses or add a new shipping address before placing your order.
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
                    padding: "12px 28px",
                    borderRadius: "2px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Sign In to Continue <ArrowRight size={14} />
                </button>
              </div>
            ) : loadingAddresses ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--muted-foreground)" }}>
                Loading saved addresses...
              </div>
            ) : addresses.length === 0 ? (
              <div
                style={{
                  backgroundColor: "var(--card)",
                  border: "1px dashed var(--border)",
                  padding: "40px 24px",
                  textAlign: "center",
                  borderRadius: "4px"
                }}
              >
                <MapPin size={34} style={{ color: "var(--muted-foreground)", margin: "0 auto 12px", display: "block" }} />
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", marginBottom: "6px" }}>
                  No Saved Delivery Address
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", maxWidth: "420px", margin: "0 auto 20px" }}>
                  You must have a delivery address selected before processing the order. Add your address to proceed.
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
                    padding: "12px 26px",
                    borderRadius: "2px",
                    border: "none",
                    cursor: "pointer"
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
                  gap: "18px"
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
                        border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                        backgroundColor: isSelected ? "var(--primary-soft)" : "var(--card)",
                        padding: "20px",
                        borderRadius: "3px",
                        cursor: "pointer",
                        position: "relative",
                        transition: "all 0.2s ease",
                        boxShadow: isSelected ? "0 4px 18px rgba(85, 104, 50, 0.12)" : "none",
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
                              <Circle size={20} style={{ color: "var(--muted-foreground)", opacity: 0.45, flexShrink: 0 }} />
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              {addr.title === "Home" && <Home size={15} style={{ color: "var(--primary)" }} />}
                              {addr.title === "Office" && <Building size={15} style={{ color: "var(--primary)" }} />}
                              {!["Home", "Office"].includes(addr.title) && (
                                <MapPin size={15} style={{ color: "var(--primary)" }} />
                              )}
                              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                                {addr.title || "Address"}
                              </span>
                            </div>
                          </div>

                          {isDef && (
                            <span
                              className="eyebrow"
                              style={{
                                backgroundColor: "rgba(85, 104, 50, 0.12)",
                                color: "var(--primary)",
                                padding: "2px 7px",
                                borderRadius: "2px",
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
                            fontSize: "0.88rem",
                            lineHeight: 1.5,
                            color: "var(--foreground)",
                            marginBottom: "6px",
                            whiteSpace: "pre-line",
                            paddingLeft: "30px"
                          }}
                        >
                          {addr.address}
                        </p>
                        <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", paddingLeft: "30px" }}>
                          {addr.cityname}, {addr.statename} {addr.pincode ? `· ${addr.pincode}` : ""}
                        </p>
                        <p style={{ fontSize: "0.78rem", color: "var(--muted-foreground)", paddingLeft: "30px", marginTop: "2px" }}>
                          {addr.countryname}
                        </p>
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
                              fontWeight: 600,
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
            border: "1px solid var(--border)",
            backgroundColor: "var(--card)",
            padding: "36px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            position: "sticky",
            top: "100px",
            maxWidth: "440px"
          }}
        >
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem" }}>
            Order Summary
          </h2>

          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.92rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted-foreground)" }}>Subtotal</span>
              <span>{format(subtotal)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted-foreground)" }}>Insured delivery</span>
              <span>{shipping ? format(shipping) : "Complimentary"}</span>
            </div>
          </div>

          {/* Total */}
          <div
            style={{
              marginTop: "24px",
              borderTop: "1px solid var(--border)",
              paddingTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-serif)",
              fontSize: "1.8rem"
            }}
          >
            <span>Total</span>
            <span>{format(total)}</span>
          </div>

          {/* Selected Delivery Address Preview Box */}
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              borderRadius: "3px",
              backgroundColor: selectedAddress ? "var(--primary-soft)" : "#fffbf0",
              border: selectedAddress ? "1px solid var(--primary-light)" : "1px solid #fde68a",
              fontSize: "0.84rem"
            }}
          >
            {selectedAddress ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600, color: "var(--primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={15} /> Delivering to: {selectedAddress.title}
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
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    Change
                  </button>
                </div>
                <p
                  style={{
                    color: "var(--foreground)",
                    fontSize: "0.8rem",
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
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#92400e" }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>Address Selection Required</div>
                  <div style={{ fontSize: "0.76rem", marginTop: "2px", color: "#b45309" }}>
                    Please select a single delivery address from the list before placing your order.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleProceedToCheckout}
            className="eyebrow"
            style={{
              width: "100%",
              marginTop: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              padding: "16px",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Lock size={15} /> Proceed to Secure Checkout
          </button>

          {/* Payment Badges */}
          <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px" }}>
            {["PayPal", "Visa", "Mastercard"].map((p) => (
              <span
                key={p}
                style={{
                  border: "1px solid var(--border)",
                  padding: "3px 8px",
                  fontSize: "0.68rem",
                  color: "var(--muted-foreground)"
                }}
              >
                {p}
              </span>
            ))}
          </div>

          <p style={{ marginTop: "14px", textAlign: "center", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            256-bit SSL encrypted · Fully insured courier delivery
          </p>
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
    </div>
  );
}
