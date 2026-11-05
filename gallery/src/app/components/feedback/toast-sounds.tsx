import { View } from "@/components/ui";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { createAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { CircleAlert, CircleCheck, Info } from "lucide-react-native";
import { ScrollView } from "react-native";

// Three synthesized sets (ui-kit gallery/src/assets/sounds/candidates). The kit
// ships "marimba" until David picks; the chosen set replaces toast-*.wav.
const SETS = {
  marimba: {
    success: require("@/assets/sounds/candidates/marimba-success.wav"),
    error: require("@/assets/sounds/candidates/marimba-error.wav"),
    info: require("@/assets/sounds/candidates/marimba-info.wav"),
  },
  glass: {
    success: require("@/assets/sounds/candidates/glass-success.wav"),
    error: require("@/assets/sounds/candidates/glass-error.wav"),
    info: require("@/assets/sounds/candidates/glass-info.wav"),
  },
  soft: {
    success: require("@/assets/sounds/candidates/soft-success.wav"),
    error: require("@/assets/sounds/candidates/soft-error.wav"),
    info: require("@/assets/sounds/candidates/soft-info.wav"),
  },
} as const;

const LABEL: Record<keyof typeof SETS, string> = {
  marimba: "A. Marimba (kit default)",
  glass: "B. Glass bell",
  soft: "C. Soft",
};

const HAPTIC = {
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  info: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
};

const players = new Map<number, ReturnType<typeof createAudioPlayer>>();
function play(source: number, kind: keyof typeof HAPTIC) {
  HAPTIC[kind]().catch(() => {});
  let p = players.get(source);
  if (!p) {
    p = createAudioPlayer(source);
    p.volume = 0.6;
    players.set(source, p);
  }
  p.seekTo(0);
  p.play();
}

export default function CompareSounds() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      {(Object.keys(SETS) as (keyof typeof SETS)[]).map((set) => (
        <View key={set}>
          <SectionTitle inset={32}>{LABEL[set]}</SectionTitle>
          <SettingsGroup>
            <SettingsRow label="Success" Icon={CircleCheck} onPress={() => play(SETS[set].success, "success")} />
            <SettingsRow label="Error" Icon={CircleAlert} onPress={() => play(SETS[set].error, "error")} />
            <SettingsRow label="Info" Icon={Info} onPress={() => play(SETS[set].info, "info")} />
          </SettingsGroup>
        </View>
      ))}
    </ScrollView>
  );
}
