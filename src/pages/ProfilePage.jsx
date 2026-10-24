import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Trash2,
  LogOut,
  Plus,
  MapPin,
  Edit2,
  X,
  Building,
  Home,
  Sparkles,
  Heart,
  ShoppingBag,
  ArrowRight,
  User,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Country, State, City } from "country-state-city";
import { useStore } from "../lib/store";

const fieldStyle = {
  width: "100%",
  border: "1px solid #EDE8DE",
  backgroundColor: "#ffffff",
  padding: "12px 16px",
  fontSize: "0.9rem",
  color: "var(--foreground)",
  borderRadius: "6px",
  outline: "none",
  transition: "all 0.2s ease"
};

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const currentTab = rawTab === "settings" ? "settings" : rawTab === "addresses" ? "addresses" : "wishlist";
  const { user, logout, wishlist } = useStore();

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  if (!user) {
    return <SignInView />;
  }

  const tabs = [
    { id: "wishlist", label: "Saved Wishlist", icon: Heart, badge: wishlist?.length || 0 },
    { id: "settings", label: "Security & Profile", icon: User },
    { id: "addresses", label: "Delivery Addresses", icon: MapPin }
  ];

  return (
    <div className="container-luxury" style={{ maxWidth: "1340px", paddingTop: "40px", paddingBottom: "100px" }}>
      {/* Atelier Client Suite Banner */}
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
          {/* Client Monogram Crest */}
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
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              fontWeight: 700,
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(85, 104, 50, 0.08)"
            }}
          >
            {user.fullname ? user.fullname.charAt(0).toUpperCase() : "C"}
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
                PRIVATE CLIENT PORTAL
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
                <Sparkles size={11} /> Verified Member
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
              Welcome, {user.fullname || "Client"}
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.88rem", marginTop: "4px", margin: 0 }}>
              Curate your fine jewelry wishlist, manage global delivery addresses, and tailor your bespoke commissions.
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
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
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#dc2626";
            e.currentTarget.style.color = "#dc2626";
            e.currentTarget.style.backgroundColor = "#fff5f5";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#EDE8DE";
            e.currentTarget.style.color = "var(--foreground)";
            e.currentTarget.style.backgroundColor = "#FAF9F6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #EDE8DE",
          marginTop: "32px",
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
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
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
                {Icon && <Icon size={14} style={{ color: isActive ? "var(--primary)" : "inherit" }} />}
                <span>{t.label}</span>
                {t.badge !== undefined && (
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
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "36px" }}>
        {currentTab === "wishlist" && <WishlistTab />}
        {currentTab === "settings" && <SettingsTab key={user?._id || user?.id || "guest"} />}
        {currentTab === "addresses" && <AddressesTab key={user?._id || user?.id || "guest"} />}
      </div>
    </div>
  );
}

