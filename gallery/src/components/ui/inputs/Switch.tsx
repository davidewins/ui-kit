// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/inputs/Switch.tsx. Edit it there and sync; local edits fail ui-kit:check.
// App-wide Switch. On iOS 26 react-native's Switch is laid out at the old
// 51x31 box while UISwitch draws at its new larger size, so it sat high and
// overflowed the row. iOS renders SwiftUI's Toggle through @expo/ui (sized by
// SwiftUI, centres like any other row content); Android keeps RN's Switch.
//
// Same props as RN's Switch. The Toggle keeps its own state, so if the host
// doesn't accept a flip (e.g. it asks to confirm first) we snap it back,
// matching RN's controlled Switch.
import { Host, Toggle } from "@expo/ui/swift-ui";
import { disabled as disabledModifier, labelsHidden } from "@expo/ui/swift-ui/modifiers";
import { useEffect, useState } from "react";
import { Platform, Switch as RNSwitch, type SwitchProps } from "react-native";

export function Switch(props: SwitchProps) {
  if (Platform.OS !== "ios") return <RNSwitch {...props} />;
  return <IOSSwitch {...props} />;
}

function IOSSwitch({ value = false, onValueChange, disabled, trackColor, style, testID }: SwitchProps) {
  const [shown, setShown] = useState(value);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    if (shown === value) return;
    const t = setTimeout(() => {
      setShown(value);
      setRev((r) => r + 1);
    }, 350);
    return () => clearTimeout(t);
  }, [shown, value]);

  const onColor = typeof trackColor?.true === "string" ? trackColor.true : undefined;

  return (
    <Host matchContents seedColor={onColor} style={style} testID={testID}>
      <Toggle
        key={rev}
        isOn={value}
        onIsOnChange={(v) => {
          setShown(v);
          onValueChange?.(v);
        }}
        modifiers={[
          labelsHidden(),
          disabledModifier(!!disabled),
        ]}
      />
    </Host>
  );
}
