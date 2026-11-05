// Gallery-only: the frame every component page shares. A usage line naming
// the import, then one Demo block per variant. The header title comes from
// the catalog (src/gallery/catalog.ts) via the root layout.
import { Text, View } from "@/components/ui";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ReactNode } from "react";
import { Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const isIOS = Platform.OS === "ios";

export function DemoPage({
  usage,
  children,
  bottom,
}: {
  /** The import line: where this comes from in an app. */
  usage: string;
  children: ReactNode;
  /** A BottomSwitch pinned under the scroll view. */
  bottom?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: bottom ? 24 : insets.bottom + 32 }}
      >
        <Usage>{usage}</Usage>
        {children}
      </ScrollView>
      {bottom}
    </View>
  );
}

function Usage({ children }: { children: string }) {
  const colors = useThemeColors();
  return (
    <Text
      weight="medium"
      selectable
      style={{ fontSize: 13, lineHeight: 18, color: colors.muted, paddingHorizontal: 20, paddingTop: 8 }}
    >
      {children}
    </Text>
  );
}

/** One variant: a title and the live demo under it. */
export function Demo({ title, children, gap = 12 }: { title: string; children: ReactNode; gap?: number }) {
  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <View style={{ paddingHorizontal: 20, gap }}>{children}</View>
    </>
  );
}

/** One line on the other platform's equivalent. */
export function Note({ children }: { children: string }) {
  const colors = useThemeColors();
  return (
    <Text weight="medium" style={{ fontSize: 13, lineHeight: 18, color: colors.muted, paddingHorizontal: 20, paddingTop: 16 }}>
      {children}
    </Text>
  );
}

/** A fixed-size box for a native island that needs real height (stacks, tabs, lists). */
export function Frame({ height, children }: { height: number; children: ReactNode }) {
  const colors = useThemeColors();
  return (
    <View
      style={{
        height,
        borderRadius: 24,
        borderCurve: "continuous",
        overflow: "hidden",
        borderWidth: 0.75,
        borderColor: colors.border,
      }}
    >
      {children}
    </View>
  );
}
