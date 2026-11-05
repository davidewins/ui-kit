import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { Switch } from "@/components/ui/inputs/Switch";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { Icon, Row, Switch as MSwitch, SyncSwitch, Text as MText } from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { SyncToggle, Toggle, useNativeState, VStack } from "@expo/ui/swift-ui";
import { toggleStyle } from "@expo/ui/swift-ui/modifiers";
import { BellRing, Store, Timer } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

export default function SwitchPage() {
  const [accepting, setAccepting] = useState(true);
  const [alerts, setAlerts] = useState(false);
  return (
    <DemoPage usage='import { Switch } from "@/components/ui/inputs/Switch". Same props as React Native Switch. iOS: SwiftUI Toggle. Android: React Native Switch.'>
      <Demo title="In settings rows">
        <View style={{ marginHorizontal: -20 }}>
          <SettingsGroup>
            <SettingsRow label="Accept orders" Icon={Store} accessory={<Switch value={accepting} onValueChange={setAccepting} />} />
            <SettingsRow label="New order sound" Icon={BellRing} accessory={<Switch value={alerts} onValueChange={setAlerts} />} />
            <SettingsRow label="Busy mode (store closed)" Icon={Timer} accessory={<Switch value={false} disabled />} />
          </SettingsGroup>
        </View>
      </Demo>
      {isIOS ? <IOSToggles /> : <ComposeSwitches />}
    </DemoPage>
  );
}

function IOSToggles() {
  const [vegan, setVegan] = useState(true);
  const [label, setLabel] = useState(false);
  const sync = useNativeState(true);
  return (
    <>
      <Demo title="SwiftUI Toggle with label">
        <SwiftHost matchContents={{ vertical: true }}>
          <VStack>
            <Toggle isOn={label} onIsOnChange={setLabel} label="Leave at door" systemImage="door.left.hand.open" />
          </VStack>
        </SwiftHost>
      </Demo>
      <Demo title="Button style">
        <SwiftHost matchContents>
          <Toggle isOn={vegan} onIsOnChange={setVegan} label="Vegan only" systemImage="leaf" modifiers={[toggleStyle("button")]} />
        </SwiftHost>
      </Demo>
      <Demo title="SyncToggle (state lives on the native side)">
        <SwiftHost matchContents={{ vertical: true }}>
          <SyncToggle isOn={sync} label="Show prices with VAT" />
        </SwiftHost>
      </Demo>
      <Note>Android: Compose Switch (with a thumb icon) and SyncSwitch.</Note>
    </>
  );
}

function ComposeSwitches() {
  const [on, setOn] = useState(true);
  const sync = useNativeState(true);
  return (
    <>
      <Demo title="Compose Switch with thumb icon">
        <ComposeHost matchContents={{ vertical: true }}>
          <Row modifiers={[fillMaxWidth()]} horizontalArrangement="spaceBetween" verticalAlignment="center">
            <MText>Leave at door</MText>
            <MSwitch value={on} onCheckedChange={setOn}>
              <MSwitch.ThumbContent>
                <Icon source={on ? MI.check : MI.close} size={16} />
              </MSwitch.ThumbContent>
            </MSwitch>
          </Row>
        </ComposeHost>
      </Demo>
      <Demo title="SyncSwitch (state lives on the native side)">
        <ComposeHost matchContents={{ vertical: true }}>
          <Row modifiers={[fillMaxWidth()]} horizontalArrangement="spaceBetween" verticalAlignment="center">
            <MText>Show prices with VAT</MText>
            <SyncSwitch isOn={sync} />
          </Row>
        </ComposeHost>
      </Demo>
      <Note>iOS: SwiftUI Toggle (switch and button styles) and SyncToggle.</Note>
    </>
  );
}
