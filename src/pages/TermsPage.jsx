import { LegalLayout } from "../components/LegalLayout";
import { useStore } from "../lib/store";

export default function TermsPage() {
  const { policies } = useStore();
  const policy = policies.find(
    (p) =>
      p.policyname?.toLowerCase().includes("term") ||
      p.policyname?.toLowerCase().includes("condition") ||
      p.policyname?.toLowerCase().includes("service")
  );

  if (policy && policy.description) {
    const updatedDate = policy.updatedAt
      ? new Date(policy.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "October 1, 2026";

    return (
      <LegalLayout
        title={policy.policyname || "Terms of Service"}
        updated={updatedDate}
        htmlContent={policy.description}
      />
    );
  }

  return (
    <LegalLayout
      title="Terms of Service"
      updated=""
      htmlContent="<p>Our official Terms of Service are currently being updated. For questions regarding our policies or orders, please contact our support team.</p>"
    />
  );
}

