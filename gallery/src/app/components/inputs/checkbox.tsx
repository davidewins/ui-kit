import { Checkbox } from "@/components/ui/inputs/Checkbox";
import { ComposeHost } from "@/components/ui/native/NativeHost";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { DIETARY } from "@/gallery/demoData";
import { Row, Text as MText, TriStateCheckbox } from "@expo/ui/jetpack-compose";
import { useState } from "react";

const TICKETS = ["#1042 Aoife Byrne", "#1043 Cian Murphy", "#1044 Niamh Kelly"] as const;

export default function CheckboxPage() {
  const [diet, setDiet] = useState<string[]>(["Vegan"]);
  const [terms, setTerms] = useState(false);
  const [tickets, setTickets] = useState<string[]>([TICKETS[0]]);
  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const all = tickets.length === TICKETS.length ? "on" : tickets.length === 0 ? "off" : "indeterminate";

  return (
    <DemoPage usage='import { Checkbox } from "@/components/ui/inputs/Checkbox". iOS: SwiftUI checkmark circle. Android: Compose Checkbox.'>
      <Demo title="Dietary tags on a menu item" gap={4}>
        {DIETARY.map((d) => (
          <Checkbox key={d} label={d} value={diet.includes(d)} onValueChange={() => toggle(diet, setDiet, d)} />
        ))}
      </Demo>
      <Demo title="Single">
        <Checkbox label="I agree to the VOID seller terms" value={terms} onValueChange={setTerms} />
      </Demo>
      <Demo title="Disabled">
        <Checkbox label="Card payments (set up Stripe first)" value={false} onValueChange={() => {}} disabled />
      </Demo>
      {isIOS ? (
        <Note>Android: Compose Checkbox, plus TriStateCheckbox for select-all.</Note>
      ) : (
        <Demo title="Select all (TriStateCheckbox)" gap={4}>
          <ComposeHost matchContents={{ vertical: true }}>
            <Row verticalAlignment="center">
              <TriStateCheckbox state={all} onClick={() => setTickets(all === "on" ? [] : [...TICKETS])} />
              <MText>Print all tickets</MText>
            </Row>
          </ComposeHost>
          {TICKETS.map((t) => (
            <Checkbox key={t} label={t} value={tickets.includes(t)} onValueChange={() => toggle(tickets, setTickets, t)} />
          ))}
        </Demo>
      )}
    </DemoPage>
  );
}
