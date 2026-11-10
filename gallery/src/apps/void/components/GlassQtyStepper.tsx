import { GlassSurface } from "@/components/GlassSurface";
import { Text } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { Minus, Plus } from "lucide-react-native";
import { FC } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

type Props = {
  quantity: number;
  onMinus: () => void;
  onPlus: () => void;
  minusDisabled?: boolean;
  plusDisabled?: boolean;
  /** Compact fits next to product title; large for sticky footers. */
  size?: "sm" | "lg";
  /**
   * Override liquid-glass. Defaults to false (plain bordered chip).
   */
  liquidGlass?: boolean;
};

function StepIcon({
  name,
  color,
  size,
}: {
  name: "plus" | "minus";
  color: string;
  size: number;
}) {
  if (Platform.OS === "ios") {
    return (
      <SymbolView name={name} size={size} tintColor={color} weight="semibold" />
    );
  }
  const Icon = name === "plus" ? Plus : Minus;
  return <Icon size={size + 2} color={color} strokeWidth={2.5} />;
}

/**
 * Reusable quantity stepper (- qty +).
 * Plain bordered chip by default. Optional liquid glass shell via `liquidGlass`.
 */
export const GlassQtyStepper: FC<Props> = ({
  quantity,
  onMinus,
  onPlus,
  minusDisabled = false,
  plusDisabled = false,
  size = "sm",
  liquidGlass = false,
}) => {
  const colors = useThemeColors();
  // Liquid glass disabled for now - a plain bordered chip reads clearer here.
  const useGlass = liquidGlass ?? false;
  // lg sits beside the 46pt add button (GlassButton md) on the product page.
  const dim = size === "lg" ? 46 : 34;
  const iconSize = size === "lg" ? 16 : 13;
  const minW = size === "lg" ? 22 : 18;

  const body = (
    <>
      <Pressable
        onPress={() => {
          if (minusDisabled) return;
          Haptics.selectionAsync();
          onMinus();
        }}
        hitSlop={10}
        disabled={minusDisabled}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        style={[
          styles.btn,
          { width: dim, height: dim, opacity: minusDisabled ? 0.35 : 1 },
        ]}
      >
        <StepIcon name="minus" color={colors.text} size={iconSize} />
      </Pressable>
      <Text
        weight="semibold"
        style={{
          minWidth: minW,
          textAlign: "center",
          color: colors.text,
          fontSize: size === "lg" ? 16 : 14,
        }}
      >
        {quantity}
      </Text>
      <Pressable
        onPress={() => {
          if (plusDisabled) return;
          Haptics.selectionAsync();
          onPlus();
        }}
        hitSlop={10}
        disabled={plusDisabled}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        style={[
          styles.btn,
          { width: dim, height: dim, opacity: plusDisabled ? 0.35 : 1 },
        ]}
      >
        <StepIcon name="plus" color={colors.text} size={iconSize} />
      </Pressable>
    </>
  );

  if (useGlass) {
    return (
      <GlassSurface
        isInteractive
        style={[
          styles.wrap,
          {
            height: dim,
            borderRadius: dim / 2,
            // no border - glass edge only
          },
        ]}
      >
        {body}
      </GlassSurface>
    );
  }

  // Flat, regular border - no glass chrome
  return (
    <View
      style={[
        styles.wrap,
        {
          height: dim,
          borderRadius: dim / 2,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
      ]}
    >
      {body}
    </View>
  );
};

/** Plus-only control (empty qty state on product details). */
export const GlassPlusButton: FC<{
  onPress: () => void;
  disabled?: boolean;
  size?: "sm" | "lg";
  liquidGlass?: boolean;
}> = ({ onPress, disabled, size = "sm", liquidGlass }) => {
  const colors = useThemeColors();
  const useGlass = liquidGlass ?? false;
  const dim = size === "lg" ? 44 : 34;
  const iconSize = size === "lg" ? 16 : 14;

  const inner = (
    <Pressable
      onPress={() => {
        if (disabled) return;
        Haptics.selectionAsync();
        onPress();
      }}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Add to basket"
      style={[
        styles.btn,
        {
          width: dim,
          height: dim,
          opacity: disabled ? 0.35 : 1,
        },
      ]}
    >
      <StepIcon name="plus" color={colors.text} size={iconSize} />
    </Pressable>
  );

  if (useGlass) {
    return (
      <GlassSurface
        isInteractive={!disabled}
        style={{
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {inner}
      </GlassSurface>
    );
  }

  return inner;
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
  },
});
