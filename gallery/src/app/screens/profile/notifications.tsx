import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Card, Text, View } from "@/components/ui";
import { DateRow } from "@/components/ui/inputs/DateRow";
import { Switch } from "@/components/ui/inputs/Switch";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { DemoScreen, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { BellOff, CalendarClock, Megaphone, MessageCircle, Moon, Newspaper, Package, Receipt, Sunrise } from "lucide-react-native";
import { useState } from "react";

const STATES = ["Allowed", "Off in Settings"] as const;

function at(h: number) {
  const d = new Date();
  d.setHours(h, 0, 0, 0);
  return d;
}

// What we send and where. Off in Settings: one card says why nothing
// arrives, the rows go quiet, and the footer opens iOS Settings.
export default function Notifications() {
  const colors = useThemeColors();
  const { state } = useStates(STATES);
  const blocked = state === "Off in Settings";
  const [push, setPush] = useState({ orders: true, reminders: true, messages: true, offers: false });
  const [email, setEmail] = useState({ receipts: true, news: false });
  const [quiet, setQuiet] = useState(true);
  const [from, setFrom] = useState(() => at(22));
  const [until, setUntil] = useState(() => at(7));
  const flip = <T extends Record<string, boolean>>(set: (f: (s: T) => T) => void, k: keyof T) => (v: boolean) => set((s) => ({ ...s, [k]: v }));

  return (
    <DemoScreen
     
      footer={blocked ? <InsetFooter primaryCta={{ label: "Turn on in Settings", onPress: () => Toast.info("Opening Settings") }} /> : undefined}
    >
      {blocked ? (
        <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
          <Card raised>
            <BellOff size={22} color={colors.text} strokeWidth={1.8} />
            <Text weight="semibold" style={{ fontSize: 17, marginTop: 10 }}>Notifications are off for this app</Text>
            <Text weight="medium" style={{ fontSize: 15, color: colors.muted, marginTop: 4 }}>
              You won't hear about orders or bookings until you turn them on in your phone's Settings.
            </Text>
          </Card>
        </View>
      ) : null}

      <SectionTitle>Push</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Order updates" Icon={Package} accessory={<Switch value={push.orders && !blocked} disabled={blocked} onValueChange={flip(setPush, "orders")} />} />
        <SettingsRow label="Booking reminders" Icon={CalendarClock} accessory={<Switch value={push.reminders && !blocked} disabled={blocked} onValueChange={flip(setPush, "reminders")} />} />
        <SettingsRow label="Messages" Icon={MessageCircle} accessory={<Switch value={push.messages && !blocked} disabled={blocked} onValueChange={flip(setPush, "messages")} />} />
        <SettingsRow label="Offers" Icon={Megaphone} accessory={<Switch value={push.offers && !blocked} disabled={blocked} onValueChange={flip(setPush, "offers")} />} />
      </SettingsGroup>

      <SectionTitle>Email</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Receipts" Icon={Receipt} accessory={<Switch value={email.receipts} onValueChange={flip(setEmail, "receipts")} />} />
        <SettingsRow label="News and offers" Icon={Newspaper} accessory={<Switch value={email.news} onValueChange={flip(setEmail, "news")} />} />
      </SettingsGroup>

      <SectionTitle>Quiet hours</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Hold push overnight" Icon={Moon} accessory={<Switch value={quiet} disabled={blocked} onValueChange={setQuiet} />} />
        {quiet ? <DateRow label="From" Icon={Moon} mode="time" value={from} onChange={setFrom} disabled={blocked} /> : null}
        {quiet ? <DateRow label="Until" Icon={Sunrise} mode="time" value={until} onChange={setUntil} disabled={blocked} /> : null}
      </SettingsGroup>
    </DemoScreen>
  );
}
