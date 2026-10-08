import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  CUSTOMER_TOKEN_NAME,
  storeEncryptedCustomerId,
  removeEncryptedCustomerId,
  getDecryptedCustomerId
} from "./cryptoStorage";


export function mapBackendItem(item) {
  let basePrice = 0;
  if (item.pricing?.priceType === "metal_wise") {
    basePrice = item.pricing.metalWisePrices?.[0]?.price || 0;
  } else if (item.pricing?.priceType === "metal_with_stone_diamond_carat") {
    const p = item.pricing.metalWithStoneDiamondCaratPrices?.[0];
    basePrice = p?.price || p?.caratPrices?.[0]?.price || 0;
  }

  // Extract metals from both pricing types
  const metalWiseMetals = (item.pricing?.metalWisePrices || [])
    .map((m) => m.metalname)
    .filter(Boolean);
  const caratMetals = (item.pricing?.metalWithStoneDiamondCaratPrices || [])
    .map((m) => m.metalname)
    .filter(Boolean);
  const metals = Array.from(new Set([...metalWiseMetals, ...caratMetals]));

  // Normalize all item attributes from backend
  const ringSizes = (item.ringsizes || []).map((r) => (typeof r === "object" ? r.ringsize : r)).filter(Boolean);
  const shapes = (item.shapes || []).map((s) => (typeof s === "object" ? s.shapename : s)).filter(Boolean);
  const clarities = (item.clarities || []).map((c) => (typeof c === "object" ? c.clarityname : c)).filter(Boolean);
  const diamondColors = (item.diamondcolors || []).map((c) => (typeof c === "object" ? c.colorname : c)).filter(Boolean);
  const bandColors = (item.bandcolors || []).map((c) => (typeof c === "object" ? c.colorname : c)).filter(Boolean);
  const stones = (item.stones || []).map((s) => (typeof s === "object" ? s.stonename : s)).filter(Boolean);
  const styles = (item.styles || []).map((s) => (typeof s === "object" ? s.stylename : s)).filter(Boolean);

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
    metals,
    ringSizes,
    shapes,
    clarities,
    diamondColors,
    bandColors,
    stones,
    styles,
    pricing: item.pricing,
    status: item.status,
    bestseller: true
  };
}

