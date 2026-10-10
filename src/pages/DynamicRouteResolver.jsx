import { useParams } from "react-router-dom";
import { useStore } from "../lib/store";
import { slugifyPolicy } from "../lib/slugify";
import PolicyPage from "./PolicyPage";
import CollectionsPage from "./CollectionsPage";

export default function DynamicRouteResolver({ NotFoundComponent = null }) {
  const { slug } = useParams();
  const { policies } = useStore();

  const currentSlug = (slug || "").toLowerCase().trim();

  // 1. Check if the slug corresponds to a Legal Policy
  const isPolicy = (policies || []).some((p) => {
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

  if (isPolicy) {
    return <PolicyPage fallbackTitle="" NotFoundComponent={NotFoundComponent} />;
  }

  // 2. Otherwise route to CollectionsPage with the clean slug
  return <CollectionsPage NotFoundComponent={NotFoundComponent} />;
}
