import { Input, View } from "@/components/ui";
import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { useState } from "react";

// Recipe §3.2: create = modal, commit in the InsetShell footer, toast + close.
export default function ExampleCreate() {
  const [name, setName] = useState("");
  return (
    <InsetShell
      primaryCta={{
        label: "Create product",
        disabled: !name.trim(),
        onPress: () => {
          Toast.success(`${name.trim()} created`);
          router.back();
        },
      }}
    >
      <View style={{ marginHorizontal: 16, gap: 12, paddingTop: 12 }}>
        <Input label="Name" placeholder="Chicken burger" value={name} onChangeText={setName} />
        <Input label="Price" placeholder="12.50" keyboardType="decimal-pad" />
        <Input label="Description" placeholder="What's in it" multiline />
      </View>
    </InsetShell>
  );
}
