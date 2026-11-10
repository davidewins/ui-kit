import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { NATIVE_ANIMATIONS } from "@/gallery/motion/native";
import { router } from "expo-router";
import { Fragment } from "react";
import { ScrollView } from "react-native";

// Every animation the native stack has, each pushing the same playlist so
// only the motion changes. Screen options only; nothing runs in JS.
export default function PushStyles() {
  const open = (anim: string) => () => router.push({ pathname: "/screens/motion/push-target", params: { anim } });
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 32 }}>
      {NATIVE_ANIMATIONS.map((g) => (
        <Fragment key={g.title}>
          <SectionTitle>{g.title}</SectionTitle>
          <SettingsGroup>
            {g.items.map((a) => (
              <SettingsRow key={a.anim} label={a.label} Icon={a.Icon} trailing={a.note} navigates onPress={open(a.anim)} />
            ))}
          </SettingsGroup>
        </Fragment>
      ))}
    </ScrollView>
  );
}
