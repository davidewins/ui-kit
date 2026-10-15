import { Badge, SkeletonList, View } from "@/components/ui";
import { LoadErrorState } from "@/components/LoadErrorState";
import { CountBadge } from "@/components/ui/CountBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { GlassButton } from "@/components/ui/GlassButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { Inbox } from "lucide-react-native";
import { ScrollView } from "react-native";
import { Toast } from "toastify-react-native";

const noop = () => {};

export default function States() {
  const pad = { paddingHorizontal: 20, gap: 12 };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>EmptyState, Thiings image</SectionTitle>
      <EmptyState
        image={require("../assets/images/empty/delivery-truck.png")}
        title="No deliveries yet"
        message="New orders show up here"
        actionLabel="Go online"
        onAction={noop}
        fullScreen={false}
      />

      <SectionTitle>EmptyState, icon</SectionTitle>
      <EmptyState icon={Inbox} title="No messages yet" message="Start a chat to see it here" fullScreen={false} />

      <SectionTitle>LoadErrorState</SectionTitle>
      <View style={{ height: 320 }}>
        <LoadErrorState onRetry={noop} />
      </View>

      <SectionTitle>Skeleton</SectionTitle>
      <View style={pad}>
        <SkeletonBlock height={20} width="60%" />
        <SkeletonBlock height={14} />
        <SkeletonBlock height={14} width="80%" />
      </View>
      <SkeletonList count={2} />

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
      </View>
    </ScrollView>
  );
}
