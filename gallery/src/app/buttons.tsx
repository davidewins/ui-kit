import { Button, View } from "@/components/ui";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArrowRight, Plus, Trash2 } from "lucide-react-native";
import { ScrollView } from "react-native";

const noop = () => {};
const TONES = ["primary", "neutral", "danger", "glass"] as const;
const SIZES = ["sm", "md", "lg"] as const;

// GlassButton is the spec's button (§2.3). Button is the className variant.
// No ghost or outline variants anywhere.
export default function Buttons() {
  const pad = { paddingHorizontal: 20, gap: 12 };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>GlassButton tones</SectionTitle>
      <View style={pad}>
        {TONES.map((tone) => (
          <GlassButton key={tone} label={tone} tone={tone} onPress={noop} fullWidth />
        ))}
      </View>

      <SectionTitle>GlassButton sizes</SectionTitle>
      <View style={pad}>
        {SIZES.map((size) => (
          <GlassButton key={size} label={`Size ${size}`} size={size} onPress={noop} />
        ))}
      </View>

      <SectionTitle>GlassButton states</SectionTitle>
      <View style={pad}>
        <GlassButton label="New item" leftIcon={<Plus />} onPress={noop} />
        <GlassButton label="Continue" rightIcon={<ArrowRight />} onPress={noop} />
        <GlassButton label="Delete" tone="danger" leftIcon={<Trash2 />} onPress={noop} />
        <GlassButton label="Loading" loading onPress={noop} />
        <GlassButton label="Disabled" disabled onPress={noop} />
        <GlassButton label="Disabled solid" disabled disabledStyle="solid" onPress={noop} />
      </View>

      <SectionTitle>Button</SectionTitle>
      <View style={pad}>
        <Button onPress={noop}>Primary</Button>
        <Button variant="secondary" onPress={noop}>Secondary</Button>
        <Button variant="danger" onPress={noop}>Danger</Button>
        <Button size="sm" onPress={noop}>Small</Button>
        <Button loading onPress={noop}>Loading</Button>
        <Button disabled onPress={noop}>Disabled</Button>
      </View>
    </ScrollView>
  );
}
