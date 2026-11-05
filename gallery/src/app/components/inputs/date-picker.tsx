import { Text, View } from "@/components/ui";
import { DateRow } from "@/components/ui/inputs/DateRow";
import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  DatePickerDialog,
  DateRangePicker,
  DateRangePickerDialog,
  DateTimePicker,
  FilledTonalButton,
  FlowRow,
  Text as MText,
  TimePickerDialog,
} from "@expo/ui/jetpack-compose";
import { DatePicker } from "@expo/ui/swift-ui";
import { datePickerStyle } from "@expo/ui/swift-ui/modifiers";
import { CalendarClock, Clock } from "lucide-react-native";
import { useState } from "react";

function at(h: number, m = 0) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}
const fmt = (d: Date | null) => (d ? d.toLocaleDateString("en-IE", { day: "numeric", month: "short" }) : "not set");

export default function DatePickerPage() {
  const [opens, setOpens] = useState(() => at(11));
  const [pause, setPause] = useState(() => at(17, 30));
  return (
    <DemoPage usage='import { DateRow } from "@/components/ui/inputs/DateRow". iOS: SwiftUI DatePicker (compact). Android: read-only value; native pickers are the Compose DateTimePicker and dialogs.'>
      <Demo title="DateRow">
        <View style={{ marginHorizontal: -20 }}>
          <SettingsGroup>
            <DateRow label="Opens" Icon={Clock} mode="time" value={opens} onChange={setOpens} />
            <DateRow label="Pause until" Icon={CalendarClock} mode="datetime" value={pause} onChange={setPause} minimumDate={new Date()} />
          </SettingsGroup>
        </View>
      </Demo>
      {isIOS ? <SwiftDates /> : <ComposeDates />}
    </DemoPage>
  );
}

function SwiftDates() {
  const [day, setDay] = useState(() => new Date());
  const [time, setTime] = useState(() => at(18, 30));
  return (
    <>
      <Demo title="Graphical: pick a delivery day">
        <SwiftHost matchContents={{ vertical: true }}>
          <DatePicker
            selection={day}
            onDateChange={setDay}
            displayedComponents={["date"]}
            range={{ start: new Date() }}
            modifiers={[datePickerStyle("graphical")]}
          />
        </SwiftHost>
      </Demo>
      <Demo title="Wheel: pickup time">
        <SwiftHost matchContents={{ vertical: true }}>
          <DatePicker selection={time} onDateChange={setTime} displayedComponents={["hourAndMinute"]} modifiers={[datePickerStyle("wheel")]} />
        </SwiftHost>
      </Demo>
      <Demo title="Compact with title">
        <SwiftHost matchContents={{ vertical: true }}>
          <DatePicker title="Scheduled for" selection={time} onDateChange={setTime} modifiers={[datePickerStyle("compact")]} />
        </SwiftHost>
      </Demo>
      <Note>Android: Compose DateTimePicker, DateRangePicker and the date, range and time dialogs.</Note>
    </>
  );
}

function ComposeDates() {
  const colors = useThemeColors();
  const [day, setDay] = useState<Date | null>(new Date());
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [dialog, setDialog] = useState<"date" | "range" | "time" | null>(null);
  const [picked, setPicked] = useState("Nothing picked yet");
  const close = () => setDialog(null);
  return (
    <>
      <Demo title={`DateTimePicker: delivery day ${fmt(day)}`}>
        <ComposeHost matchContents={{ vertical: true }}>
          <DateTimePicker initialDate={new Date().toISOString()} onDateSelected={setDay} variant="picker" showVariantToggle={false} />
        </ComposeHost>
      </Demo>
      <Demo title={`DateRangePicker: holiday closure ${fmt(range.start)} to ${fmt(range.end)}`}>
        <ComposeHost style={{ height: 460 }}>
          <DateRangePicker onDateRangeSelected={setRange} variant="picker" showVariantToggle={false} />
        </ComposeHost>
      </Demo>
      <Demo title="Dialogs">
        <ComposeHost matchContents={{ vertical: true }}>
          <FlowRow horizontalArrangement={{ spacedBy: 8 }}>
            <FilledTonalButton onClick={() => setDialog("date")}>
              <MText>Pick a day</MText>
            </FilledTonalButton>
            <FilledTonalButton onClick={() => setDialog("range")}>
              <MText>Pick dates</MText>
            </FilledTonalButton>
            <FilledTonalButton onClick={() => setDialog("time")}>
              <MText>Pick a time</MText>
            </FilledTonalButton>
          </FlowRow>
        </ComposeHost>
        <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>{picked}</Text>
      </Demo>
      {dialog === "date" ? (
        <ComposeHost style={{ position: "absolute", width: 1, height: 1 }}>
          <DatePickerDialog
            confirmButtonLabel="Set day"
            dismissButtonLabel="Cancel"
            onDateSelected={(d) => {
              setPicked(`Day: ${fmt(d)}`);
              close();
            }}
            onDismissRequest={close}
          />
        </ComposeHost>
      ) : null}
      {dialog === "range" ? (
        <ComposeHost style={{ position: "absolute", width: 1, height: 1 }}>
          <DateRangePickerDialog
            confirmButtonLabel="Set dates"
            dismissButtonLabel="Cancel"
            onDateRangeSelected={(r) => {
              setPicked(`Closed ${fmt(r.start)} to ${fmt(r.end)}`);
              close();
            }}
            onDismissRequest={close}
          />
        </ComposeHost>
      ) : null}
      {dialog === "time" ? (
        <ComposeHost style={{ position: "absolute", width: 1, height: 1 }}>
          <TimePickerDialog
            is24Hour
            confirmButtonLabel="Set time"
            dismissButtonLabel="Cancel"
            onDateSelected={(d) => {
              setPicked(`Pickup at ${d.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" })}`);
              close();
            }}
            onDismissRequest={close}
          />
        </ComposeHost>
      ) : null}
      <Note>iOS: SwiftUI DatePicker in compact, graphical and wheel styles.</Note>
    </>
  );
}
