// WhatsNewScreen: What's New for every app, one screen (David, 18 Nov: "when
// i want one screen updated i want it synced"). Copied from VOID and RIDERS'
// (aux)/changelog: "This Update" over the latest entry, a SectionTitle per
// earlier version, the app version as a footnote. Each change is a row with a
// Thiings picture for its type (new, improved, fixed, security) instead of a
// lucide icon; the row is the apps' FeatureRow geometry, and the text wraps
// (never cut off).
//
// The screen sets no header options. The app's route:
//   <Stack.Screen options={{ title: "What's New" }} />
// and passes its own CHANGELOG and marks it seen:
//   <WhatsNewScreen entries={CHANGELOG} onSeen={markSeen} />
import { ScrollView, Text, View } from "@/components/ui";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SETTINGS_ROW } from "@/components/ui/lists/SettingsRow";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { TYPE } from "@/components/ui/primitives/type";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Application from "expo-application";
import { Image } from "expo-image";
import { useEffect } from "react";

export type WhatsNewChangeType = "new" | "improved" | "fixed" | "security";

export interface WhatsNewEntry {
  version: string;
  date: string;
  changes: { type: WhatsNewChangeType; description: string }[];
}

export interface WhatsNewScreenProps {
  /** Newest first; the first entry is "This Update". */
  entries: readonly WhatsNewEntry[];
  /** Called once on mount (the app's changelog store markSeen). */
  onSeen?: () => void;
}

const ORDER: WhatsNewChangeType[] = ["new", "improved", "fixed", "security"];

// Thiings (r2 tkvr-media/thiings/256): party-popper, magic-wand, wrench,
// closed-padlock.
const ART = {
  new: require("@/assets/images/kit/changelog-new.png"),
  improved: require("@/assets/images/kit/changelog-improved.png"),
  fixed: require("@/assets/images/kit/changelog-fixed.png"),
  security: require("@/assets/images/kit/changelog-security.png"),
} as const;

const ART_SIZE = 32;

function ChangeRow({ type, description }: { type: WhatsNewChangeType; description: string }) {
  return (
    <View
      className="flex-row items-center"
      style={{
        minHeight: SETTINGS_ROW.height,
        paddingVertical: 10,
        paddingHorizontal: SETTINGS_ROW.paddingHorizontal,
        columnGap: SETTINGS_ROW.gap,
      }}
    >
      <Image source={ART[type]} style={{ width: ART_SIZE, height: ART_SIZE }} contentFit="contain" accessibilityLabel={type} />
      <View className="flex-1">
        <Text weight="medium" style={TYPE.body}>
          {description}
        </Text>
      </View>
    </View>
  );
}

export function WhatsNewScreen({ entries, onSeen }: WhatsNewScreenProps) {
  const colors = useThemeColors();
  const appVersion = Application.nativeApplicationVersion ?? "1.0.0";
  const buildNumber = Application.nativeBuildVersion ?? "1";

  useEffect(() => {
    onSeen?.();
  }, [onSeen]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingTop: 8, paddingBottom: 40 }}
    >
      {entries.map((entry, idx) => {
        const changes = [...entry.changes].sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type));
        return (
          <View key={`${entry.version}-${entry.date}`}>
            {idx === 0 ? (
              <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <Text weight="medium" style={[TYPE.body, { color: colors.muted }]}>
                  {entry.date}
                </Text>
                <Text weight="semibold" style={TYPE.display}>
                  This Update
                </Text>
              </View>
            ) : (
              <SectionTitle>{`Version ${entry.version} · ${entry.date}`}</SectionTitle>
            )}
            <SettingsGroup separatorInset={SETTINGS_ROW.paddingHorizontal + ART_SIZE + SETTINGS_ROW.gap}>
              {changes.map((c, i) => (
                <ChangeRow key={`${c.description}-${i}`} type={c.type} description={c.description} />
              ))}
            </SettingsGroup>
          </View>
        );
      })}
      <Text weight="medium" style={[TYPE.sub, { paddingHorizontal: 16, marginTop: 8, marginBottom: 18, color: colors.muted }]}>
        {`You're on ${appVersion} (${buildNumber}).`}
      </Text>
    </ScrollView>
  );
}
