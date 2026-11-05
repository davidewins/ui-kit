import { View } from "@/components/ui";
import { SwiftHost } from "@/components/ui/NativeHost";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { StepperRow } from "@/components/ui/StepperRow";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { Stepper } from "@expo/ui/swift-ui";
import { Layers, ShoppingBasket } from "lucide-react-native";
import { useState } from "react";

export default function StepperPage() {
  const [perSlot, setPerSlot] = useState(6);
  const [qty, setQty] = useState(2);
  const [tip, setTip] = useState(1);
  return (
    <DemoPage usage='import { StepperRow } from "@/components/ui/StepperRow". iOS: SwiftUI Stepper. Android: React Native stepper (Compose has no stepper).'>
      <Demo title="StepperRow">
        <View style={{ marginHorizontal: -20 }}>
          <SettingsGroup>
            <StepperRow label="Orders per slot" Icon={Layers} value={perSlot} onChange={setPerSlot} min={1} max={20} />
            <StepperRow label="Pork belly bao" Icon={ShoppingBasket} value={qty} onChange={setQty} min={0} max={10} format={(v) => `${v}x`} />
          </SettingsGroup>
        </View>
      </Demo>
      {isIOS ? (
        <Demo title="SwiftUI Stepper with label and step">
          <SwiftHost matchContents={{ vertical: true }}>
            <Stepper label={`Rider tip: €${tip}`} value={tip} step={1} min={0} max={10} onValueChange={setTip} />
          </SwiftHost>
        </Demo>
      ) : null}
      <Note>{isIOS ? "Android: Compose has no stepper; StepperRow draws its own minus and plus buttons." : "iOS: SwiftUI Stepper."}</Note>
    </DemoPage>
  );
}
