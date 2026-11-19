// A SettingsRow holding a date and/or time. iOS puts SwiftUI's compact
// DatePicker in the accessory slot (the grey date chip that opens the native
// calendar / time wheel popover). Android shows the value as trailing text;
// tapping the row opens the native Material date or time dialog
// (@expo/ui/community/datetime-picker, as VOID's Date of Birth screen uses).
import { useThemeColors } from "@/hooks/useThemeColors";
import { DatePicker, Host } from "@expo/ui/swift-ui";
import {
  datePickerStyle,
  disabled as disabledModifier,
  labelsHidden,
} from "@expo/ui/swift-ui/modifiers";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import { Platform } from "react-native";
import { SettingsRow, type SettingsIcon } from "../lists/SettingsRow";

export type DateRowMode = "date" | "time" | "datetime";

export interface DateRowProps {
  label: string;
  /** Optional, like SettingsRow: leave out for a plain row. */
  Icon?: SettingsIcon;
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
  // The year shows when it isn't this year (a date of birth, say).
  const sameYear = value.getFullYear() === new Date().getFullYear();
  const date = value.toLocaleDateString(undefined, { day: "numeric", month: "short", year: sameYear ? undefined : "numeric" });
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
  // Android's dialog opens on mount and stays until it is unmounted.
  const [open, setOpen] = useState(false);

  if (Platform.OS !== "ios") {
    return (
      <>
        <SettingsRow
          label={label}
          Icon={Icon}
          trailing={formatValue(value, mode)}
          disabled={disabled}
          onPress={disabled ? undefined : () => setOpen(true)}
        />
        {open ? (
          <DateTimePicker
            value={value}
            mode={mode === "time" ? "time" : "date"}
            accentColor={colors.tint}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onValueChange={(_, date) => {
              setOpen(false);
              if (date) onChange(date);
            }}
            onDismiss={() => setOpen(false)}
          />
        ) : null}
      </>
    );
  }

  return (
    <SettingsRow
      label={label}
      Icon={Icon}
      disabled={disabled}
      accessory={
        <Host ignoreSafeArea="all" matchContents seedColor={colors.tint}>
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
