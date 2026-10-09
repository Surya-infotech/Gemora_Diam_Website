import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Trash2, LogOut, Plus, MapPin, Edit2, X, Building, Home, Sparkles } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { useStore } from "../lib/store";

const fieldStyle = {
  width: "100%",
  border: "1px solid #EDE8DE",
  backgroundColor: "#ffffff",
  padding: "12px 16px",
  fontSize: "0.9rem",
  color: "var(--foreground)",
  borderRadius: "3px",
  outline: "none",
  transition: "all 0.2s ease"
};

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const currentTab = rawTab === "settings" ? "settings" : rawTab === "addresses" ? "addresses" : "wishlist";
  const { user, logout } = useStore();

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  if (!user) {
    return <SignInView />;
  }

  const tabs = [
    { id: "wishlist", label: "Wishlist Atelier" },
    { id: "settings", label: "Security & Profile" },
    { id: "addresses", label: "Delivery Addresses" }
  ];

  return (
    <div className="container-luxury" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--gold)" }} />
            <p className="eyebrow" style={{ color: "var(--gold-deep)", margin: 0 }}>Private Client Portal</p>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 3.6rem)", margin: "8px 0 0 0", letterSpacing: "-0.01em" }}>
            Welcome, {user.fullname ? user.fullname.split(" ")[0] : "Client"}
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.92rem", marginTop: "8px", margin: 0 }}>
            Manage your fine jewelry wishlist, bespoke preferences, and global delivery destinations.
          </p>
        </div>
        <button
          onClick={logout}
          className="eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#FAF9F6",
            color: "#666",
            border: "1px solid #EDE8DE",
            padding: "11px 22px",
            borderRadius: "3px",
            cursor: "pointer",
            fontWeight: 600,
            letterSpacing: "0.12em",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#c33";
            e.currentTarget.style.color = "#c33";
            e.currentTarget.style.backgroundColor = "#fff8f8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#EDE8DE";
            e.currentTarget.style.color = "#666";
            e.currentTarget.style.backgroundColor = "#FAF9F6";
          }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #EDE8DE",
          marginTop: "40px",
          gap: "8px"
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "32px",
            overflowX: "auto",
            scrollbarWidth: "none"
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="eyebrow"
              style={{
                background: "none",
                border: "none",
                borderBottom: currentTab === t.id ? "2.5px solid var(--primary)" : "2.5px solid transparent",
                padding: "0 4px 14px 4px",
                color: currentTab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
                fontWeight: currentTab === t.id ? 700 : 500,
                letterSpacing: "0.12em",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        {currentTab === "wishlist" && <WishlistTab />}
        {currentTab === "settings" && <SettingsTab key={user?._id || user?.id || "guest"} />}
        {currentTab === "addresses" && <AddressesTab key={user?._id || user?.id || "guest"} />}
      </div>
    </div>
  );
}


