import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Column, Text as MText } from "@expo/ui/jetpack-compose";
import { Label, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, monospacedDigit } from "@expo/ui/swift-ui/modifiers";
import { useMemo } from "react";

// Native text inside native islands. Screens use the kit Text (Geist) for
// everything else; native text is set in Geist too.
export default function TextAndLabelPage() {
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: import { Text, Label } from "@expo/ui/swift-ui", with font({ family: "Geist-Medium" }). Screens use Text from "@/components/ui".'
          : 'Compose: import { Text } from "@expo/ui/jetpack-compose", with style={{ fontFamily: "Geist-Medium" }}. Screens use Text from "@/components/ui".'
      }
    >
      {isIOS ? <Swift /> : <Compose />}
    </DemoPage>
  );
}

function Swift() {
  const colors = useThemeColors();
  const eta = useMemo(() => new Date(Date.now() + 14 * 60 * 1000), []);
  return (
    <>
      <Demo title="Weights">
        <SwiftHost matchContents={{ vertical: true }}>
          <VStack alignment="leading" spacing={6}>
            <Text modifiers={[font({ family: "Geist-Bold", size: 28 })]}>€912.40</Text>
            <Text modifiers={[font({ family: "Geist-SemiBold", size: 17 })]}>Bao House</Text>
            <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted)]}>Asian street food, Swords</Text>
          </VStack>
        </SwiftHost>
      </Demo>
      <Demo title="Markdown">
        <SwiftHost matchContents={{ vertical: true }}>
          <Text markdownEnabled modifiers={[font({ family: "Geist-Regular", size: 15 })]}>
            {"Your order is **ready**. Show code *4821* at the counter."}
          </Text>
        </SwiftHost>
      </Demo>
      <Demo title="Live timer: rider arrives in">
        <SwiftHost matchContents={{ vertical: true }}>
          <Text date={eta} dateStyle="timer" modifiers={[font({ family: "Geist-SemiBold", size: 34 }), monospacedDigit()]} />
        </SwiftHost>
      </Demo>
      <Demo title="Label: symbol and title">
        <SwiftHost matchContents={{ vertical: true }}>
          <VStack alignment="leading" spacing={10} modifiers={[font({ family: "Geist-Medium", size: 15 })]}>
            <Label title="Collection at 18:30" systemImage="bag" />
            <Label title="Ciarán is 4 min away" systemImage="bicycle" />
            <Label title="Paid with Apple Pay" systemImage="creditcard" />
          </VStack>
        </SwiftHost>
      </Demo>
      <Note>Android: Compose Text, set in Geist.</Note>
    </>
  );
}

function Compose() {
  const colors = useThemeColors();
  return (
    <>
      <Demo title="Weights">
        <ComposeHost matchContents={{ vertical: true }}>
          <Column verticalArrangement={{ spacedBy: 6 }}>
            <MText style={{ fontFamily: "Geist-Bold", fontSize: 28 }}>€912.40</MText>
            <MText style={{ fontFamily: "Geist-SemiBold", fontSize: 17 }}>Bao House</MText>
            <MText color={colors.muted} style={{ fontFamily: "Geist-Medium", fontSize: 15 }}>Asian street food, Swords</MText>
          </Column>
        </ComposeHost>
      </Demo>
      <Demo title="Overflow: one line, ellipsis">
        <ComposeHost matchContents={{ vertical: true }}>
          <MText maxLines={1} overflow="ellipsis" style={{ fontFamily: "Geist-Medium", fontSize: 15 }}>
            Leave at the side door please, the bell is broken and the dog barks at riders but is friendly
          </MText>
        </ComposeHost>
      </Demo>
      <Note>iOS: SwiftUI Text (markdown, live timers) and Label.</Note>
    </>
  );
}
