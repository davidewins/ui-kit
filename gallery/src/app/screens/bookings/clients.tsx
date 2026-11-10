import { EmptyState } from "@/components/ui";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ART, BOOKINGS, CLIENTS } from "@/gallery/demo/data";
import { Avatar, DemoScreen, MEDIA_INSET, MediaRow, useStates } from "@/gallery/demo/parts";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { SkeletonMediaRows } from "@/gallery/demo/skeletons";

const STATES = ["Loaded", "Loading", "Empty"] as const;

// Clients A to Z with header search; each row opens their next booking.
export default function Clients() {
  const { state } = useStates(STATES);
  const [q, setQ] = useState("");
  const shown = state === "Empty" ? [] : CLIENTS.filter((c) => c.name.toLowerCase().includes(q.trim().toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Stack.Screen options={{ headerSearchBarOptions: { placeholder: "Search clients", onChangeText: (e) => setQ(e.nativeEvent.text) } }} />
      <DemoScreen>
        {state === "Loading" ? (
          <SkeletonMediaRows count={6} lead="avatar" trailing="figure" />
        ) : shown.length === 0 ? (
          <EmptyState
            layout="inline"
            art={{ image: ART.people }}
            title={q ? `No one called "${q}"` : "No clients yet"}
            body={q ? "Check the spelling, or add them with a new booking" : "Clients are added when they book"}
            action={{ label: "New booking", onPress: () => router.push("/screens/bookings/new-booking") }}
          />
        ) : (
          <SettingsGroup separatorInset={MEDIA_INSET}>
            {shown.map((c) => {
              const next = BOOKINGS.find((b) => b.client === c.id && b.status !== "Cancelled");
              return (
                <MediaRow
                  key={c.id}
                  leading={<Avatar name={c.name} />}
                  title={c.name}
                  subtitle={c.visits === 1 ? "First visit" : `${c.visits} visits, last ${c.lastVisit}`}
                  trailing={next ? next.start : undefined}
                  href={next ? `/screens/bookings/booking/${next.id}` : "/screens/bookings/new-booking"}
                />
              );
            })}
          </SettingsGroup>
        )}
      </DemoScreen>
    </>
  );
}
