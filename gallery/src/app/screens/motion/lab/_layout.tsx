import { PRESETS, cardStack, coverMorph, photoZoom, snapSheet } from "@/gallery/motion/lab";
import { BlankStack } from "react-native-screen-transitions/expo-router";

// The transition lab runs on react-native-screen-transitions' Blank Stack (a
// JS stack, so every frame of the motion is ours). Its pages draw their own
// header; the root native stack hides its header for this route.
export default function LabLayout() {
  return (
    <BlankStack>
      <BlankStack.Screen name="index" />
      <BlankStack.Screen name="photo/[id]" options={photoZoom} />
      <BlankStack.Screen name="playlist/[id]" options={coverMorph} />
      <BlankStack.Screen name="sheet" options={snapSheet} />
      <BlankStack.Screen name="stack" options={cardStack} />
      {Object.entries(PRESETS).map(([name, p]) => (
        <BlankStack.Screen key={name} name={`preset-${name}`} options={p.options} />
      ))}
    </BlankStack>
  );
}
