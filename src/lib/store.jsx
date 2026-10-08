import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CURRENCIES, PRODUCTS as FALLBACK_PRODUCTS } from "./products";

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

export function mapBackendItem(item) {
  let basePrice = 0;
  if (item.pricing?.priceType === "metal_wise") {
    basePrice = item.pricing.metalWisePrices?.[0]?.price || 0;
  } else if (item.pricing?.priceType === "metal_with_stone_diamond_carat") {
    const p = item.pricing.metalWithStoneDiamondCaratPrices?.[0];
    basePrice = p?.price || p?.caratPrices?.[0]?.price || 0;
  }

  const metals = (item.pricing?.metalWisePrices || [])
    .map((m) => m.metalname)
    .filter(Boolean);

  const gallery = (item.galleryimages || []).map((g) => g.imageUrl).filter(Boolean);
  const mainImage = item.image || gallery[0] || "";

  return {
    id: String(item.itemid || item._id),
    rawId: item.itemid,
    _id: item._id,
    sku: item.sku || "",
    name: item.itemname,
    category: item.categoryname || "Jewelry",
    categoryid: item.categoryid,
    subcategory: item.subcategoryname || "",
    price: basePrice,
    image: mainImage,
    galleryImages: gallery,
    video: item.video || item.galleryvideos?.[0]?.videoUrl || "",
    description: item.description || "",
    metals: metals.length > 0 ? metals : ["18k Yellow Gold", "14k White Gold", "Rose Gold", "Platinum"],
    ringSizes: item.ringsizes || [],
    shapes: item.shapes || [],
    clarities: item.clarities || [],
    colors: item.diamondcolors || [],
    stones: item.stones || [],
    styles: item.styles || [],
    pricing: item.pricing,
    status: item.status,
    bestseller: true
  };
}

