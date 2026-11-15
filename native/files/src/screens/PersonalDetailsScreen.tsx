// PersonalDetailsScreen: "Personal details" for every app. Remixed from ZESTY
// gallery screens/profile/edit-profile: a pushed page, one kit Input per
// field, optional kit rows (DateRow birthday, PickerRow) in one group under
// them, Save in the sticky InsetFooter. The app shows the toast and goes back.
//
// The screen sets no header options. The app's route:
//   <Stack.Screen options={{ title: "Personal details" }} />
// (a pushed page: small title, back chevron from useStackScreenOptions).
import { View } from "@/components/ui";
import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { Input } from "@/components/ui/inputs/Input";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import type { ReactNode } from "react";
import type { TextInputProps } from "react-native";

export interface PersonalDetailsField
  extends Pick<
    TextInputProps,
    "keyboardType" | "autoCapitalize" | "autoComplete" | "autoCorrect" | "textContentType" | "placeholder" | "editable" | "maxLength"
  > {
  key: string;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  /** Muted line under the field, e.g. "We'll send a code to confirm a new address". */
  hint?: string;
  error?: string;
}

export interface PersonalDetailsSave {
  onPress: () => void;
  /** Default "Save changes". */
  label?: string;
  disabled?: boolean;
  loading?: boolean;
}

export interface PersonalDetailsScreenProps {
  fields: readonly PersonalDetailsField[];
  /** Kit rows (DateRow, PickerRow) shown in one SettingsGroup under the fields. */
  rows?: ReactNode;
  save: PersonalDetailsSave;
}

export function PersonalDetailsScreen({ fields, rows, save }: PersonalDetailsScreenProps) {
  return (
    <InsetShell
      primaryCta={{ label: save.label ?? "Save changes", onPress: save.onPress, disabled: save.disabled, loading: save.loading }}
    >
      <View style={{ marginHorizontal: 16, gap: 12, paddingTop: 12, marginBottom: 24 }}>
        {fields.map(({ key, ...field }) => (
          <Input key={key} {...field} />
        ))}
      </View>
      {rows ? <SettingsGroup>{rows}</SettingsGroup> : null}
    </InsetShell>
  );
}
