import { RadioGroup } from "@/components/ui/RadioGroup";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { SLOTS } from "@/gallery/demoData";
import { useState } from "react";

const PAYOUTS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly, every Monday", value: "weekly" },
  { label: "Monthly, on the 1st", value: "monthly" },
] as const;

export default function RadioGroupPage() {
  const [slot, setSlot] = useState<string>(SLOTS[0]);
  const [payout, setPayout] = useState<string>("weekly");
  return (
    <DemoPage usage='import { RadioGroup } from "@/components/ui/RadioGroup". iOS: SwiftUI checkmark rows. Android: Compose RadioButton.'>
      <Demo title="Delivery slot">
        <RadioGroup options={SLOTS.map((s) => ({ label: s, value: s }))} value={slot} onChange={setSlot} />
      </Demo>
      <Demo title="Payout schedule">
        <RadioGroup options={PAYOUTS} value={payout} onChange={setPayout} />
      </Demo>
      <Note>{isIOS ? "Android: Material 3 RadioButtons in a selectable group." : "iOS: a column of rows with a checkmark on the chosen one."}</Note>
    </DemoPage>
  );
}
