import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";


function mapBackendItem(item) {
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
  const ringSizes = (item.ringsizes || [])
    .map((r) => (typeof r === "object" ? r.ringsize : r))
    .filter(Boolean)
    .sort((a, b) => {
      const numA = parseFloat(String(a).replace(/[^0-9.]/g, "")) || 0;
      const numB = parseFloat(String(b).replace(/[^0-9.]/g, "")) || 0;
      if (numA !== numB) return numA - numB;
      return String(a).localeCompare(String(b));
    });
  const shapes = (item.shapes || []).map((s) => (typeof s === "object" ? s.shapename : s)).filter(Boolean);
  const clarities = (item.clarities || []).map((c) => (typeof c === "object" ? c.clarityname : c)).filter(Boolean);
  const diamondColors = (item.diamondcolors || []).map((c) => (typeof c === "object" ? c.colorname : c)).filter(Boolean);
  const bandColors = (item.bandcolors || []).map((c) => (typeof c === "object" ? c.colorname : c)).filter(Boolean);
  const stones = (item.stones || []).map((s) => (typeof s === "object" ? s.stonename : s)).filter(Boolean);
  const styles = (item.styles || []).map((s) => (typeof s === "object" ? s.stylename : s)).filter(Boolean);

  const gallery = (item.galleryimages || []).map((g) => (typeof g === "object" ? g?.imageUrl : g)).filter(Boolean);
  const mainImage = item.image || gallery[0] || "";

  const galleryVideos = (item.galleryvideos || [])
    .map((v) => (typeof v === "object" ? v?.videoUrl || v?.url : v))
    .filter(Boolean);
  const mainVideo = item.video || galleryVideos[0] || "";

  const mongoId = item._id ? String(item._id) : "";
  const numericId = item.itemid !== undefined && item.itemid !== null ? String(item.itemid) : "";
  const primaryId = mongoId || numericId;

  return {
    id: primaryId,
    _id: mongoId || primaryId,
    itemid: numericId,
    rawId: item.itemid,
    sku: item.sku || "",
    name: item.itemname,
    category: item.categoryname || "Jewelry",
    categoryid: item.categoryid,
    subcategory: item.subcategoryname || "",
    price: basePrice,
    image: mainImage,
    galleryImages: gallery,
    video: mainVideo,
    galleryVideos,
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

function getItemPrice(product, selectedMetal, selectedStoneOrCarat, maybeCarat) {
  if (!product || !product.pricing) return product?.price || 0;
  const { priceType, metalWisePrices, metalWithStoneDiamondCaratPrices } = product.pricing;

  let selectedStone = "";
  let selectedCarat = "";
  if (maybeCarat !== undefined) {
    selectedStone = (selectedStoneOrCarat || "").trim();
    selectedCarat = (maybeCarat || "").trim();
  } else {
    selectedCarat = (selectedStoneOrCarat || "").trim();
  }

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
      let matchedGroup = null;

      // 1. Match both metal and stone if stone is provided
      if (selectedMetal && selectedStone) {
        matchedGroup = metalWithStoneDiamondCaratPrices.find(
          (m) =>
            (m.metalname || "").trim().toLowerCase() === selectedMetal.trim().toLowerCase() &&
            (m.stonename || "").trim().toLowerCase() === selectedStone.trim().toLowerCase()
        );
      }

      // 2. Fallback to metal only
      if (!matchedGroup && selectedMetal) {
        matchedGroup = metalWithStoneDiamondCaratPrices.find(
          (m) => (m.metalname || "").trim().toLowerCase() === selectedMetal.trim().toLowerCase()
        );
      }

      // 3. Fallback to first pricing config
      if (!matchedGroup) {
        matchedGroup = metalWithStoneDiamondCaratPrices[0];
      }

      if (matchedGroup) {
        const isCaratPricing =
          matchedGroup.hasCarat !== false && matchedGroup.stonePricingType !== "fixed";

        if (!isCaratPricing && typeof matchedGroup.price === "number" && matchedGroup.price !== null) {
          return matchedGroup.price;
        }

        if (isCaratPricing && Array.isArray(matchedGroup.caratPrices) && matchedGroup.caratPrices.length > 0) {
          if (selectedCarat) {
            const matchedCarat = matchedGroup.caratPrices.find(
              (c) => (c.diamondsize || "").trim().toLowerCase() === selectedCarat.toLowerCase()
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

function formatCurrencyWithDetails(amount, details) {
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
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const customerTokenKey = import.meta.env.VITE_CUSTOMERTOKEN_NAME;
  const customerIdKey = import.meta.env.VITE_CUSTOMERID_NAME;
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [currency, setCurrency] = useState("INR");
  const [storeCurrency, setStoreCurrency] = useState(null);
  const [user, setUser] = useState(null);
  const [generalSettings, setGeneralSettings] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [banners, setBanners] = useState([]);
  const [collectionBanners, setCollectionBanners] = useState([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // On mount: Purge all items from localStorage except CustomerID and customer token, and verify token
  useEffect(() => {
    const allowed = [customerIdKey, customerTokenKey];
    try {
      // Purge all items from localStorage except CustomerID and customer token
      Object.keys(localStorage).forEach((key) => {
        if (!allowed.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // ignore
    }

    const token = localStorage.getItem(customerTokenKey);
    const customerId = localStorage.getItem(customerIdKey);

    if (!token || !customerId) {
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
          const resolvedId = data.customer_id || data.customer._id;
          setUser({
            ...data.customer,
            _id: resolvedId,
            id: resolvedId,
            fullname: data.customer.fullname,
            email: data.customer.email,
            phone: data.customer.phone || ""
          });
        } else {
          localStorage.removeItem(customerTokenKey);
          localStorage.removeItem(customerIdKey);
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, [backendUrl, customerIdKey, customerTokenKey]);

  const notify = useCallback((title, description = "") => {
    setToastMessage({ title, description });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const changeCurrency = useCallback((newCode) => {
    setCurrency(newCode);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(customerTokenKey);
    localStorage.removeItem(customerIdKey);
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_id");
    try {
      Object.keys(localStorage).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch {
      // ignore
    }
    notify("Logged Out", "You have successfully signed out of your account.");
  }, [customerTokenKey, customerIdKey, notify]);

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
          localStorage.setItem(customerIdKey, customerId);
        }
        if (token) {
          localStorage.setItem(customerTokenKey, token);
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

        notify("Account Created", `Welcome to Gemora Diam, ${customerUser.fullname}!`);
        return { success: true, customer: customerUser, token, customer_id: customerId };
      } catch (err) {
        notify("Registration Error", err.message || "Could not register account");
        return { success: false, error: err.message };
      }
    },
    [backendUrl, customerIdKey, customerTokenKey, notify]
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
          localStorage.setItem(customerIdKey, customerId);
        }
        if (token) {
          localStorage.setItem(customerTokenKey, token);
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
    [backendUrl, customerIdKey, customerTokenKey, notify]
  );

  const updateProfile = useCallback(
    async ({ fullname, phone, email }) => {
      try {
        const customerId = user?._id || user?.id || localStorage.getItem(customerIdKey);
        if (!customerId) {
          throw new Error("You must be signed in to update your profile");
        }

        const payload = {};
        if (fullname !== undefined) payload.fullname = fullname;
        if (phone !== undefined) payload.phone = phone;
        if (email !== undefined) payload.email = email;

        const token = localStorage.getItem(customerTokenKey);
        const res = await fetch(`${backendUrl}/Customer/UpdateProfile/${customerId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user": "true",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update profile");
        }

        const updatedCustomer = data.customer || {};
        const resolvedId = data.customer_id || updatedCustomer._id || customerId;
        const updatedUser = {
          ...user,
          ...updatedCustomer,
          _id: resolvedId,
          id: resolvedId,
          fullname: updatedCustomer.fullname || (fullname !== undefined ? fullname : user?.fullname),
          email: updatedCustomer.email || (email !== undefined ? email : user?.email),
          phone: updatedCustomer.phone !== undefined ? updatedCustomer.phone : (phone !== undefined ? phone : (user?.phone || ""))
        };

        setUser(updatedUser);
        notify("Profile Updated", data.message || "Your profile details have been saved.");
        return { success: true, customer: updatedUser, data };
      } catch (err) {
        notify("Update Error", err.message || "Could not save profile changes");
        return { success: false, error: err.message };
      }
    },
    [backendUrl, customerIdKey, customerTokenKey, notify, user]
  );

  const updatePassword = useCallback(
    async ({ currentPassword, newPassword }) => {
      try {
        const customerId = user?._id || user?.id || localStorage.getItem(customerIdKey);
        if (!customerId) {
          throw new Error("You must be signed in to update your password");
        }

        const token = localStorage.getItem(customerTokenKey);
        const res = await fetch(`${backendUrl}/Customer/UpdateProfile/${customerId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user": "true",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update password");
        }

        notify("Password Updated", data.message || "Your password has been updated.");
        return { success: true, data };
      } catch (err) {
        notify("Password Error", err.message || "Could not update password");
        return { success: false, error: err.message };
      }
    },
    [backendUrl, customerIdKey, customerTokenKey, notify, user]
  );

  const getAddresses = useCallback(
    async (customerId) => {
      try {
        const id = customerId || user?.customerid;
        if (!id) return [];
        const token = localStorage.getItem(customerTokenKey);
        const res = await fetch(`${backendUrl}/Customer/GetAddresses/${id}`, {
          headers: {
            "x-user": "true",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.addresses)) {
          return data.addresses;
        }
        return [];
      } catch (err) {
        console.error("Failed to load addresses:", err);
        return [];
      }
    },
    [backendUrl, customerTokenKey, user]
  );

  const addAddress = useCallback(
    async (addressData) => {
      try {
        const targetId = user?.customerid;
        const token = localStorage.getItem(customerTokenKey);
        const res = await fetch(`${backendUrl}/Customer/AddAddress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user": "true",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            ...addressData,
            customerid: targetId
          })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to add address");
        }
        notify("Address Saved", "Your new address has been added successfully.");
        return { success: true, address: data.address };
      } catch (err) {
        notify("Address Error", err.message || "Could not save address");
        return { success: false, error: err.message };
      }
    },
    [backendUrl, customerTokenKey, notify, user]
  );

  const updateAddress = useCallback(
    async (addressId, addressData) => {
      try {
        const token = localStorage.getItem(customerTokenKey);
        const res = await fetch(`${backendUrl}/Customer/UpdateAddress/${addressId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user": "true",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(addressData)
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update address");
        }
        notify("Address Updated", "Your address has been updated successfully.");
        return { success: true, address: data.address };
      } catch (err) {
        notify("Address Error", err.message || "Could not update address");
        return { success: false, error: err.message };
      }
    },
    [backendUrl, customerTokenKey, notify]
  );

  const deleteAddress = useCallback(
    async (addressId) => {
      try {
        const token = localStorage.getItem(customerTokenKey);
        const res = await fetch(`${backendUrl}/Customer/DeleteAddress/${addressId}`, {
          method: "DELETE",
          headers: {
            "x-user": "true",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to delete address");
        }
        notify("Address Deleted", "The address has been removed.");
        return { success: true };
      } catch (err) {
        notify("Error", err.message || "Could not delete address");
        return { success: false, error: err.message };
      }
    },
    [backendUrl, customerTokenKey, notify]
  );

  const setDefaultAddress = useCallback(
    async (addressId) => {
      try {
        const token = localStorage.getItem(customerTokenKey);
        const res = await fetch(`${backendUrl}/Customer/SetDefaultAddress/${addressId}`, {
          method: "PUT",
          headers: {
            "x-user": "true",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to set default address");
        }
        notify("Default Address Set", "Primary shipping address updated.");
        return { success: true, address: data.address };
      } catch (err) {
        notify("Error", err.message || "Could not set default address");
        return { success: false, error: err.message };
      }
    },
    [backendUrl, customerTokenKey, notify]
  );

  const createOrder = useCallback(
    async ({ items, shippingaddress, shippingAddress, subtotal, shipping, total, currencydetails, currency, paymentmethod, paymentMethod }) => {
      try {
        const token = localStorage.getItem(customerTokenKey);
        const targetId = user?.customerid || user?._id || localStorage.getItem(customerIdKey);
        const res = await fetch(`${backendUrl}/Customer/CreateOrder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user": "true",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            customerid: targetId,
            items,
            shippingaddress: shippingaddress || shippingAddress,
            subtotal,
            shipping,
            total,
            currencydetails,
            currency,
            paymentmethod: paymentmethod || paymentMethod
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to place order");
        }

        return { success: true, order: data.order };
      } catch (err) {
        notify("Order Error", err.message || "Could not place order");
        return { success: false, error: err.message };
      }
    },
    [backendUrl, customerIdKey, customerTokenKey, notify, user]
  );

  const getCustomerOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem(customerTokenKey);
      const targetId = user?.customerid || user?._id || localStorage.getItem(customerIdKey);
      if (!targetId) return [];

      const res = await fetch(`${backendUrl}/Customer/GetOrders/${targetId}`, {
        headers: {
          "x-user": "true",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (res.ok && data.orders) {
        return data.orders;
      }
      return [];
    } catch (err) {
      console.log("Failed to fetch customer orders:", err);
      return [];
    }
  }, [backendUrl, customerIdKey, customerTokenKey, user]);


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
            }
            if (Array.isArray(data.socialMedia)) {
              setSocialMedia(data.socialMedia);
            }
            if (data.currency) {
              setStoreCurrency(data.currency);
              if (data.currency.currency) {
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
          })
          .catch((err) => console.warn("Failed to fetch products:", err))
          .finally(() => {
            if (isMounted) setProductsLoading(false);
          });

        // 3. Categories
        fetch(`${backendUrl}/Attributes/GetActiveCategories`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !data) return;
            const list = Array.isArray(data)
              ? data
              : Array.isArray(data.categories)
              ? data.categories
              : Array.isArray(data.value)
              ? data.value
              : [];
            setCategories(list);
          })
          .catch((err) => console.warn("Failed to fetch categories:", err));

        // 4. Policies
        fetch(`${backendUrl}/Support/GetActivePolicies`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !Array.isArray(data)) return;
            setPolicies(data);
          })
          .catch((err) => console.warn("Failed to fetch policies:", err));

        // 5. FAQs
        fetch(`${backendUrl}/Support/GetActiveFAQs`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !data) return;
            const list = Array.isArray(data) ? data : [data];
            setFaqs(list);
          })
          .catch((err) => console.warn("Failed to fetch FAQs:", err));

        // 6. Banners
        fetch(`${backendUrl}/Support/GetActiveBanners`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !Array.isArray(data)) return;
            setBanners(data);
          })
          .catch((err) => console.warn("Failed to fetch banners:", err));

        // 7. Collection Banners (Split Banners)
        fetch(`${backendUrl}/Support/GetActiveCollectionBanners`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (!isMounted || !Array.isArray(data)) return;
            setCollectionBanners(data);
          })
          .catch((err) => console.warn("Failed to fetch collection banners:", err));
      } finally {
        if (isMounted) setSettingsLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [backendUrl]);



  const getProduct = useCallback(
    (id) => {
      if (!id) return null;
      const strId = String(id).trim();
      return (
        products.find(
          (p) =>
            (p._id && String(p._id) === strId) ||
            (p.id && String(p.id) === strId) ||
            (p.rawId !== undefined && String(p.rawId) === strId) ||
            (p.itemid !== undefined && String(p.itemid) === strId)
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

  const addToCart = (
    productId,
    metal = "",
    size = "",
    carat = "",
    customPrice = null,
    stone = "",
    extra = {}
  ) => {
    const p = getProduct(productId);
    const resolvedPrice =
      customPrice !== null && customPrice !== undefined
        ? Number(customPrice)
        : getItemPrice(p, metal, stone, carat);
    const shape = extra.shape || extra.shapename || "";
    const clarity = extra.clarity || extra.clarityname || "";
    const diamondcolor = extra.diamondcolor || extra.diamondColor || "";
    const bandcolor = extra.bandcolor || extra.bandColor || "";

    const key = `${productId}|${metal || ""}|${stone || ""}|${size || ""}|${carat || ""}|${shape}|${clarity}|${diamondcolor}|${bandcolor}`;
    setCart((c) => {
      const ex = c.find((i) => i.key === key);
      return ex
        ? c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
        : [
            ...c,
            {
              key,
              productId,
              metal,
              stone,
              size,
              carat,
              shape,
              shapename: shape,
              clarity,
              clarityname: clarity,
              diamondcolor,
              bandcolor,
              specialinstruction: extra.specialinstruction || extra.specialInstruction || "",
              price: resolvedPrice,
              qty: 1
            }
          ];
    });
    notify("Added to Bag", `${p?.name || "Jewelry Piece"}${metal ? " • " + metal : ""}`);
    setCartOpen(true);
  };

  const toggleWishlist = (id) => {
    if (!user) {
      notify("Sign In Required", "Please sign in to save items to your wishlist.");
      navigate("/profile");
      return;
    }
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

  const updateItemInstruction = (key, specialinstruction) => {
    setCart((c) =>
      c.map((i) => (i.key === key ? { ...i, specialinstruction } : i))
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
        collectionBanners,
        cartOpen,
        setCartOpen,
        setCurrency: changeCurrency,
        addToCart,
        updateQty,
        updateItemInstruction,
        removeItem,
        clearCart,
        toggleWishlist,
        setUser,
        updateProfile,
        updatePassword,
        getAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        createOrder,
        getCustomerOrders,
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