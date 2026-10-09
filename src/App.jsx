import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { StoreProvider } from "./lib/store";
import { Header, Footer } from "./components/SiteChrome";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import PolicyPage from "./pages/PolicyPage";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, search]);

  return null;
}

function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "65vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
        textAlign: "center"
      }}
    >
      <div style={{ maxWidth: "480px" }}>
        <p className="eyebrow" style={{ color: "var(--gold-deep)" }}>404 Not Found</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 3.6rem)", marginTop: "12px" }}>
          Page Not Found
        </h1>
        <p style={{ marginTop: "16px", fontSize: "0.95rem", color: "var(--muted-foreground)" }}>
          The page or jewelry item you are looking for may have been moved or is unavailable.
        </p>
        <Link
          to="/"
          className="eyebrow"
          style={{
            marginTop: "32px",
            display: "inline-block",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            padding: "16px 36px"
          }}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/policy/:slug" element={<PolicyPage />} />
              <Route path="/:slug" element={<PolicyPage NotFoundComponent={NotFoundPage} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </StoreProvider>
    </BrowserRouter>
  );
}