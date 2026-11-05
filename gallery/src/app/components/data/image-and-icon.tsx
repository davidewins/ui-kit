import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Icon, Image as MImage, Row } from "@expo/ui/jetpack-compose";
import { clip, Shapes, size } from "@expo/ui/jetpack-compose/modifiers";
import { HStack, Image } from "@expo/ui/swift-ui";

const PHOTO = require("@/assets/images/glass-bg.jpeg");

// SF Symbols on iOS, Material Symbols (XML vectors) on Android. Screens use
// lucide icons through the kit; these are for native islands.
export default function ImageAndIconPage() {
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: import { Image } from "@expo/ui/swift-ui" with systemName (SF Symbols).'
          : 'Compose: import { Icon, Image } from "@expo/ui/jetpack-compose". Icon takes an Android vector XML (Material Symbols).'
      }
    >
      {isIOS ? <Swift /> : <Compose />}
    </DemoPage>
  );
}

function Swift() {
  const colors = useThemeColors();
  return (
    <>
      <Demo title="SF Symbols at 16, 24, 32">
        <SwiftHost matchContents>
          <HStack spacing={20}>
            {[16, 24, 32].map((s) => (
              <Image key={s} systemName="bag" size={s} color={colors.text} />
            ))}
          </HStack>
        </SwiftHost>
      </Demo>
      <Demo title="Status colour only where it means something">
        <SwiftHost matchContents>
          <HStack spacing={20}>
            <Image systemName="checkmark.circle.fill" size={28} color={colors.success} />
            <Image systemName="exclamationmark.triangle.fill" size={28} color={colors.warning} />
            <Image systemName="xmark.octagon.fill" size={28} color={colors.error} />
          </HStack>
        </SwiftHost>
      </Demo>
      <Demo title="Variable value: rider signal">
        <SwiftHost matchContents>
          <HStack spacing={20}>
            {[0.2, 0.6, 1].map((v) => (
              <Image key={v} systemName="cellularbars" variableValue={v} size={28} color={colors.text} />
            ))}
          </HStack>
        </SwiftHost>
      </Demo>
      <Demo title="Tappable">
        <SwiftHost matchContents>
          <Image systemName="phone.circle.fill" size={44} color={colors.text} onPress={() => Toast.info("Calling Ciarán")} />
        </SwiftHost>
      </Demo>
      <Note>Android: Compose Icon (Material Symbols XML) and Image.</Note>
    </>
  );
}

function Compose() {
  const colors = useThemeColors();
  return (
    <>
      <Demo title="Material Symbols at 16, 24, 32">
        <ComposeHost matchContents>
          <Row horizontalArrangement={{ spacedBy: 20 }} verticalAlignment="center">
            {[16, 24, 32].map((s) => (
              <Icon key={s} source={MI.home} size={s} tint={colors.text} />
            ))}
          </Row>
        </ComposeHost>
      </Demo>
      <Demo title="Status colour only where it means something">
        <ComposeHost matchContents>
          <Row horizontalArrangement={{ spacedBy: 20 }}>
            <Icon source={MI.check} size={28} tint={colors.success} />
            <Icon source={MI.close} size={28} tint={colors.error} />
          </Row>
        </ComposeHost>
      </Demo>
      <Demo title="Image, cropped and clipped">
        <ComposeHost matchContents>
          <MImage source={PHOTO} contentScale="crop" contentDescription="Bao House storefront" modifiers={[size(160, 100), clip(Shapes.RoundedCorner(16))]} />
        </ComposeHost>
      </Demo>
      <Note>iOS: SwiftUI Image with SF Symbols.</Note>
    </>
  );
}
