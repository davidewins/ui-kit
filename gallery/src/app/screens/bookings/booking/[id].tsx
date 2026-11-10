import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsIdentity } from "@/components/ui/lists/SettingsIdentity";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { STATUS_BADGE, VISITS, bookingById, clientById, euro, serviceById } from "@/gallery/demo/data";
import { Avatar, DataTable, DemoScreen, MetricGrid, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router, useLocalSearchParams } from "expo-router";
import { CalendarDays, Scissors } from "lucide-react-native";
import { useState } from "react";

const STATES = ["Confirmed", "Checked in", "Cancelled"] as const;

// A booking: who (tap for the client), what, when, the client's note, and
// the next step in the footer. Cancel is in the header menu, behind a confirm.
export default function BookingDetail() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const b = bookingById(id);
  const c = clientById(b.client);
  const s = serviceById(b.service);
  // An unconfirmed booking has the same page and actions as a confirmed one.
  const { state } = useStates(STATES, b.status === "Unconfirmed" ? "Confirmed" : b.status);
  const [cancelling, setCancelling] = useState(false);

  const footer =
    state === "Confirmed" ? (
      <InsetFooter
        primaryCta={{ label: "Check in", onPress: () => Toast.success(`${c.name.split(" ")[0]} checked in`) }}
        secondaryCta={{ label: "Reschedule", onPress: () => router.push("/screens/bookings/new-booking") }}
      />
    ) : state === "Checked in" ? (
      <InsetFooter primaryCta={{ label: s.price ? `Take payment, ${euro(s.price)}` : "Finish", onPress: () => Toast.success("Paid") }} />
    ) : (
      <InsetFooter primaryCta={{ label: "Book again", onPress: () => router.push("/screens/bookings/new-booking") }} />
    );

  return (
    <>
      <ActionMenu
        accessibilityLabel="Booking actions"
        actions={[
          { label: "Message", systemImage: "message", onPress: () => Toast.info(`Message ${c.name}`) },
          { label: "Call", systemImage: "phone", onPress: () => Toast.info(c.phone) },
          ...(state === "Confirmed" ? [{ label: "Cancel booking", systemImage: "xmark.circle", destructive: true, onPress: () => setCancelling(true) }] : []),
        ]}
      />
      <DemoScreen footer={footer} secondary={state === "Confirmed"}>
        <SettingsIdentity
            leading={<Avatar name={c.name} size={60} />}
            title={c.name}
            subtitle={c.phone}
            caption={`Client since ${c.since}, last in ${c.lastVisit}`}
            onPress={() => router.push("/screens/bookings/clients")}
            accessibilityLabel={`${c.name}, client`}
          />
        <View style={{ flexDirection: "row", gap: 6, marginHorizontal: 16, marginBottom: 12 }}>
          <Badge variant={STATUS_BADGE[state]}>{state}</Badge>
          <Badge>Booked online, 3 Nov</Badge>
          {c.noShows ? <Badge variant="warning">{`${c.noShows} no-show${c.noShows > 1 ? "s" : ""}`}</Badge> : null}
        </View>
        <SettingsGroup>
          <SettingsRow label={`${s.name}, ${s.minutes} min`} Icon={Scissors} trailing={s.price ? euro(s.price) : "Free"} />
          <SettingsRow label={`Wed 12 Nov, ${b.start} to ${b.end}`} Icon={CalendarDays} trailing={b.staff} />
        </SettingsGroup>
        <MetricGrid
          items={[
            { label: "Visits", value: String(c.visits) },
            { label: "Spent", value: euro(c.spent) },
            { label: "Average", value: c.visits ? euro(Math.round(c.spent / c.visits)) : "€0" },
            { label: "Every", value: c.visits > 5 ? "6" : "9", unit: "weeks" },
            { label: "Usually with", value: "Aisling" },
            { label: "No-shows", value: String(c.noShows), delta: c.noShows ? "Ask for a deposit" : undefined, good: false },
          ]}
        />
        {c.note ? (
          <>
            <SectionTitle>Note</SectionTitle>
            <Text weight="medium" style={{ fontSize: 15, lineHeight: 21, color: colors.muted, marginHorizontal: 16, marginBottom: 6 }}>{c.note}</Text>
          </>
        ) : null}
        <SectionTitle>Past visits</SectionTitle>
        <DataTable
          dense
          columns={[
            { key: "date", label: "Date", width: 52, align: "left" },
            { key: "service", label: "Service" },
            { key: "staff", label: "With", width: 64, align: "left" },
            { key: "paid", label: "Paid", width: 44 },
          ]}
          rows={VISITS}
        />
      </DemoScreen>
      <ConfirmDialog
        visible={cancelling}
        onClose={() => setCancelling(false)}
        title={`Cancel ${c.name.split(" ")[0]}'s ${s.name.toLowerCase()}?`}
        message="They get a text saying it's cancelled. The slot opens up for others."
        confirmLabel="Cancel booking"
        cancelLabel="Keep it"
        destructive
        onConfirm={() => {
          Toast.success("Booking cancelled");
          router.back();
        }}
      />
    </>
  );
}
