import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { PickerRow } from "@/components/ui/PickerRow";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { PREP_TIMES } from "@/gallery/demoData";
import {
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  Icon,
  OutlinedTextField,
  Text as MText,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, menuAnchor } from "@expo/ui/jetpack-compose/modifiers";
import { Picker, Text, useNativeState } from "@expo/ui/swift-ui";
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";
import { Timer } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

const VEHICLES = ["Bicycle", "E-bike", "Scooter", "Car"] as const;

export default function PickerPage() {
  const [prep, setPrep] = useState(15);
  return (
    <DemoPage usage='import { PickerRow } from "@/components/ui/PickerRow". iOS: SwiftUI Picker (menu). Android: PickerRow opens an Alert list; the Compose dropdown is ExposedDropdownMenuBox.'>
      <Demo title="PickerRow">
        <View style={{ marginHorizontal: -20 }}>
          <SettingsGroup>
            <PickerRow label="Prep time" Icon={Timer} options={[10, 15, 20, 30].map((m) => ({ label: `${m} min`, value: m }))} value={prep} onChange={setPrep} />
          </SettingsGroup>
        </View>
      </Demo>
      {isIOS ? <SwiftPickers /> : <ExposedDropdown />}
    </DemoPage>
  );
}

function SwiftPickers() {
  const [vehicle, setVehicle] = useState(0);
  const [prep, setPrep] = useState(1);
  const options = (list: readonly string[]) => list.map((v, i) => <Text key={v} modifiers={[tag(i)]}>{v}</Text>);
  return (
    <>
      <Demo title="Menu style">
        <SwiftHost matchContents>
          <Picker label="Vehicle" selection={vehicle} onSelectionChange={(v: number) => setVehicle(v)} modifiers={[pickerStyle("menu")]}>
            {options(VEHICLES)}
          </Picker>
        </SwiftHost>
      </Demo>
      <Demo title="Wheel style">
        <SwiftHost matchContents={{ vertical: true }}>
          <Picker label="Prep time" selection={prep} onSelectionChange={(v: number) => setPrep(v)} modifiers={[pickerStyle("wheel")]}>
            {options(PREP_TIMES)}
          </Picker>
        </SwiftHost>
      </Demo>
      <Demo title="Inline style">
        <SwiftHost matchContents={{ vertical: true }}>
          <Picker label="Vehicle" selection={vehicle} onSelectionChange={(v: number) => setVehicle(v)} modifiers={[pickerStyle("inline")]}>
            {options(VEHICLES)}
          </Picker>
        </SwiftHost>
      </Demo>
      <Note>Android: Compose ExposedDropdownMenuBox, a read-only field that opens a menu.</Note>
    </>
  );
}

function ExposedDropdown() {
  const [open, setOpen] = useState(false);
  const value = useNativeState<string>(VEHICLES[0]);
  return (
    <>
      <Demo title="ExposedDropdownMenuBox">
        <ComposeHost matchContents={{ vertical: true }}>
          <ExposedDropdownMenuBox expanded={open} onExpandedChange={setOpen}>
            <OutlinedTextField value={value} readOnly singleLine modifiers={[menuAnchor("primaryNotEditable"), fillMaxWidth()]}>
              <OutlinedTextField.Label>
                <MText>Vehicle</MText>
              </OutlinedTextField.Label>
              <OutlinedTextField.TrailingIcon>
                <Icon source={MI.arrowDown} />
              </OutlinedTextField.TrailingIcon>
            </OutlinedTextField>
            <ExposedDropdownMenu expanded={open} onDismissRequest={() => setOpen(false)}>
              {VEHICLES.map((v) => (
                <DropdownMenuItem
                  key={v}
                  onClick={() => {
                    value.set(v);
                    setOpen(false);
                  }}
                >
                  <DropdownMenuItem.Text>
                    <MText>{v}</MText>
                  </DropdownMenuItem.Text>
                </DropdownMenuItem>
              ))}
            </ExposedDropdownMenu>
          </ExposedDropdownMenuBox>
        </ComposeHost>
      </Demo>
      <Note>iOS: SwiftUI Picker in menu, wheel and inline styles.</Note>
    </>
  );
}
