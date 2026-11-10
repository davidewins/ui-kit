import { Text as UIText, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { BasketItemInterface } from "@/apps/void/types/basket";
import { SegmentedControl } from "@expo/ui/community/segmented-control";
import {
  Host as ComposeHost,
  SegmentedButton,
  SingleChoiceSegmentedButtonRow,
  Text as ComposeText,
} from "@expo/ui/jetpack-compose";
import {
  fillMaxWidth,
  height,
} from "@expo/ui/jetpack-compose/modifiers";
import { Host, Picker, Text } from "@expo/ui/swift-ui";
import {
  controlSize,
  environment,
  pickerStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, StyleSheet, useColorScheme } from "react-native";

type FulfillmentType = "pickup" | "platform_delivery" | "vendor_delivery";

const LABELS = ["Pickup", "Delivery"];

/**
 * Stands in for the segmented control when the store offers a single mode.
 * Sized to match the compact control so the row it shares does not reflow.
 */
export function SingleMode({ label, compact }: { label: string; compact: boolean }) {
  const colors = useThemeColors();
  return (
    <View className={compact ? "" : "px-2 py-1.5"}>
      <View
        accessibilityRole="text"
        accessibilityLabel={`${label} only`}
        style={{
          height: compact ? 34 : 48,
          // A pill where the segmented control would be.
          borderRadius: 999,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          backgroundColor: colors.secondaryBackground,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 14,
        }}
      >
        <UIText weight="semibold" className="text-sm text-text">
          {label}
        </UIText>
      </View>
    </View>
  );
}

interface BasketFooterProps {
  items: BasketItemInterface[];
  fulfillmentType: FulfillmentType;
  deliveryAvailable: boolean;
  vendorUsesOwnDelivery: boolean;
  /** False when the store has pickup turned off: delivery is the only mode,
   * so there's nothing to toggle. */
  pickupAvailable?: boolean;
  /**
   * Smaller control for the basket's storefront card, where it shares a row
   * with the arrival time. Order Config keeps the full-size one: it is the
   * only thing on that row and a chunky target suits it.
   */
  compact?: boolean;
  onFulfillmentTypeChange: (type: FulfillmentType) => void;
}

export function FulfillmentToggle({
  items,
  fulfillmentType,
  deliveryAvailable,
  vendorUsesOwnDelivery,
  pickupAvailable = true,
  compact = false,
  onFulfillmentTypeChange,
}: BasketFooterProps) {
  const colorScheme = useColorScheme();
  const appearance = colorScheme === "dark" ? "dark" : "light";

  if (items.length === 0) return null;

  // One mode only. This used to render nothing, which left a hole in the
  // basket card's row and pushed the arrival time across to where the control
  // should be. Show the mode as a static pill instead: it holds the layout and
  // it answers the question the control would have answered anyway.
  const deliveryOnly = !pickupAvailable;
  const pickupOnly = !deliveryAvailable && !vendorUsesOwnDelivery;
  if (deliveryOnly || pickupOnly) {
    return (
      <SingleMode label={pickupOnly ? "Pickup" : "Delivery"} compact={compact} />
    );
  }

  const selectedIndex = fulfillmentType === "pickup" ? 0 : 1;
  const select = (index: number) => {
    Haptics.selectionAsync();
    if (index === 0) {
      onFulfillmentTypeChange("pickup");
    } else if (deliveryAvailable) {
      onFulfillmentTypeChange("platform_delivery");
    } else {
      onFulfillmentTypeChange("vendor_delivery");
    }
  };

  // The community SegmentedControl wraps its native control in a
  // content-sized Host, so a style height is ignored. Size the native
  // controls directly for a chunkier toggle.
  if (Platform.OS === "ios") {
    return (
      <View className={compact ? "" : "px-2 py-1.5"}>
        <Host matchContents={{ vertical: true }}>
          <Picker
            selection={selectedIndex}
            onSelectionChange={select}
            label=""
            modifiers={[
              pickerStyle("segmented"),
              controlSize(compact ? "small" : "large"),
              environment("colorScheme", appearance),
            ]}
          >
            {LABELS.map((label, index) => (
              <Text key={label} modifiers={[tag(index)]}>
                {label}
              </Text>
            ))}
          </Picker>
        </Host>
      </View>
    );
  }

  if (Platform.OS === "android") {
    return (
      <View className={compact ? "" : "px-2 py-1.5"}>
        <ComposeHost
          matchContents={{ vertical: true }}
          colorScheme={appearance}
        >
          <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
            {LABELS.map((label, index) => (
              <SegmentedButton
                key={label}
                selected={index === selectedIndex}
                onClick={() => select(index)}
                modifiers={[height(compact ? 34 : 48)]}
              >
                <SegmentedButton.Label>
                  <ComposeText style={{ fontSize: 15, fontWeight: "600" }}>
                    {label}
                  </ComposeText>
                </SegmentedButton.Label>
              </SegmentedButton>
            ))}
          </SingleChoiceSegmentedButtonRow>
        </ComposeHost>
      </View>
    );
  }

  return (
    <View className="px-2 py-1.5">
      <SegmentedControl
        values={LABELS}
        selectedIndex={selectedIndex}
        onChange={(e) => select(e.nativeEvent.selectedSegmentIndex)}
        appearance={appearance}
        style={{ height: 44 }}
      />
    </View>
  );
}