export function getItemPrice(product, selectedMetal, selectedCarat) {
  if (!product || !product.pricing) return product?.price || 0;
  const { priceType, metalWisePrices, metalWithStoneDiamondCaratPrices } = product.pricing;

  if (priceType === "metal_wise") {
    if (Array.isArray(metalWisePrices) && metalWisePrices.length > 0) {
      if (selectedMetal) {
        const matched = metalWisePrices.find(
          (m) => (m.metalname || "").trim().toLowerCase() === selectedMetal.trim().toLowerCase()
        );
        if (matched && typeof matched.price === "number") return matched.price;
      }
      return metalWisePrices[0]?.price ?? (product.price || 0);
    }
  } else if (priceType === "metal_with_stone_diamond_carat") {
    if (Array.isArray(metalWithStoneDiamondCaratPrices) && metalWithStoneDiamondCaratPrices.length > 0) {
      let matchedGroup = metalWithStoneDiamondCaratPrices[0];
      if (selectedMetal) {
        const found = metalWithStoneDiamondCaratPrices.find(
          (m) => (m.metalname || "").trim().toLowerCase() === selectedMetal.trim().toLowerCase()
        );
        if (found) matchedGroup = found;
      }

      if (matchedGroup) {
        if (!matchedGroup.hasCarat && typeof matchedGroup.price === "number" && matchedGroup.price !== null) {
          return matchedGroup.price;
        }
        if (Array.isArray(matchedGroup.caratPrices) && matchedGroup.caratPrices.length > 0) {
          if (selectedCarat) {
            const matchedCarat = matchedGroup.caratPrices.find(
              (c) => (c.diamondsize || "").trim().toLowerCase() === selectedCarat.trim().toLowerCase()
            );
            if (matchedCarat && typeof matchedCarat.price === "number") {
              return matchedCarat.price;
            }
          }
          return matchedGroup.caratPrices[0]?.price ?? (product.price || 0);
        }
        if (typeof matchedGroup.price === "number" && matchedGroup.price !== null) {
          return matchedGroup.price;
        }
      }
    }
  }
  return product.price || 0;
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
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [cart, setCart] = useState(() => load("gemora.cart", []));
  const [wishlist, setWishlist] = useState(() => load("gemora.wishlist", []));
  const [currency, setCurrency] = useState(() => {
    const saved = load("gemora.currency", null);
    if (saved) return saved;
    const storeCur = load("gemora.storeCurrency", null);
    return storeCur?.currency || "INR";
  });
  const [storeCurrency, setStoreCurrency] = useState(() => load("gemora.storeCurrency", null));
  const [user, setUser] = useState(null);

  // On mount: Clean up any legacy user storage and securely restore session from backend using customer token
  useEffect(() => {
    localStorage.removeItem("gemora.user");
    localStorage.removeItem("gemora.customer_id");
    localStorage.removeItem("gemora.token");
    localStorage.removeItem("gemora.token_expiry");
    localStorage.removeItem("gemora.loggedOut");

    const token = localStorage.getItem("customer_token");
    const encryptedId = localStorage.getItem(CUSTOMER_TOKEN_NAME);

    if (!token || !encryptedId) {
      setUser(null);
      return;
    }

    fetch(`${backendUrl}/Customer/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.customer) {
          const customerId = data.customer_id || data.customer._id;
          setUser({
            ...data.customer,
            _id: customerId,
            id: customerId,
            fullname: data.customer.fullname,
            email: data.customer.email,
            phone: data.customer.phone || ""
          });
        } else {
          removeEncryptedCustomerId();
          localStorage.removeItem("customer_token");
          localStorage.removeItem("customer_id");
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, [backendUrl]);
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

  const changeCurrency = useCallback((newCode) => {
    setCurrency(newCode);
    localStorage.setItem("gemora.currency", JSON.stringify(newCode));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeEncryptedCustomerId();
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_id");
    localStorage.removeItem("gemora.user");
    localStorage.removeItem("gemora.customer_id");
    localStorage.removeItem("gemora.token");
    localStorage.removeItem("gemora.token_expiry");
    localStorage.removeItem("gemora.loggedOut");
    notify("Logged Out", "You have successfully signed out of your account.");
  }, [notify]);

  const signup = useCallback(
    async ({ fullname, email, password, phone }) => {
      try {
        const finalFullName = (fullname || "").trim();
        const res = await fetch(`${backendUrl}/Customer/Signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullname: finalFullName, email, password, phone })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to create account");
        }

        const customerId = data.customer_id || data.customer?._id;
        const token = data.token;

        if (customerId) {
          storeEncryptedCustomerId(customerId);
          localStorage.setItem("customer_id", customerId);
        }
        if (token) {
          localStorage.setItem("customer_token", token);
        }

        const customerUser = {
          ...data.customer,
          _id: customerId,
          id: customerId,
          fullname: data.customer.fullname || finalFullName,
          email: data.customer.email || email,
          phone: data.customer.phone || phone || ""
        };

        setUser(customerUser);


        notify("Account Created", `Welcome to Maison Gemora, ${customerUser.fullname}!`);
        return { success: true, customer: customerUser, token, customer_id: customerId };
      } catch (err) {
        notify("Registration Error", err.message || "Could not register account");
        return { success: false, error: err.message };
      }
    },
    [backendUrl, notify]
  );

  const login = useCallback(
    async (credentials) => {
      try {
        const res = await fetch(`${backendUrl}/Customer/Signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials?.email, password: credentials?.password })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Invalid email or password");
        }

        const customerId = data.customer_id || data.customer?._id;
        const token = data.token;

        if (customerId) {
          storeEncryptedCustomerId(customerId);
          localStorage.setItem("customer_id", customerId);
        }
        if (token) {
          localStorage.setItem("customer_token", token);
        }

        const customerUser = {
          ...data.customer,
          _id: customerId,
          id: customerId,
          fullname: data.customer.fullname,
          email: data.customer.email,
          phone: data.customer.phone || ""
        };

        setUser(customerUser);


        notify("Welcome Back", `Signed in as ${customerUser.fullname}`);
        return { success: true, customer: customerUser, token, customer_id: customerId };
      } catch (err) {
        notify("Sign In Error", err.message || "Could not sign in");
        return { success: false, error: err.message };
      }
    },
    [backendUrl, notify]
  );

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
              const saved = localStorage.getItem("gemora.currency");
              if (!saved && data.currency.currency) {
                setCurrency(data.currency.currency);
              }
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



  const getProduct = useCallback(
    (id) => {
      if (!id) return null;
      return (
        products.find(
          (p) => String(p.id) === String(id) || String(p.rawId) === String(id) || String(p._id) === String(id)
        ) || null
      );
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

  const addToCart = (productId, metal = "", size = "", carat = "", customPrice = null) => {
    const p = getProduct(productId);
    const resolvedPrice =
      customPrice !== null && customPrice !== undefined
        ? Number(customPrice)
        : getItemPrice(p, metal, carat);
    const key = `${productId}|${metal || ""}|${size || ""}|${carat || ""}`;
    setCart((c) => {
      const ex = c.find((i) => i.key === key);
      return ex
        ? c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { key, productId, metal, size, carat, price: resolvedPrice, qty: 1 }];
    });
    notify("Added to Bag", `${p?.name || "Jewelry Piece"}${metal ? " • " + metal : ""}`);
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

  const subtotal = cart.reduce(
    (s, i) => s + (i.price !== undefined && i.price !== null ? i.price : (getProduct(i.productId)?.price ?? 0)) * i.qty,
    0
  );
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
        setCurrency: changeCurrency,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        toggleWishlist,
        setUser,
        login,
        signup,
        logout,
        getProduct,
        getItemPrice,
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
        settingsLoading,
        getDecryptedCustomerId,
        CUSTOMER_TOKEN_NAME
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