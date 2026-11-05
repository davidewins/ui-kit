import { Button, Card, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ColorRow } from "@/components/ui/inputs/ColorRow";
import { DateRow } from "@/components/ui/inputs/DateRow";
import { PickerRow } from "@/components/ui/inputs/PickerRow";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SegmentedControl } from "@/components/ui/inputs/SegmentedControl";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { Sheet } from "@/components/ui/overlays/Sheet";
import { SliderRow } from "@/components/ui/inputs/SliderRow";
import { StepperRow } from "@/components/ui/inputs/StepperRow";
import { Switch } from "@/components/ui/inputs/Switch";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Stack } from "expo-router";
import { CalendarClock, Clock, Gauge, Layers, Palette, Store, Timer } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

const RANGES = ["Today", "Week", "Month"] as const;
const ORDERS_BY_RANGE = [38, 241, 1012];
const PREP_TIMES = [10, 15, 20, 30].map((m) => ({ label: `${m} min`, value: m }));

function at(hours: number, minutes = 0) {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// A real screen (a store's order settings) built only from ZESTY UI native
// controls, the way an app would use them. Each control is a kit component:
//   header "..."        ActionMenu        (SwiftUI Menu)
//   Today / Week / Month SegmentedControl (SwiftUI Picker, segmented)
//   capacity bar        ProgressBar       (SwiftUI ProgressView)
//   Accept orders       SettingsRow + Switch (SwiftUI Toggle)
//   Prep time           PickerRow         (SwiftUI Picker, menu)
//   Orders per slot     StepperRow        (SwiftUI Stepper)
//   Busy-mode capacity  SliderRow         (SwiftUI Slider)
//   Opens / Pause until DateRow           (SwiftUI DatePicker, compact)
//   Accent              ColorRow          (SwiftUI ColorPicker)
//   Close for the day   Sheet             (SwiftUI sheet hosting RN content)
// Android / web get the RN fallback of each.
export default function NativeControls() {
  const colors = useThemeColors();
  const [range, setRange] = useState(0);
  const [accepting, setAccepting] = useState(true);
  const [prep, setPrep] = useState(15);
  const [perSlot, setPerSlot] = useState(6);
  const [capacity, setCapacity] = useState(0.7);
  const [opens, setOpens] = useState(() => at(11));
  const [pauseUntil, setPauseUntil] = useState(() => at(17, 30));
  const [accent, setAccent] = useState("#dc2626");
  const [closing, setClosing] = useState(false);

  const load = 0.62;
  const nearlyFull = load >= capacity - 0.05;

  return (
    <>
      <ActionMenu
        accessibilityLabel="Store actions"
        actions={[
          { label: "Pause for 30 min", systemImage: "pause.circle", onPress: () => Toast.info("Paused for 30 min") },
          { label: "Share store link", systemImage: "square.and.arrow.up", onPress: () => Toast.success("Link copied") },
          { label: "Close for the day", systemImage: "xmark.circle", destructive: true, onPress: () => setClosing(true) },
        ]}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingTop: 8, paddingBottom: 64 }}>
        <SegmentedControl
          values={RANGES}
          selectedIndex={range}
          onChange={setRange}
          accessibilityLabel="Range"
          style={{ marginHorizontal: 16, marginBottom: 16 }}
        />

        <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
          <Card>
            <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
              <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>Orders</Text>
              <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>{RANGES[range]}</Text>
            </View>
            <Text weight="semibold" style={{ fontSize: 34, letterSpacing: -0.8, marginTop: 2, fontVariant: ["tabular-nums"] }}>
              {ORDERS_BY_RANGE[range]}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 14, marginBottom: 8 }}>
              <Text weight="medium" style={{ fontSize: 13 }}>Kitchen load</Text>
              <Text weight="medium" style={{ fontSize: 13, color: nearlyFull ? colors.warning : colors.muted, fontVariant: ["tabular-nums"] }}>
                {Math.round(load * 100)}% of {Math.round(capacity * 100)}%
              </Text>
            </View>
            <ProgressBar value={load / capacity} color={nearlyFull ? colors.warning : undefined} accessibilityLabel="Kitchen load" />
          </Card>
        </View>

        <SectionTitle inset={32}>Orders</SectionTitle>
        <SettingsGroup>
          <SettingsRow
            label="Accept orders"
            Icon={Store}
            accessory={<Switch value={accepting} onValueChange={setAccepting} />}
          />
          <PickerRow label="Prep time" Icon={Timer} options={PREP_TIMES} value={prep} onChange={setPrep} disabled={!accepting} />
          <StepperRow label="Orders per slot" Icon={Layers} value={perSlot} onChange={setPerSlot} min={1} max={20} disabled={!accepting} />
          <SliderRow
            label="Busy-mode capacity"
            Icon={Gauge}
            value={capacity}
            onChange={setCapacity}
            min={0.3}
            max={1}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
          />
        </SettingsGroup>

        <SectionTitle inset={32}>Hours</SectionTitle>
        <SettingsGroup>
          <DateRow label="Opens" Icon={Clock} mode="time" value={opens} onChange={setOpens} />
          <DateRow label="Pause until" Icon={CalendarClock} mode="datetime" value={pauseUntil} onChange={setPauseUntil} minimumDate={new Date()} />
        </SettingsGroup>

        <SectionTitle inset={32}>Storefront</SectionTitle>
        <SettingsGroup>
          <ColorRow label="Accent" Icon={Palette} value={accent} onChange={setAccent} />
        </SettingsGroup>

      </ScrollView>

      <Sheet visible={closing} onClose={() => setClosing(false)}>
        <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4 }}>Close for the day?</Text>
        <Text weight="medium" style={{ fontSize: 15, color: colors.muted, marginTop: 6, marginBottom: 20 }}>
          New orders stop straight away. Orders already in the kitchen still go out.
        </Text>
        <View style={{ gap: 10 }}>
          <Button
            variant="danger"
            fullWidth
            onPress={() => {
              setClosing(false);
              setAccepting(false);
              Toast.success("Closed until tomorrow");
            }}
          >
            Close store
          </Button>
          <Button variant="secondary" fullWidth onPress={() => setClosing(false)}>
            Keep open
          </Button>
        </View>
      </Sheet>
    </>
  );
}
