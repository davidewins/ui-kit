// GdprScreen: "GDPR" for every app. Remixed from ZESTY gallery
// screens/account/gdpr (the SELLERS GDPR page): what we hold in one
// paragraph; contact rows (DPO, Privacy policy, Terms) with the reply promise
// under them; your rights at the bottom, one row each named by what it does
// (David, 15 Nov). Group titles are the Settings screen's (SectionHeader, as
// on Account), never muted eyebrow labels. An optional InsetFooter carries
// one primary action (e.g. Download my data).
//
// The screen sets no header options. The app's route:
//   <Stack.Screen options={{ title: "GDPR", ...LARGE_TITLE }} />
// LARGE_TITLE comes from lib/stackHeader. The ScrollView is the first child
// with contentInsetAdjustmentBehavior="automatic", so the large title works.
//
// Rows only describe what to do; the app wires mail composers, pushes and
// dismissals in each row's onPress or href.
import { ScrollView, Text, View } from "@/components/ui";
import { InsetFooter, useInsetFooterSpace } from "@/components/onboarding/shells/InsetShell";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ComponentProps } from "react";
import { SettingsSections, SettingsSectionTitle, type SettingsScreenRow } from "./SettingsScreen";

type FooterProps = ComponentProps<typeof InsetFooter>;

export interface GdprScreenProps {
  /** Access, correct, export, object, delete: one row each. */
  rights: readonly SettingsScreenRow[];
  /** Default "Your rights". */
  rightsTitle?: string;
  /** One paragraph: what personal data the app keeps. */
  dataHeld: string;
  /** Default "What we hold". */
  dataHeldTitle?: string;
  /** DPO email, Privacy policy, Terms. */
  contact: readonly SettingsScreenRow[];
  /** Default "Contact". */
  contactTitle?: string;
  /** Muted line under the contact rows, e.g. "We reply to every request within 30 days." */
  replyNote?: string;
  /** Sticky footer action. */
  primaryCta?: FooterProps["primaryCta"];
  secondaryCta?: FooterProps["secondaryCta"];
}

export function GdprScreen({
  rights,
  rightsTitle = "Your rights",
  dataHeld,
  dataHeldTitle = "What we hold",
  contact,
  contactTitle = "Contact",
  replyNote,
  primaryCta,
  secondaryCta,
}: GdprScreenProps) {
  const colors = useThemeColors();
  const space = useInsetFooterSpace({ secondary: !!secondaryCta });
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingTop: 8, paddingBottom: primaryCta ? space : 32 }}>
        <SettingsSectionTitle title={dataHeldTitle} />
        <Text selectable style={{ fontSize: 15, lineHeight: 24, color: colors.text, marginHorizontal: 16, marginBottom: 18 }}>
          {dataHeld}
        </Text>

        <SettingsSections sections={[{ key: "contact", title: contactTitle, rows: contact, note: replyNote }]} />

        <SettingsSections sections={[{ key: "rights", title: rightsTitle, rows: rights }]} />
      </ScrollView>
      {primaryCta ? <InsetFooter primaryCta={primaryCta} secondaryCta={secondaryCta} /> : null}
    </View>
  );
}
