// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/actions/RoundButton.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A round icon button on Liquid Glass (a filled grey circle where glass is
// not available): the small controls beside a focus element (15 seconds
// less, previous, next, close). Give it a lucide icon as its child. For a
// header use HeaderIconButton; for a labelled action use GlassButton.
import { GlassSurface } from "@/components/GlassSurface";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import type { ReactNode } from "react";
import { Pressable } from "react-native";

export interface RoundButtonProps {
  /** What it does, for VoiceOver: there is no visible label. */
  accessibilityLabel: string;
  onPress: () => void;
  children: ReactNode;
  size?: number;
  disabled?: boolean;
}

export function RoundButton({ accessibilityLabel, onPress, children, size = 44, disabled = false }: RoundButtonProps) {
  const colors = useThemeColors();
  return (
    <GlassSurface isInteractive fillColor={colors.surface} style={{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", opacity: disabled ? 0.45 : 1 }}>
      <Pressable
        disabled={disabled}
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          onPress();
        }}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={6}
        style={({ pressed }) => ({ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? colors.border : "transparent" })}
      >
        {children}
      </Pressable>
    </GlassSurface>
  );
}
