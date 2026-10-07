import React, { createContext, useContext, useEffect, useState } from "react";
import { CURRENCIES, getProduct } from "./products";

const defaultUser = {
  name: "Isabella Laurent",
  email: "isabella@example.com",
  phone: "+1 212 555 0198",
  points: 2840,
  tier: "Gold Circle",
  addresses: [
    {
      id: "a1",
      label: "Home",
      name: "Isabella Laurent",
      line: "740 Park Avenue, Apt 12B",
      city: "New York, NY 10021",
      country: "United States",
      isDefault: true
    },
    {
      id: "a2",
      label: "Office",
      name: "Isabella Laurent",
      line: "1 Rockefeller Plaza, Fl 20",
      city: "New York, NY 10020",
      country: "United States",
      isDefault: false
    }
  ]
};

const Ctx = createContext(null);

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(["eternelle-solitaire", "verdant-drop"]);
  const [currency, setCurrency] = useState("USD");
  const [user, setUser] = useState(defaultUser);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const notify = (title, description = "") => {
    setToastMessage({ title, description });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    setCart(load("gemora.cart", []));
    setWishlist(load("gemora.wishlist", ["eternelle-solitaire", "verdant-drop"]));
    setCurrency(load("gemora.currency", "USD"));
    setUser(load("gemora.user", defaultUser));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("gemora.cart", JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem("gemora.wishlist", JSON.stringify(wishlist));
  }, [wishlist, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem("gemora.currency", JSON.stringify(currency));
  }, [currency, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem("gemora.user", JSON.stringify(user));
  }, [user, ready]);

  const format = (usd) => {
    const c = CURRENCIES[currency] || CURRENCIES.USD;
    return c.symbol + Math.round(usd * c.rate).toLocaleString(currency === "INR" ? "en-IN" : "en-US");
  };

  const addToCart = (productId, metal = "18k Yellow Gold", size) => {
    const key = `${productId}|${metal}|${size ?? ""}`;
    const p = getProduct(productId);
    setCart((c) => {
      const ex = c.find((i) => i.key === key);
      return ex
        ? c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { key, productId, metal, size, qty: 1 }];
    });
    notify("Added to Bag", `${p?.name} • ${metal}`);
    setCartOpen(true);
  };

  const toggleWishlist = (id) => {
    const p = getProduct(id);
    setWishlist((w) => {
      const exists = w.includes(id);
      if (exists) {
        notify("Removed from Wishlist", p?.name);
        return w.filter((x) => x !== id);
      } else {
        notify("Added to Wishlist", p?.name);
        return [...w, id];
      }
    });
  };

  const updateQty = (key, qty) => {
    setCart((c) =>
      qty < 1 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty } : i))
    );
  };

  const removeItem = (key) => {
    setCart((c) => c.filter((i) => i.key !== key));
    notify("Item Removed", "Your bag has been updated.");
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((s, i) => s + (getProduct(i.productId)?.price ?? 0) * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider
      value={{
        cart,
        wishlist,
        currency,
        user,
        cartOpen,
        setCartOpen,
        setCurrency,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        toggleWishlist,
        setUser,
        format,
        cartCount,
        subtotal,
        notify
      }}
    >
      {children}

      {/* Luxury Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 99999,
            backgroundColor: "#181f13",
            color: "#ffffff",
            padding: "16px 22px",
            borderRadius: "4px",
            borderLeft: "4px solid #556832",
            border: "1px solid rgba(85, 104, 50, 0.4)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            animation: "fadeIn 0.25s ease-out",
            maxWidth: "380px"
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "rgba(85, 104, 50, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c5a059",
              fontSize: "0.9rem"
            }}
          >
            ✦
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ffffff" }}>
              {toastMessage.title}
            </div>
            {toastMessage.description && (
              <div style={{ fontSize: "0.78rem", color: "#a5b09e", marginTop: "2px" }}>
                {toastMessage.description}
              </div>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
