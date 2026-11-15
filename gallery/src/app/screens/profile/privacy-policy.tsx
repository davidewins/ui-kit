import { Toast } from "@/lib/toast";
import { LegalScreen } from "@/screens/LegalScreen";

// Privacy policy: the kit's LegalScreen (src/screens). Demo copy.
export default function PrivacyPolicy() {
  return (
    <LegalScreen
      title="Privacy policy"
      updated="3 November 2026"
      sections={[
        { body: "This policy explains what we collect, why, and what you can do about it." },
        { heading: "What we collect", body: "Your name, email and phone number, your orders and addresses, and how you use the app." },
        { heading: "Why we collect it", body: "To deliver your orders, keep your account safe and make the app better. We never sell your data." },
        { heading: "Who we share it with", body: "Sellers and riders see what they need to fill your order. Stripe handles payments." },
        { heading: "Your rights", body: "You can get a copy of your data, correct it or delete your account at any time from Privacy and data." },
      ]}
      contact="Questions? Email privacy@example.com"
      onContactPress={() => Toast.info("Opens Mail")}
    />
  );
}
