import { Input, View } from "@/components/ui";
import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { router } from "expo-router";

// Recipe §3.3 edit screen: Input cards (gap 12, 16 in from the edges), CTA in
// the InsetShell sticky footer.
export default function Footer() {
  return (
    <InsetShell
      step={2}
      total={4}
      subtitle="Fields above, the one main action pinned to the bottom."
      primaryCta={{ label: "Save changes", onPress: () => router.back() }}
      secondaryCta={{ label: "Skip for now", onPress: () => router.back() }}
    >
      <View style={{ marginHorizontal: 16, gap: 12 }}>
        <Input label="Display name" placeholder="Alex Rider" />
        <Input label="Handle" placeholder="@alex" />
      </View>
    </InsetShell>
  );
}
