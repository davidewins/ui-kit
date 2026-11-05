// Verbatim copy of TKVR src/components/ui/Badge.tsx before ui-kit (export renamed).
import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Text } from "@/components/ui/primitives/Text";
import { View } from "@/components/ui/primitives/View";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

// Badge labels are always white on a saturated fill, in both themes (the rule
// in VOID, RIDERS, SELLERS and ADMIN). The old tinted --color-*-bg tokens
// never existed in TKVR's globals.css, so this read undefined colours.
// Default is grey, like the web's badges (creator-platform TAK-1371).
export const TkvrBadge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const colors = useThemeColors();
  // NATIVE_UI §4 Q2 (David, 13 Oct): status colour only, white label on a
  // saturated fill. info is not a status in TKVR, so it draws as default.
  const fill =
    variant === "success" ? colors.success
    : variant === "error" ? colors.danger
    : variant === "warning" ? colors.warning
    : colors.muted;
  const label = "#FFFFFF";

  return (
    <View
      className={`px-2.5 py-0.5 self-start ${className}`}
      style={{ backgroundColor: fill, borderRadius: 9999 }}
      accessibilityRole="text"
    >
      <Text className="text-xs" weight="medium" style={{ color: label }}>
        {children}
      </Text>
    </View>
  );
};