function WishlistTab() {
  const { wishlist, toggleWishlist, addToCart, format, getProduct, showToast } = useStore();
  const navigate = useNavigate();

  const handleMoveAllToBag = () => {
    if (!wishlist.length) return;
    let addedCount = 0;
    wishlist.forEach((id) => {
      const p = getProduct(id);
      if (p) {
        const metal = p.metals?.[0]?.name || (typeof p.metals?.[0] === "string" ? p.metals[0] : "14K White Gold");
        addToCart(p.id || p._id, metal);
        addedCount++;
      }
    });
    if (showToast) {
      showToast(`${addedCount} creation${addedCount === 1 ? "" : "s"} moved to your Shopping Bag!`, "success");
    }
  };

  if (!wishlist.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "90px 24px",
          backgroundColor: "#ffffff",
          border: "1px solid #EDE8DE",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.02)"
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "rgba(85, 104, 50, 0.08)",
            border: "1px solid rgba(85, 104, 50, 0.18)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 20px",
            color: "var(--primary)"
          }}
        >
          <Heart size={32} strokeWidth={1.5} />
        </div>
        <span
          className="eyebrow"
          style={{ color: "var(--primary)", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "6px" }}
        >
          SAVED WISHLIST
        </span>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", margin: "0 0 10px 0", color: "var(--foreground)", fontWeight: 600 }}>
          Your Wishlist is Empty
        </h3>
        <p style={{ fontSize: "0.92rem", color: "var(--muted-foreground)", maxWidth: "440px", margin: "0 auto 28px", lineHeight: 1.6 }}>
          Explore our signature collections to curate your personal heirloom jewelry pieces and bespoke bridal creations.
        </p>
        <Link
          to="/collections"
          className="eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 34px",
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: "0.14em",
            boxShadow: "0 4px 16px rgba(85, 104, 50, 0.25)"
          }}
        >
          <span>Discover Collections</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          paddingBottom: "20px",
          borderBottom: "1px solid #EDE8DE",
          marginBottom: "28px"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", margin: 0, fontWeight: 600, color: "var(--foreground)" }}>
              Saved Fine Jewelry
            </h2>
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "999px",
                backgroundColor: "rgba(85, 104, 50, 0.1)",
                color: "var(--primary)"
              }}
            >
              {wishlist.length} {wishlist.length === 1 ? "Piece" : "Pieces"}
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: "4px 0 0 0" }}>
            Curated selection ready for commission, sizing, or immediate acquisition.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={handleMoveAllToBag}
            className="eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "rgba(85, 104, 50, 0.08)",
              color: "var(--primary)",
              border: "1px solid rgba(85, 104, 50, 0.25)",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
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
            <ShoppingBag size={14} />
            <span>Move All to Bag</span>
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px"
        }}
      >
        {wishlist.map((id) => {
          const p = getProduct(id);
          if (!p) return null;
          const productUrl = `/product/${p._id || p.id}`;
          const defaultMetal = p.metals?.[0]?.name || (typeof p.metals?.[0] === "string" ? p.metals[0] : "14K White Gold");

          return (
            <div
              key={id}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #EDE8DE",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 14px 34px rgba(0, 0, 0, 0.07)";
                e.currentTarget.style.borderColor = "#D8D1C5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.02)";
                e.currentTarget.style.borderColor = "#EDE8DE";
              }}
            >
              {/* Image Stage */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  backgroundColor: "#FAF9F6",
                  borderBottom: "1px solid #EDE8DE",
                  overflow: "hidden",
                  cursor: "pointer"
                }}
                onClick={() => navigate(productUrl)}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.5s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />

                {/* Top-Left Category Badge */}
                {p.category && (
                  <span
                    className="eyebrow"
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.92)",
                      backdropFilter: "blur(4px)",
                      color: "var(--foreground)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.64rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      border: "1px solid rgba(220, 215, 205, 0.5)"
                    }}
                  >
                    {p.category}
                  </span>
                )}

                {/* Top-Right Remove Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(p.id || p._id);
                  }}
                  title="Remove from wishlist"
                  aria-label="Remove item"
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(220, 215, 205, 0.6)",
                    color: "var(--primary)",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff0f0";
                    e.currentTarget.style.borderColor = "#fca5a5";
                    e.currentTarget.style.color = "#dc2626";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.92)";
                    e.currentTarget.style.borderColor = "rgba(220, 215, 205, 0.6)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: "16px 18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <h3
                    onClick={() => navigate(productUrl)}
                    title={p.name}
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      margin: 0,
                      lineHeight: 1.35,
                      cursor: "pointer",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                  >
                    {p.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--primary)",
                      margin: "8px 0 0",
                      fontFamily: "var(--font-serif)"
                    }}
                  >
                    {format(p.price)}
                  </p>
                </div>

                {/* Move to Bag Action */}
                <div style={{ marginTop: "16px" }}>
                  <button
                    onClick={() => {
                      addToCart(p.id || p._id, defaultMetal);
                      toggleWishlist(p.id || p._id);
                    }}
                    className="eyebrow"
                    style={{
                      width: "100%",
                      backgroundColor: "var(--primary)",
                      color: "#ffffff",
                      padding: "12px 16px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "0.76rem",
                      letterSpacing: "0.12em",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(85, 104, 50, 0.2)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 6px 18px rgba(85, 104, 50, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(85, 104, 50, 0.2)";
                    }}
                  >
                    <ShoppingBag size={14} />
                    <span>Move to Bag</span>
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))", gap: "28px" }}>
      {/* Profile Details Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #EDE8DE",
          borderRadius: "12px",
          padding: "34px 30px",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <User size={15} style={{ color: "var(--primary)" }} />
          <span className="eyebrow" style={{ color: "var(--primary)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em" }}>
            CLIENT CREDENTIALS
          </span>
        </div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", margin: "6px 0 20px 0", color: "var(--foreground)", fontWeight: 600 }}>
          Profile Details
        </h3>

        <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
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
            <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
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
            <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
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
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              padding: "12px 26px",
              border: "none",
              borderRadius: "8px",
              cursor: savingProfile ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "0.76rem",
              letterSpacing: "0.12em",
              opacity: savingProfile ? 0.75 : 1,
              marginTop: "8px",
              boxShadow: "0 4px 14px rgba(85, 104, 50, 0.2)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (!savingProfile) {
                e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!savingProfile) {
                e.currentTarget.style.backgroundColor = "var(--primary)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <CheckCircle2 size={14} />
            <span>{savingProfile ? "Saving..." : "Save Profile Details"}</span>
          </button>
        </form>
      </div>

      {/* Security & Access Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #EDE8DE",
          borderRadius: "12px",
          padding: "34px 30px",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <Lock size={15} style={{ color: "var(--primary)" }} />
          <span className="eyebrow" style={{ color: "var(--primary)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em" }}>
            ACCOUNT SECURITY
          </span>
        </div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", margin: "6px 0 20px 0", color: "var(--foreground)", fontWeight: 600 }}>
          Security &amp; Password
        </h3>

        <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
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
            <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
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
            <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
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
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid var(--primary)",
              backgroundColor: "rgba(85, 104, 50, 0.08)",
              color: "var(--primary)",
              padding: "12px 26px",
              borderRadius: "8px",
              cursor: savingPassword ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "0.76rem",
              letterSpacing: "0.12em",
              opacity: savingPassword ? 0.75 : 1,
              marginTop: "8px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              if (!savingPassword) {
                e.currentTarget.style.backgroundColor = "var(--primary)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!savingPassword) {
                e.currentTarget.style.backgroundColor = "rgba(85, 104, 50, 0.08)";
                e.currentTarget.style.color = "var(--primary)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <Lock size={14} />
            <span>{savingPassword ? "Updating..." : "Update Password"}</span>
          </button>
        </form>
      </div>

      {/* Account Session & Logout */}
      <div
        style={{
          gridColumn: "1 / -1",
          marginTop: "12px",
          padding: "28px 32px",
          backgroundColor: "#ffffff",
          border: "1px solid #EDE8DE",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        <div>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, color: "var(--primary)" }}>
            SESSION MANAGEMENT
          </span>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", color: "var(--foreground)", margin: "6px 0 4px 0", fontWeight: 600 }}>
            Account Session &amp; Sign Out
          </h4>
          <p style={{ fontSize: "0.88rem", color: "var(--muted-foreground)", margin: 0 }}>
            Currently authenticated as <strong style={{ color: "var(--foreground)" }}>{user?.fullname}</strong> ({user?.email}).
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#fff5f5",
            color: "#dc2626",
            border: "1px solid #fecaca",
            padding: "11px 22px",
            borderRadius: "8px",
            fontSize: "0.76rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = "#dc2626";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fff5f5";
            e.currentTarget.style.color = "#dc2626";
            e.currentTarget.style.borderColor = "#fecaca";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <LogOut size={15} />
          <span>Sign Out of Account</span>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #EDE8DE" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", margin: 0, fontWeight: 600, color: "var(--foreground)" }}>
              Saved Delivery Addresses
            </h2>
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "999px",
                backgroundColor: "rgba(85, 104, 50, 0.1)",
                color: "var(--primary)"
              }}
            >
              {addresses.length} {addresses.length === 1 ? "Location" : "Locations"}
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginTop: "4px", margin: "4px 0 0 0" }}>
            Manage personal residences and delivery destinations worldwide.
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
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.76rem",
            letterSpacing: "0.12em",
            boxShadow: "0 4px 14px rgba(85, 104, 50, 0.2)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary-hover)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus size={15} />
          <span>Add New Address</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
          Retrieving saved destinations...
        </div>
      ) : addresses.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            border: "1px dashed #EDE8DE",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 14px rgba(0, 0, 0, 0.02)"
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "rgba(85, 104, 50, 0.08)",
              border: "1px solid rgba(85, 104, 50, 0.18)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 18px",
              color: "var(--primary)"
            }}
          >
            <MapPin size={30} strokeWidth={1.5} />
          </div>
          <span
            className="eyebrow"
            style={{ color: "var(--primary)", letterSpacing: "0.2em", fontSize: "0.72rem", fontWeight: 700, display: "block", marginBottom: "6px" }}
          >
            GLOBAL DESTINATIONS
          </span>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", marginBottom: "8px", fontWeight: 600, color: "var(--foreground)" }}>
            No Delivery Destinations
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", maxWidth: "420px", margin: "0 auto 24px", lineHeight: 1.6 }}>
            You haven't saved any delivery addresses yet. Register your address now for seamless bespoke acquisitions.
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
              padding: "13px 28px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.76rem",
              letterSpacing: "0.12em",
              boxShadow: "0 4px 14px rgba(85, 104, 50, 0.2)"
            }}
          >
            <Plus size={15} /> <span>Add Your First Address</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: "24px"
          }}
        >
          {addresses.map((addr) => {
            const isDef = Boolean(addr.isDefault);
            return (
              <div
                key={addr.addressid}
                style={{
                  border: isDef ? "1.5px solid var(--primary)" : "1px solid #EDE8DE",
                  backgroundColor: "#ffffff",
                  padding: "26px",
                  borderRadius: "12px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: isDef ? "0 8px 24px rgba(85, 104, 50, 0.08)" : "0 2px 10px rgba(0, 0, 0, 0.02)",
                  transition: "all 0.2s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          backgroundColor: isDef ? "rgba(85, 104, 50, 0.12)" : "#FAF9F6",
                          border: "1px solid #EDE8DE",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--primary)"
                        }}
                      >
                        {addr.title === "Home" && <Home size={15} />}
                        {addr.title === "Office" && <Building size={15} />}
                        {!["Home", "Office"].includes(addr.title) && <MapPin size={15} />}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>
                        {addr.title || "Address"}
                      </span>
                    </div>
                    {isDef && (
                      <span
                        className="eyebrow"
                        style={{
                          backgroundColor: "rgba(85, 104, 50, 0.12)",
                          color: "var(--primary)",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em"
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

                  <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", fontWeight: 600 }}>
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
                    borderTop: "1px solid #EDE8DE",
                    fontSize: "0.82rem"
                  }}
                >
                  <div style={{ display: "flex", gap: "14px" }}>
                    <button
                      onClick={() => openEditModal(addr)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--primary)";
                        e.currentTarget.style.backgroundColor = "rgba(85, 104, 50, 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--foreground)";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <Edit2 size={13} /> <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(addr)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff5f5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <Trash2 size={13} /> <span>Delete</span>
                    </button>
                  </div>

                  {!isDef && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="eyebrow"
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        letterSpacing: "0.1em",
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
              backgroundColor: "#ffffff",
              border: "1px solid #EDE8DE",
              padding: "36px 32px",
              position: "relative",
              borderRadius: "14px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22)"
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
                background: "#FAF9F6",
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

            <span className="eyebrow" style={{ color: "var(--primary)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.16em" }}>
              {editingAddress ? "UPDATE LOCATION" : "NEW LOCATION"}
            </span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", margin: "6px 0 24px", fontWeight: 600, color: "var(--foreground)" }}>
              {editingAddress ? "Edit Address Details" : "Add Address Details"}
            </h2>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Address Type / Label */}
              <div>
                <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "8px", color: "var(--foreground)" }}>
                  Address Type
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["Home", "Office", "Other"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTitle(t)}
                      style={{
                        padding: "9px 20px",
                        fontSize: "0.82rem",
                        borderRadius: "6px",
                        border: title === t ? "1.5px solid var(--primary)" : "1px solid #EDE8DE",
                        backgroundColor: title === t ? "rgba(85, 104, 50, 0.1)" : "#FAF9F6",
                        color: title === t ? "var(--primary)" : "var(--foreground)",
                        cursor: "pointer",
                        fontWeight: title === t ? 700 : 500,
                        transition: "all 0.2s ease"
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
                <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "6px", color: "var(--foreground)" }}>
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
                    borderColor: errors.address ? "#dc2626" : "#EDE8DE"
                  }}
                />
                {errors.address && (
                  <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "4px" }}>{errors.address}</p>
                )}
              </div>

              {/* Country & State Dropdowns */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "6px", color: "var(--foreground)" }}>
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
                      borderColor: errors.country ? "#dc2626" : "#EDE8DE"
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
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "4px" }}>{errors.country}</p>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "6px", color: "var(--foreground)" }}>
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
                      backgroundColor: !selectedCountry || states.length === 0 ? "#FAF9F6" : "#fff",
                      borderColor: errors.state ? "#dc2626" : "#EDE8DE"
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
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "4px" }}>{errors.state}</p>
                  )}
                </div>
              </div>

              {/* City Dropdown & Pincode */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "6px", color: "var(--foreground)" }}>
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
                        backgroundColor: !selectedState ? "#FAF9F6" : "#fff",
                        borderColor: errors.city ? "#dc2626" : "#EDE8DE"
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
                        backgroundColor: !selectedState ? "#FAF9F6" : "transparent",
                        borderColor: errors.city ? "#dc2626" : "#EDE8DE"
                      }}
                    />
                  )}
                  {errors.city && (
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "4px" }}>{errors.city}</p>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "6px", color: "var(--foreground)" }}>
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
                      borderColor: errors.postalCode ? "#dc2626" : "#EDE8DE"
                    }}
                  />
                  {errors.postalCode && (
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "4px" }}>{errors.postalCode}</p>
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
                <span style={{ fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 500 }}>
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
                    border: "1px solid #EDE8DE",
                    backgroundColor: "#FAF9F6",
                    color: "var(--foreground)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.76rem",
                    letterSpacing: "0.1em"
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
                    borderRadius: "8px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    fontWeight: 700,
                    fontSize: "0.76rem",
                    letterSpacing: "0.12em",
                    boxShadow: "0 4px 14px rgba(85, 104, 50, 0.2)"
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
          backgroundColor: "#ffffff",
          border: "1px solid #EDE8DE",
          padding: "clamp(28px, 6vw, 48px) clamp(18px, 5vw, 38px)",
          borderRadius: "14px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.04)",
          textAlign: "center"
        }}
      >
        {/* Atelier Crest */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "rgba(85, 104, 50, 0.08)",
            border: "1.5px solid rgba(85, 104, 50, 0.25)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 16px",
            color: "var(--primary)"
          }}
        >
          <Sparkles size={24} strokeWidth={1.5} />
        </div>

        <p className="eyebrow" style={{ color: "var(--primary)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em" }}>
          GEMORA DIAM · PRIVATE CLIENT PORTAL
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 4vw, 2.3rem)", margin: "8px 0 10px 0", color: "var(--foreground)", fontWeight: 600, letterSpacing: "-0.01em" }}>
          {isRegister ? "Create An Account" : "Welcome Back"}
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.6, margin: "0 0 28px 0" }}>
          {isRegister
            ? "Create your private account to curate wishlists, view order details, and explore bespoke pieces."
            : "Sign in to access your order history, authenticated invoices, and saved fine jewelry."}
        </p>

        {/* Tab Segment Switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            padding: "4px",
            backgroundColor: "#FAF9F6",
            borderRadius: "8px",
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
              borderRadius: "6px",
              backgroundColor: !isRegister ? "var(--primary)" : "transparent",
              color: !isRegister ? "#ffffff" : "var(--muted-foreground)",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.74rem",
              letterSpacing: "0.12em",
              transition: "all 0.2s ease",
              boxShadow: !isRegister ? "0 2px 8px rgba(85, 104, 50, 0.25)" : "none"
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
              borderRadius: "6px",
              backgroundColor: isRegister ? "var(--primary)" : "transparent",
              color: isRegister ? "#ffffff" : "var(--muted-foreground)",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.74rem",
              letterSpacing: "0.12em",
              transition: "all 0.2s ease",
              boxShadow: isRegister ? "0 2px 8px rgba(85, 104, 50, 0.25)" : "none"
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
              color: "#dc2626",
              fontSize: "0.85rem",
              borderRadius: "6px",
              textAlign: "left"
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", textAlign: "left" }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
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
            <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", display: "block", marginBottom: "6px" }}>
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
              <label style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>
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
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "0.78rem",
              letterSpacing: "0.16em",
              textAlign: "center",
              opacity: loading ? 0.75 : 1,
              transition: "all 0.2s ease",
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