function WishlistTab() {
  const { wishlist, toggleWishlist, addToCart, format, getProduct } = useStore();

  if (!wishlist.length) {
    return (
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
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            backgroundColor: "var(--primary-soft)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 20px",
            color: "var(--primary)"
          }}
        >
          <Sparkles size={30} strokeWidth={1.5} />
        </div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: "0 0 10px 0", color: "var(--foreground)" }}>
          Your Atelier Wishlist is Empty
        </p>
        <p style={{ fontSize: "0.92rem", color: "var(--muted-foreground)", maxWidth: "440px", margin: "0 auto 28px" }}>
          Explore our signature collections to save your favorite lab grown diamond pieces and bridal sets.
        </p>
        <Link
          to="/shop"
          className="eyebrow"
          style={{
            display: "inline-block",
            padding: "13px 32px",
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            borderRadius: "2px",
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: "0.14em"
          }}
        >
          Explore Collection ✦
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", margin: 0 }}>
          Saved Fine Jewelry ({wishlist.length})
        </h2>
        <span style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
          Curated selection ready for commission
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
        {wishlist.map((id) => {
          const p = getProduct(id);
          if (!p) return null;
          return (
            <div
              key={id}
              className="card-luxury"
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #EDE8DE",
                backgroundColor: "#FAF9F6",
                borderRadius: "4px",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}
            >
              {/* Image with zoom effect */}
              <div
                className="img-zoom-parent"
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  backgroundColor: "#ffffff",
                  position: "relative",
                  borderBottom: "1px solid #EDE8DE"
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Body */}
              <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <span className="eyebrow" style={{ color: "var(--gold-deep)", fontSize: "0.68rem" }}>
                    {p.category || "Fine Jewelry"}
                  </span>
                  <Link
                    to={`/product/${p.id}`}
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      textDecoration: "none",
                      display: "block",
                      marginTop: "4px",
                      lineHeight: 1.3
                    }}
                  >
                    {p.name}
                  </Link>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "8px", margin: "8px 0 0 0" }}>
                    {format(p.price)}
                  </p>
                </div>

                <div style={{ marginTop: "18px", display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      addToCart(p.id, "18k Yellow Gold");
                      toggleWishlist(p.id);
                    }}
                    className="eyebrow"
                    style={{
                      flex: 1,
                      backgroundColor: "var(--primary)",
                      color: "#ffffff",
                      padding: "11px 16px",
                      border: "none",
                      borderRadius: "2px",
                      cursor: "pointer",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
                  >
                    Move to Bag
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    aria-label="Remove from wishlist"
                    style={{
                      border: "1px solid #EDE8DE",
                      backgroundColor: "#ffffff",
                      padding: "0 12px",
                      borderRadius: "2px",
                      cursor: "pointer",
                      color: "#999",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#c33";
                      e.currentTarget.style.color = "#c33";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#EDE8DE";
                      e.currentTarget.style.color = "#999";
                    }}
                  >
                    <Trash2 size={16} strokeWidth={1.4} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { user, updateProfile, updatePassword, showToast, logout } = useStore();
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passData, setPassData] = useState({ current: "", next: "", confirm: "" });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({
      fullname: profileData.fullname,
      email: profileData.email,
      phone: profileData.phone
    });
    setSavingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passData.current) {
      showToast("Current password is required", "error");
      return;
    }
    if (passData.next.length < 8) {
      showToast("New password must be at least 8 characters", "error");
      return;
    }
    if (passData.next !== passData.confirm) {
      showToast("New passwords do not match", "error");
      return;
    }

    setSavingPassword(true);
    const res = await updatePassword({
      currentPassword: passData.current,
      newPassword: passData.next
    });
    setSavingPassword(false);
    if (res?.success) {
      setPassData({ current: "", next: "", confirm: "" });
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
      {/* Profile Details Card */}
      <div
        style={{
          backgroundColor: "#FAF9F6",
          border: "1px solid #EDE8DE",
          borderRadius: "4px",
          padding: "32px 30px"
        }}
      >
        <span className="eyebrow" style={{ color: "var(--gold-deep)", fontSize: "0.7rem" }}>
          Client Credentials
        </span>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", margin: "6px 0 20px 0" }}>
          Profile Details
        </h3>

        <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
              Full Name *
            </label>
            <input
              style={fieldStyle}
              value={profileData.fullname}
              onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
              placeholder="Full name"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
              Email Address *
            </label>
            <input
              style={fieldStyle}
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              placeholder="Email"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
              Contact Phone
            </label>
            <input
              style={fieldStyle}
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="eyebrow"
            style={{
              alignSelf: "flex-start",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              padding: "12px 28px",
              border: "none",
              borderRadius: "2px",
              cursor: savingProfile ? "not-allowed" : "pointer",
              fontWeight: 600,
              letterSpacing: "0.12em",
              opacity: savingProfile ? 0.75 : 1,
              marginTop: "8px"
            }}
          >
            {savingProfile ? "Saving..." : "Save Profile Details"}
          </button>
        </form>
      </div>

      {/* Security & Access Card */}
      <div
        style={{
          backgroundColor: "#FAF9F6",
          border: "1px solid #EDE8DE",
          borderRadius: "4px",
          padding: "32px 30px"
        }}
      >
        <span className="eyebrow" style={{ color: "var(--gold-deep)", fontSize: "0.7rem" }}>
          Atelier Protection
        </span>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", margin: "6px 0 20px 0" }}>
          Security &amp; Password
        </h3>

        <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
              Current Password *
            </label>
            <input
              type="password"
              style={fieldStyle}
              value={passData.current}
              onChange={(e) => setPassData({ ...passData, current: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
              New Password (Min 8 characters) *
            </label>
            <input
              type="password"
              style={fieldStyle}
              value={passData.next}
              onChange={(e) => setPassData({ ...passData, next: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
              Confirm New Password *
            </label>
            <input
              type="password"
              style={fieldStyle}
              value={passData.confirm}
              onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="eyebrow"
            style={{
              alignSelf: "flex-start",
              border: "1px solid var(--primary)",
              backgroundColor: "transparent",
              color: "var(--primary)",
              padding: "12px 28px",
              borderRadius: "2px",
              cursor: savingPassword ? "not-allowed" : "pointer",
              fontWeight: 600,
              letterSpacing: "0.12em",
              opacity: savingPassword ? 0.75 : 1,
              marginTop: "8px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--primary)";
            }}
          >
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Account Session & Logout */}
      <div
        style={{
          gridColumn: "1 / -1",
          marginTop: "12px",
          padding: "28px 32px",
          backgroundColor: "#FAF9F6",
          border: "1px solid #EDE8DE",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        <div>
          <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, color: "var(--gold-deep)" }}>
            Session Management
          </span>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", color: "var(--foreground)", margin: "6px 0 4px 0" }}>
            Account Session &amp; Sign Out
          </h4>
          <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", margin: 0 }}>
            Currently authenticated as <strong style={{ color: "var(--foreground)" }}>{user?.fullname}</strong> ({user?.email}).
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#FAF9F6",
            color: "#a83232",
            border: "1px solid #e5c3c3",
            padding: "12px 26px",
            borderRadius: "2px",
            fontSize: "0.76rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#a83232";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FAF9F6";
            e.currentTarget.style.color = "#a83232";
          }}
        >
          <LogOut size={15} />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}

function AddressesTab() {
  const { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useStore();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Form inputs
  const [title, setTitle] = useState("Home");
  const [customTitle, setCustomTitle] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    const list = await getAddresses();
    setAddresses(list);
    setLoading(false);
  }, [getAddresses]);

  useEffect(() => {
    let isMounted = true;
    getAddresses().then((list) => {
      if (isMounted) {
        setAddresses(list);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [getAddresses]);

  // Countries dropdown from country-state-city
  const countries = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      isoCode: c.isoCode,
      name: c.name
    }));
  }, []);

  // States dropdown dependent on selectedCountry
  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry).map((s) => ({
      isoCode: s.isoCode,
      name: s.name
    }));
  }, [selectedCountry]);

  // Cities dropdown dependent on selectedCountry & selectedState
  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState).map((c) => ({
      name: c.name
    }));
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (isoCode) => {
    setSelectedCountry(isoCode);
    setSelectedState("");
    setSelectedCity("");
  };

  const handleStateChange = (isoCode) => {
    setSelectedState(isoCode);
    setSelectedCity("");
  };

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setTitle("Home");
    setCustomTitle("");
    setAddress("");
    setPostalCode("");
    const defaultCountry = Country.getAllCountries().find((c) => c.isoCode === "IN")?.isoCode || countries[0]?.isoCode || "";
    setSelectedCountry(defaultCountry);
    setSelectedState("");
    setSelectedCity("");
    setIsDefault(addresses.length === 0);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    const isStandard = ["Home", "Office"].includes(addr.title);
    setTitle(isStandard ? addr.title : "Other");
    setCustomTitle(isStandard ? "" : (addr.title || ""));
    setAddress(addr.address || "");
    setPostalCode(addr.pincode || "");
    setIsDefault(Boolean(addr.isDefault));
    setErrors({});

    // Match country
    let cCode = addr.countrycode || "";
    if (!cCode && addr.countryname) {
      const match = Country.getAllCountries().find(
        (c) => c.name.toLowerCase() === addr.countryname.toLowerCase()
      );
      if (match) cCode = match.isoCode;
    }
    setSelectedCountry(cCode);

    // Match state
    let sCode = addr.statecode || "";
    if (cCode && !sCode && addr.statename) {
      const countryStates = State.getStatesOfCountry(cCode);
      const match = countryStates.find(
        (s) => s.name.toLowerCase() === addr.statename.toLowerCase()
      );
      if (match) sCode = match.isoCode;
    }
    setSelectedState(sCode);

    // Match city
    setSelectedCity(addr.cityname || "");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!address.trim()) newErrors.address = "Address is required";
    if (!postalCode.trim()) newErrors.postalCode = "Pincode is required";
    if (!selectedCountry) newErrors.country = "Country is required";
    if (!selectedState) newErrors.state = "State is required";
    if (!selectedCity.trim()) newErrors.city = "City is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const countryObj = Country.getCountryByCode(selectedCountry);
    const stateObj = State.getStateByCodeAndCountry(selectedState, selectedCountry);
    const finalTitle = title === "Other" && customTitle.trim() ? customTitle.trim() : title;

    const payload = {
      title: finalTitle,
      address: address.trim(),
      pincode: postalCode.trim(),
      countryname: countryObj?.name || selectedCountry,
      countrycode: selectedCountry,
      statename: stateObj?.name || selectedState,
      statecode: selectedState,
      cityname: selectedCity.trim(),
      isDefault
    };

    setSubmitting(true);
    let res;
    if (editingAddress) {
      res = await updateAddress(editingAddress.addressid, payload);
    } else {
      res = await addAddress(payload);
    }
    setSubmitting(false);

    if (res.success) {
      setModalOpen(false);
      setEditingAddress(null);
      loadAddresses();
    }
  };

  const handleDelete = async (addr) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const res = await deleteAddress(addr.addressid);
      if (res.success) {
        loadAddresses();
      }
    }
  };

  const handleSetDefault = async (addr) => {
    const res = await setDefaultAddress(addr.addressid);
    if (res.success) {
      loadAddresses();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: 0 }}>
            Saved Addresses
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", marginTop: "4px" }}>
            Manage delivery locations for orders and gifts.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "opacity 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted-foreground)" }}>
          Loading addresses...
        </div>
      ) : addresses.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            border: "1px dashed var(--border)",
            borderRadius: "4px",
            backgroundColor: "var(--card)"
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-soft)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
              color: "var(--primary)"
            }}
          >
            <MapPin size={28} />
          </div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", marginBottom: "8px" }}>
            No Addresses Saved
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", maxWidth: "420px", margin: "0 auto 24px" }}>
            You haven't added any delivery addresses yet. Add an address now to enjoy faster checkout.
          </p>
          <button
            onClick={openAddModal}
            className="eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: "2px",
              cursor: "pointer"
            }}
          >
            <Plus size={16} /> Add Your First Address
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px"
          }}
        >
          {addresses.map((addr) => {
            const isDef = Boolean(addr.isDefault);
            return (
              <div
                key={addr.addressid}
                style={{
                  border: isDef ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                  padding: "24px",
                  borderRadius: "2px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: isDef ? "0 4px 16px rgba(85, 104, 50, 0.08)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {addr.title === "Home" && <Home size={16} style={{ color: "var(--primary)" }} />}
                      {addr.title === "Office" && <Building size={16} style={{ color: "var(--primary)" }} />}
                      {!["Home", "Office"].includes(addr.title) && <MapPin size={16} style={{ color: "var(--primary)" }} />}
                      <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        {addr.title || "Address"}
                      </span>
                    </div>
                    {isDef && (
                      <span
                        className="eyebrow"
                        style={{
                          backgroundColor: "var(--primary-soft)",
                          color: "var(--primary)",
                          padding: "3px 8px",
                          borderRadius: "2px",
                          fontSize: "0.62rem"
                        }}
                      >
                        Default
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "var(--foreground)", marginBottom: "8px", whiteSpace: "pre-line" }}>
                    {addr.address}
                  </p>

                  <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginBottom: "4px" }}>
                    {addr.cityname}, {addr.statename} {addr.pincode ? ` - ${addr.pincode}` : ""}
                  </p>

                  <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", fontWeight: 500 }}>
                    {addr.countryname}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "24px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border-subtle)",
                    fontSize: "0.82rem"
                  }}
                >
                  <div style={{ display: "flex", gap: "16px" }}>
                    <button
                      onClick={() => openEditModal(addr)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 500
                      }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#c33",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 500
                      }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>

                  {!isDef && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        cursor: "pointer",
                        fontWeight: 600,
                        textDecoration: "underline"
                      }}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {modalOpen && (
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
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "640px",
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
              onClick={() => setModalOpen(false)}
              aria-label="Close"
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
            >
              <X size={18} />
            </button>

            <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>
              {editingAddress ? "Update Location" : "New Location"}
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", margin: "6px 0 24px" }}>
              {editingAddress ? "Edit Address Details" : "Add Address Details"}
            </h2>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Address Type / Label */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "8px", color: "var(--foreground)" }}>
                  Address Type
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["Home", "Office", "Other"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTitle(t)}
                      style={{
                        padding: "8px 18px",
                        fontSize: "0.82rem",
                        borderRadius: "2px",
                        border: title === t ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                        backgroundColor: title === t ? "var(--primary-soft)" : "transparent",
                        color: title === t ? "var(--primary)" : "var(--foreground)",
                        cursor: "pointer",
                        fontWeight: title === t ? 600 : 400
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {title === "Other" && (
                  <input
                    type="text"
                    placeholder="e.g. Vacation Home, Studio"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    style={{ ...fieldStyle, marginTop: "10px" }}
                  />
                )}
              </div>

              {/* Street Address */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px", color: "var(--foreground)" }}>
                  Address (House / Flat / Street / Landmark) *
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter complete street address..."
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  style={{
                    ...fieldStyle,
                    resize: "vertical",
                    fontFamily: "inherit",
                    borderColor: errors.address ? "#d9534f" : "var(--border)"
                  }}
                />
                {errors.address && (
                  <p style={{ color: "#d9534f", fontSize: "0.75rem", marginTop: "4px" }}>{errors.address}</p>
                )}
              </div>

              {/* Country & State Dropdowns (Same as General.jsx) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px", color: "var(--foreground)" }}>
                    Country *
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      handleCountryChange(e.target.value);
                      if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
                    }}
                    style={{
                      ...fieldStyle,
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      borderColor: errors.country ? "#d9534f" : "var(--border)"
                    }}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p style={{ color: "#d9534f", fontSize: "0.75rem", marginTop: "4px" }}>{errors.country}</p>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px", color: "var(--foreground)" }}>
                    State / Region *
                  </label>
                  <select
                    value={selectedState}
                    disabled={!selectedCountry || states.length === 0}
                    onChange={(e) => {
                      handleStateChange(e.target.value);
                      if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
                    }}
                    style={{
                      ...fieldStyle,
                      cursor: !selectedCountry || states.length === 0 ? "not-allowed" : "pointer",
                      backgroundColor: !selectedCountry || states.length === 0 ? "#f9f9f9" : "#fff",
                      borderColor: errors.state ? "#d9534f" : "var(--border)"
                    }}
                  >
                    <option value="">
                      {!selectedCountry
                        ? "Select Country First"
                        : states.length === 0
                        ? "No states available"
                        : "Select State"}
                    </option>
                    {states.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p style={{ color: "#d9534f", fontSize: "0.75rem", marginTop: "4px" }}>{errors.state}</p>
                  )}
                </div>
              </div>

              {/* City Dropdown & Pincode */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px", color: "var(--foreground)" }}>
                    City *
                  </label>
                  {cities.length > 0 ? (
                    <select
                      value={selectedCity}
                      disabled={!selectedState}
                      onChange={(e) => {
                        handleCityChange(e.target.value);
                        if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
                      }}
                      style={{
                        ...fieldStyle,
                        cursor: !selectedState ? "not-allowed" : "pointer",
                        backgroundColor: !selectedState ? "#f9f9f9" : "#fff",
                        borderColor: errors.city ? "#d9534f" : "var(--border)"
                      }}
                    >
                      <option value="">
                        {!selectedState ? "Select State First" : "Select City"}
                      </option>
                      {cities.map((city, idx) => (
                        <option key={`${city.name}-${idx}`} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder={!selectedState ? "Select State First" : "Enter city name"}
                      disabled={!selectedState}
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
                      }}
                      style={{
                        ...fieldStyle,
                        backgroundColor: !selectedState ? "#f9f9f9" : "transparent",
                        borderColor: errors.city ? "#d9534f" : "var(--border)"
                      }}
                    />
                  )}
                  {errors.city && (
                    <p style={{ color: "#d9534f", fontSize: "0.75rem", marginTop: "4px" }}>{errors.city}</p>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px", color: "var(--foreground)" }}>
                    Pincode / Postal Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 395006"
                    value={postalCode}
                    onChange={(e) => {
                      setPostalCode(e.target.value);
                      if (errors.postalCode) setErrors((prev) => ({ ...prev, postalCode: "" }));
                    }}
                    style={{
                      ...fieldStyle,
                      borderColor: errors.postalCode ? "#d9534f" : "var(--border)"
                    }}
                  />
                  {errors.postalCode && (
                    <p style={{ color: "#d9534f", fontSize: "0.75rem", marginTop: "4px" }}>{errors.postalCode}</p>
                  )}
                </div>
              </div>

              {/* Default Address Checkbox */}
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "6px" }}>
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "var(--primary)", cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>
                  Set as default shipping address
                </span>
              </label>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="eyebrow"
                  style={{
                    padding: "12px 24px",
                    border: "1px solid var(--border)",
                    backgroundColor: "transparent",
                    color: "var(--foreground)",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="eyebrow"
                  style={{
                    padding: "12px 28px",
                    backgroundColor: "var(--primary)",
                    color: "#ffffff",
                    border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SignInView() {
  const { signup, login } = useStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setErrorMsg("");
    setLoading(true);

    if (isRegister) {
      if (!fullname.trim()) {
        setErrorMsg("Please enter your full name.");
        setLoading(false);
        return;
      }
      const res = await signup({ fullname, email, password });
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to create account.");
      }
    } else {
      const res = await login({ email, password });
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || "Invalid email or password.");
      }
    }
  };

  return (
    <div className="container-luxury" style={{ paddingTop: "70px", paddingBottom: "110px", maxWidth: "520px", margin: "0 auto" }}>
      <div
        style={{
          backgroundColor: "#FAF9F6",
          border: "1px solid #EDE8DE",
          padding: "48px 38px",
          borderRadius: "6px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
          textAlign: "center"
        }}
      >
        {/* Atelier Crest */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "var(--primary-soft)",
            border: "1px solid rgba(197, 160, 89, 0.35)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 16px",
            color: "var(--primary)"
          }}
        >
          <Sparkles size={24} strokeWidth={1.5} />
        </div>

        <p className="eyebrow" style={{ color: "var(--gold-deep)", fontSize: "0.72rem" }}>
          Gemora Diam • Private Client Portal
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", margin: "8px 0 10px 0", color: "var(--foreground)", letterSpacing: "-0.01em" }}>
          {isRegister ? "Join The Atelier" : "Welcome Back"}
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: "0 0 28px 0" }}>
          {isRegister
            ? "Create your private account to curate wishlists, view order dossiers, and commission bespoke pieces."
            : "Sign in to access your order history, authenticated invoices, and saved fine jewelry."}
        </p>

        {/* Tab Segment Switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            padding: "4px",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            border: "1px solid #EDE8DE",
            marginBottom: "24px"
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg("");
            }}
            className="eyebrow"
            style={{
              padding: "10px",
              border: "none",
              borderRadius: "3px",
              backgroundColor: !isRegister ? "var(--primary)" : "transparent",
              color: !isRegister ? "#ffffff" : "var(--muted-foreground)",
              cursor: "pointer",
              fontWeight: 600,
              letterSpacing: "0.1em",
              transition: "all 0.2s"
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg("");
            }}
            className="eyebrow"
            style={{
              padding: "10px",
              border: "none",
              borderRadius: "3px",
              backgroundColor: isRegister ? "var(--primary)" : "transparent",
              color: isRegister ? "#ffffff" : "var(--muted-foreground)",
              cursor: "pointer",
              fontWeight: 600,
              letterSpacing: "0.1em",
              transition: "all 0.2s"
            }}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              backgroundColor: "#fff2f2",
              border: "1px solid #fedcdc",
              color: "#a83232",
              fontSize: "0.85rem",
              borderRadius: "3px",
              textAlign: "left"
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", textAlign: "left" }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: "0.76rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
                Full Name *
              </label>
              <input
                style={fieldStyle}
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: "0.76rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
              Email Address *
            </label>
            <input
              style={fieldStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@gemoradiam.com"
              required
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "0.76rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>
                Password *
              </label>
            </div>
            <input
              style={fieldStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="eyebrow"
            style={{
              marginTop: "8px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              padding: "14px",
              border: "none",
              borderRadius: "2px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textAlign: "center",
              opacity: loading ? 0.75 : 1,
              transition: "background 0.2s ease",
              boxShadow: "0 6px 18px rgba(85, 104, 50, 0.25)"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
          >
            {loading ? "Processing..." : isRegister ? "Create Private Account" : "Access Account ✦"}
          </button>
        </form>

        <p style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #EDE8DE", fontSize: "0.82rem", color: "var(--muted-foreground)", margin: "24px 0 0 0" }}>
          By continuing, you acknowledge Gemora Diam's{" "}
          <Link to="/privacy-policy" style={{ color: "var(--primary)", textDecoration: "underline" }}>
            Privacy Protocol
          </Link>{" "}
          &amp; Client Terms.
        </p>
      </div>
    </div>
  );
}
