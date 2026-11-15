import { useStates } from "@/gallery/demo/parts";
import { Toast } from "@/lib/toast";
import { DataPrivacyScreen, type DataExportStatus } from "@/screens/DataPrivacyScreen";
import { Bug, ChartNoAxesColumn, FileText, Scale, Sparkles } from "lucide-react-native";
import { useState } from "react";

const STATES = ["Default", "Preparing export", "Export ready"] as const;
const EXPORT: Record<(typeof STATES)[number], DataExportStatus> = {
  Default: "idle",
  "Preparing export": "preparing",
  "Export ready": "ready",
};

// Privacy and your data (GDPR): the kit's DataPrivacyScreen (src/screens),
// the same page every app ships, driven here by demo state.
export default function Privacy() {
  const { state } = useStates(STATES);
  const [analytics, setAnalytics] = useState(true);
  const [personal, setPersonal] = useState(false);
  const [crashes, setCrashes] = useState(true);

  return (
    <DataPrivacyScreen
      toggles={[
        { key: "analytics", label: "Usage analytics", icon: ChartNoAxesColumn, value: analytics, onValueChange: setAnalytics },
        { key: "personal", label: "Personalised offers", icon: Sparkles, value: personal, onValueChange: setPersonal },
        { key: "crashes", label: "Crash reports", icon: Bug, value: crashes, onValueChange: setCrashes },
      ]}
      togglesNote="Analytics never include your name or email. Changes apply from your next visit."
      policies={[
        { label: "Privacy policy", icon: FileText, navigates: true, href: "/screens/profile/privacy-policy" },
        { label: "Terms of use", icon: Scale, navigates: true, href: "/screens/profile/terms" },
      ]}
      dataExport={{
        status: EXPORT[state],
        onRequest: () => Toast.success("We'll email you when it's ready"),
        onSave: () => Toast.success("Saved to Files"),
        saveLabel: "Save file, 4.2 MB",
        progress: 0.4,
        readyMessage: "Orders, bookings, workouts and settings. The link works for 7 days.",
      }}
      deleteAccount={{
        onConfirm: () => Toast.success("Account will be deleted in 30 days"),
        message: "Your orders, bookings and workouts are erased in 30 days. You can't undo this after that.",
      }}
    />
  );
}
