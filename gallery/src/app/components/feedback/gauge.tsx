import { View } from "@/components/ui";
import { Gauge } from "@/components/ui/Gauge";
import { SwiftHost } from "@/components/ui/NativeHost";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Gauge as SwiftGauge, HStack, Text } from "@expo/ui/swift-ui";
import { gaugeStyle, tint } from "@expo/ui/swift-ui/modifiers";

export default function GaugePage() {
  return (
    <DemoPage usage='import { Gauge } from "@/components/ui/Gauge". iOS: SwiftUI Gauge. Android: Compose progress indicators.'>
      <Demo title="Ring">
        <View style={{ flexDirection: "row", gap: 24 }}>
          <Gauge label="Kitchen load" value={0.62} valueLabel="62%" />
          <Gauge label="Shift target" value={9} max={12} valueLabel="9/12" />
          <Gauge label="Busy" value={0.91} valueLabel="91%" tone="warning" />
        </View>
      </Demo>
      <Demo title="Bar">
        <Gauge variant="bar" label="Fries in stock" value={14} max={40} valueLabel="14 left" />
        <Gauge variant="bar" label="Bao buns in stock" value={3} max={60} valueLabel="3 left" tone="error" />
      </Demo>
      {isIOS ? <SwiftStyles /> : <Note>iOS: SwiftUI Gauge in circular, linear and capacity styles.</Note>}
    </DemoPage>
  );
}

// The plain (non-capacity) SwiftUI gauge styles, for reference.
function SwiftStyles() {
  const colors = useThemeColors();
  return (
    <>
      <Demo title="SwiftUI circular and linear styles">
        <SwiftHost matchContents>
          <HStack spacing={24}>
            <SwiftGauge value={4.6} min={1} max={5} currentValueLabel={<Text>4.6</Text>} modifiers={[gaugeStyle("circular"), tint(colors.text)]}>
              <Text>Rating</Text>
            </SwiftGauge>
            <SwiftGauge value={0.4} modifiers={[gaugeStyle("linear"), tint(colors.text)]}>
              <Text>Prep</Text>
            </SwiftGauge>
          </HStack>
        </SwiftHost>
      </Demo>
      <Note>Android: Compose circular and linear progress indicators with the same labels.</Note>
    </>
  );
}
