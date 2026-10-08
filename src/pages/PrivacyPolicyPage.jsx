import { LegalLayout } from "../components/LegalLayout";
import { useStore } from "../lib/store";

export default function PrivacyPolicyPage() {
  const { policies } = useStore();
  const policy = policies.find((p) => p.policyname?.toLowerCase().includes("privacy"));

  if (policy && policy.description) {
    const updatedDate = policy.updatedAt
      ? new Date(policy.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "October 1, 2026";

    return (
      <LegalLayout
        title={policy.policyname || "Privacy Policy"}
        updated={updatedDate}
        htmlContent={policy.description}
      />
    );
  }

  return (
    <LegalLayout
      title="Privacy Policy"
      updated=""
      htmlContent="<p>Our official Privacy Policy is currently being updated. For any privacy requests or questions, please contact our support team.</p>"
    />
  );
}