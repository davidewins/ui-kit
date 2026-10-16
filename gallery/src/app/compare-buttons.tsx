import { Button, View } from "@/components/ui";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SellersButton } from "@/compare/buttons/SellersButton";
import { TkvrButton } from "@/compare/buttons/TkvrButton";
import { Plus } from "lucide-react-native";
import { ScrollView } from "react-native";

const noop = () => {};
const pad = { paddingHorizontal: 20, gap: 12 };

// The three Button components in the apps, plus the spec's GlassButton.
// No ghost buttons: each app's own "outline" is shown so you can see what it is.
export default function CompareButtons() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>A. Kit Button (VOID, RIDERS, demo, ADMIN)</SectionTitle>
      <View style={pad}>
        <Button onPress={noop}>Primary</Button>
        <Button variant="secondary" onPress={noop}>Secondary</Button>
        <Button variant="danger" onPress={noop}>Danger</Button>
        <Button size="sm" leftIcon={<Plus />} onPress={noop}>Small with icon</Button>
      </View>

      <SectionTitle>B. SELLERS Button (GlassButton spec)</SectionTitle>
      <View style={pad}>
        <SellersButton onPress={noop}>Primary</SellersButton>
        <SellersButton variant="secondary" onPress={noop}>Secondary (glass)</SellersButton>
        <SellersButton variant="outline" onPress={noop}>Outline (filled neutral)</SellersButton>
        <SellersButton variant="danger" onPress={noop}>Danger</SellersButton>
        <SellersButton size="sm" leftIcon={<Plus />} onPress={noop}>Small with icon</SellersButton>
      </View>

      <SectionTitle>C. TKVR Button</SectionTitle>
      <View style={pad}>
        <TkvrButton onPress={noop}>Primary</TkvrButton>
        <TkvrButton variant="secondary" onPress={noop}>Secondary</TkvrButton>
        <TkvrButton variant="outline" onPress={noop}>Outline</TkvrButton>
        <TkvrButton variant="danger" onPress={noop}>Danger</TkvrButton>
      </View>

      <SectionTitle>D. GlassButton (spec §2.3)</SectionTitle>
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
