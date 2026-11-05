import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { Toast } from "@/lib/toast";
import { FilledTonalIconButton, Icon, Row } from "@expo/ui/jetpack-compose";
import { Button, ControlGroup, Text } from "@expo/ui/swift-ui";
import { controlSize } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

export default function ControlGroupPage() {
  const [qty, setQty] = useState(2);
  const less = () => setQty((q) => Math.max(0, q - 1));
  const more = () => setQty((q) => Math.min(20, q + 1));
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI only: import { ControlGroup } from "@expo/ui/swift-ui". Related actions joined in one capsule.'
          : "ControlGroup is SwiftUI only. Android equivalent: tonal icon buttons in a Compose Row."
      }
    >
      {isIOS ? (
        <>
          <Demo title="Icons">
            <SwiftHost matchContents>
              <ControlGroup modifiers={[controlSize("large")]}>
                <Button systemImage="printer" label="Print" onPress={() => Toast.success("Ticket printed")} />
                <Button systemImage="square.and.arrow.up" label="Share" onPress={() => Toast.info("Sharing order #1042")} />
                <Button systemImage="message" label="Message" onPress={() => Toast.info("Chat with Aoife")} />
              </ControlGroup>
            </SwiftHost>
          </Demo>
          <Demo title={`Quantity: ${qty} Pork belly bao`}>
            <SwiftHost matchContents>
              <ControlGroup>
                <Button systemImage="minus" label="Remove one" onPress={less} />
                <Text>{String(qty)}</Text>
                <Button systemImage="plus" label="Add one" onPress={more} />
              </ControlGroup>
            </SwiftHost>
          </Demo>
          <Note>Android: tonal icon buttons in a Compose Row.</Note>
        </>
      ) : (
        <>
          <Demo title={`Quantity: ${qty} Pork belly bao`}>
            <ComposeHost matchContents>
              <Row horizontalArrangement={{ spacedBy: 8 }}>
                <FilledTonalIconButton onClick={less}>
                  <Icon source={MI.remove} contentDescription="Remove one" />
                </FilledTonalIconButton>
                <FilledTonalIconButton onClick={more}>
                  <Icon source={MI.add} contentDescription="Add one" />
                </FilledTonalIconButton>
              </Row>
            </ComposeHost>
          </Demo>
          <Note>iOS: SwiftUI ControlGroup joins related buttons in one capsule.</Note>
        </>
      )}
    </DemoPage>
  );
}
