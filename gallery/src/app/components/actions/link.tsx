import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { FilledTonalButton, Text as MText } from "@expo/ui/jetpack-compose";
import { Label, Link } from "@expo/ui/swift-ui";
import { buttonBorderShape, buttonStyle, controlSize } from "@expo/ui/swift-ui/modifiers";
import { Linking } from "react-native";

const TERMS = "https://void.ie/terms";

export default function LinkPage() {
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: import { Link } from "@expo/ui/swift-ui". Opens the URL in Safari.'
          : 'Android has no Link view: a Compose button calling Linking.openURL.'
      }
    >
      <Demo title="Open the terms of service">
        {isIOS ? (
          <SwiftHost matchContents>
            <Link destination={TERMS} modifiers={[buttonStyle("glass"), buttonBorderShape("capsule"), controlSize("small")]}>
              <Label title="Terms of service" systemImage="safari" />
            </Link>
          </SwiftHost>
        ) : (
          <ComposeHost matchContents>
            <FilledTonalButton onClick={() => Linking.openURL(TERMS)}>
              <MText>Terms of service</MText>
            </FilledTonalButton>
          </ComposeHost>
        )}
      </Demo>
      <Note>{isIOS ? "Android: a tonal button calling Linking.openURL." : "iOS: SwiftUI Link."}</Note>
    </DemoPage>
  );
}
