import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Trash2, LogOut } from "lucide-react";
import { useStore } from "../lib/store";

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
  const rawTab = searchParams.get("tab");
  const currentTab = rawTab === "settings" ? "settings" : "wishlist";
  const { user, logout } = useStore();

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  if (!user) {
    return <SignInView />;
  }

  const tabs = [
    { id: "wishlist", label: "Wishlist" },
    { id: "settings", label: "Security & Settings" },
  ];

  return (
    <div className="container-luxury" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>My Account</p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.6rem, 5vw, 3.8rem)", marginTop: "12px" }}>
            Welcome, {user.fullname ? user.fullname.split(" ")[0] : "Customer"}
          </h1>
        </div>
        <button
          onClick={logout}
          className="eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "transparent",
            color: "#555",
            border: "1px solid var(--border)",
            padding: "10px 22px",
            borderRadius: "2px",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#c33";
            e.currentTarget.style.color = "#c33";
            e.currentTarget.style.backgroundColor = "#fff8f8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "#555";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <LogOut size={15} />
          Log Out
        </button>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
          marginTop: "36px",
          gap: "24px"
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "24px",
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
      </div>

      <div style={{ marginTop: "40px" }}>
        {currentTab === "wishlist" && <WishlistTab />}
        {currentTab === "settings" && <SettingsTab key={user?._id || user?.id || "guest"} />}
      </div>
    </div>
  );
}


function WishlistTab() {
  const { wishlist, toggleWishlist, addToCart, format, getProduct } = useStore();

  if (!wishlist.length) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem" }}>Your wishlist is empty</p>
        <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "var(--muted-foreground)" }}>
          Browse our jewelry collections and save your favorite items.
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "48px" }}>
      {/* Profile Details */}
      <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem" }}>Profile Details</h3>
        <input
          style={fieldStyle}
          value={profileData.fullname}
          onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
          placeholder="Full name"
          required
        />
        <input
          style={fieldStyle}
          type="email"
          value={profileData.email}
          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          placeholder="Email"
          required
        />
        <input
          style={fieldStyle}
          value={profileData.phone}
          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          placeholder="Phone"
        />
        <button
          type="submit"
          disabled={savingProfile}
          className="eyebrow"
          style={{
            alignSelf: "flex-start",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            padding: "12px 24px",
            border: "none",
            cursor: savingProfile ? "not-allowed" : "pointer",
            opacity: savingProfile ? 0.75 : 1
          }}
        >
          {savingProfile ? "Saving..." : "Save Changes"}
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
          disabled={savingPassword}
          className="eyebrow"
          style={{
            alignSelf: "flex-start",
            border: "1px solid var(--foreground)",
            backgroundColor: "transparent",
            padding: "12px 24px",
            cursor: savingPassword ? "not-allowed" : "pointer",
            opacity: savingPassword ? 0.75 : 1
          }}
        >
          {savingPassword ? "Updating..." : "Update Password"}
        </button>
      </form>

      {/* Account Session & Logout */}
      <div
        style={{
          gridColumn: "1 / -1",
          marginTop: "16px",
          padding: "28px 32px",
          backgroundColor: "#fffdfb",
          border: "1px solid #f2ded9",
          borderRadius: "2px",
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
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", color: "#181818", margin: "6px 0 4px 0" }}>
            Account Session &amp; Sign Out
          </h4>
          <p style={{ fontSize: "0.88rem", color: "#666", margin: 0 }}>
            Currently signed in as <strong style={{ color: "#181818" }}>{user?.fullname}</strong> ({user?.email}).
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#a83232",
            color: "#ffffff",
            padding: "14px 28px",
            border: "none",
            borderRadius: "2px",
            fontSize: "0.78rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.2s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#882323")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#a83232")}
        >
          <LogOut size={16} />
          Log Out Account
        </button>
      </div>
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
    <div className="container-luxury" style={{ paddingTop: "70px", paddingBottom: "110px", maxWidth: "540px", margin: "0 auto" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid var(--border)",
          padding: "44px 40px",
          borderRadius: "2px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          textAlign: "center"
        }}
      >
        <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>Gemora Diam</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", marginTop: "12px", color: "var(--foreground)" }}>
          {isRegister ? "Create Account" : "Sign In"}
        </h1>
        <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
          {isRegister
            ? "Create your account to view order history, save items to your wishlist, and enjoy a personalized shopping experience."
            : "Sign in to access your account, track orders, and view your saved jewelry."}
        </p>

        {errorMsg && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px 16px",
              backgroundColor: "#fff0f0",
              border: "1px solid #ffd0d0",
              color: "#c33",
              fontSize: "0.84rem",
              borderRadius: "2px",
              textAlign: "left"
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", display: "block", marginBottom: "6px" }}>
                Full Name
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
            <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#666", display: "block", marginBottom: "6px" }}>
              Email Address
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
              <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#666" }}>
                Password
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
              marginTop: "12px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              padding: "14px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textAlign: "center",
              opacity: loading ? 0.75 : 1
            }}
          >
            {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)", fontSize: "0.85rem", color: "#666" }}>
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg("");
                }}
                style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg("");
                }}
                style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
