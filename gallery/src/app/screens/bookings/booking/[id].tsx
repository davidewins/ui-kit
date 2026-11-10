import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsIdentity } from "@/components/ui/lists/SettingsIdentity";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { STATUS_BADGE, bookingById, clientById, euro, serviceById } from "@/gallery/demo/data";
import { Avatar, DemoScreen, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Toast } from "@/lib/toast";
import { router, useLocalSearchParams } from "expo-router";
import { CalendarDays, Clock, Euro, Scissors, User } from "lucide-react-native";
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
  const { state } = useStates(STATES);
  const [cancelling, setCancelling] = useState(false);

  const footer =
    state === "Confirmed" ? (
      <InsetFooter
        primaryCta={{ label: "Check in", onPress: () => { haptic("success"); Toast.success(`${c.name.split(" ")[0]} checked in`); } }}
        secondaryCta={{ label: "Reschedule", onPress: () => router.push("/screens/bookings/new-booking") }}
      />
    ) : state === "Checked in" ? (
      <InsetFooter primaryCta={{ label: s.price ? `Take payment, ${euro(s.price)}` : "Finish", onPress: () => { haptic("success"); Toast.success("Paid"); } }} />
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
            caption={`${c.visits} visits, last ${c.lastVisit}`}
            onPress={() => router.push("/screens/bookings/clients")}
            accessibilityLabel={`${c.name}, client`}
          />
        <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
          <Badge variant={STATUS_BADGE[state]}>{state}</Badge>
        </View>
        <SettingsGroup>
          <SettingsRow label={s.name} Icon={Scissors} trailing={`${s.minutes} min`} />
          <SettingsRow label="With" Icon={User} trailing={b.staff} />
          <SettingsRow label="Wednesday 12 Nov" Icon={CalendarDays} trailing={`${b.start} to ${b.end}`} />
          <SettingsRow label="Price" Icon={Euro} trailing={s.price ? euro(s.price) : "Free"} />
          <SettingsRow label="Booked online" Icon={Clock} trailing="3 Nov" />
        </SettingsGroup>
        {c.note ? (
          <>
            <SectionTitle>Note</SectionTitle>
            <Text weight="medium" style={{ fontSize: 15, lineHeight: 22, color: colors.muted, marginHorizontal: 20, marginBottom: 18 }}>{c.note}</Text>
          </>
        ) : null}
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
