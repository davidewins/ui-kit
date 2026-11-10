import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useOrderNotesStore } from "@/apps/void/context/store/orderNotesStore";
import { useUserPaymentPreferences } from "@/apps/void/hooks/useUserPaymentPreferences";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Platform, Pressable } from "react-native";

export default function BasketPaymentMethod({
  canAcceptCards,
}: {
  canAcceptCards: boolean;
}) {
  const colors = useThemeColors();
  const { data: preferences, isLoading } = useUserPaymentPreferences();
  const {
    selectedPaymentMethod,
    vendorAcceptsCash,
    setSelectedPaymentMethod,
  } = useOrderNotesStore();
  const showToggle = canAcceptCards && vendorAcceptsCash;

  const getCardDisplay = () => {
    const defaultMethod = preferences?.defaultMethod || "apple_pay";
    switch (defaultMethod) {
      // Apple Pay display disabled for now - useless until it's actually
      // wired as a distinct payment rail. Falls through to plain "Card".
      // case "apple_pay":
      //   if (Platform.OS !== "ios") {
      //     return { icon: "card" as const, label: "Card" };
      //   }
      //   return { icon: "logo-apple" as const, label: "Apple Pay" };
      case "google_pay":
        if (Platform.OS !== "android") {
          return { icon: "card" as const, label: "Card" };
        }
        return { icon: "logo-google" as const, label: "Google Pay" };
      case "card":
        return { icon: "card" as const, label: "Card" };
      default:
        return { icon: "card" as const, label: "Card" };
    }
  };

  if (isLoading) {
    return (
      <View className="flex-row items-center gap-2">
        <ActivityIndicator size="small" color={colors.muted} />
      </View>
    );
  }

  if (showToggle) {
    const cardDisplay = getCardDisplay();
    return (
      <View
        className="rounded-lg p-1 w-full flex-row"
        style={{ backgroundColor: colors.secondaryBackground }}
      >
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            setSelectedPaymentMethod("card");
          }}
          accessibilityRole="button"
          accessibilityLabel={`Pay by ${cardDisplay.label}`}
          accessibilityState={{ selected: selectedPaymentMethod === "card" }}
          className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-md ${
            selectedPaymentMethod === "card" ? "bg-background" : ""
          }`}
        >
          <Ionicons
            name={cardDisplay.icon}
            size={18}
            color={selectedPaymentMethod === "card" ? colors.text : colors.muted}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            setSelectedPaymentMethod("cash");
          }}
          accessibilityRole="button"
          accessibilityLabel="Pay in store with cash"
          accessibilityState={{ selected: selectedPaymentMethod === "cash" }}
          className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-md ${
            selectedPaymentMethod === "cash" ? "bg-background" : ""
          }`}
        >
          <Ionicons
            name="cash"
            size={18}
            color={selectedPaymentMethod === "cash" ? colors.text : colors.muted}
          />
        </Pressable>
      </View>
    );
  }

  // Nothing to choose - only one method is available, so this is a plain
  // status line, not a control. No card/background chrome around it.
  if (!canAcceptCards) {
    return (
      <View className="flex-row items-center gap-2">
        <Ionicons name="cash" size={16} color={colors.muted} />
        <Text className="text-sm text-muted">Pay in store</Text>
      </View>
    );
  }

  // Single silent payment method, nothing to choose or confirm - the label
  // display here was useless (showed "Card" with no actual distinction to
  // make), disabled for now rather than show a meaningless line.
  // const cardDisplay = getCardDisplay();
  // return (
  //   <View className="flex-row items-center gap-2">
  //     <Ionicons name={cardDisplay.icon} size={16} color={colors.muted} />
  //     <Text className="text-sm text-muted">{cardDisplay.label}</Text>
  //   </View>
  // );
  return null;
}