import { View } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { GlassButton } from "@/components/ui/GlassButton";
import { PillButton } from "@/components/ui/PillButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Plus } from "lucide-react-native";
import { ScrollView } from "react-native";

const noop = () => {};
const pad = { paddingHorizontal: 20, gap: 12 };

// David, 16 Oct: Button (SELLERS) and GlassButton are the same spec; PillButton
// (TKVR) stays for when it fits. No ghost buttons anywhere.
export default function CompareButtons() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>Button (kit, from SELLERS)</SectionTitle>
      <View style={pad}>
        <Button onPress={noop}>Primary</Button>
        <Button variant="secondary" onPress={noop}>Secondary (glass)</Button>
        <Button variant="outline" onPress={noop}>Outline (filled neutral)</Button>
        <Button variant="danger" onPress={noop}>Danger</Button>
        <Button size="sm" leftIcon={<Plus />} onPress={noop}>Small with icon</Button>
        <Button loading onPress={noop}>Loading</Button>
        <Button disabled onPress={noop}>Disabled</Button>
      </View>

      <SectionTitle>PillButton (kit, from TKVR)</SectionTitle>
      <View style={pad}>
        <PillButton onPress={noop}>Primary</PillButton>
        <PillButton variant="secondary" onPress={noop}>Secondary (glass)</PillButton>
        <PillButton variant="outline" onPress={noop}>Outline</PillButton>
        <PillButton variant="danger" onPress={noop}>Danger</PillButton>
        <PillButton size="sm" onPress={noop}>Small</PillButton>
        <PillButton disabled onPress={noop}>Disabled</PillButton>
      </View>

      <SectionTitle>GlassButton (spec §2.3)</SectionTitle>
      <View style={pad}>
        <GlassButton label="Primary" onPress={noop} />
        <GlassButton label="Neutral" tone="neutral" onPress={noop} />
        <GlassButton label="Glass" tone="glass" onPress={noop} />
        <GlassButton label="Danger" tone="danger" onPress={noop} />
        <GlassButton label="Small with icon" size="sm" leftIcon={<Plus />} onPress={noop} />
      </View>
    </ScrollView>
  );
}
