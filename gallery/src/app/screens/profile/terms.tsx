import { Toast } from "@/lib/toast";
import { LegalScreen } from "@/screens/LegalScreen";

// Terms: the kit's LegalScreen (src/screens). Demo copy.
export default function Terms() {
  return (
    <LegalScreen
      title="Terms"
      updated="3 November 2026"
      sections={[
        { body: "These terms cover your use of the app. By making an account you agree to them." },
        { heading: "Your account", body: "Keep your sign-in details to yourself. You are responsible for what happens on your account.\n\nTell us straight away if you think someone else has used it." },
        { heading: "Orders and payment", body: "Prices include VAT. We take payment when you place an order and refund it in full if the seller cancels." },
        { heading: "Cancelling", body: "You can cancel an order until the seller accepts it. After that, contact the seller from the order page." },
        { heading: "Changes to these terms", body: "We tell you in the app before a change takes effect. Using the app after that date means you accept the new terms." },
      ]}
      contact="Questions? Email hello@example.com"
      onContactPress={() => Toast.info("Opens Mail")}
    />
  );
}
