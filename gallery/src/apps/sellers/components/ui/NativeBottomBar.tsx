import { useThemeColors } from "@/hooks/useThemeColors";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useCallback } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  useColorScheme,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";

/**
 * NativeBottomBar - iOS-Calendar-style floating glass pill action bar.
 *
 * Two pills float above content, anchored to the safe-area bottom + 16px.
 * - Left pill: optional, single quick-jump action (label OR icon, exclusive).
 * - Right pill: required, 1-3 SF symbol icons, last one may carry a numeric badge.
 *
 * Use only on screens that DON'T render the bottom tab bar (drilldowns, full-screen
 * sheet routes). On tab screens this stacks on top of the tab bar - banned.
 *
 * @see DESIGN.md §5.2 (floating elements) / §5.4 (buttons)
 * @see feedback_native_bottom_buttons.md
 */

// Sum of pill height (44) + gutter below (16) + visual slack above the pill (28).
// Consumers should add this as `paddingBottom` to their ScrollView so the last
// row sits clear of the floating bar.
export const NATIVE_BOTTOM_BAR_HEIGHT = 88;

/** Drop-in spacer; alternative to passing the constant manually. */
export const NativeBottomBarSpacer = () => (
  <View style={{ height: NATIVE_BOTTOM_BAR_HEIGHT }} />
);

type SFSymbol = SymbolViewProps["name"];

// TS-narrow: left pill is label OR icon, never both.
type LeftLabel = {
  label: string;
  icon?: never;
  onPress: () => void;
  accessibilityLabel: string;
};
type LeftIcon = {
  icon: SFSymbol;
  label?: never;
  onPress: () => void;
  accessibilityLabel: string;
};
export type NativeBottomBarLeft = LeftLabel | LeftIcon;

export type NativeBottomBarRightItem = {
  icon: SFSymbol;
  onPress: () => void;
  accessibilityLabel: string;
  badge?: number;
  destructive?: boolean;
};

export type NativeBottomBarProps = {
  left?: NativeBottomBarLeft;
  /** 1-3 items. Anything beyond index 2 is ignored at runtime, with a dev warn. */
  right: [NativeBottomBarRightItem, ...NativeBottomBarRightItem[]];
};

const PILL_HEIGHT = 44;
const PILL_PADDING_X = 16;
const ICON_SIZE = 24;
const GUTTER = 16;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function formatBadge(n: number): string {
  if (n > 99) return "99+";
  return String(n);
}

function usePressScale() {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));
  const onPressIn = useCallback(() => {
    scale.set(withSpring(0.94, { damping: 16, stiffness: 240 }));
  }, [scale]);
  const onPressOut = useCallback(() => {
    scale.set(withSpring(1, { damping: 16, stiffness: 240 }));
  }, [scale]);
  return { animatedStyle, onPressIn, onPressOut };
}

/**
 * Glass surface used by both pills. Liquid-glass on iOS 26+, BlurView fallback
 * elsewhere (older iOS, Android). Tinted overlay (`bg-card/60`) keeps the pill
 * legible against busy content.
 */
