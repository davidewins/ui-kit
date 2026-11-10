import { Input, View } from "@/components/ui";
import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { Chip } from "@/components/ui/inputs/Chip";
import { DateRow } from "@/components/ui/inputs/DateRow";
import { PickerRow } from "@/components/ui/inputs/PickerRow";
import { Switch } from "@/components/ui/inputs/Switch";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { CLIENTS, SERVICES, STAFF, euro } from "@/gallery/demo/data";
import { GUTTER } from "@/gallery/demo/parts";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { CalendarDays, MessageSquare, Scissors, User, UserRound } from "lucide-react-native";
import { useState } from "react";

const SLOTS = ["09:45", "11:30", "12:30", "13:15", "14:45", "16:00", "16:45"];

// New booking = modal. Who, what, with whom, which day, then a free slot.
// Book is off until a slot is picked; the label says what you're booking.
export default function NewBooking() {
  const [client, setClient] = useState(CLIENTS[0].id);
  const [service, setService] = useState(SERVICES[0].id);
  const [staff, setStaff] = useState<string>(STAFF[0]);
  const [day, setDay] = useState(() => new Date());
  const [slot, setSlot] = useState<string | null>(null);
  const [text, setText] = useState(true);
  const s = SERVICES.find((x) => x.id === service)!;

  return (
    <InsetShell
      primaryCta={{
        label: slot ? `Book ${slot}, ${s.price ? euro(s.price) : "free"}` : "Pick a time",
        disabled: !slot,
        onPress: () => {
          Toast.success(`Booked ${s.name.toLowerCase()} at ${slot}`);
          router.back();
        },
      }}
    >
      <SettingsGroup>
        <PickerRow label="Client" Icon={UserRound} options={CLIENTS.map((c) => ({ label: c.name, value: c.id }))} value={client} onChange={setClient} />
        <PickerRow label="Service" Icon={Scissors} options={SERVICES.map((x) => ({ label: `${x.name}, ${x.minutes} min`, value: x.id }))} value={service} onChange={setService} />
        <PickerRow label="With" Icon={User} options={STAFF.map((x) => ({ label: x, value: x }))} value={staff} onChange={setStaff} />
        <DateRow label="Day" Icon={CalendarDays} value={day} onChange={setDay} minimumDate={new Date()} />
      </SettingsGroup>

      <SectionTitle>{`Free with ${staff}`}</SectionTitle>
      <View style={{ marginHorizontal: GUTTER, marginBottom: 18, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {SLOTS.map((t) => (
          <Chip key={t} label={t} selected={slot === t} onPress={() => setSlot(t)} />
        ))}
      </View>

      <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
        <Input label="Note" placeholder="Anything to know before they arrive" multiline />
      </View>
      <SettingsGroup>
        <SettingsRow label="Text a confirmation" Icon={MessageSquare} accessory={<Switch value={text} onValueChange={setText} />} />
      </SettingsGroup>
    </InsetShell>
  );
}
