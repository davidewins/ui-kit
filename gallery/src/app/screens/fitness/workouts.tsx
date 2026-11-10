import { EmptyState } from "@/components/ui";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { Chip } from "@/components/ui/inputs/Chip";
import { ART, WORKOUTS, type WorkoutKind } from "@/gallery/demo/data";
import { ChipRow, DemoScreen, PhotoGrid, PhotoTile, useStates } from "@/gallery/demo/parts";
import { Stack, router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { SkeletonPhotoGrid } from "@/gallery/demo/skeletons";

const KINDS = ["All", "Strength", "HIIT", "Yoga", "Core"] as const;
const STATES = ["Loaded", "Loading", "No results"] as const;

// Workout library: filter chips, a two-up photo grid, New in the header.
export default function Workouts() {
  const { state } = useStates(STATES);
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
      <DemoScreen>
        <ChipRow>
          {KINDS.map((k) => (
            <Chip key={k} label={k} selected={kind === k} onPress={() => setKind(k)} />
          ))}
        </ChipRow>
        {state === "Loading" ? (
          <SkeletonPhotoGrid count={4} ratio={0.8} />
        ) : shown.length === 0 ? (
          <EmptyState
            layout="inline"
            art={{ image: ART.magnifier }}
            title={`No ${kind === "All" ? "" : kind + " "}workouts`}
            body={kind === "All" ? "Make your own and it shows up here" : "Try another type, or make your own"}
            action={{ label: "New workout", onPress: () => router.push("/screens/fitness/new-workout") }}
            secondary={kind === "All" ? undefined : { label: "Show all", onPress: () => setKind("All") }}
          />
        ) : (
          <PhotoGrid
            data={shown}
            keyOf={(w) => w.id}
            render={(w, width) => (
              <PhotoTile image={w.photo} title={w.name} subtitle={`${w.kind}, ${w.minutes} min`} width={width} ratio={0.8} href={`/screens/fitness/workout/${w.id}`} />
            )}
          />
        )}
      </DemoScreen>
    </>
  );
}
