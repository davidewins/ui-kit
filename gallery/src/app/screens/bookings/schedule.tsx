import { Badge, EmptyState, View } from "@/components/ui";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { Chip } from "@/components/ui/inputs/Chip";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ART, BOOKINGS, type Booking, DAYS, STAFF_LOAD, STATUS_BADGE, clientById, euro, serviceById } from "@/gallery/demo/data";
import { ChipRow, DemoScreen, MEDIA_INSET, MediaRow, FactList, TimeColumn, useStates, Section } from "@/gallery/demo/parts";
import { Gauge } from "@/components/ui/feedback/Gauge";
import { Stack, router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { SkeletonBars, SkeletonMediaRows, SkeletonFacts, SkeletonSection } from "@/gallery/demo/skeletons";

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
          subtitle={`${s.name}, ${s.price ? euro(s.price) : "free"}, ${b.staff}, ${c.visits === 1 ? "first visit" : `visit ${c.visits + 1}`}`}
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
            <SkeletonFacts rows={6} />
            <SkeletonBars count={3} />
            <SkeletonSection />
            <SkeletonMediaRows count={3} lead="time" />
            <SkeletonSection />
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
            <FactList
              items={[
                { label: "Bookings", value: String(live.length), delta: "+2 on last Wed", good: true },
                { label: "Booked", value: "5.4", unit: "h of 22", delta: "25% full", good: false },
                { label: "Expected", value: euro(revenue), delta: "+€85", good: true },
                { label: "Free slots", value: "9" },
                { label: "Walk-ins", value: "1" },
                { label: "No-shows", value: "0", unit: "this week" },
              ]}
            />
            <View style={{ gap: 10, marginHorizontal: 16, marginBottom: 6 }}>
              {STAFF_LOAD.map((st) => (
                <Gauge key={st.name} variant="bar" label={st.name} value={st.booked} max={st.shift} valueLabel={`${st.booked} of ${st.shift} h`} />
              ))}
            </View>
            <Section title="Morning" art="calendar" trailing={`${morning.length} bookings`} />
            <SettingsGroup separatorInset={MEDIA_INSET}>{rows(morning)}</SettingsGroup>
            <Section title="Afternoon" art="stopwatch" trailing={`${afternoon.length} bookings`} />
            <SettingsGroup separatorInset={MEDIA_INSET}>{rows(afternoon)}</SettingsGroup>
          </>
        )}
      </DemoScreen>
    </>
  );
}
