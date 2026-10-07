import React from "react";
import { LegalLayout } from "../components/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="October 1, 2026"
      sections={[
        {
          id: "data-collection",
          title: "Data Collection",
          body: [
            "We collect information you provide directly — such as your name, email, shipping address, phone number, and ring size — when you place an order, create an account, or contact our client concierge.",
            "We also collect limited technical telemetry (device type, browser, anonymized pages viewed) to maintain exceptional salon experience and website performance."
          ]
        },
        {
          id: "cookies",
          title: "Cookie Policy",
          body: [
            "We use strictly necessary cookies to keep your shopping bag and authenticated session active across visits, and — solely with your explicit consent — analytics and personalization cookies.",
            "You may withdraw or modify consent at any time via your browser preferences or our cookie management panel."
          ]
        },
        {
          id: "security",
          title: "Security Standards",
          body: [
            "All data is transmitted exclusively over 256-bit TLS bank-grade encryption. Payment credentials are tokenized by PCI-DSS Level 1 certified processors (Stripe, Apple Pay) and are never stored on our servers.",
            "Access to personal client data is strictly restricted to authorized concierge personnel under non-disclosure obligations."
          ]
        },
        {
          id: "third-parties",
          title: "Third-Party Processors",
          body: [
            "We share data only with trusted partners strictly required to fulfill your order: licensed payment providers, insured armored couriers (Ferrari Group, Malca-Amit, FedEx Custom Critical), and transactional notification providers.",
            "Each processor is bound by a strict data processing agreement compliant with GDPR and international privacy regulations."
          ]
        },
        {
          id: "rights",
          title: "Customer Rights (GDPR / CCPA)",
          body: [
            "You hold the full right to access, rectify, port, or permanently delete your personal data, and to object to or restrict its processing at any time.",
            "California residents may request full disclosure of categories of personal information collected. GEMORA DIAM never sells or rents personal customer information to third parties.",
            "To exercise any legal privacy right, email concierge@gemoradiam.com. We respond to all formal requests within 30 days."
          ]
        },
        {
          id: "returns",
          title: "Returns & Exchanges",
          body: [
            "Unworn pieces in original sealed packaging and accompanied by original GIA / IGI certificates may be returned within 30 days for a full refund or exchange. Bespoke commissions and custom engraved pieces are final sale.",
            "All approved returns are scheduled with complimentary insured armored courier pickup directly from your preferred address."
          ]
        }
      ]}
    />
  );
}
