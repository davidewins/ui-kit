import { Text } from "@/components/ui";
import { ComposeHost } from "@/components/ui/native/NativeHost";
import { BottomSwitch } from "@/gallery/BottomSwitch";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  MultiChoiceSegmentedButtonRow,
  SegmentedButton,
  SingleChoiceSegmentedButtonRow,
  Text as MText,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { useState } from "react";

const RANGES = ["Today", "Week", "Month"] as const;
const ORDERS = [38, 241, 1012];
const MODES = ["Delivery", "Collection", "Dine in"] as const;

// The page's own switch is the live demo: segmented controls in ZESTY sit at
// the bottom of the page.
export default function SegmentedPage() {
  const colors = useThemeColors();
  const [range, setRange] = useState(0);
  return (
    <DemoPage
      usage='import { SegmentedControl } from "@/components/ui/inputs/SegmentedControl". iOS: SwiftUI segmented Picker. Android: Material 3 segmented buttons. Put it at the bottom of the page.'
      bottom={<BottomSwitch values={RANGES} selectedIndex={range} onChange={setRange} accessibilityLabel="Range" />}
    >
      <Demo title={`Orders ${RANGES[range].toLowerCase() === "today" ? "today" : `this ${RANGES[range].toLowerCase()}`}`}>
        <Text weight="semibold" style={{ fontSize: 34, letterSpacing: -0.8, fontVariant: ["tabular-nums"] }}>
          {ORDERS[range]}
        </Text>
        <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>
          The switch at the bottom of this page is the SegmentedControl.
        </Text>
      </Demo>
      {isIOS ? <Note>Android: Compose SingleChoiceSegmentedButtonRow, plus MultiChoiceSegmentedButtonRow for several at once.</Note> : <ComposeRows />}
    </DemoPage>
  );
}

function ComposeRows() {
  const [mode, setMode] = useState(0);
  const [modes, setModes] = useState<number[]>([0, 1]);
  return (
    <>
      <Demo title="SingleChoiceSegmentedButtonRow">
        <ComposeHost matchContents={{ vertical: true }}>
          <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
            {MODES.map((m, i) => (
              <SegmentedButton key={m} selected={i === mode} onClick={() => setMode(i)}>
                <SegmentedButton.Label>
                  <MText>{m}</MText>
                </SegmentedButton.Label>
              </SegmentedButton>
            ))}
          </SingleChoiceSegmentedButtonRow>
        </ComposeHost>
      </Demo>
      <Demo title="MultiChoiceSegmentedButtonRow: modes a store offers">
        <ComposeHost matchContents={{ vertical: true }}>
          <MultiChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
            {MODES.map((m, i) => (
              <SegmentedButton
                key={m}
                checked={modes.includes(i)}
                onCheckedChange={(c) => setModes((l) => (c ? [...l, i] : l.filter((x) => x !== i)))}
              >
                <SegmentedButton.Label>
                  <MText>{m}</MText>
                </SegmentedButton.Label>
              </SegmentedButton>
            ))}
          </MultiChoiceSegmentedButtonRow>
        </ComposeHost>
      </Demo>
      <Note>iOS: SwiftUI Picker in the segmented style; several at once are FilterChips.</Note>
    </>
  );
}
