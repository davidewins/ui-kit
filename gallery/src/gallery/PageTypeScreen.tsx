// Gallery-only: the body every Page types screen shares. The presentation
// itself is set on the root Stack (src/app/_layout.tsx); this only lays the
// copy out to suit it: opaque pages, sheets on a transparent root so the
// native sheet material shows through, and overlays over a scrim.
import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { Button, Text, View } from "@/components/ui";
import { PAGE_TYPES, type PageType } from "@/gallery/catalog";
import { PAGE_TYPE_COPY } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";

const SHEETS: PageType[] = ["formSheet", "fittedFormSheet"];
const OVERLAYS: PageType[] = ["transparentModal", "containedTransparentModal"];

export function PageTypeScreen({ type }: { type: PageType }) {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const done = () => router.back();

  if (type === "fittedFormSheet") {
    return (
      // The sheet's header sits over its content; start below it.
      <View style={{ paddingHorizontal: 20, paddingTop: headerHeight + 12, paddingBottom: insets.bottom + 12, gap: 20 }}>
        <Copy type={type} />
        <Button fullWidth onPress={done}>Done</Button>
      </View>
    );
  }

  if (SHEETS.includes(type)) {
    return (
      // Clears the sheet's header, like RIDERS' chat/report formSheet.
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 12, gap: 20 }}
      >
        <Copy type={type} />
        <Button fullWidth onPress={done}>Done</Button>
      </ScrollView>
    );
  }

  if (OVERLAYS.includes(type)) return <Overlay type={type} onDone={done} />;

  if (type === "card") {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 32 }}>
        <Copy type={type} />
      </ScrollView>
    );
  }

  return (
    <InsetShell primaryCta={{ label: "Done", onPress: done }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <Copy type={type} />
      </View>
    </InsetShell>
  );
}

function Overlay({ type, onDone }: { type: PageType; onDone: () => void }) {
  const colors = useThemeColors();
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onDone}
        style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.45)" }]}
      />
      <View style={{ backgroundColor: colors.background, borderRadius: 24, borderCurve: "continuous", padding: 20, gap: 20 }}>
        <Copy type={type} heading />
        <Button fullWidth onPress={onDone}>Done</Button>
      </View>
    </View>
  );
}

function Copy({ type, heading = false }: { type: PageType; heading?: boolean }) {
  const colors = useThemeColors();
  const copy = PAGE_TYPE_COPY[type];
  const facts: [string, string][] = [
    ["What it is", copy.what],
    ["When to use it", copy.when],
    ["How to dismiss it", copy.dismiss],
    ["On Android", copy.android ?? "Same as iOS."],
  ];
  return (
    <View style={{ gap: 16 }}>
      {heading ? (
        <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4 }}>{PAGE_TYPES[type].title}</Text>
      ) : null}
      {facts.map(([label, body]) => (
        <View key={label} style={{ gap: 4 }}>
          <Text weight="semibold" style={{ fontSize: 15 }}>{label}</Text>
          <Text weight="medium" style={{ fontSize: 15, lineHeight: 21, color: colors.muted }}>{body}</Text>
        </View>
      ))}
    </View>
  );
}
