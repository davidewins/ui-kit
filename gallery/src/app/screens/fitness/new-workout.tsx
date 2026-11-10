import { Input, View } from "@/components/ui";
import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { DateRow } from "@/components/ui/inputs/DateRow";
import { PickerRow } from "@/components/ui/inputs/PickerRow";
import { StepperRow } from "@/components/ui/inputs/StepperRow";
import { Switch } from "@/components/ui/inputs/Switch";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { Bell, CalendarDays, Dumbbell, Gauge, Repeat, Timer } from "lucide-react-native";
import { useState } from "react";

const KINDS = ["Strength", "HIIT", "Yoga", "Core"].map((k) => ({ label: k, value: k }));
const LEVELS = ["Beginner", "Intermediate", "Advanced"].map((k) => ({ label: k, value: k }));

// Create = modal, the commit in the footer, a toast, then close.
export default function NewWorkout() {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("Strength");
  const [level, setLevel] = useState("Intermediate");
  const [minutes, setMinutes] = useState(45);
  const [weekly, setWeekly] = useState(2);
  const [first, setFirst] = useState(() => new Date());
  const [remind, setRemind] = useState(true);

  return (
    <InsetShell
      primaryCta={{
        label: "Create workout",
        disabled: !name.trim(),
        onPress: () => {
          Toast.success(`${name.trim()} added to your plan`);
          router.back();
        },
      }}
    >
      <View style={{ marginHorizontal: 16, gap: 12, paddingTop: 12, marginBottom: 24 }}>
        <Input label="Name" placeholder="Leg day" value={name} onChangeText={setName} />
        <Input label="Notes" placeholder="Warm up on the bike first" multiline />
      </View>
      <SettingsGroup>
        <PickerRow label="Type" Icon={Dumbbell} options={KINDS} value={kind} onChange={setKind} />
        <PickerRow label="Level" Icon={Gauge} options={LEVELS} value={level} onChange={setLevel} />
        <StepperRow label="Length" Icon={Timer} value={minutes} onChange={setMinutes} min={10} max={120} step={5} format={(v) => `${v} min`} />
      </SettingsGroup>
      <SectionTitle>Schedule</SectionTitle>
      <SettingsGroup>
        <StepperRow label="Times a week" Icon={Repeat} value={weekly} onChange={setWeekly} min={1} max={7} />
        <DateRow label="First session" Icon={CalendarDays} mode="datetime" value={first} onChange={setFirst} minimumDate={new Date()} />
        <SettingsRow label="Remind me" Icon={Bell} accessory={<Switch value={remind} onValueChange={setRemind} />} />
      </SettingsGroup>
    </InsetShell>
  );
}
