import { ComposeHost, SwiftHost, SwiftSystemHost } from "@/components/ui/native/NativeHost";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Column, HorizontalDivider, ListItem, Text as MText } from "@expo/ui/jetpack-compose";
import { Form, LabeledContent, Section, Text, Toggle } from "@expo/ui/swift-ui";
import { font, foregroundStyle, scrollContentBackground } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

// Native settings forms, for reference. ZESTY's own settings screens are
// SettingsGroup + SettingsRow (one look on both platforms).
export default function FormPage() {
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: import { Form, Section, LabeledContent } from "@expo/ui/swift-ui". Apps use SettingsGroup and SettingsRow for the same job.'
          : "Form, Section and LabeledContent are SwiftUI. Android equivalent: Compose ListItems with dividers. Apps use SettingsGroup and SettingsRow."
      }
    >
      {isIOS ? <SwiftForm /> : <ComposeForm />}
    </DemoPage>
  );
}

function SwiftForm() {
  const colors = useThemeColors();
  const [collection, setCollection] = useState(true);
  const value = (v: string) => <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted)]}>{v}</Text>;
  return (
    <>
      <Demo title="Payout details">
        <Frame height={470}>
          <SwiftSystemHost kind="toggle" style={{ flex: 1 }}>
            <Form modifiers={[scrollContentBackground("hidden")]}>
              <Section title="Bank account" footer={<Text>Payouts land every Monday. Changing the account pauses the next payout for 24 hours.</Text>}>
                <LabeledContent label="Account holder">{value("Bao House Ltd")}</LabeledContent>
                <LabeledContent label="IBAN">{value("IE29 •••• 5678")}</LabeledContent>
                <LabeledContent label="Next payout">{value("€1,284.60")}</LabeledContent>
              </Section>
              <Section title="Ordering">
                <Toggle isOn={collection} onIsOnChange={setCollection} label="Collection orders" />
                <LabeledContent label="Commission">{value("5%")}</LabeledContent>
              </Section>
            </Form>
          </SwiftSystemHost>
        </Frame>
      </Demo>
      <Note>Android: Compose ListItems with dividers; apps use SettingsGroup.</Note>
    </>
  );
}

function ComposeForm() {
  const colors = useThemeColors();
  const row = (label: string, v: string) => (
    <ListItem colors={{ containerColor: "transparent" }}>
      <ListItem.HeadlineContent>
        <MText>{label}</MText>
      </ListItem.HeadlineContent>
      <ListItem.TrailingContent>
        <MText color={colors.muted}>{v}</MText>
      </ListItem.TrailingContent>
    </ListItem>
  );
  return (
    <>
      <Demo title="Payout details">
        <ComposeHost matchContents={{ vertical: true }}>
          <Column>
            {row("Account holder", "Bao House Ltd")}
            <HorizontalDivider />
            {row("IBAN", "IE29 •••• 5678")}
            <HorizontalDivider />
            {row("Next payout", "€1,284.60")}
          </Column>
        </ComposeHost>
      </Demo>
      <Note>iOS: SwiftUI Form, Section and LabeledContent.</Note>
    </>
  );
}
