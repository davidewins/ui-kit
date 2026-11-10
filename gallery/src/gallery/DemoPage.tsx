// Gallery-only: the frame every component page shares: one Demo block per
// variant. The usage line (the import) and the Notes (other-platform notes)
// live behind the header's info button in a kit Sheet, not as muted text all
// over the page (David, 9 Nov: "too many eyebrows ... put it behind an 'i'").
// The header title comes from the catalog (src/gallery/catalog.ts).
import { Text, View } from "@/components/ui";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { Sheet } from "@/components/ui/overlays/Sheet";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Stack } from "expo-router";
import { Info } from "lucide-react-native";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Notes register here so the page can show them in its info sheet. A page
// with inline={true} (its header button is taken) renders them in place.
const NotesContext = createContext<{ add: (text: string) => () => void } | null>(null);

export const isIOS = Platform.OS === "ios";

export function DemoPage({
  usage,
  children,
  bottom,
  inline = false,
  fill = false,
}: {
  /** The import line: where this comes from in an app. */
  usage: string;
  children: ReactNode;
  /** A BottomSwitch pinned under the scroll view. */
  bottom?: ReactNode;
  /** The page owns headerRight (a header menu demo): show usage and notes in the page. */
  inline?: boolean;
  /** One native island takes the whole screen under the header (navigation
   *  demos: David, 10 Nov, "show it fullscreen"). No scroll view, and the
   *  header is opaque so the island starts below it. */
  fill?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [notes, setNotes] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  // Stable, so a Note's effect runs once per text, not on every render.
  const registry = useMemo(
    () => ({
      add: (text: string) => {
        setNotes((n) => [...n, text]);
        return () => setNotes((n) => n.filter((x) => x !== text));
      },
    }),
    [],
  );

  return (
    <NotesContext.Provider value={inline ? null : registry}>
      {inline ? null : (
        <Stack.Screen
          options={{
            ...(fill ? { headerTransparent: false } : null),
            headerRight: () => (
              <HeaderIconButton icon={Info} accessibilityLabel="About this component" onPress={() => setOpen(true)} />
            ),
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        {fill ? (
          <View style={{ flex: 1 }}>{children}</View>
        ) : (
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingBottom: bottom ? 24 : insets.bottom + 32 }}
          >
            {inline ? <InfoText>{usage}</InfoText> : null}
            {children}
          </ScrollView>
        )}
        {bottom}
      </View>
      {inline ? null : (
        <Sheet visible={open} onClose={() => setOpen(false)}>
          <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4 }}>
            About this component
          </Text>
          <Text weight="medium" selectable style={{ fontSize: 15, lineHeight: 21, color: colors.text, marginTop: 12 }}>
            {usage}
          </Text>
          {notes.map((n) => (
            <Text key={n} weight="medium" style={{ fontSize: 15, lineHeight: 21, color: colors.muted, marginTop: 10 }}>
              {n}
            </Text>
          ))}
        </Sheet>
      )}
    </NotesContext.Provider>
  );
}

function InfoText({ children }: { children: string }) {
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

/** One line on the other platform's equivalent: shown in the page's info sheet. */
export function Note({ children }: { children: string }) {
  const notes = useContext(NotesContext);
  const colors = useThemeColors();
  useEffect(() => notes?.add(children), [notes, children]);
  if (notes) return null;
  return (
    <Text weight="medium" style={{ fontSize: 13, lineHeight: 18, color: colors.muted, paddingHorizontal: 20, paddingTop: 16 }}>
      {children}
    </Text>
  );
}

/** A fixed-size box for a native island that needs real height (stacks, tabs, lists).
 *  With `fill` (inside a DemoPage fill) it is the whole screen, edge to edge. */
export function Frame({ height, fill = false, children }: { height?: number; fill?: boolean; children: ReactNode }) {
  const colors = useThemeColors();
  if (fill) return <View style={{ flex: 1 }}>{children}</View>;
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
