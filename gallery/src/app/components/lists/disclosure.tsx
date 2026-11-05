import { Text, View } from "@/components/ui";
import { Disclosure } from "@/components/ui/lists/Disclosure";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";

export default function DisclosurePage() {
  const colors = useThemeColors();
  const [open, setOpen] = useState(false);
  const line = (a: string, b: string) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
      <Text weight="medium" style={{ fontSize: 15 }}>{a}</Text>
      <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>{b}</Text>
    </View>
  );
  return (
    <DemoPage usage='import { Disclosure } from "@/components/ui/lists/Disclosure". iOS: SwiftUI DisclosureGroup. Android: Compose ListItem + AnimatedVisibility.'>
      <Demo title="Order items (starts closed)">
        <Disclosure title="4 items in order #1042">
          <View style={{ paddingVertical: 4 }}>
            {line("2x Pork belly bao", "€13.00")}
            {line("Kimchi fries", "€5.00")}
            {line("Brown sugar bubble tea", "€4.90")}
            {line("Delivery", "€1.60")}
          </View>
        </Disclosure>
      </Demo>
      <Demo title="Allergens (starts open)">
        <Disclosure title="Allergens" defaultOpen>
          <Text weight="medium" style={{ fontSize: 15, color: colors.muted, paddingVertical: 4 }}>
            Contains gluten, soy and sesame. Made in a kitchen that handles peanuts.
          </Text>
        </Disclosure>
      </Demo>
      <Demo title={`Controlled (${open ? "open" : "closed"})`}>
        <Disclosure title="How payouts work" open={open} onOpenChange={setOpen}>
          <Text weight="medium" style={{ fontSize: 15, color: colors.muted, paddingVertical: 4 }}>
            VOID pays out every Monday for the week before, minus the 5% commission. It reaches your bank in one to two working days.
          </Text>
        </Disclosure>
      </Demo>
      <Note>{isIOS ? "Android: a Material 3 ListItem header with a rotating arrow and an animated body." : "iOS: SwiftUI DisclosureGroup."}</Note>
    </DemoPage>
  );
}