function PillSurface({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const colorScheme = useColorScheme();
  const tint: "light" | "dark" =
    colorScheme === "dark" ? "dark" : "light";
  const liquidGlass = Platform.OS === "ios" && isLiquidGlassAvailable();

  const surfaceStyle: ViewStyle = {
    height: PILL_HEIGHT,
    borderRadius: 9999,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    ...style,
  };

  if (liquidGlass) {
    return (
      <GlassView glassEffectStyle="regular" style={surfaceStyle}>
        <View
          className="flex-row items-center border-[0.5px] border-border"
          style={{
            height: "100%",
            paddingHorizontal: PILL_PADDING_X,
            borderRadius: 9999,
          }}
        >
          {children}
        </View>
      </GlassView>
    );
  }

  return (
    <BlurView
      intensity={24}
      tint={tint}
      style={surfaceStyle}
    >
      <View
        className="bg-card/60 flex-row items-center border-[0.5px] border-border"
        style={{
          height: "100%",
          paddingHorizontal: PILL_PADDING_X,
          borderRadius: 9999,
        }}
      >
        {children}
      </View>
    </BlurView>
  );
}

/** Left pill - single quick-jump action (label or icon). */
function LeftPill({ left }: { left: NativeBottomBarLeft }) {
  const colors = useThemeColors();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  const handlePress = useCallback(() => {
    Haptics.selectionAsync();
    left.onPress();
  }, [left]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={left.accessibilityLabel}
      hitSlop={8}
      style={animatedStyle}
    >
      <PillSurface>
        {left.label !== undefined ? (
          <Text
            weight="semibold"
            className="text-base"
            style={{ color: colors.foreground }}
          >
            {left.label}
          </Text>
        ) : (
          <SymbolView
            name={left.icon}
            size={ICON_SIZE}
            weight="semibold"
            tintColor={colors.foreground}
            resizeMode="scaleAspectFit"
          />
        )}
      </PillSurface>
    </AnimatedPressable>
  );
}

/** Single icon button inside the right cluster - scales independently. */
function RightIconButton({ item }: { item: NativeBottomBarRightItem }) {
  const colors = useThemeColors();
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  const handlePress = useCallback(() => {
    if (item.destructive) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.selectionAsync();
    }
    item.onPress();
  }, [item]);

  const iconColor = item.destructive ? colors.error : colors.foreground;
  const showBadge =
    typeof item.badge === "number" && item.badge > 0;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      accessibilityLabel={item.accessibilityLabel}
      // Hit slop pads the 24pt icon out to ≥44pt tap target inside the pill.
      hitSlop={10}
      style={[
        {
          width: ICON_SIZE,
          height: ICON_SIZE,
          alignItems: "center",
          justifyContent: "center",
        },
        animatedStyle,
      ]}
    >
      <SymbolView
        name={item.icon}
        size={ICON_SIZE}
        weight="semibold"
        tintColor={iconColor}
        resizeMode="scaleAspectFit"
      />
      {/* Inside the icon's box: the pill clips anything hung outside it. */}
      {showBadge ? (
        <View
          className="bg-error rounded-full items-center justify-center"
          style={{
            position: "absolute",
            top: -1,
            right: -1,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
          }}
          // Badge text is merged into the parent button's accessibilityLabel,
          // so hide this from a11y to avoid double-announcement.
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Text
            weight="semibold"
            className="text-white text-xs"
            style={{ lineHeight: 14 }}
          >
            {formatBadge(item.badge as number)}
          </Text>
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

/** Right pill - 1-3 icons clustered horizontally with gap-3. */
function RightPill({ items }: { items: NativeBottomBarRightItem[] }) {
  return (
    <PillSurface>
      <View className="flex-row items-center gap-3" style={{ height: "100%" }}>
        {items.map((item, idx) => (
          <RightIconButton key={`${item.icon}-${idx}`} item={item} />
        ))}
      </View>
    </PillSurface>
  );
}

export function NativeBottomBar({ left, right }: NativeBottomBarProps) {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const maxPillWidth = Math.max(120, screenWidth * 0.5 - 24);

  if (__DEV__ && right.length > 3) {
    console.warn(
      "[NativeBottomBar] right cluster supports at most 3 items; extras will render but break the design contract. Move overflow to a header-right ellipsis menu."
    );
  }

  const visibleRight = right.slice(0, 3) as NativeBottomBarRightItem[];

  const bottom = insets.bottom + GUTTER;

  return (
    // Wrap in a non-blocking container that lets touches pass through gaps
    // between the two pills.
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: PILL_HEIGHT + bottom,
      }}
    >
      {left ? (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            left: GUTTER,
            bottom,
            maxWidth: maxPillWidth,
          }}
        >
          <LeftPill left={left} />
        </View>
      ) : null}

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          right: GUTTER,
          bottom,
          maxWidth: maxPillWidth,
        }}
      >
        <RightPill items={visibleRight} />
      </View>
    </View>
  );
}
