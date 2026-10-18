import { Badge } from "@/components/ui";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeaderIconButton } from "@/components/ui/HeaderIconButton";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { SkeletonList } from "@/components/ui";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Stack, router } from "expo-router";
import { Package, Plus } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

const ORDERS = [
  { id: "1042", who: "Aoife M.", status: "Preparing", variant: "warning" as const },
  { id: "1041", who: "Liam K.", status: "Ready", variant: "success" as const },
  { id: "1040", who: "Niamh O.", status: "Delivered", variant: "default" as const },
  { id: "1039", who: "Cian D.", status: "Cancelled", variant: "error" as const },
];
const STATES = ["Loaded", "Loading", "Empty"] as const;

// Recipe §3.1: tab root list. New = header Plus (opens the §3.2 create modal),
// skeleton while loading, EmptyState when empty.
export default function ExampleList() {
  const [state, setState] = useState(0);
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderIconButton icon={Plus} accessibilityLabel="New order" onPress={() => router.push("/examples/create")} />
          ),
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingTop: 8, paddingBottom: 48, flexGrow: 1 }}>
        <SegmentedControl values={STATES} selectedIndex={state} onChange={setState} accessibilityLabel="State" style={{ marginHorizontal: 16, marginBottom: 16 }} />
        {STATES[state] === "Loading" ? (
          <SkeletonList count={4} />
        ) : STATES[state] === "Empty" ? (
          <EmptyState art={{ image: require("../../assets/images/empty/box.png") }} title="No orders yet" body="New orders show up here as they come in" action={{ label: "New order", plus: true, onPress: () => router.push("/examples/create") }} />
        ) : (
          <SettingsGroup>
            {ORDERS.map((o) => (
              <SettingsRow key={o.id} label={`#${o.id}  ${o.who}`} Icon={Package} navigates href="/examples/detail" accessory={<Badge variant={o.variant}>{o.status}</Badge>} />
            ))}
          </SettingsGroup>
        )}
      </ScrollView>
    </>
  );
}
