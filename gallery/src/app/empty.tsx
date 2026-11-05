import { LoadErrorState } from "@/components/LoadErrorState";
import { View } from "@/components/ui";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonList } from "@/components/ui";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { BottomSwitch } from "@/gallery/BottomSwitch";
import { Inbox } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

const STATES = ["Empty", "Icon", "List", "Loading", "Error"] as const;

// Every screen state on one page. Empty and error are fixed, centred screens
// (nothing to scroll); only the loading skeleton scrolls, like the list it
// stands in for.
export default function ScreenStates() {
  const [state, setState] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const current = STATES[state];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {current === "Empty" ? (
          <EmptyState
            art={{ image: require("../assets/images/empty/delivery-truck.png") }}
            title="No deliveries yet"
            body="New orders show up here"
            action={{ label: "Go online", onPress: () => {} }}
          />
        ) : current === "Icon" ? (
          <EmptyState art={{ icon: Inbox }} title="No messages yet" body="Start a chat to see it here" />
        ) : current === "List" ? (
          <EmptyState
            art="list"
            title="No orders yet"
            body="They'll show up here as they come in"
            secondary={{ label: "Clear filters", onPress: () => {} }}
          />
        ) : current === "Loading" ? (
          <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingTop: 8 }}>
            <View style={{ paddingHorizontal: 20, paddingBottom: 16, gap: 12 }}>
              <SkeletonBlock height={40} width="55%" />
              <SkeletonBlock height={14} width="35%" />
            </View>
            <SkeletonList count={6} />
          </ScrollView>
        ) : (
          <LoadErrorState
            retrying={retrying}
            onRetry={() => {
              setRetrying(true);
              setTimeout(() => setRetrying(false), 1200);
            }}
          />
        )}
      </View>
      <BottomSwitch values={STATES} selectedIndex={state} onChange={setState} accessibilityLabel="State" />
    </View>
  );
}
