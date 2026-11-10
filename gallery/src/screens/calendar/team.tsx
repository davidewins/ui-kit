// The resource view (modelled on Fresha's team calendar and Google Calendar's
// people-side-by-side day): three stylists as three columns on one clock, how
// full each one is in the column header, and how many chairs are busy each
// hour in the bars above.
import { EmptyState, Text, View } from "@/components/ui";
import { DayTimeline, type TimelineColumn } from "@/components/ui/calendar/DayTimeline";
import { PeriodBar } from "@/components/ui/calendar/PeriodBar";
import type { CalendarEvent } from "@/components/ui/calendar/timeline";
import { BarChart } from "@/components/ui/data/BarChart";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { ART } from "@/gallery/demo/data";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { addDays, format, isSameDay } from "date-fns";
import { useMemo, useState } from "react";
import { NOW, SERVICES, STYLISTS, type ServiceKind, TODAY, bookingStatus, bookingsOn, duration } from "./data";
import { CalendarHeader, EventPeek, useKindHue } from "./parts";

const OPEN = Math.min(...STYLISTS.map((s) => s.from));
const CLOSE = Math.max(...STYLISTS.map((s) => s.to));
const KINDS: ServiceKind[] = ["Cut", "Colour", "Styling", "Barber"];
const euro = (n: number) => `€${n.toLocaleString("en-IE")}`;
const NEXT_STEP = { Confirmed: "Check in", "In the chair": "Check out", Done: "Rebook", Cancelled: "Rebook" } as const;

export default function CalendarTeam() {
  const colors = useThemeColors();
  const hues = useHues();
  const kindHue = useKindHue();
  const [day, setDay] = useState(TODAY);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const isToday = isSameDay(day, TODAY);

  const bookings = useMemo(() => bookingsOn(day), [day]);
  const live = bookings.filter((b) => !b.cancelled);
  const minutesOf = (id: string) => live.filter((b) => b.stylist === id).reduce((n, b) => n + SERVICES[b.service].minutes, 0);
  const columns: TimelineColumn[] = STYLISTS.map((s) => ({
    key: s.id,
    title: s.name,
    detail: `${duration(minutesOf(s.id))} of ${s.to - s.from} h`,
    load: minutesOf(s.id) / ((s.to - s.from) * 60),
    color: hues.green,
  }));
  const events: CalendarEvent[] = useMemo(
    () => bookings.map((b) => ({ id: b.id, column: b.stylist, start: b.start, end: b.end, title: b.client.split(" ")[0], detail: SERVICES[b.service].short, color: kindHue[SERVICES[b.service].kind], struck: b.cancelled })),
    [bookings, kindHue],
  );

  // Chairs busy in each hour: booked minutes across the team, over 60.
  const hours = Array.from({ length: CLOSE - OPEN }, (_, i) => {
    const from = new Date(day.getFullYear(), day.getMonth(), day.getDate(), OPEN + i);
    const to = new Date(+from + 3600000);
    // A stylist with two clients at once (colour processing) still fills one chair.
    const busy = STYLISTS.reduce((n, s) => n + Math.min(60, live.filter((b) => b.stylist === s.id).reduce((m, b) => m + Math.max(0, Math.min(+b.end, +to) - Math.max(+b.start, +from)) / 60000, 0)), 0);
    return { hour: OPEN + i, chairs: busy / 60 };
  });
  const peak = hours.reduce((a, b) => (b.chairs > a.chairs ? b : a), hours[0]);
  const quiet = hours.reduce((a, b) => (b.chairs < a.chairs ? b : a), hours[0]);
  const booked = live.reduce((n, b) => n + SERVICES[b.service].minutes, 0);
  const shift = STYLISTS.reduce((n, s) => n + (s.to - s.from) * 60, 0);
  const revenue = live.reduce((n, b) => n + SERVICES[b.service].price, 0);
  const picked = bookings.find((b) => b.id === pickedId);
  const move = (days: number) => {
    setDay(addDays(day, days));
    setPickedId(null);
  };

  return (
    <>
      <CalendarHeader
        view="team"
        addLabel="New booking"
        onAdd={() => Toast.info(`New booking, ${format(day, "EEE d MMM")}`)}
        onToday={() => {
          setDay(TODAY);
          setPickedId(null);
        }}
      />
      <DemoScreen
        footer={
          picked ? (
            <EventPeek
              leading={<View style={{ width: 4, alignSelf: "stretch", borderRadius: 2, backgroundColor: kindHue[SERVICES[picked.service].kind] }} />}
              title={`${picked.client} with ${STYLISTS.find((s) => s.id === picked.stylist)!.name}`}
              lines={[
                `${SERVICES[picked.service].name} · ${duration(SERVICES[picked.service].minutes)} · ${euro(SERVICES[picked.service].price)}`,
                `${format(picked.start, "HH:mm")} to ${format(picked.end, "HH:mm")} · ${bookingStatus(picked)}`,
              ]}
              action={{ label: NEXT_STEP[bookingStatus(picked)], onPress: () => Toast.info(`${NEXT_STEP[bookingStatus(picked)]}: ${picked.client}`) }}
            />
          ) : undefined
        }
      >
        <View style={{ marginHorizontal: 16 }}>
          <PeriodBar title={format(day, "EEE d MMM")} detail={isToday ? "Today" : undefined} unit="day" onPrevious={() => move(-1)} onNext={() => move(1)} />
          {bookings.length ? (
            <>
              <View style={{ flexDirection: "row", alignItems: "flex-end", columnGap: 16, marginTop: 10 }}>
                <View>
                  <Text weight="semibold" style={[TYPE.display, TABULAR]}>
                    {`${Math.round((booked / shift) * 100)}%`}
                  </Text>
                  <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>
                    {`${duration(booked)} of ${shift / 60} h booked`}
                  </Text>
                  <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>
                    {`${live.length} bookings · ${euro(revenue)}`}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <BarChart
                    height={76}
                    data={hours.map((h) => ({ label: String(h.hour), value: h.chairs, color: hues.green }))}
                    selected={isToday ? NOW.getHours() - OPEN : undefined}
                    format={(v) => v.toFixed(1)}
                    accessibilityLabel={`Chairs busy by hour. Busiest at ${peak.hour}:00, quietest at ${quiet.hour}:00.`}
                  />
                </View>
              </View>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginTop: 10 }]}>
                {`Chairs busy by hour. Fullest at ${peak.hour}:00, ${quiet.chairs < 0.5 ? "nobody" : `only ${quiet.chairs.toFixed(1)}`} at ${quiet.hour}:00.`}
              </Text>
              <View style={{ flexDirection: "row", columnGap: 14, marginTop: 12, marginBottom: 18 }}>
                {KINDS.map((k) => (
                  <View key={k} style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: kindHue[k] }} />
                    <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>
                      {k}
                    </Text>
                  </View>
                ))}
              </View>
              <DayTimeline day={day} events={events} columns={columns} startHour={OPEN} endHour={CLOSE} hourHeight={64} now={NOW} onPressEvent={(e) => setPickedId(e.id)} />
            </>
          ) : null}
        </View>
        {bookings.length ? null : (
          <EmptyState layout="inline" art={{ image: ART.calendar }} title="Closed on Sundays" body="Nobody is on the rota. Add a shift to open the day for bookings." action={{ label: "Add a shift", plus: true, onPress: () => Toast.info("Add a shift") }} />
        )}
      </DemoScreen>
    </>
  );
}
