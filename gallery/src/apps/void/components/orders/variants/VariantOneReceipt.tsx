// VARIANT 1 - RECEIPT-LED.
//
// The docket is the tracker. The order prints itself onto the paper as it
// advances: each beat gets a printed line with the time it actually happened,
// and the beats that have not happened yet sit on the paper as faint unprinted
// lines. The map is a small window torn into the docket that expands on tap.
//
// One card on the screen. Not three.
import { Text } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { HelpCircle, Maximize2, Minimize2, Navigation, Phone } from "lucide-react-native";
import { FC, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { GlassButton } from "@/components/ui/GlassButton";
import { ChatRows } from "./ChatRows";
import { OrderMiniMap } from "./OrderMiniMap";
import { toneColor } from "./orderNarrative";
import { ReceiptBlock } from "./ReceiptBlock";
import { VariantSwitcher } from "./VariantSwitcher";
import type { VariantOrderModel } from "./useVariantOrder";

const NUM = { fontVariant: ["tabular-nums" as const] };
const MAP_COLLAPSED = 108;
const MAP_EXPANDED = 280;

export const VariantOneReceipt: FC<{
  model: VariantOrderModel;
  /** Only the /variant/[n] showroom route passes this. */
  showSwitcher?: boolean;
}> = ({ model, showSwitcher = false }) => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);
  // Conversations rows already offer both threads, so a chat primary is a
  // second button for the same thing.
  const primaryDuplicatesAChatRow =
    model.primaryKind === "chat_store" || model.primaryKind === "chat_rider";
  const mapHeight = useSharedValue(MAP_COLLAPSED);
  const mapStyle = useAnimatedStyle(() => ({ height: mapHeight.value }));

  const { narrative, map } = model;
  const accent = toneColor(narrative.tone, colors);

  const toggleMap = () => {
    Haptics.selectionAsync();
    const next = !expanded;
    setExpanded(next);
    mapHeight.set(
      withTiming(next ? MAP_EXPANDED : MAP_COLLAPSED, { duration: 220 }),
    );
  };

  const mapCaption = model.isPickup
    ? (model.storeAddress ?? model.storeName ?? "The store")
    : map.rider
      ? map.riderIsStale
        ? `${model.riderName ?? "Your rider"} last reported a few minutes ago`
        : `${model.riderName ?? "Your rider"} is on the map`
      : `${model.storeName ?? "The store"} to your door`;

  return (
    <>
      <Stack.Screen
        options={{
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: colors.tint,
          headerShadowVisible: false,
          headerTitleStyle: colors.headerTitleStyle,
          headerTitle: narrative.title,
        }}
      />
      {/* Header: call / directions / support as icons, cancel in the "..."
          menu. The one main action is the big button at the bottom (David,
          3 Nov: no bare-text buttons, two big bottom buttons at most). */}
      <ActionMenu
        accessibilityLabel="Order actions"
        buttons={[
          ...(model.canCallRider
            ? [{ label: `Call ${model.riderName ?? "your rider"}`, systemImage: "phone" as const, icon: Phone, onPress: model.callRider }]
            : []),
          ...(model.isPickup && model.canGetDirections
            ? [{ label: "Directions to the store", systemImage: "location" as const, icon: Navigation, onPress: model.openDirections }]
            : []),
          { label: "Order support", systemImage: "questionmark.circle", icon: HelpCircle, onPress: model.openHelp },
        ]}
        actions={model.canCancel ? [{ label: "Cancel order", systemImage: "xmark.circle", destructive: true, onPress: model.cancel }] : []}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={model.isRefetching}
            onRefresh={model.refetch}
            tintColor={colors.text}
          />
        }
      >
        {showSwitcher ? (
          <VariantSwitcher orderId={model.id} current={1} />
        ) : null}

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 22,
            borderCurve: "continuous",
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          {/* Head: who it is from, and which order it is. */}
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Text
                weight="bold"
                style={{ flex: 1, fontSize: 20, letterSpacing: -0.4 }}
                numberOfLines={1}
              >
                {model.storeName ?? "Your order"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: accent + "1f",
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: accent,
                  }}
                />
                <Text weight="semibold" className="text-[12px]" style={{ color: accent }}>
                  {narrative.title}
                </Text>
              </View>
            </View>
            <Text className="text-[12px]" style={{ color: colors.muted, marginTop: 2 }}>
              {[
                model.displayId,
                model.placedAt,
                `${model.itemCount} ${model.itemCount === 1 ? "item" : "items"}`,
              ]
                .filter(Boolean)
                .join("  ·  ")}
            </Text>
          </View>

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />

          {/* The print log: the order writing itself onto the docket. */}
          <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12 }}>
            {model.printLines.map((line) => (
              <View key={line.label}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 5,
                    opacity: line.state === "todo" ? 0.35 : 1,
                  }}
                >
                  <Text
                    className="text-[12px]"
                    style={[NUM, { width: 46, color: colors.muted }]}
                  >
                    {line.time ?? "--:--"}
                  </Text>
                  <Text
                    weight={line.state === "current" ? "semibold" : "regular"}
                    className="flex-1 text-[14px]"
                    style={{
                      color: line.state === "current" ? colors.text : colors.muted,
                    }}
                  >
                    {line.label}
                  </Text>
                  {line.state === "current" ? (
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: accent,
                      }}
                    />
                  ) : null}
                </View>
                {line.state === "current" ? (
                  <Text
                    className="text-[13px] leading-snug"
                    style={{ color: colors.muted, marginLeft: 46, marginBottom: 4 }}
                  >
                    {narrative.detail}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>

          {/* The window torn into the paper. */}
          {map.canShow ? (
            <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
              <Pressable
                onPress={toggleMap}
                accessibilityRole="button"
                accessibilityLabel={expanded ? "Collapse map" : "Expand map"}
              >
                <Animated.View
                  style={[
                    mapStyle,
                    {
                      borderRadius: 14,
                      borderCurve: "continuous",
                      overflow: "hidden",
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: colors.border,
                      backgroundColor: colors.secondaryBackground,
                    },
                  ]}
                >
                  <OrderMiniMap
                    store={map.store}
                    dropoff={map.dropoff}
                    rider={map.rider}
                    user={map.user}
                    riderIsStale={map.riderIsStale}
                    waypoints={map.waypoints}
                    // Pinch and pan once the map is opened out. Collapsed it
                    // stays inert so it does not steal the page scroll.
                    interactive={expanded}
                  />
                </Animated.View>
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <Text
                  className="text-[12px] flex-1"
                  style={{ color: colors.muted }}
                  numberOfLines={1}
                >
                  {mapCaption}
                </Text>
                <Pressable
                  onPress={toggleMap}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={expanded ? "Collapse map" : "Expand map"}
                >
                  {expanded ? (
                    <Minimize2 size={15} color={colors.muted} strokeWidth={2} />
                  ) : (
                    <Maximize2 size={15} color={colors.muted} strokeWidth={2} />
                  )}
                </Pressable>
              </View>
            </View>
          ) : null}

          {/* The receipt he keeps. */}
          <ReceiptBlock
            items={model.items}
            money={model.money}
            pageColor={colors.background}
          />

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />

          <ChatRows chats={model.chats} onOpen={model.openChat} />

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />

        </View>
      </ScrollView>
      {primaryDuplicatesAChatRow ? null : (
        <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: (insets.bottom || 16) + 4, backgroundColor: colors.background }}>
          <GlassButton
            label={model.primaryLabel}
            onPress={model.runPrimary}
            loading={model.primaryBusy}
            disabled={model.primaryBusy}
            tone="primary"
            size="lg"
          />
        </View>
      )}
    </>
  );
};
