// A SettingsRow holding a date and/or time. iOS puts SwiftUI's compact
// DatePicker in the accessory slot (the grey date chip that opens the native
// calendar / time wheel popover). Other platforms show the value read-only as
// trailing text; add @react-native-community/datetimepicker in the app if
// Android needs to edit it.
import { useThemeColors } from "@/hooks/useThemeColors";
import { DatePicker, Host } from "@expo/ui/swift-ui";
import {
  datePickerStyle,
  disabled as disabledModifier,
  labelsHidden,
} from "@expo/ui/swift-ui/modifiers";
import { Platform } from "react-native";
import { SettingsRow, type SettingsIcon } from "./SettingsRow";

export type DateRowMode = "date" | "time" | "datetime";

export interface DateRowProps {
  label: string;
  Icon: SettingsIcon;
  value: Date;
  onChange: (value: Date) => void;
  mode?: DateRowMode;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
}

const COMPONENTS = {
  date: ["date"],
  time: ["hourAndMinute"],
  datetime: ["date", "hourAndMinute"],
} as const;

function formatValue(value: Date, mode: DateRowMode) {
  const date = value.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  const time = value.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return mode === "date" ? date : mode === "time" ? time : `${date}, ${time}`;
}

export function DateRow({
  label,
  Icon,
  value,
  onChange,
  mode = "date",
  minimumDate,
  maximumDate,
  disabled = false,
}: DateRowProps) {
  const colors = useThemeColors();

  if (Platform.OS !== "ios") {
    return <SettingsRow label={label} Icon={Icon} trailing={formatValue(value, mode)} disabled={disabled} />;
  }

  return (
    <SettingsRow
      label={label}
      Icon={Icon}
      disabled={disabled}
      accessory={
        <Host matchContents seedColor={colors.tint}>
          <DatePicker
            title={label}
            selection={value}
            onDateChange={onChange}
            displayedComponents={[...COMPONENTS[mode]]}
            range={minimumDate || maximumDate ? { start: minimumDate, end: maximumDate } : undefined}
            modifiers={[
              datePickerStyle("compact"),
              labelsHidden(),
              disabledModifier(disabled),
            ]}
          />
        </Host>
      }
    />
  );
}
