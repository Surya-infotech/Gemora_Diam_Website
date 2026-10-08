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
      updated="October 1, 2026"
      sections={[
        {
          id: "eligibility",
          title: "Return Window & Eligibility",
          body: [
            "We offer a 30-day return policy for fine jewelry items in pristine, unworn condition with original packaging, receipts, and gemological certifications intact.",
            "To initiate a return or exchange, please reach out to our client concierge team with your order reference number."
          ]
        },
        {
          id: "custom-items",
          title: "Custom & Personalized Commissions",
          body: [
            "Custom bespoke jewelry, engraved items, and custom sizes tailored specifically to client requirements cannot be returned or refunded once produced.",
            "All custom designs undergo thorough 3D model approvals prior to crafting."
          ]
        },
        {
          id: "refunds",
          title: "Refund Processing",
          body: [
            "Once returned items are received and inspected by our master gemologists, your refund will be processed back to your original payment method within 5-10 business days."
          ]
        }
      ]}
    />
  );
}