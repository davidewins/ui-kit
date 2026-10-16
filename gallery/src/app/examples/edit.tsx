import { Input, View } from "@/components/ui";
import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { Alert } from "react-native";

// Recipe §3.3: edit = pushed screen, one Input card per field, "Save changes"
// in the InsetShell footer, destructive row last behind an Alert.
export default function ExampleEdit() {
  return (
    <InsetShell
      primaryCta={{
        label: "Save changes",
        onPress: () => {
          Toast.success("Changes saved");
          router.back();
        },
      }}
    >
      <View style={{ marginHorizontal: 16, gap: 12, paddingTop: 12, marginBottom: 24 }}>
        <Input label="Name" defaultValue="Chicken burger" />
        <Input label="Price" defaultValue="12.50" keyboardType="decimal-pad" />
        <Input label="Description" defaultValue="Buttermilk chicken, slaw, pickles" multiline />
      </View>
      <SettingsGroup>
        <SettingsRow
          label="Delete product"
          Icon={Trash2}
          destructive
          onPress={() =>
            Alert.alert("Delete this product?", "It comes off your menu straight away.", [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: () => { Toast.success("Product deleted"); router.back(); } },
            ])
          }
        />
      </SettingsGroup>
    </InsetShell>
  );
}
