import { Text, View } from "@/components/ui";
import { useOrderNotesStore } from "@/apps/void/context/store/orderNotesStore";
import { useThemeColors } from "@/hooks/useThemeColors";
import { AvailableCredit } from "@/apps/void/hooks/useAvailableCredit";
import { formatMoney } from "@/apps/void/lib/utils/formatMoney";
import * as Haptics from "expo-haptics";
import { Platform, StyleSheet, Switch, useColorScheme } from "react-native";

/**
 * Lets the customer spend their store credit at checkout (TAK-1218). Renders
 * nothing when there's no balance, or when cash is the selected payment
 * method - credit never touches a cash order (the rider would otherwise have
 * to collect a reduced amount at the door and someone would reconcile it by
 * hand).
 */
export function CreditToggleRow({
  availableCredit,
}: {
  availableCredit: AvailableCredit | null | undefined;
}) {
  const colors = useThemeColors();
  const colorScheme = useColorScheme();
  const { useCredit, setUseCredit, selectedPaymentMethod } =
    useOrderNotesStore();

  if (!availableCredit || availableCredit.applicable_cents <= 0) return null;
  if (selectedPaymentMethod !== "card") return null;

  // vendor_cents is only spendable at this vendor - when it differs from the
  // platform-wide balance, say so, so the customer isn't surprised when it
  // doesn't follow them to another store.
  const showVendorOnlyNote =
    availableCredit.vendor_cents > 0 &&
    availableCredit.vendor_cents !== availableCredit.platform_cents;

  const subtitle = showVendorOnlyNote
    ? `${formatMoney(availableCredit.applicable_cents)} available - ${formatMoney(
        availableCredit.vendor_cents,
      )} only valid at this store`
    : `${formatMoney(availableCredit.applicable_cents)} available`;

  const offTrack =
    colorScheme === "dark" ? "rgba(120, 120, 128, 0.32)" : colors.border;

  return (
    <View
      className="mx-4 mb-4 rounded-2xl px-4 py-3 flex-row items-center justify-between"
      style={{
        backgroundColor: colors.secondaryBackground,
        borderRadius: 16,
        borderCurve: "continuous",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
      }}
    >
      <View className="flex-1 pr-4">
        <Text weight="semibold" className="text-base">
          Use store credit
        </Text>
        <Text className="text-[13px] text-muted" style={{ lineHeight: 18 }}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={useCredit}
        onValueChange={(next) => {
          Haptics.selectionAsync();
          setUseCredit(next);
        }}
        trackColor={{ true: colors.tint, false: offTrack }}
        thumbColor={Platform.OS === "android" ? colors.background : undefined}
        ios_backgroundColor={offTrack}
        accessibilityLabel="Use store credit on this order"
      />
    </View>
  );
}