const Ctx = createContext(null);

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function formatCurrencyWithDetails(amount, details) {
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

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load("gemora.cart", []));
  const [wishlist, setWishlist] = useState(() => load("gemora.wishlist", ["eternelle-solitaire", "verdant-drop"]));
  const [currency, setCurrency] = useState(() => load("gemora.currency", "USD"));
  const [storeCurrency, setStoreCurrency] = useState(() => load("gemora.storeCurrency", null));
  const [user, setUser] = useState(() => load("gemora.user", defaultUser));
  const [generalSettings, setGeneralSettings] = useState(() => load("gemora.settings", null));
  const [socialMedia, setSocialMedia] = useState(() => load("gemora.socialMedia", []));
  const [products, setProducts] = useState(() => load("gemora.products", []));
  const [categories, setCategories] = useState(() => load("gemora.categories", []));
  const [policies, setPolicies] = useState(() => load("gemora.policies", []));
  const [faqs, setFaqs] = useState(() => load("gemora.faqs", []));
  const [banners, setBanners] = useState(() => load("gemora.banners", []));
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const notify = useCallback((title, description = "") => {
    setToastMessage({ title, description });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8085";

  // Fetch all Admin Panel data
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        setSettingsLoading(true);
        setProductsLoading(true);

        // 1. General Settings & Currency from Misc Setting
        fetch(`${backendUrl}/System/GetGeneralSetting_landingpage`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !data) return;
            if (data.generalSetting) {
              setGeneralSettings(data.generalSetting);
              localStorage.setItem("gemora.settings", JSON.stringify(data.generalSetting));
            }
            if (Array.isArray(data.socialMedia)) {
              setSocialMedia(data.socialMedia);
              localStorage.setItem("gemora.socialMedia", JSON.stringify(data.socialMedia));
            }
            if (data.currency) {
              setStoreCurrency(data.currency);
              localStorage.setItem("gemora.storeCurrency", JSON.stringify(data.currency));
            }
          })
          .catch((err) => console.warn("Failed to fetch settings:", err));

        // 2. Products (Active items)
        fetch(`${backendUrl}/Products/GetActiveItems`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !Array.isArray(data)) return;
            const mapped = data.map(mapBackendItem);
            setProducts(mapped);
            localStorage.setItem("gemora.products", JSON.stringify(mapped));
          })
          .catch((err) => console.warn("Failed to fetch products:", err))
          .finally(() => {
            if (isMounted) setProductsLoading(false);
          });

        // 3. Categories
        fetch(`${backendUrl}/Attributes/GetActiveCategories`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !Array.isArray(data)) return;
            setCategories(data);
            localStorage.setItem("gemora.categories", JSON.stringify(data));
          })
          .catch((err) => console.warn("Failed to fetch categories:", err));

        // 4. Policies
        fetch(`${backendUrl}/Support/GetActivePolicies`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !Array.isArray(data)) return;
            setPolicies(data);
            localStorage.setItem("gemora.policies", JSON.stringify(data));
          })
          .catch((err) => console.warn("Failed to fetch policies:", err));

        // 5. FAQs
        fetch(`${backendUrl}/Support/GetActiveFAQs`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !data) return;
            const list = Array.isArray(data) ? data : [data];
            setFaqs(list);
            localStorage.setItem("gemora.faqs", JSON.stringify(list));
          })
          .catch((err) => console.warn("Failed to fetch FAQs:", err));

        // 6. Banners
        fetch(`${backendUrl}/Support/GetActiveBanners`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !Array.isArray(data)) return;
            setBanners(data);
            localStorage.setItem("gemora.banners", JSON.stringify(data));
          })
          .catch((err) => console.warn("Failed to fetch banners:", err));
      } finally {
        if (isMounted) setSettingsLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [backendUrl]);

  useEffect(() => {
    localStorage.setItem("gemora.cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("gemora.wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("gemora.currency", JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("gemora.user", JSON.stringify(user));
  }, [user]);

  const getProduct = useCallback(
    (id) => {
      if (!id) return null;
      const found = products.find(
        (p) => String(p.id) === String(id) || String(p.rawId) === String(id) || String(p._id) === String(id)
      );
      if (found) return found;
      return FALLBACK_PRODUCTS.find((p) => String(p.id) === String(id));
    },
    [products]
  );

  const format = useCallback(
    (amount) => {
      if (storeCurrency) {
        return formatCurrencyWithDetails(amount, storeCurrency);
      }
      return formatCurrencyWithDetails(amount, {
        currencysymbol: "$",
        currencyposition: "left",
        decimal: 2,
        thousandseparator: ",",
        decimalseparator: "."
      });
    },
    [storeCurrency]
  );

  const addToCart = (productId, metal = "18k Yellow Gold", size) => {
    const key = `${productId}|${metal}|${size ?? ""}`;
    const p = getProduct(productId);
    setCart((c) => {
      const ex = c.find((i) => i.key === key);
      return ex
        ? c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { key, productId, metal, size, qty: 1 }];
    });
    notify("Added to Bag", `${p?.name || "Jewelry Piece"} • ${metal}`);
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

  // Send Contact Us inquiry to backend Admin Panel
  const submitContactUs = async ({ name, email, message }) => {
    try {
      const res = await fetch(`${backendUrl}/Support/AddContactUs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit message");
      }
      notify("Message Received", "Our concierge will reply within 24 hours.");
      return { success: true, data };
    } catch (err) {
      notify("Submission Error", err.message || "Could not send message. Please try again.");
      return { success: false, error: err };
    }
  };

  // Subscribe Newsletter to backend Admin Panel
  const subscribeNewsletter = async (email) => {
    try {
      const res = await fetch(`${backendUrl}/Support/SubscribeNewsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Subscription failed");
      }
      notify("Subscribed Successfully", data.message || "Welcome to Gemora Diam!");
      return { success: true, data };
    } catch (err) {
      notify("Subscription Error", err.message || "Could not subscribe. Please try again.");
      return { success: false, error: err };
    }
  };

  return (
    <Ctx.Provider
      value={{
        cart,
        wishlist,
        currency,
        user,
        products,
        productsLoading,
        categories,
        policies,
        faqs,
        banners,
        cartOpen,
        setCartOpen,
        setCurrency,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        toggleWishlist,
        setUser,
        getProduct,
        format,
        cartCount,
        subtotal,
        notify,
        showToast: notify,
        submitContactUs,
        subscribeNewsletter,
        generalSettings,
        socialMedia,
        storeCurrency,
        settingsLoading
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

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}