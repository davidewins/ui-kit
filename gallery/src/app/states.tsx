import { Badge, View } from "@/components/ui";
import { CountBadge } from "@/components/ui/CountBadge";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ScrollView } from "react-native";
import { Toast } from "@/lib/toast";

export default function States() {
  const pad = { paddingHorizontal: 20, gap: 12 };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>Badges</SectionTitle>
      <View style={[pad, { flexDirection: "row", flexWrap: "wrap", alignItems: "center" }]}>
        <Badge>Default</Badge>
        <Badge variant="success">Delivered</Badge>
        <Badge variant="warning">Late</Badge>
        <Badge variant="error">Cancelled</Badge>
        <Badge variant="info">Info</Badge>
        <CountBadge count={4} />
        <CountBadge count={12} size="sm" />
      </View>

      <SectionTitle>Toast</SectionTitle>
      <View style={pad}>
        <GlassButton label="Success toast" tone="neutral" onPress={() => Toast.success("Saved")} />
        <GlassButton label="Error toast" tone="neutral" onPress={() => Toast.error("Couldn't save that")} />
        <GlassButton label="Info toast" tone="neutral" onPress={() => Toast.info("Order picked up")} />
        <GlassButton label="Warning toast" tone="neutral" onPress={() => Toast.warn("Card expires next month")} />
        <GlassButton
          label="Three in a row (stack)"
          tone="neutral"
          onPress={() => {
            Toast.success("Saved");
            setTimeout(() => Toast.info("Synced to the web"), 350);
            setTimeout(() => Toast.error("One photo didn't upload"), 700);
          }}
        />
        <GlassButton
          label="Long toast"
          tone="neutral"
          onPress={() =>
            Toast.show({
              type: "warn",
              text1: "Your payout is on hold until Stripe confirms your bank details",
              text2: "We've emailed you the two documents they need. It usually clears within a working day once they're uploaded.",
            })
          }
        />
      </View>
    </ScrollView>
  );
}
