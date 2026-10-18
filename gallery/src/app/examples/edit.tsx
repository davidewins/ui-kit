import { Input, View } from "@/components/ui";
import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { DateRow } from "@/components/ui/DateRow";
import { PickerRow } from "@/components/ui/PickerRow";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { StepperRow } from "@/components/ui/StepperRow";
import { Switch } from "@/components/ui/Switch";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { CalendarDays, Eye, Package, Tag, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";

// Recipe §3.3: edit = pushed screen, one Input card per field, "Save changes"
// in the InsetShell footer, native option rows in a SettingsGroup, destructive
// row last behind an Alert.
const CATEGORIES = ["Burgers", "Sides", "Drinks", "Desserts"].map((c) => ({ label: c, value: c }));

export default function ExampleEdit() {
  const [category, setCategory] = useState("Burgers");
  const [stock, setStock] = useState(24);
  const [visible, setVisible] = useState(true);
  const [from, setFrom] = useState(() => new Date());
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
        <PickerRow label="Category" Icon={Tag} options={CATEGORIES} value={category} onChange={setCategory} />
        <StepperRow label="In stock" Icon={Package} value={stock} onChange={setStock} min={0} max={999} />
        <SettingsRow label="Show on menu" Icon={Eye} accessory={<Switch value={visible} onValueChange={setVisible} />} />
        <DateRow label="Available from" Icon={CalendarDays} value={from} onChange={setFrom} minimumDate={new Date()} />
      </SettingsGroup>
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
