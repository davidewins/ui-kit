import { EmptyState, SkeletonList } from "@/components/ui";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { Chip } from "@/components/ui/inputs/Chip";
import { ART, WORKOUTS, type WorkoutKind } from "@/gallery/demo/data";
import { ChipRow, DemoScreen, PhotoGrid, PhotoTile, useStates } from "@/gallery/demo/parts";
import { Stack, router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";

const KINDS = ["All", "Strength", "HIIT", "Yoga", "Core"] as const;
const STATES = ["Loaded", "Loading", "No results"] as const;

// Workout library: filter chips, a two-up photo grid, New in the header.
export default function Workouts() {
  const { state, bar } = useStates(STATES);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All");
  const shown = state === "No results" ? [] : WORKOUTS.filter((w) => kind === "All" || w.kind === (kind as WorkoutKind));

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderIconButton icon={Plus} accessibilityLabel="New workout" onPress={() => router.push("/screens/fitness/new-workout")} />
          ),
        }}
      />
      <DemoScreen bar={bar}>
        <ChipRow>
          {KINDS.map((k) => (
            <Chip key={k} label={k} selected={kind === k} onPress={() => setKind(k)} />
          ))}
        </ChipRow>
        {state === "Loading" ? (
          <SkeletonList count={4} />
        ) : shown.length === 0 ? (
          <EmptyState
            layout="inline"
            art={{ image: ART.magnifier }}
            title={`No ${kind === "All" ? "" : kind + " "}workouts`}
            body="Try another type, or make your own"
            action={{ label: "New workout", plus: true, onPress: () => router.push("/screens/fitness/new-workout") }}
            secondary={kind === "All" ? undefined : { label: "Show all", onPress: () => setKind("All") }}
          />
        ) : (
          <PhotoGrid
            data={shown}
            keyOf={(w) => w.id}
            render={(w, width) => (
              <PhotoTile image={w.photo} title={w.name} subtitle={`${w.kind} · ${w.minutes} min`} width={width} ratio={0.8} href={`/screens/fitness/workout/${w.id}`} />
            )}
          />
        )}
      </DemoScreen>
    </>
  );
}
