import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Award, Trash2 } from "lucide-react";
import { useStore } from "../lib/store";
import { getProduct } from "../lib/products";
import { ORDERS } from "../lib/orders";
import { StatusBadge } from "../components/StatusBadge";

const fieldStyle = {
  width: "100%",
  border: "1px solid var(--border)",
  backgroundColor: "transparent",
  padding: "10px 14px",
  fontSize: "0.88rem",
  color: "var(--foreground)",
  outline: "none"
};

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";
  const { user } = useStore();

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "addresses", label: "Saved Addresses" },
    { id: "wishlist", label: "Wishlist" },
    { id: "settings", label: "Security & Settings" },
  ];

  return (
    <div className="container-luxury" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
      <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>My Account</p>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.6rem, 5vw, 3.8rem)", marginTop: "12px" }}>
        Bonjour, {user.name.split(" ")[0]}
      </h1>

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          overflowX: "auto",
          borderBottom: "1px solid var(--border)",
          marginTop: "36px",
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
              borderBottom: currentTab === t.id ? "2px solid var(--primary)" : "2px solid transparent",
              paddingBottom: "14px",
              color: currentTab === t.id ? "var(--foreground)" : "var(--muted-foreground)",
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "40px" }}>
        {currentTab === "overview" && <OverviewTab />}
        {currentTab === "addresses" && <AddressesTab />}
        {currentTab === "wishlist" && <WishlistTab />}
        {currentTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const { user, format } = useStore();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
      {/* Welcome Card in Brand Green (#556832) */}
      <div
        style={{
          gridColumn: "span 2",
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
          padding: "40px",
          borderRadius: "2px"
        }}
      >
        <p className="eyebrow" style={{ color: "var(--gold)" }}>Welcome Back</p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", marginTop: "12px" }}>
          Your private salon awaits
        </h2>
        <p style={{ marginTop: "14px", fontSize: "0.92rem", lineHeight: 1.6, opacity: 0.85, maxWidth: "560px" }}>
          Enjoy priority preview access to rare natural gemstone releases, private atelier viewings, and complimentary cleaning as an esteemed {user.tier} member.
        </p>
        <Link
          to="/shop?high=true"
          className="eyebrow"
          style={{
            marginTop: "28px",
            display: "inline-block",
            backgroundColor: "var(--gold)",
            color: "#1c2211",
            padding: "12px 24px",
            fontWeight: 600
          }}
        >
          Preview High Jewelry
        </Link>
      </div>

      {/* Loyalty Tier Card */}
      <div
        style={{
          border: "1px solid var(--border)",
          backgroundColor: "var(--card)",
          padding: "36px",
          borderRadius: "2px"
        }}
      >
        <Award size={30} style={{ color: "var(--gold-deep)" }} strokeWidth={1.3} />
        <p className="eyebrow" style={{ color: "var(--muted-foreground)", marginTop: "16px" }}>Loyalty Tier</p>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", marginTop: "4px" }}>{user.tier}</p>
        <p style={{ fontSize: "0.9rem", color: "var(--foreground)", marginTop: "16px" }}>
          {user.points.toLocaleString()} points accumulated
        </p>

        {/* Progress Bar */}
        <div style={{ marginTop: "8px", width: "100%", height: "6px", backgroundColor: "var(--muted)", borderRadius: "3px", overflow: "hidden" }}>
          <div
            style={{
              width: `${(user.points / 5000) * 100}%`,
              height: "100%",
              backgroundColor: "var(--primary)",
              transition: "width 0.4s ease"
            }}
          />
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "8px" }}>
          {(5000 - user.points).toLocaleString()} points to Platinum Circle tier
        </p>
      </div>

      {/* Recent Orders Section */}
      <div style={{ gridColumn: "1 / -1", marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>Recent Orders</h3>
          <Link to="/orders" className="eyebrow" style={{ borderBottom: "1px solid var(--foreground)", paddingBottom: "2px" }}>
            View All Orders
          </Link>
        </div>

        <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
          {ORDERS.slice(0, 2).map((o) => {
            const firstProduct = getProduct(o.items[0]?.productId);
            return (
              <div
                key={o.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                  padding: "20px"
                }}
              >
                <img
                  src={firstProduct?.image}
                  alt=""
                  style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "2px" }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem" }}>{o.id}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{format(o.total)}</p>
                </div>
                <StatusBadge s={o.status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AddressesTab() {
  const { user, setUser, showToast } = useStore();
  const [form, setForm] = useState({ label: "", line: "", city: "", country: "" });

  const saveAddresses = (addresses) => {
    setUser({ ...user, addresses });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!form.label || !form.line || !form.city || !form.country) {
      showToast("Please fill in all address fields", "error");
      return;
    }
    const newAddress = {
      id: "addr-" + Date.now(),
      name: user.name,
      isDefault: user.addresses.length === 0,
      ...form
    };
    saveAddresses([...user.addresses, newAddress]);
    setForm({ label: "", line: "", city: "", country: "" });
    showToast("Address saved successfully", "success");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
      {user.addresses.map((a) => (
        <div
          key={a.id}
          style={{
            border: a.isDefault ? "2px solid var(--primary)" : "1px solid var(--border)",
            backgroundColor: "var(--card)",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p className="eyebrow" style={{ color: "var(--foreground)" }}>{a.label}</p>
              {a.isDefault && (
                <span className="eyebrow" style={{ color: "var(--primary)", fontWeight: 600 }}>Default</span>
              )}
            </div>
            <p style={{ marginTop: "16px", fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted-foreground)" }}>
              <strong style={{ color: "var(--foreground)" }}>{a.name}</strong><br />
              {a.line}<br />
              {a.city}<br />
              {a.country}
            </p>
          </div>

          <div style={{ marginTop: "24px", display: "flex", gap: "16px", fontSize: "0.78rem" }}>
            {!a.isDefault && (
              <button
                type="button"
                onClick={() => {
                  saveAddresses(user.addresses.map((x) => ({ ...x, isDefault: x.id === a.id })));
                  showToast("Default address updated", "success");
                }}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid var(--foreground)",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                Set as default
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                saveAddresses(user.addresses.filter((x) => x.id !== a.id));
                showToast("Address removed", "info");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#d9534f",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                padding: 0
              }}
            >
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </div>
      ))}

      {/* Add New Address Form */}
      <form
        onSubmit={handleAddAddress}
        style={{
          border: "1px dashed var(--border)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <p className="eyebrow">Add New Address</p>
        <input
          style={fieldStyle}
          placeholder="Label (e.g. Paris Villa, Office)"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          style={fieldStyle}
          placeholder="Street address"
          value={form.line}
          onChange={(e) => setForm({ ...form, line: e.target.value })}
        />
        <input
          style={fieldStyle}
          placeholder="City, postal code"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          style={fieldStyle}
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />
        <button
          type="submit"
          className="eyebrow"
          style={{
            marginTop: "8px",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            padding: "12px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Save Address
        </button>
      </form>
    </div>
  );
}

function WishlistTab() {
  const { wishlist, toggleWishlist, addToCart, format } = useStore();

  if (!wishlist.length) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem" }}>Your wishlist is empty</p>
        <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
          Explore our fine jewelry vaults and save pieces that speak to you.
        </p>
        <Link
          to="/shop"
          className="eyebrow"
          style={{
            marginTop: "24px",
            display: "inline-block",
            borderBottom: "1px solid var(--foreground)",
            paddingBottom: "4px"
          }}
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
      {wishlist.map((id) => {
        const p = getProduct(id);
        if (!p) return null;
        return (
          <div key={id} style={{ display: "flex", flexDirection: "column" }}>
            <img
              src={p.image}
              alt={p.name}
              style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", borderRadius: "2px" }}
            />
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", marginTop: "12px" }}>{p.name}</p>
            <p style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", marginTop: "4px" }}>{format(p.price)}</p>

            <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
              <button
                onClick={() => {
                  addToCart(p.id, "18k Yellow Gold");
                  toggleWishlist(p.id);
                }}
                className="eyebrow"
                style={{
                  flex: 1,
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  padding: "10px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Move to Bag
              </button>
              <button
                onClick={() => toggleWishlist(p.id)}
                aria-label="Remove from wishlist"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "transparent",
                  padding: "0 12px",
                  cursor: "pointer"
                }}
              >
                <Trash2 size={16} strokeWidth={1.4} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SettingsTab() {
  const { user, setUser, showToast } = useStore();
  const [profileData, setProfileData] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [passData, setPassData] = useState({ current: "", next: "", confirm: "" });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setUser({ ...user, ...profileData });
    showToast("Profile details updated successfully", "success");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passData.next.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    if (passData.next !== passData.confirm) {
      showToast("New passwords do not match", "error");
      return;
    }
    setPassData({ current: "", next: "", confirm: "" });
    showToast("Password updated successfully", "success");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "48px" }}>
      {/* Profile Details */}
      <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>Profile Details</h3>
        <input
          style={fieldStyle}
          value={profileData.name}
          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          placeholder="Full name"
        />
        <input
          style={fieldStyle}
          value={profileData.email}
          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          placeholder="Email"
        />
        <input
          style={fieldStyle}
          value={profileData.phone}
          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          placeholder="Phone"
        />
        <button
          type="submit"
          className="eyebrow"
          style={{
            alignSelf: "flex-start",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            padding: "12px 24px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Save Changes
        </button>
      </form>

      {/* Password Reset */}
      <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>Security & Access</h3>
        <input
          type="password"
          style={fieldStyle}
          value={passData.current}
          onChange={(e) => setPassData({ ...passData, current: e.target.value })}
          placeholder="Current password"
        />
        <input
          type="password"
          style={fieldStyle}
          value={passData.next}
          onChange={(e) => setPassData({ ...passData, next: e.target.value })}
          placeholder="New password (min 8 chars)"
        />
        <input
          type="password"
          style={fieldStyle}
          value={passData.confirm}
          onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
          placeholder="Confirm new password"
        />
        <button
          type="submit"
          className="eyebrow"
          style={{
            alignSelf: "flex-start",
            border: "1px solid var(--foreground)",
            backgroundColor: "transparent",
            padding: "12px 24px",
            cursor: "pointer"
          }}
        >
          Update Password
        </button>
      </form>

      {/* Email Preferences */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>Salon Preferences</h3>
        {[
          "New collection previews & private vault releases",
          "Private Paris atelier event invitations",
          "Order tracking and courier notifications",
          "Fine jewelry care and diamond styling notes"
        ].map((item, idx) => (
          <label
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "12px",
              fontSize: "0.85rem",
              cursor: "pointer",
              color: "var(--foreground)"
            }}
          >
            <span>{item}</span>
            <input
              type="checkbox"
              defaultChecked={idx < 3}
              onChange={() => showToast("Salon preferences updated", "info")}
              style={{ width: "16px", height: "16px", accentColor: "var(--primary)", cursor: "pointer" }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
