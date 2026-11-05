import { Button, View } from "@/components/ui";
import { NativeButton } from "@/components/ui/actions/NativeButton";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { BottomSwitch } from "@/gallery/BottomSwitch";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

const noop = () => {};
const KINDS = ["Big", "Small native"] as const;

// Big = the kit Button (GlassButton is the same spec under another name, so
// it is not shown twice): the one main action at the bottom of a screen, or
// two at most. Small native = Apple's SwiftUI Button in glass, for compact
// in-content actions. There is no ghost variant anywhere.
export default function Buttons() {
  const [kind, setKind] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 24 }}>
        {KINDS[kind] === "Big" ? (
          <>
            <SectionTitle>Variants</SectionTitle>
            <View style={{ paddingHorizontal: 20, gap: 12 }}>
              <Button fullWidth size="lg" onPress={noop}>Primary</Button>
              <Button fullWidth size="lg" variant="secondary" onPress={noop}>Secondary (glass)</Button>
              <Button fullWidth size="lg" variant="outline" onPress={noop}>Outline</Button>
              <Button fullWidth size="lg" variant="danger" onPress={noop}>Danger</Button>
            </View>
            <SectionTitle>Sizes</SectionTitle>
            <View style={{ paddingHorizontal: 20, gap: 12, alignItems: "flex-start" }}>
              <Button size="lg" onPress={noop}>Large</Button>
              <Button size="md" onPress={noop}>Medium</Button>
              <Button size="sm" leftIcon={<Plus />} onPress={noop}>Small</Button>
              <Button size="xs" onPress={noop}>Extra small</Button>
            </View>
            <SectionTitle>States</SectionTitle>
            <View style={{ paddingHorizontal: 20, gap: 12 }}>
              <Button fullWidth size="lg" loading onPress={noop}>Loading</Button>
              <Button fullWidth size="lg" disabled onPress={noop}>Disabled</Button>
            </View>
          </>
        ) : (
          <>
            <SectionTitle>Tones</SectionTitle>
            <View style={{ paddingHorizontal: 20, gap: 12, flexDirection: "row", flexWrap: "wrap" }}>
              <NativeButton label="Add" systemImage="plus" tone="primary" onPress={noop} />
              <NativeButton label="Edit" systemImage="pencil" onPress={noop} />
              <NativeButton label="Remove" systemImage="trash" tone="destructive" onPress={noop} />
            </View>
            <SectionTitle>Sizes</SectionTitle>
            <View style={{ paddingHorizontal: 20, gap: 12, flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
              <NativeButton label="Mini" size="mini" onPress={noop} />
              <NativeButton label="Small" size="small" onPress={noop} />
              <NativeButton label="Regular" size="regular" onPress={noop} />
            </View>
            <SectionTitle>States</SectionTitle>
            <View style={{ paddingHorizontal: 20, gap: 12, flexDirection: "row", flexWrap: "wrap" }}>
              <NativeButton label="Disabled" tone="primary" disabled onPress={noop} />
              <NativeButton label="Disabled" disabled onPress={noop} />
            </View>
          </>
        )}
      </ScrollView>
      <BottomSwitch values={KINDS} selectedIndex={kind} onChange={setKind} accessibilityLabel="Button kind" />
    </View>
  );
}
