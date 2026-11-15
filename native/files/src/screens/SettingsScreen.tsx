// SettingsScreen: the one Settings page for every app (David, 15 Nov: each
// app's settings drifted). Remixed from ZESTY gallery screens/profile/account
// and components/lists/settings-rows: optional identity row on top, then
// groups of SettingsRows, each with an optional section title above and an
// optional muted note under it, then an optional centred footnote (version).
// Section titles are the kit SectionHeader, as on SELLERS' Account screen,
// set 2pt lower (David, 15 Nov), never the muted SectionTitle.
//
// The screen sets no header options. The app's route:
//   tab root:     <Stack.Screen options={{ title: "Settings", ...LARGE_TITLE }} />
//   pushed page:  <Stack.Screen options={{ title: "Settings" }} />
// LARGE_TITLE comes from lib/stackHeader. The ScrollView is the first child
// with contentInsetAdjustmentBehavior="automatic", so the large title works.
//
// Header menu (Sign out and the like): pass `menu`; it renders the kit
// ActionMenu, never a lone destructive row at the bottom.
import { ScrollView, Text, View } from "@/components/ui";
import { ActionMenu, type MenuAction } from "@/components/ui/actions/ActionMenu";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsIdentity } from "@/components/ui/lists/SettingsIdentity";
import { type SettingsIcon, SettingsRow } from "@/components/ui/lists/SettingsRow";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { Href } from "expo-router";
import { type ComponentProps, Fragment, type ReactElement, type ReactNode } from "react";

/** One SettingsRow, described as data. */
export interface SettingsScreenItem {
  key?: string;
  label: string;
  /** Muted text before the chevron or accessory ("2 in progress", "v2.4.0"). */
  value?: string;
  icon?: SettingsIcon;
  onPress?: () => void;
  /** Destination: the row becomes a Link with the iOS peek preview. */
  href?: Href;
  /** Chevron. Set it on rows that go somewhere; rows that act in place leave it off. */
  navigates?: boolean;
  /** Sign out, delete: icon and label in the error colour. */
  destructive?: boolean;
  /** Unresolved attention marker. */
  alert?: boolean;
  /** Switch, CountBadge or another kit accessory left of the chevron. */
  accessory?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

/** A kit row that is not a SettingsRow (PickerRow, DateRow, CheckForUpdatesRow). */
export interface SettingsScreenElement {
  key: string;
  element: ReactElement;
}

/** null / false / undefined entries are dropped, so gated rows can sit inline. */
export type SettingsScreenRow = SettingsScreenItem | SettingsScreenElement | null | false | undefined;

export interface SettingsScreenSection {
  key?: string;
  /** Section title above the group. Leave out for an unlabelled group. */
  title?: string;
  /** Small pill on the right of the title line, e.g. "Add". */
  titleAction?: { label: string; onPress: () => void };
  rows: readonly SettingsScreenRow[];
  /** Muted line that belongs to this group, directly under it. */
  note?: string;
}

export type SettingsScreenIdentity = ComponentProps<typeof SettingsIdentity>;

export interface SettingsScreenMenu {
  accessibilityLabel: string;
  actions: readonly MenuAction[];
}

export interface SettingsScreenProps {
  /** Who this is: avatar or business tile, name, email; taps through to Personal details. */
  identity?: SettingsScreenIdentity;
  /** Between the identity row and the first group, e.g. a stats list. */
  header?: ReactNode;
  sections: readonly SettingsScreenSection[];
  /** Centred muted line at the end, e.g. "Version 2.4.0 (318)". */
  footnote?: string;
  /** Header "..." menu (one action shows as its own header button). */
  menu?: SettingsScreenMenu;
}

export function SettingsScreen({ identity, header, sections, footnote, menu }: SettingsScreenProps) {
  return (
    <>
      {menu ? <ActionMenu accessibilityLabel={menu.accessibilityLabel} actions={menu.actions} /> : null}
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        {identity ? <SettingsIdentity {...identity} /> : null}
        {header}
        <SettingsSections sections={sections} />
        {footnote ? (
          <Text weight="medium" className="text-muted" style={{ fontSize: 13, textAlign: "center", marginTop: 4 }}>
            {footnote}
          </Text>
        ) : null}
      </ScrollView>
    </>
  );
}

/** The groups on their own, for the other kit screens (privacy, GDPR). */
export function SettingsSections({ sections }: { sections: readonly SettingsScreenSection[] }) {
  return (
    <>
      {sections.map((section, i) => {
        const rows = section.rows.filter(isRow);
        if (rows.length === 0) return null;
        return (
          <View key={section.key ?? section.title ?? i}>
            {section.title ? <SettingsSectionTitle title={section.title} action={section.titleAction} /> : null}
            {/* The note belongs to this group, so the group's gap moves under it. */}
            <SettingsGroup style={section.note ? { marginBottom: 8 } : undefined}>
              {rows.map((row, j) => renderRow(row, j))}
            </SettingsGroup>
            {section.note ? <SettingsNote>{section.note}</SettingsNote> : null}
          </View>
        );
      })}
    </>
  );
}

/** The title above a group: the Account screen's SectionHeader, drawn 2pt
 *  lower without moving the group under it (David, 15 Nov). */
export function SettingsSectionTitle({ title, action }: { title: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={{ transform: [{ translateY: 2 }] }}>
      <SectionHeader title={title} action={action} />
    </View>
  );
}

/** The muted line under a group (ZESTY profile/privacy). */
export function SettingsNote({ children }: { children: string }) {
  const colors = useThemeColors();
  return (
    <Text weight="medium" style={{ fontSize: 13, lineHeight: 18, color: colors.muted, marginHorizontal: 16, marginBottom: 18 }}>
      {children}
    </Text>
  );
}

function isRow(row: SettingsScreenRow): row is SettingsScreenItem | SettingsScreenElement {
  return Boolean(row);
}

function renderRow(row: SettingsScreenItem | SettingsScreenElement, index: number) {
  if ("element" in row) return <Fragment key={row.key}>{row.element}</Fragment>;
  return (
    <SettingsRow
      key={row.key ?? row.label ?? index}
      label={row.label}
      Icon={row.icon}
      trailing={row.value}
      onPress={row.onPress}
      href={row.href}
      navigates={row.navigates}
      destructive={row.destructive}
      alert={row.alert}
      accessory={row.accessory}
      loading={row.loading}
      disabled={row.disabled}
    />
  );
}
