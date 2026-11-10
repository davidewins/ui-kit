import { Badge } from "@/components/ui";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { } from "@/components/ui";
import { View } from "@/components/ui";
import { useStates } from "@/gallery/demo/parts";
import { Stack, router } from "expo-router";
import { Package, Plus } from "lucide-react-native";
import { ScrollView } from "react-native";
import { SkeletonSettingsRows } from "@/gallery/demo/skeletons";

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
  const { state } = useStates(STATES);
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderIconButton icon={Plus} accessibilityLabel="New order" onPress={() => router.push("/screens/patterns/create")} />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
      {state === "Empty" ? (
        <View style={{ flex: 1 }}>
          <EmptyState art={{ image: require("@/assets/images/empty/box.png") }} title="No orders yet" body="New orders show up here as they come in" action={{ label: "New order", plus: true, onPress: () => router.push("/screens/patterns/create") }} />
        </View>
      ) : (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}>
        {state === "Loading" ? (
          <SkeletonSettingsRows count={4} badge />
        ) : (
          <SettingsGroup>
            {ORDERS.map((o) => (
              <SettingsRow key={o.id} label={`#${o.id}  ${o.who}`} Icon={Package} navigates href="/screens/patterns/detail" accessory={<Badge variant={o.variant}>{o.status}</Badge>} />
            ))}
          </SettingsGroup>
        )}
      </ScrollView>
      )}
      </View>
    </>
  );
}
