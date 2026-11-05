// Flow · 1 execute pickup or dropoff on this order · 2 primary writes
// picked_up / delivered · 3 pickup stays here in dropoff phase; delivered
// returns to the map. Customer contact is Stream only - no tel, no SMS.
// Taste: VOID help chat + RIDERS inset glass / one primary pill.

import { Text, View } from "@/components/ui";
import { useOrderBadgeStore } from "@/apps/riders/stores/orderBadgeStore";
import { GraySurface } from "@/apps/riders/components/GraySurface";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { useGroupSurface } from "@/gallery/groupStyle";
import { GlassButton } from "@/components/ui/actions/GlassButton";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useStartChat } from "@/apps/riders/hooks/useStartChat";
import { useStartSupportChat } from "@/apps/riders/hooks/useStartSupportChat";
import { useCustomerCall } from "@/apps/riders/context/VideoCallWrapper";
import { useRiderStore } from "@/apps/riders/stores/riderStore";
import { openNavigationPicker } from "@/apps/riders/services/navigation";
import {
  markPickedUp as markPickedUpApi,
  markDelivered as markDeliveredApi,
  markAgeCheckFailed as markAgeCheckFailedApi,
  getActiveAssignment,
} from "@/apps/riders/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Logger from "@/lib/Logger";
import {
  Navigation2,
  MessageSquare,
  Phone,
  LifeBuoy,
  Info,
  ArrowBigRightDash,
} from "lucide-react-native";
import React from "react";
import { Alert, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function StopRow({
  step,
  total,
  active,
  label,
  title,
  subtitle,
  actionLabel,
  onNavigate,
}: {
  step: number;
  total: number;
  active: boolean;
  label: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  onNavigate: () => void;
}) {
  const colors = useThemeColors();
  return (
    <View className="px-4 py-3.5">
      <View className="flex-row items-start gap-3">
        <View className="items-center" style={{ width: 22, paddingTop: 2 }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: active ? colors.tint : colors.background,
              borderWidth: 1.5,
              borderColor: active ? colors.tint : colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              weight="semibold"
              style={{
                fontSize: 11,
                color: active ? colors.background : colors.muted,
              }}
            >
              {step}
            </Text>
          </View>
          {step < total ? (
            <View
              style={{
                width: 1.5,
                flex: 1,
                minHeight: 12,
                marginTop: 4,
                backgroundColor: colors.separator,
              }}
            />
          ) : null}
        </View>
        <View className="flex-1">
          <Text
            weight="semibold"
            className="text-[11px] uppercase tracking-wide text-muted"
          >
            {label}
          </Text>
          <Text weight="semibold" className="text-[16px] tracking-tight mt-0.5">
            {title}
          </Text>
          <Text className="text-[14px] text-muted tracking-tight mt-0.5">
            {subtitle}
          </Text>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onNavigate();
            }}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            className="flex-row items-center self-start gap-1.5 mt-2.5 bg-text text-background rounded-full px-3 py-1"

          >
            <Text weight="medium" className="text-[14px]" style={{ color: colors.background }}>
              {actionLabel}
            </Text>
            <ArrowBigRightDash size={14} color={colors.background} strokeWidth={2.2} />

          </Pressable>
        </View>
      </View>
    </View>
  );
}

function ActionTile({
  label,
  hint,
  Icon,
  disabled,
  onPress,
}: {
  label: string;
  hint: string;
  Icon: typeof MessageSquare;
  disabled?: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled, busy: disabled }}
      className="flex-1"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <GraySurface
        style={{
          borderRadius: 16,
          borderCurve: "continuous",
          overflow: "hidden",
          paddingVertical: 14,
          paddingHorizontal: 12,
          alignItems: "center",
          gap: 6,
        }}
      >
        <Icon size={18} color={colors.text} strokeWidth={2} />
        <Text weight="medium" className="text-[14px] tracking-tight">
          {label}
        </Text>
      </GraySurface>
    </Pressable>
  );
}

