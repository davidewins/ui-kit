import { DateRow } from "@/components/ui/inputs/DateRow";
import { Toast } from "@/lib/toast";
import { PersonalDetailsScreen } from "@/screens/PersonalDetailsScreen";
import { router } from "expo-router";
import { Cake } from "lucide-react-native";
import { useState } from "react";

// Personal details: the kit's PersonalDetailsScreen (src/screens). Edit is a
// pushed screen, one Input per field, Save in the footer, a toast.
export default function EditProfile() {
  const [first, setFirst] = useState("Aoife");
  const [last, setLast] = useState("Byrne");
  const [email, setEmail] = useState("aoife@example.com");
  const [phone, setPhone] = useState("+353 87 123 4567");
  const [birthday, setBirthday] = useState(() => new Date(1994, 4, 12));
  return (
    <PersonalDetailsScreen
      fields={[
        { key: "first", label: "First name", value: first, onChangeText: setFirst },
        { key: "last", label: "Last name", value: last, onChangeText: setLast },
        { key: "email", label: "Email", value: email, onChangeText: setEmail, keyboardType: "email-address", autoCapitalize: "none", hint: "We'll send a code to confirm a new address" },
        { key: "phone", label: "Phone", value: phone, onChangeText: setPhone, keyboardType: "phone-pad" },
      ]}
      rows={<DateRow label="Birthday" Icon={Cake} value={birthday} onChange={setBirthday} maximumDate={new Date()} />}
      save={{
        disabled: !first.trim(),
        onPress: () => {
          Toast.success("Details saved");
          router.back();
        },
      }}
    />
  );
}
