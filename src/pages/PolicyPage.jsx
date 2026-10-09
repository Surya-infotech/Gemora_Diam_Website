import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { LegalLayout } from "../components/LegalLayout";
import { useStore } from "../lib/store";

export function slugifyPolicy(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PolicyPage({ fallbackTitle = "", NotFoundComponent = null }) {
  const { slug } = useParams();
  const location = useLocation();
  const { policies } = useStore();
  const [fetchedPolicies, setFetchedPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  const rawPath = slug || location.pathname.replace(/^\/(policy\/)?/, "").replace(/\/$/, "");
  const currentSlug = (rawPath || "").toLowerCase();

  const allPolicies = policies && policies.length > 0 ? policies : fetchedPolicies;

  useEffect(() => {
    if (!policies || policies.length === 0) {
      setLoading(true);
      const url = import.meta.env.VITE_BACKEND_URL;
      fetch(`${url}/Support/GetActivePolicies`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) {
            setFetchedPolicies(data);
          }
        })
        .catch((err) => console.warn("Failed to fetch policies:", err))
        .finally(() => setLoading(false));
    }
  }, [policies]);

  const policy = allPolicies?.find((p) => {
    if (!p || !p.policyname) return false;
    const pSlug = slugifyPolicy(p.policyname);
    if (pSlug === currentSlug) return true;
    if (currentSlug === "privacy-policy" && p.policyname.toLowerCase().includes("privacy")) return true;
    if (
      (currentSlug === "return-exchange-policy" || currentSlug === "returns" || currentSlug === "return-policy") &&
      (p.policyname.toLowerCase().includes("return") || p.policyname.toLowerCase().includes("exchange"))
    ) return true;
    if (
      (currentSlug === "terms" || currentSlug === "terms-of-service" || currentSlug === "terms-conditions") &&
      (p.policyname.toLowerCase().includes("term") || p.policyname.toLowerCase().includes("service"))
    ) return true;
    return false;
  });

  if (loading && !policy) {
    return (
      <div className="container-luxury" style={{ padding: "100px 20px", textAlign: "center" }}>
        <p style={{ color: "var(--muted-foreground)" }}>Loading policy...</p>
      </div>
    );
  }

  if (policy && policy.description) {
    const updatedDate = policy.updatedAt
      ? new Date(policy.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "";

    return (
      <LegalLayout
        title={policy.policyname}
        updated={updatedDate}
        htmlContent={policy.description}
      />
    );
  }

  if (policy) {
    return (
      <LegalLayout
        title={policy.policyname}
        updated=""
        htmlContent="<p>Our official policy details are currently being updated. For any requests or questions, please contact our support team.</p>"
      />
    );
  }

  if (fallbackTitle) {
    return (
      <LegalLayout
        title={fallbackTitle}
        updated=""
        htmlContent="<p>Our official policy details are currently being updated. For any requests or questions, please contact our support team.</p>"
      />
    );
  }

  if (NotFoundComponent) {
    return <NotFoundComponent />;
  }

  return (
    <LegalLayout
      title="Policy Not Found"
      updated=""
      htmlContent="<p>The requested policy could not be found. Please check our footer links or contact our support team.</p>"
    />
  );
}