export default function ActiveDeliveryScreen() {
  const colors = useThemeColors();
  const { titlePadInGutter } = useGroupSurface();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const activeDelivery = useRiderStore((s) => s.activeDelivery);
  // Opening the job is reading its updates (TAK-1179).
  const markOrderRead = useOrderBadgeStore((s) => s.markOrderRead);
  React.useEffect(() => {
    if (activeDelivery?.orderId) markOrderRead(activeDelivery.orderId);
  }, [activeDelivery?.orderId, markOrderRead]);
  const updateDeliveryStatus = useRiderStore((s) => s.updateDeliveryStatus);
  const completeDelivery = useRiderStore((s) => s.completeDelivery);
  const { startChatWithCustomer, isCreating: isStartingChat } = useStartChat();
  const { startSupportChat, isStarting: isStartingSupport } =
    useStartSupportChat();
  const { startCustomerCall, starting: isCalling } = useCustomerCall();
  const setActiveDelivery = useRiderStore((s) => s.setActiveDelivery);
  const queryClient = useQueryClient();

  // The server credits riders.today_earnings_cents / today_deliveries as part
  // of the delivered call, so refetch the rider row once the job is closed:
  // the map's "Today's Earnings" then shows the banked figure rather than the
  // optimistic one completeDelivery() just added.
  const refreshTodayTotals = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["rider_profile"] });
  }, [queryClient]);

  // Concierge, rider first (TAK-1106): the operator phones the restaurant
  // after the rider accepts, so the ready time lands later. Poll for it -
  // the push is a nudge, not the only way to find out. Above the early
  // return below: hooks can't sit behind a conditional.
  const awaitingReadyTime =
    !!activeDelivery &&
    activeDelivery.concierge === true &&
    !activeDelivery.readyAt &&
    (activeDelivery.status === "accepted" ||
      activeDelivery.status === "en_route");
  React.useEffect(() => {
    if (!awaitingReadyTime || !activeDelivery) return;
    let stopped = false;
    const check = async () => {
      try {
        const data = await getActiveAssignment();
        const a = data?.assignment;
        if (stopped || !a || a.id !== activeDelivery.id || !a.ready_at) return;
        setActiveDelivery({ ...activeDelivery, readyAt: a.ready_at });
      } catch (err) {
        Logger.log("[Delivery] ready-time poll failed", err);
      }
    };
    check();
    const timer = setInterval(check, 20_000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [awaitingReadyTime, activeDelivery?.id]);

  if (!activeDelivery) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-muted">No active delivery</Text>
        <View className="mt-4 w-full">
          <GlassButton
            label="Go Back"
            tone="neutral"
            onPress={() => router.back()}
          />
        </View>
      </View>
    );
  }

  const isPickupPhase =
    activeDelivery.status === "accepted" ||
    activeDelivery.status === "en_route";
  const isDropoffPhase = activeDelivery.status === "picked_up";

  const handleNavigateToPickup = () => {
    openNavigationPicker(
      activeDelivery.pickupLat,
      activeDelivery.pickupLng,
      activeDelivery.vendorName,
    );
  };

  const handleNavigateToDropoff = () => {
    openNavigationPicker(
      activeDelivery.dropoffLat,
      activeDelivery.dropoffLng,
      activeDelivery.dropoffAddress,
    );
  };

  const submitPickup = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await markPickedUpApi(activeDelivery.id);
      updateDeliveryStatus("picked_up");
    } catch (err) {
      Logger.error("[Delivery] Failed to mark picked up:", err);
      Alert.alert(
        "Couldn't update delivery",
        "We couldn't mark this order as picked up. Please try again.",
      );
    }
  };

  // Concierge orders are placed and paid by the operator over the phone
  // (TAK-1106) - the rider just collects, nothing to enter.
  const handlePickedUp = () => submitPickup();

  const submitDelivered = async (ageVerified?: boolean) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await markDeliveredApi(activeDelivery.id, ageVerified);
      completeDelivery();
      refreshTodayTotals();
      router.back();
    } catch (err) {
      Logger.error("[Delivery] Failed to mark delivered:", err);
      // Server says this order needs an ID check but the local flag was
      // missing (e.g. an offer loaded before TAK-1092) - ask for it now.
      if (String(err).includes("age_check_required")) {
        handleAgeCheck();
        return;
      }
      Alert.alert(
        "Couldn't complete delivery",
        "We couldn't mark this order as delivered. Please try again.",
      );
    }
  };

  const submitAgeCheckFailed = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    try {
      const result = await markAgeCheckFailedApi(activeDelivery.id);
      // Delivery pay + €5 return fee (TAK-1092) - counts as a delivery.
      completeDelivery(result?.payout_cents);
      refreshTodayTotals();
      router.back();
    } catch (err) {
      Logger.error("[Delivery] Failed to record age check failure:", err);
      Alert.alert("Couldn't update order", "Please try again, or use Help.");
    }
  };

  // TAK-1092: 18+ orders - only hand over after checking photo ID.
  const handleAgeCheck = () => {
    Alert.alert(
      "Check photo ID",
      "This order has 18+ items. Only hand it over if the customer's photo ID shows they're 18 or over.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Couldn't verify",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Don't hand it over",
              "The customer is refunded minus the delivery fee. Keep the items - support will tell you where to return them.",
              [
                { text: "Back", style: "cancel" },
                {
                  text: "Confirm",
                  style: "destructive",
                  onPress: submitAgeCheckFailed,
                },
              ],
            ),
        },
        { text: "ID checked, 18+", onPress: () => submitDelivered(true) },
      ],
    );
  };

  const handleDelivered = () => {
    if (activeDelivery.ageRestricted) {
      handleAgeCheck();
      return;
    }
    Alert.alert("Confirm Delivery", "Has the order been delivered?", [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: () => submitDelivered() },
    ]);
  };

  const handleMessageCustomer = async () => {
    if (!activeDelivery.customerId) {
      Alert.alert(
        "Chat unavailable",
        "Can't message this customer right now. Use Help if you need us.",
      );
      return;
    }
    const cid = await startChatWithCustomer(
      activeDelivery.customerId,
      activeDelivery.customerName,
    );
    if (cid) {
      router.push(`/chat/${cid}` as `/chat/${string}`);
    } else {
      Alert.alert("Couldn't start chat", "Please try again.");
    }
  };

  const handleHelp = async () => {
    const cid = await startSupportChat({
      category: "order_issue",
      subject: `Help with order at ${activeDelivery.vendorName}`,
      orderId: activeDelivery.orderId,
    });
    if (cid) {
      router.push(`/chat/${cid}` as `/chat/${string}`);
    } else {
      Alert.alert("Couldn't start chat", "Please try again.");
    }
  };

  const fee = `€${(activeDelivery.deliveryFee / 100).toFixed(2)}`;
  // estimatedDuration is seconds (total_eta_seconds) - it was printed raw
  // next to "min", so a 20-minute trip read as "1179 min".
  const meta = [
    `${activeDelivery.estimatedDistance.toFixed(1)} km`,
    `${Math.max(1, Math.round(activeDelivery.estimatedDuration / 60))} min`,
  ].join(" · ");

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: isPickupPhase ? "Picking Up" : "Delivering",
        }}
      />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="mb-5">
          <Text weight="bold" className="text-[28px] tracking-tight">
            {fee}
          </Text>
          <Text weight="semibold" className="text-[17px] tracking-tight mt-1">
            {activeDelivery.vendorName}
          </Text>
          <Text className="text-[13px] text-muted tracking-tight mt-0.5">
            {meta}
            {id ? ` · #${activeDelivery.orderId.slice(0, 8)}` : ""}
          </Text>
        </View>

        {activeDelivery.ageRestricted && (
          <View className="mb-5">
            <GraySurface
              group="paddedInGutter"
              style={{
                borderRadius: 16,
                borderCurve: "continuous",
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Text weight="semibold">18+ order · Check photo ID</Text>
              <Text className="text-muted text-sm mt-0.5">
                Only hand it over if the customer&apos;s ID shows they&apos;re 18 or
                over.
              </Text>
            </GraySurface>
          </View>
        )}

        {isPickupPhase && activeDelivery.concierge && (
          <View className="mb-5">
            <GraySurface
              group="paddedInGutter"
              style={{
                borderRadius: 16,
                borderCurve: "continuous",
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Text weight="semibold">
                {activeDelivery.readyAt
                  ? `Ready at ${new Date(activeDelivery.readyAt).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" })}`
                  : "Waiting for the restaurant"}
              </Text>
              <Text className="text-muted text-sm mt-0.5">
                {activeDelivery.readyAt
                  ? `Head to ${activeDelivery.vendorName} and collect it.`
                  : "We're placing the order by phone now. The ready time appears here as soon as it's in."}
              </Text>
            </GraySurface>
          </View>
        )}

        {isPickupPhase && activeDelivery.concierge && (
          <View className="mb-5">
            <SectionTitle inset={titlePadInGutter} style={{ marginTop: 0 }}>Collect - already paid</SectionTitle>
            <GraySurface
              group="paddedInGutter"
              style={{
                borderRadius: 16,
                borderCurve: "continuous",
                overflow: "hidden",
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              {(activeDelivery.items ?? []).map((it, i) => (
                <View
                  key={`${it.name}-${i}`}
                  className="py-1.5"
                  style={
                    i > 0
                      ? {
                          borderTopWidth: 0.5,
                          borderTopColor: colors.separator,
                        }
                      : undefined
                  }
                >
                  <Text weight="medium">
                    {it.quantity}× {it.name}
                  </Text>
                  {(it.customizations ?? []).length > 0 && (
                    <Text className="text-muted text-xs mt-0.5">
                      {(it.customizations ?? []).map((c) => c.option).join(", ")}
                    </Text>
                  )}
                </View>
              ))}
              {(!activeDelivery.items || activeDelivery.items.length === 0) && (
                <Text className="text-muted text-sm">
                  Item list unavailable - check Help if you&apos;re stuck.
                </Text>
              )}
              <Text className="text-muted text-xs mt-2">
                Ask for the order under {activeDelivery.customerName}.
              </Text>
            </GraySurface>
          </View>
        )}

        <View className="mb-5">
          <SectionTitle inset={titlePadInGutter} style={{ marginTop: 0 }}>Route</SectionTitle>
          <GraySurface
            group="inGutter"
            style={{
              borderRadius: 16,
              borderCurve: "continuous",
              overflow: "hidden",
            }}
          >
            <StopRow
              step={1}
              total={2}
              active={isPickupPhase}
              label="Pickup"
              title={activeDelivery.vendorName}
              subtitle={activeDelivery.pickupAddress}
              actionLabel="Navigate to pickup"
              onNavigate={handleNavigateToPickup}
            />
            <View
              style={{
                height: 0.5,
                backgroundColor: colors.separator,
                marginLeft: 42,
              }}
            />
            <StopRow
              step={2}
              total={2}
              active={isDropoffPhase}
              label="Drop-off"
              title={activeDelivery.customerName}
              subtitle={activeDelivery.dropoffAddress}
              actionLabel="Navigate to drop-off"
              onNavigate={handleNavigateToDropoff}
            />
          </GraySurface>
        </View>

        {isDropoffPhase &&
          (activeDelivery.deliveryInstructions ||
            activeDelivery.noteForRider) && (
            <View className="mb-5">
              <SectionTitle inset={titlePadInGutter} style={{ marginTop: 0 }}>Customer instructions</SectionTitle>
              <GraySurface
              group="paddedInGutter"
                style={{
                  borderRadius: 16,
                  borderCurve: "continuous",
                  overflow: "hidden",
                  padding: 16,
                  gap: 14,
                }}
              >
                {activeDelivery.deliveryInstructions ? (
                  <View className="flex-row items-start gap-3">
                    <Info size={16} color={colors.muted} />
                    <View className="flex-1">
                      <Text className="text-xs text-muted mb-0.5">
                        Drop-off preference
                      </Text>
                      <Text weight="medium">
                        {activeDelivery.deliveryInstructions}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {activeDelivery.noteForRider ? (
                  <View className="flex-row items-start gap-3">
                    <MessageSquare size={16} color={colors.muted} />
                    <View className="flex-1">
                      <Text className="text-xs text-muted mb-0.5">
                        Note from customer
                      </Text>
                      <Text weight="medium">{activeDelivery.noteForRider}</Text>
                    </View>
                  </View>
                ) : null}
              </GraySurface>
            </View>
          )}

        <View className="flex-row gap-3 mb-2">
          <ActionTile
            label="Message"
            hint="Open an in-app chat with the customer. Phone numbers are not shared."
            Icon={MessageSquare}
            disabled={isStartingChat}
            onPress={handleMessageCustomer}
          />
          <ActionTile
            label="Call"
            hint="Start an in-app voice call with the customer. Phone numbers are not shared."
            Icon={Phone}
            disabled={isCalling}
            onPress={() => startCustomerCall(activeDelivery.orderId)}
          />
          <ActionTile
            label="Help"
            hint="Open an in-app chat with support about this order"
            Icon={LifeBuoy}
            disabled={isStartingSupport}
            onPress={handleHelp}
          />
        </View>
        <Text className="text-[12px] text-muted tracking-tight ml-1 mb-4">
          In-app chat and calls. Customer numbers stay private.
        </Text>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        {isPickupPhase && (
          <GlassButton
            label={awaitingReadyTime ? "Waiting for restaurant" : "Picked Up"}
            tone="primary"
            size="lg"
            disabled={awaitingReadyTime}
            accessibilityHint={
              awaitingReadyTime
                ? "Available once the operator has placed the order with the restaurant"
                : "Confirm you have collected the order from the pickup location"
            }
            onPress={handlePickedUp}
          />
        )}
        {isDropoffPhase && (
          <GlassButton
            label="Mark as Delivered"
            tone="primary"
            size="lg"
            accessibilityHint="Confirm the order has been delivered to the customer"
            onPress={handleDelivered}
          />
        )}
      </View>
    </>
  );
}
