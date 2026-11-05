import { Text, View } from "@/components/ui";
import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SliderRow } from "@/components/ui/inputs/SliderRow";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Row, Slider as MSlider, Text as MText, VerticalSlider } from "@expo/ui/jetpack-compose";
import { fillMaxWidth, height } from "@expo/ui/jetpack-compose/modifiers";
import { Image, Slider, Text as SText } from "@expo/ui/swift-ui";
import { Gauge } from "lucide-react-native";
import { useState } from "react";

export default function SliderPage() {
  const colors = useThemeColors();
  const [capacity, setCapacity] = useState(0.7);
  const [radius, setRadius] = useState(5);
  return (
    <DemoPage usage='import { SliderRow } from "@/components/ui/inputs/SliderRow". iOS: SwiftUI Slider. Android: SliderRow steps with minus and plus; the Compose Slider is shown below.'>
      <Demo title="SliderRow">
        <View style={{ marginHorizontal: -20 }}>
          <SettingsGroup>
            <SliderRow label="Busy-mode capacity" Icon={Gauge} value={capacity} onChange={setCapacity} min={0.3} max={1} step={0.05} format={(v) => `${Math.round(v * 100)}%`} />
          </SettingsGroup>
        </View>
      </Demo>
      <Demo title={`Delivery radius: ${radius} km`}>
        {isIOS ? (
          <SwiftHost matchContents={{ vertical: true }}>
            <Slider
              value={radius}
              min={1}
              max={10}
              step={1}
              onValueChange={(v) => setRadius(Math.round(v))}
              minimumValueLabel={<SText>1 km</SText>}
              maximumValueLabel={<SText>10 km</SText>}
            />
          </SwiftHost>
        ) : (
          <ComposeHost matchContents={{ vertical: true }}>
            <MSlider value={radius} min={1} max={10} steps={8} onValueChange={(v) => setRadius(Math.round(v))} modifiers={[fillMaxWidth()]} />
          </ComposeHost>
        )}
        <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>Stepped: one stop per kilometre.</Text>
      </Demo>
      {isIOS ? (
        <Demo title="With symbols">
          <SwiftHost matchContents={{ vertical: true }}>
            <Slider
              value={capacity}
              min={0}
              max={1}
              onValueChange={setCapacity}
              minimumValueLabel={<Image systemName="tortoise" />}
              maximumValueLabel={<Image systemName="hare" />}
            />
          </SwiftHost>
        </Demo>
      ) : (
        <VerticalDemo />
      )}
      <Note>{isIOS ? "Android: Compose Slider and VerticalSlider." : "iOS: SwiftUI Slider with value labels."}</Note>
    </DemoPage>
  );
}

function VerticalDemo() {
  const [volume, setVolume] = useState(0.6);
  return (
    <Demo title={`VerticalSlider: order alert volume ${Math.round(volume * 100)}%`}>
      <ComposeHost matchContents>
        <Row>
          <VerticalSlider value={volume} onValueChange={setVolume} modifiers={[height(160)]} />
          <MText>{`${Math.round(volume * 100)}%`}</MText>
        </Row>
      </ComposeHost>
    </Demo>
  );
}
