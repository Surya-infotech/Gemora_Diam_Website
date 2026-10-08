import { LegalLayout } from "../components/LegalLayout";
import { useStore } from "../lib/store";

export default function ReturnPolicyPage() {
  const { policies } = useStore();
  const policy = policies.find(
    (p) =>
      p.policyname?.toLowerCase().includes("return") ||
      p.policyname?.toLowerCase().includes("exchange") ||
      p.policyname?.toLowerCase().includes("refund")
  );

  if (policy && policy.description) {
    const updatedDate = policy.updatedAt
      ? new Date(policy.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "October 1, 2026";

    return (
      <LegalLayout
        title={policy.policyname || "Return & Exchange Policy"}
        updated={updatedDate}
        htmlContent={policy.description}
      />
    );
  }

  return (
    <LegalLayout
      title="Return & Exchange Policy"
      updated=""
      htmlContent="<p>Our Return & Exchange Policy details are available upon request. Please contact our support team for any return inquiries.</p>"
    />
  );
}