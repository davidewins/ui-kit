import { Input, View } from "@/components/ui";
import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { DateRow } from "@/components/ui/inputs/DateRow";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { Cake } from "lucide-react-native";
import { useState } from "react";

// Edit = pushed screen, one Input per field, Save in the footer, a toast.
export default function EditProfile() {
  const [first, setFirst] = useState("Aoife");
  const [last, setLast] = useState("Byrne");
  const [birthday, setBirthday] = useState(() => new Date(1994, 4, 12));
  return (
    <InsetShell
      primaryCta={{
        label: "Save changes",
        disabled: !first.trim(),
        onPress: () => {
          Toast.success("Details saved");
          router.back();
        },
      }}
    >
      <View style={{ marginHorizontal: 16, gap: 12, paddingTop: 12, marginBottom: 24 }}>
        <Input label="First name" value={first} onChangeText={setFirst} />
        <Input label="Last name" value={last} onChangeText={setLast} />
        <Input label="Email" defaultValue="aoife@example.com" keyboardType="email-address" autoCapitalize="none" hint="We'll send a code to confirm a new address" />
        <Input label="Phone" defaultValue="+353 87 123 4567" keyboardType="phone-pad" />
      </View>
      <SettingsGroup>
        <DateRow label="Birthday" Icon={Cake} value={birthday} onChange={setBirthday} maximumDate={new Date()} />
      </SettingsGroup>
    </InsetShell>
  );
}
