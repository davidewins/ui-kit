import { FulfillmentToggle, SingleMode } from "@/apps/void/components/basket/FulfillmentToggle";
import { TravelTimeDisplay } from "@/apps/void/components/basket/TravelTimeDisplay";
import { TravelData } from "@/apps/void/hooks/useTravelData";
import { GlassSurface } from "@/components/GlassSurface";
import { Image, Text, View } from "@/components/ui";
import { BasketItemInterface } from "@/apps/void/types/basket";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

type FulfillmentType = "pickup" | "platform_delivery" | "vendor_delivery";

interface BasketSectionHeaderProps {
  section: {
    title: string;
    logo?: string;
    address: string;
  };
  /**
   * Pickup/Delivery used to sit in its own strip above the list, and the
   * arrival time down in the footer, so the two halves of one decision were
   * at opposite ends of the screen. They live together in this card now.
   * A store with only one mode renders that mode as a static pill rather
   * than an empty slot, so the row keeps its shape.
   */
  fulfillment?: {
    items: BasketItemInterface[];
    fulfillmentType: FulfillmentType;
    deliveryAvailable: boolean;
    vendorUsesOwnDelivery: boolean;
    pickupAvailable: boolean;
    onFulfillmentTypeChange: (type: FulfillmentType) => void;
  };
  /** "25-35 min", or null while it is still being worked out. */
  arrival?: string | null;
  /**
   * Pickup's own timing. The same slot shows delivery arrival or travel to
   * the store depending on the control, because it answers the same question
   * either way: when do I get the food.
   */
  travel?: {
    travelData: TravelData;
    preferredMode: string;
  };
  /** A price index shop (TAK-1559): it posts the order, nothing else. */
  postOnly?: boolean;
}

export const BasketSectionHeader = ({
  section,
  fulfillment,
  arrival,
  travel,
  postOnly = false,
}: BasketSectionHeaderProps) => {
  const colors = useThemeColors();

  return (
    <View className="mx-2 mb-3 mt-1">
      <GlassSurface
        style={[styles.glass, { borderColor: colors.border }]}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.background, opacity: 0.45 },
          ]}
        />
        <View className="flex-row items-center gap-2.5 px-3 py-3">
          {/* The tile is bordered and filled whether or not there is a logo.
              Without it, a store with no logo (or a logo with a transparent
              background) read as a hole in the card, because the card's own
              fill and the fallback fill are near-identical in light mode. */}
          {section.logo ? (
            <Image
              source={{ uri: section.logo }}
              style={[
                styles.logoBox,
                {
                  backgroundColor: colors.secondaryBackground,
                  borderColor: colors.border,
                },
              ]}
            />
          ) : (
            <View
              style={[
                styles.logoBox,
                styles.logoFallback,
                {
                  backgroundColor: colors.secondaryBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="storefront" size={18} color={colors.muted} />
            </View>
          )}
          <View className="flex-1 min-w-0">
            <Text weight="semibold" className="text-sm text-text" numberOfLines={1}>
              {section.title}
            </Text>
            <Text className="text-xs text-muted mt-0.5" numberOfLines={2}>
              {section.address}
            </Text>
          </View>
        </View>

        {postOnly ? (
          <View
            className="flex-row items-center gap-3 px-3 pb-3"
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.border,
              paddingTop: 10,
            }}
          >
            <SingleMode label="Post" compact />
          </View>
        ) : null}

        {fulfillment ? (
          <View
            className="flex-row items-center gap-3 px-3 pb-3"
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.border,
              paddingTop: 10,
            }}
          >
            <View style={{ flex: 1, maxWidth: 220 }}>
              <FulfillmentToggle {...fulfillment} compact />
            </View>
            {fulfillment.fulfillmentType === "pickup" ? (
              travel ? (
                <View className="flex-1 items-end">
                  <Text className="text-[11px] text-muted">
                    Travel to store
                  </Text>
                  <TravelTimeDisplay
                    travelData={travel.travelData}
                    preferredMode={travel.preferredMode}
                  />
                </View>
              ) : null
            ) : arrival ? (
              <View className="flex-1 items-end">
                <Text className="text-[11px] text-muted">Arrives</Text>
                <Text weight="semibold" className="text-sm" numberOfLines={1}>
                  {arrival}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </GlassSurface>
    </View>
  );
};

const styles = StyleSheet.create({
  glass: {
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  logoFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
});