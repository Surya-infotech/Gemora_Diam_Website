import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Gift } from "lucide-react";
import { useStore } from "../lib/store";
import { CartLines } from "../components/CartLines";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, subtotal, format, clearCart, showToast, user } = useStore();
  const [gift, setGift] = useState(false);
  const [msg, setMsg] = useState("");

  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 35;
  const wrap = gift ? 15 : 0;
  const total = subtotal + shipping + wrap;

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
        {/* Cart Item Lines */}
        <div style={{ flex: 1 }}>
          <CartLines />
        </div>

        {/* Order Summary Sidebar */}
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

            {gift && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted-foreground)" }}>Gift wrapping</span>
                <span>{format(wrap)}</span>
              </div>
            )}
          </div>

          {/* Signature Gift Wrapping Toggle */}
          <div style={{ marginTop: "24px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
                <Gift size={16} style={{ color: "var(--gold-deep)" }} strokeWidth={1.4} />
                Signature gift wrapping
              </span>
              <input
                type="checkbox"
                checked={gift}
                onChange={(e) => setGift(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--primary)", cursor: "pointer" }}
              />
            </label>

            {gift && (
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value.slice(0, 200))}
                placeholder="Your handwritten card message..."
                rows={3}
                style={{
                  marginTop: "12px",
                  width: "100%",
                  border: "1px solid var(--border)",
                  backgroundColor: "transparent",
                  padding: "10px",
                  fontSize: "0.85rem",
                  outline: "none",
                  resize: "none"
                }}
              />
            )}
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

          {/* Checkout Button */}
          <button
            onClick={() => {
              if (!user) {
                showToast("Please sign in to your account to proceed to checkout.", "error");
                navigate("/profile");
                return;
              }
              showToast("Order placed successfully! A confirmation is on its way to your email.", "success");
              clearCart();
            }}
            className="eyebrow"
            style={{
              width: "100%",
              marginTop: "24px",
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
    </div>
  );
}
