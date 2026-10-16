// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/HeaderIconButton.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Spec §3.1 header button, lifted unchanged from SELLERS
// src/app/(protected)/(tabs)/dashboard/index.tsx. Plain Pressable (iOS 26 draws
// the glass capsule), lucide 22 / 1.8 in tint, optional red count badge.
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import type { LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";

export function HeaderIconButton({
  icon: Icon,
  onPress,
  badge,
  accessibilityLabel,
}: {
  icon: LucideIcon;
  onPress: () => void;
  badge?: number;
  accessibilityLabel: string;
}) {
  const colors = useThemeColors();
  const showBadge = (badge ?? 0) > 0;
  const badgeText =
    badge && badge > 99 ? "99+" : badge && badge > 0 ? String(badge) : "";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      className="px-2"
      style={({ pressed }) => ({
        height: 32,
        justifyContent: "center",
        opacity: pressed ? 0.4 : 1,
      })}
    >
      <View>
        <Icon size={22} strokeWidth={1.8} color={colors.tint} />
        {showBadge ? (
          <View
            className="absolute items-center justify-center"
            style={{
              top: -6,
              right: -10,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              paddingHorizontal: badgeText.length > 2 ? 5 : 3,
              backgroundColor: colors.error,
              borderWidth: 1.5,
              // Carve the badge out of the header background. This is a page-bg
              // ring, NOT text on a subtle fill - valid contrast use.
              borderColor: colors.background,
            }}
          >
            <Text
              weight="bold"
              className="text-[10px]"
              style={{
                // White on the red fill in BOTH themes. `colors.primaryText`
                // flips to black in dark mode, which is text-on-primary, not
                // text-on-a-saturated-badge.
                color: "#fff",
                lineHeight: 13,
                fontVariant: ["tabular-nums"],
              }}
            >
              {badgeText}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
