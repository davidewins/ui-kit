import { Badge, EmptyState } from "@/components/ui";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { Chip } from "@/components/ui/inputs/Chip";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ART, BOOKINGS, type Booking, DAYS, STATUS_BADGE, clientById, euro, serviceById } from "@/gallery/demo/data";
import { ChipRow, DemoScreen, MEDIA_INSET, MediaRow, StatTiles, TimeColumn, useStates } from "@/gallery/demo/parts";
import { Stack, router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { SkeletonTiles, SkeletonTitle, SkeletonMediaRows } from "@/gallery/demo/skeletons";

const STATES = ["Busy", "Loading", "Day off"] as const;

// A salon's day: pick the day, three numbers, then morning and afternoon.
// New booking is the header Plus (a modal).
export default function Schedule() {
  const { state } = useStates(STATES);
  const [day, setDay] = useState(2);
  const live = BOOKINGS.filter((b) => b.status !== "Cancelled");
  const revenue = live.reduce((n, b) => n + serviceById(b.service).price, 0);
  const morning = BOOKINGS.filter((b) => b.start < "12:00");
  const afternoon = BOOKINGS.filter((b) => b.start >= "12:00");

  const rows = (list: Booking[]) =>
    list.map((b) => {
      const c = clientById(b.client);
      const s = serviceById(b.service);
      return (
        <MediaRow
          key={b.id}
          leading={<TimeColumn start={b.start} end={b.end} struck={b.status === "Cancelled"} />}
          title={c.name}
          subtitle={`${s.name} with ${b.staff}`}
          accessory={b.status === "Confirmed" ? undefined : <Badge variant={STATUS_BADGE[b.status]}>{b.status}</Badge>}
          href={`/screens/bookings/booking/${b.id}`}
        />
      );
    });

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderIconButton icon={Plus} accessibilityLabel="New booking" onPress={() => router.push("/screens/bookings/new-booking")} />
          ),
        }}
      />
      <DemoScreen>
        <ChipRow>
          {DAYS.map((d, i) => (
            <Chip key={d} label={i === 2 ? `Today, ${d}` : d} selected={day === i} onPress={() => setDay(i)} />
          ))}
        </ChipRow>
        {state === "Loading" ? (
          <>
            <SkeletonTiles />
            <SkeletonTitle />
            <SkeletonMediaRows count={3} lead="time" />
            <SkeletonTitle />
            <SkeletonMediaRows count={4} lead="time" />
          </>
        ) : state === "Day off" ? (
          <EmptyState
            layout="inline"
            art={{ image: ART.calendar }}
            title="No bookings"
            body="The salon is closed on this day. Change your hours to take bookings."
            action={{ label: "Opening hours", onPress: () => router.push("/screens/bookings/hours") }}
          />
        ) : (
          <>
            <StatTiles items={[{ value: String(live.length), label: "Bookings" }, { value: "6.5 h", label: "Booked" }, { value: euro(revenue), label: "Expected" }]} />
            <SectionTitle>Morning</SectionTitle>
            <SettingsGroup separatorInset={MEDIA_INSET}>{rows(morning)}</SettingsGroup>
            <SectionTitle>Afternoon</SectionTitle>
            <SettingsGroup separatorInset={MEDIA_INSET}>{rows(afternoon)}</SettingsGroup>
          </>
        )}
      </DemoScreen>
    </>
  );
}
