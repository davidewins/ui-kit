import { View } from "@/components/ui";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  BottomSheet,
  Button,
  ColorPicker,
  ContentUnavailableView,
  DatePicker,
  DisclosureGroup,
  Gauge,
  Host,
  Menu,
  Picker,
  ProgressView,
  Slider,
  Stepper,
  Text,
  Toggle,
  VStack,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  datePickerStyle,
  frame,
  padding,
  pickerStyle,
  tag,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Platform, ScrollView, useColorScheme } from "react-native";

const SIZES = ["Small", "Medium", "Large"];

// Native SwiftUI controls through @expo/ui (iOS). Each block sits in a
// content-sized Host, which is how the apps embed them (SELLERS Switch, VOID
// FulfillmentToggle). Tint is the app tint: black / white.
export default function SwiftUIScreen() {
  const dark = useColorScheme() === "dark";
  const appTint = dark ? "#ffffff" : "#000000";
  const [segment, setSegment] = useState(0);
  const [menuPick, setMenuPick] = useState(1);
  const [wheel, setWheel] = useState(2);
  const [slider, setSlider] = useState(0.4);
  const [qty, setQty] = useState(2);
  const [on, setOn] = useState(true);
  const [date, setDate] = useState(new Date());
  const [color, setColor] = useState<string | null>("#dc2626");
  const [expanded, setExpanded] = useState(false);
  const [sheet, setSheet] = useState(false);

  if (Platform.OS !== "ios") return null;
  const pad = { paddingHorizontal: 16 };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 64 }}>
      <SectionTitle>Button styles (Liquid Glass first)</SectionTitle>
      <View style={pad}>
        <Host matchContents={{ vertical: true }}>
          <VStack spacing={10} alignment="leading">
            <Button label="Glass prominent" modifiers={[buttonStyle("glassProminent"), controlSize("large"), tint(appTint)]} onPress={() => {}} />
            <Button label="Glass" modifiers={[buttonStyle("glass"), controlSize("large")]} onPress={() => {}} />
            <Button label="Bordered prominent" modifiers={[buttonStyle("borderedProminent"), controlSize("large"), tint(appTint)]} onPress={() => {}} />
            <Button label="Bordered" modifiers={[buttonStyle("bordered"), controlSize("large"), tint(appTint)]} onPress={() => {}} />
            <Button label="Delete" role="destructive" systemImage="trash" modifiers={[buttonStyle("glass"), controlSize("large")]} onPress={() => {}} />
          </VStack>
        </Host>
      </View>

      <SectionTitle>Picker: segmented</SectionTitle>
      <View style={pad}>
        <Host matchContents={{ vertical: true }}>
          <Picker selection={segment} onSelectionChange={(v: number) => { Haptics.selectionAsync(); setSegment(v); }} label="" modifiers={[pickerStyle("segmented"), controlSize("large")]}>
            {["Today", "Week", "Month"].map((l, i) => <Text key={l} modifiers={[tag(i)]}>{l}</Text>)}
          </Picker>
        </Host>
      </View>

      <SectionTitle>Picker: menu</SectionTitle>
      <View style={pad}>
        <Host matchContents>
          <Picker selection={menuPick} onSelectionChange={(v: number) => setMenuPick(v)} label="Size" modifiers={[pickerStyle("menu"), tint(appTint)]}>
            {SIZES.map((l, i) => <Text key={l} modifiers={[tag(i)]}>{l}</Text>)}
          </Picker>
        </Host>
      </View>

      <SectionTitle>Picker: wheel</SectionTitle>
      <View style={pad}>
        <Host matchContents={{ vertical: true }}>
          <Picker selection={wheel} onSelectionChange={(v: number) => setWheel(v)} label="" modifiers={[pickerStyle("wheel")]}>
            {["5 min", "10 min", "15 min", "20 min", "30 min"].map((l, i) => <Text key={l} modifiers={[tag(i)]}>{l}</Text>)}
          </Picker>
        </Host>
      </View>

      <SectionTitle>Slider, Stepper, Toggle</SectionTitle>
      <View style={pad}>
        <Host matchContents={{ vertical: true }}>
          <VStack spacing={14}>
            <Slider value={slider} onValueChange={setSlider} modifiers={[tint(appTint)]} />
            <Stepper label={`Quantity: ${qty}`} value={qty} min={1} max={9} onValueChange={setQty} />
            <Toggle label="Accept orders" isOn={on} onIsOnChange={setOn} modifiers={[tint(appTint)]} />
          </VStack>
        </Host>
      </View>

      <SectionTitle>DatePicker</SectionTitle>
      <View style={pad}>
        <Host matchContents={{ vertical: true }}>
          <VStack spacing={10}>
            <DatePicker title="Pickup" selection={date} onDateChange={setDate} displayedComponents={["date", "hourAndMinute"]} modifiers={[datePickerStyle("compact"), tint(appTint)]} />
            <DatePicker selection={date} onDateChange={setDate} displayedComponents={["date"]} modifiers={[datePickerStyle("graphical"), tint(appTint)]} />
          </VStack>
        </Host>
      </View>

      <SectionTitle>ColorPicker</SectionTitle>
      <View style={pad}>
        <Host matchContents={{ vertical: true }}>
          <ColorPicker label="Page accent" selection={color} onSelectionChange={setColor} />
        </Host>
      </View>

      <SectionTitle>Gauge and ProgressView</SectionTitle>
      <View style={pad}>
        <Host matchContents={{ vertical: true }}>
          <VStack spacing={14} alignment="leading">
            <Gauge value={slider} modifiers={[tint(appTint)]} currentValueLabel={<Text>{`${Math.round(slider * 100)}%`}</Text>}>
              <Text>Prep capacity</Text>
            </Gauge>
            <ProgressView value={slider} modifiers={[tint(appTint)]} />
            <ProgressView />
          </VStack>
        </Host>
      </View>

      <SectionTitle>Menu</SectionTitle>
      <View style={pad}>
        <Host matchContents>
          <Menu label="Order actions" systemImage="ellipsis.circle">
            <Button label="Mark ready" systemImage="checkmark" onPress={() => {}} />
            <Button label="Message customer" systemImage="message" onPress={() => {}} />
            <Button label="Cancel order" systemImage="xmark" role="destructive" onPress={() => {}} />
          </Menu>
        </Host>
      </View>

      <SectionTitle>DisclosureGroup</SectionTitle>
      <View style={pad}>
        <Host matchContents={{ vertical: true }}>
          <DisclosureGroup label="Opening hours" isExpanded={expanded} onIsExpandedChange={setExpanded}>
            <Text>Mon to Fri, 11:00 to 22:00</Text>
            <Text>Sat and Sun, 12:00 to 23:00</Text>
          </DisclosureGroup>
        </Host>
      </View>

      <SectionTitle>BottomSheet</SectionTitle>
      <View style={pad}>
        <Host matchContents>
          <VStack>
            <Button label="Open sheet" modifiers={[buttonStyle("glass"), controlSize("large")]} onPress={() => setSheet(true)} />
            <BottomSheet isPresented={sheet} onIsPresentedChange={setSheet} fitToContents>
              <VStack spacing={12} modifiers={[padding({ all: 24 }), frame({ maxWidth: 10000 })]}>
                <Text>A native SwiftUI sheet</Text>
                <Button label="Done" modifiers={[buttonStyle("glassProminent"), controlSize("large"), tint(appTint)]} onPress={() => setSheet(false)} />
              </VStack>
            </BottomSheet>
          </VStack>
        </Host>
      </View>

      <SectionTitle>ContentUnavailableView</SectionTitle>
      <Host matchContents={{ vertical: true }}>
        <ContentUnavailableView title="No orders yet" systemImage="tray" description="New orders show up here as they come in." />
      </Host>
    </ScrollView>
  );
}
