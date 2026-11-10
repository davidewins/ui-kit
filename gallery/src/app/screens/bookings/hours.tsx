import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { DateRow } from "@/components/ui/inputs/DateRow";
import { PickerRow } from "@/components/ui/inputs/PickerRow";
import { StepperRow } from "@/components/ui/inputs/StepperRow";
import { Switch } from "@/components/ui/inputs/Switch";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { Toast } from "@/lib/toast";
import { CalendarRange, Clock, Coffee, Hourglass, Timer } from "lucide-react-native";
import { useState } from "react";

const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const NOTICE = [1, 2, 4, 12, 24].map((h) => ({ label: h === 1 ? "1 hour" : `${h} hours`, value: h }));

function at(h: number, m = 0) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

// Opening hours and booking rules: a switch per day, the times for the open
// days, the rules, and Save in the footer.
export default function Hours() {
  const [open, setOpen] = useState([true, true, true, true, true, true, false]);
  const [opens, setOpens] = useState(() => at(9));
  const [closes, setCloses] = useState(() => at(18));
  const [lunch, setLunch] = useState(() => at(13));
  const [buffer, setBuffer] = useState(10);
  const [weeks, setWeeks] = useState(6);
  const [notice, setNotice] = useState(2);
  const fmt = (d: Date) => d.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });

  return (
    <InsetShell primaryCta={{ label: "Save hours", onPress: () => Toast.success("Hours saved") }}>
      <SectionTitle>Open on</SectionTitle>
      <SettingsGroup>
        {WEEK.map((d, i) => (
          <SettingsRow
            key={d}
            label={d}
            trailing={open[i] ? `${fmt(opens)} to ${fmt(closes)}` : "Closed"}
            accessory={<Switch value={open[i]} onValueChange={(v) => setOpen((o) => o.map((x, j) => (j === i ? v : x)))} />}
          />
        ))}
      </SettingsGroup>
      <SectionTitle>Times</SectionTitle>
      <SettingsGroup>
        <DateRow label="Opens" Icon={Clock} mode="time" value={opens} onChange={setOpens} />
        <DateRow label="Closes" Icon={Clock} mode="time" value={closes} onChange={setCloses} />
        <DateRow label="Lunch, 30 min" Icon={Coffee} mode="time" value={lunch} onChange={setLunch} />
      </SettingsGroup>
      <SectionTitle>Booking rules</SectionTitle>
      <SettingsGroup>
        <StepperRow label="Gap between bookings" Icon={Timer} value={buffer} onChange={setBuffer} min={0} max={60} step={5} format={(v) => `${v} min`} />
        <StepperRow label="Book ahead up to" Icon={CalendarRange} value={weeks} onChange={setWeeks} min={1} max={26} format={(v) => `${v} weeks`} />
        <PickerRow label="Least notice" Icon={Hourglass} options={NOTICE} value={notice} onChange={setNotice} />
      </SettingsGroup>
    </InsetShell>
  );
}
