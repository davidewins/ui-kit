// One stylist's day in a salon (modelled on Fresha's and Booksy's day
// calendar, and iOS Calendar's day view with its week strip): the week to
// pick from, the day in one line and one bar, then the day against the clock
// with the overlap, the free gap and the cancellation where they fall.
import { EmptyState, Text, View } from "@/components/ui";
import { DayTimeline } from "@/components/ui/calendar/DayTimeline";
import { type CalendarEvent, dayKey } from "@/components/ui/calendar/timeline";
import { WeekStrip } from "@/components/ui/calendar/WeekStrip";
import { SegmentBar } from "@/components/ui/data/SegmentBar";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { ART, euro } from "@/gallery/demo/data";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { differenceInMinutes, format, isSameDay } from "date-fns";
import { useMemo, useState } from "react";
import { BOOKINGS, type Booking, NOW, SERVICES, STYLISTS, type ServiceKind, TODAY, bookingStatus, bookingsOn, duration } from "./data";
import { CalendarHeader, EventPeek, useKindHue } from "./parts";

const ME = STYLISTS[0];
const KINDS: ServiceKind[] = ["Cut", "Colour", "Styling", "Barber"];
const NEXT_STEP = { Confirmed: "Check in", "In the chair": "Check out", Done: "Rebook", Cancelled: "Rebook" } as const;

/** Stretches of an hour or more with nobody booked, from now on. */
function freeSlots(day: Date, live: Booking[]): CalendarEvent[] {
  const at = (h: number) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), h);
  const out: CalendarEvent[] = [];
  let cursor = at(ME.from);
  for (const b of [...live].sort((a, c) => +a.start - +c.start).concat({ start: at(ME.to), end: at(ME.to) } as Booking)) {
    const mins = differenceInMinutes(b.start, cursor);
    if (mins >= 60 && b.start > NOW) out.push({ id: `free-${+cursor}`, start: cursor, end: b.start, title: `Free for ${duration(mins)}`, detail: `${format(cursor, "HH:mm")} to ${format(b.start, "HH:mm")}, tap to book`, color: "", open: true });
    if (b.end > cursor) cursor = b.end;
  }
  return out;
}

export default function CalendarDay() {
  const colors = useThemeColors();
  const hues = useHues();
  const kindHue = useKindHue();
  const [day, setDay] = useState(TODAY);
  const [pickedId, setPickedId] = useState<string | null>(null);

  const bookings = useMemo(() => bookingsOn(day, ME.id), [day]);
  const live = bookings.filter((b) => !b.cancelled);
  const events = useMemo(
    () => [
      ...bookings.map((b): CalendarEvent => {
        const s = SERVICES[b.service];
        return { id: b.id, start: b.start, end: b.end, title: s.name, detail: [`${b.client} · ${euro(s.price)}`, `${format(b.start, "HH:mm")} to ${format(b.end, "HH:mm")} · ${b.visit === 1 ? "first visit" : `visit ${b.visit}`}`], color: kindHue[s.kind], struck: b.cancelled };
      }),
      ...freeSlots(day, bookings.filter((b) => !b.cancelled)),
    ],
    [bookings, day, kindHue],
  );
  const dots = useMemo(() => Object.fromEntries(BOOKINGS.filter((b) => b.stylist === ME.id).map((b) => [dayKey(b.start), hues.gray])), [hues]);
  const minutes = live.reduce((n, b) => n + SERVICES[b.service].minutes, 0);
  const revenue = live.reduce((n, b) => n + SERVICES[b.service].price, 0);
  const picked = bookings.find((b) => b.id === pickedId);
  const fact = (value: string, label: string) => (
    <Text weight="medium" style={[TYPE.body, { color: colors.muted }]}>
      <Text weight="semibold" style={TABULAR}>
        {value}
      </Text>
      {` ${label}`}
    </Text>
  );

  return (
    <>
      <CalendarHeader view="day" addLabel="New booking" onAdd={() => Toast.info(`New booking, ${format(day, "EEE d MMM")}`)} onToday={() => setDay(TODAY)} />
      <DemoScreen
        footer={
          picked ? (
            <EventPeek
              leading={
                <View style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: `${kindHue[SERVICES[picked.service].kind]}33` }}>
                  <Text weight="semibold" style={TYPE.body}>
                    {picked.client.split(" ").map((w) => w[0]).join("")}
                  </Text>
                </View>
              }
              title={picked.client}
              lines={[
                `${SERVICES[picked.service].name} · ${duration(SERVICES[picked.service].minutes)} · ${euro(SERVICES[picked.service].price)}`,
                `${format(picked.start, "HH:mm")} to ${format(picked.end, "HH:mm")} · ${bookingStatus(picked)} · ${picked.visit === 1 ? "first visit" : `visit ${picked.visit}`}`,
              ]}
              action={{ label: NEXT_STEP[bookingStatus(picked)], onPress: () => Toast.info(`${NEXT_STEP[bookingStatus(picked)]}: ${picked.client}`) }}
            />
          ) : undefined
        }
      >
        <View style={{ marginHorizontal: 16 }}>
          <WeekStrip
            selected={day}
            today={TODAY}
            dots={dots}
            onSelect={(d) => {
              setDay(d);
              setPickedId(null);
            }}
          />
          <View style={{ marginTop: 14, marginBottom: 18, rowGap: 10 }}>
            <View style={{ rowGap: 2 }}>
              <Text weight="semibold" style={TYPE.headline}>
                {`${isSameDay(day, TODAY) ? "Today, " : ""}${format(day, "EEEE d MMMM")}`}
              </Text>
              {live.length ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 12 }}>
                  {fact(String(live.length), "bookings")}
                  {fact(duration(minutes), `of ${ME.to - ME.from} h booked`)}
                  {fact(euro(revenue), "expected")}
                </View>
              ) : null}
            </View>
            {live.length ? (
              <SegmentBar
                height={8}
                segments={KINDS.map((k) => {
                  const m = live.filter((b) => SERVICES[b.service].kind === k).reduce((n, b) => n + SERVICES[b.service].minutes, 0);
                  return { label: k, value: m, color: kindHue[k], display: duration(m) };
                }).filter((s) => s.value > 0)}
              />
            ) : null}
          </View>
        </View>
        {bookings.length ? (
          <View style={{ marginHorizontal: 16 }}>
            <DayTimeline
              day={day}
              events={events}
              startHour={ME.from}
              endHour={ME.to}
              hourHeight={76}
              now={NOW}
              onPressEvent={(e) => {
                if (e.open) Toast.info(`New booking at ${format(e.start, "HH:mm")} with ${ME.name}`);
                else setPickedId(e.id);
              }}
            />
          </View>
        ) : (
          <EmptyState layout="inline" art={{ image: ART.calendar }} title="Closed on Sundays" body={`${ME.name} has no bookings on this day. Open it up from your hours to take some.`} action={{ label: "Opening hours", onPress: () => Toast.info("Opening hours") }} />
        )}
      </DemoScreen>
    </>
  );
}
