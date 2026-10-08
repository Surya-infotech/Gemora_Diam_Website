import { LegalLayout } from "../components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="October 1, 2026"
      sections={[
        {
          id: "acceptance",
          title: "Acceptance of Terms",
          body: [
            "By accessing, browsing, or purchasing from GEMORA DIAM Fine Jewelry, you unconditionally agree to these Terms of Service. If you do not accept these terms, please refrain from utilizing our online salon and bespoke services."
          ]
        },
        {
          id: "pricing",
          title: "Pricing & Currency Conversion",
          body: [
            "Prices are dynamically displayed in your selected currency for convenience; orders are settled securely based on real-time prevailing foreign exchange rates. GEMORA DIAM reserves the right to correct manifest typographical pricing errors prior to dispatch.",
            "All transactions are authenticated and processed securely via PCI-DSS certified payment processors including Stripe, PayPal, Apple Pay, Visa, and Mastercard."
          ]
        },
        {
          id: "shipping",
          title: "Shipping & Armored Transit",
          body: [
            "All fine jewelry and high jewelry orders are dispatched fully insured with adult signature and identity verification required upon delivery. Complimentary worldwide insured shipping applies to all orders exceeding $500.",
            "Applicable customs duties and import tariffs for international destinations are handled during checkout or coordinated by our logistics concierge."
          ]
        },
        {
          id: "warranty",
          title: "Lifetime Atelier Warranty",
          body: [
            "Every authentic GEMORA DIAM piece carries a comprehensive lifetime warranty covering manufacturing craftsmanship defects, including complimentary annual ultrasonic cleaning, prong inspection, and re-polishing.",
            "The warranty does not cover accidental loss, catastrophic impact damage, or unauthorized alterations performed outside of our Paris atelier."
          ]
        },
        {
          id: "returns",
          title: "Returns & Exchanges",
          body: [
            "Unworn items in immaculate original condition may be returned within 30 days of receipt. Custom bespoke designs, tailored band resizings, and personalized hand-engraved heirlooms are final sale.",
            "Refunds are credited to the original payment instrument within 10 business days of rigorous gemological inspection by our atelier staff."
          ]
        },
        {
          id: "ip",
          title: "Intellectual Property",
          body: [
            "All bespoke jewelry silhouettes, CAD models, photography, brand identity assets, and editorial copy are the proprietary intellectual property of GEMORA DIAM and protected under international copyright law."
          ]
        },
        {
          id: "law",
          title: "Governing Law & Jurisdiction",
          body: [
            "These terms and any disputes arising hereunder are governed exclusively by French civil law, subject to any mandatory consumer protection statutes of your primary jurisdiction of residence."
          ]
        }
      ]}
    />
  );
}
