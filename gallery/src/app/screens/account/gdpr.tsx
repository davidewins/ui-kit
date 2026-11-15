import { Toast } from "@/lib/toast";
import { GdprScreen } from "@/screens/GdprScreen";
import { Download, FileLock, FileText, Mail, Pencil, ScrollText, ShieldOff, Trash2 } from "lucide-react-native";

const DPO = "privacy@example.com";
const mail = (subject: string) => () => Toast.info(`Opens Mail: ${subject}`);

// GDPR: the kit's GdprScreen (src/screens), with the SELLERS page's rows and
// copy. Each right is one row named by what it does; in an app the mail rows
// open the composer with the request prefilled.
export default function GDPR() {
  return (
    <GdprScreen
      rights={[
        { label: "Get a copy of my data", icon: FileText, navigates: true, onPress: mail("GDPR Data Access Request") },
        { label: "Correct my details", icon: Pencil, navigates: true, href: "/screens/profile/edit-profile" },
        { label: "Export my data", icon: Download, navigates: true, onPress: mail("GDPR Data Portability Request") },
        { label: "Object to marketing", icon: ShieldOff, navigates: true, onPress: mail("GDPR Right to Object") },
        { label: "Delete my account", icon: Trash2, destructive: true, navigates: true, onPress: () => Toast.info("Delete account") },
      ]}
      dataHeld="Your business details, how you sign in, your orders, payout details (encrypted and held by Stripe), usage analytics and your messages."
      contact={[
        { label: "Data Protection Officer", icon: Mail, value: DPO, onPress: mail("GDPR question") },
        { label: "Privacy Policy", icon: FileLock, navigates: true, href: "/screens/profile/privacy-policy" },
        { label: "Terms of Service", icon: ScrollText, navigates: true, href: "/screens/profile/terms" },
      ]}
      replyNote="We reply to every request within 30 days."
    />
  );
}
