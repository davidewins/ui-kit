import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import {
  Button as MButton,
  ElevatedButton,
  FilledIconButton,
  FilledIconToggleButton,
  FilledTonalButton,
  FilledTonalIconButton,
  FlowRow,
  Icon,
  IconButton,
  IconToggleButton,
  OutlinedButton,
  OutlinedIconButton,
  OutlinedIconToggleButton,
  SplitButtonLayout,
  SplitButtonLeadingButton,
  SplitButtonTrailingButton,
  Text as MText,
  TextButton,
  ToggleButton,
} from "@expo/ui/jetpack-compose";
import { Button, HStack } from "@expo/ui/swift-ui";
import { buttonBorderShape, buttonStyle, controlSize, tint } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

const say = (m: string) => () => Toast.success(m);

// Every native button style, shown once. ZESTY's own buttons are Button
// (big, bottom of the page) and NativeButton (small, in content); these are
// the platform styles underneath, for reference.
export default function NativeButtonStyles() {
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: import { Button } from "@expo/ui/swift-ui". In apps use NativeButton from "@/components/ui/NativeButton".'
          : 'Compose: import { Button, FilledTonalButton, IconButton, ToggleButton, SplitButtonLayout } from "@expo/ui/jetpack-compose".'
      }
    >
      {isIOS ? <IOSStyles /> : <AndroidStyles />}
    </DemoPage>
  );
}

function IOSStyles() {
  const colors = useThemeColors();
  const row = (style: "glassProminent" | "glass" | "borderedProminent" | "bordered", label: string) => (
    <SwiftHost matchContents>
      <HStack spacing={12}>
        {(["small", "regular", "large"] as const).map((size) => (
          <Button
            key={size}
            label={label}
            onPress={say(`${label} pressed`)}
            modifiers={[
              buttonStyle(style),
              buttonBorderShape("capsule"),
              controlSize(size),
              ...(style.endsWith("Prominent") ? [tint(colors.text)] : []),
            ]}
          />
        ))}
      </HStack>
    </SwiftHost>
  );
  return (
    <>
      <Demo title="Glass prominent">{row("glassProminent", "Accept")}</Demo>
      <Demo title="Glass">{row("glass", "Edit")}</Demo>
      <Demo title="Bordered prominent">{row("borderedProminent", "Accept")}</Demo>
      <Demo title="Bordered">{row("bordered", "Edit")}</Demo>
      <Note>Android: Material 3 filled, tonal, elevated, outlined, icon, toggle and split buttons from @expo/ui/jetpack-compose.</Note>
    </>
  );
}

function AndroidStyles() {
  const [open, setOpen] = useState(true);
  const [starred, setStarred] = useState(false);
  const [printMenu, setPrintMenu] = useState(false);
  const row = (children: React.ReactNode) => (
    <ComposeHost matchContents={{ vertical: true }}>
      <FlowRow horizontalArrangement={{ spacedBy: 8 }} verticalArrangement={{ spacedBy: 8 }}>
        {children}
      </FlowRow>
    </ComposeHost>
  );
  return (
    <>
      <Demo title="Filled, tonal and elevated">
        {row(
          <>
            <MButton onClick={say("Order accepted")}>
              <MText>Accept order</MText>
            </MButton>
            <FilledTonalButton onClick={say("Marked ready")}>
              <MText>Mark ready</MText>
            </FilledTonalButton>
            <ElevatedButton onClick={say("Ticket sent to printer")}>
              <MText>Print ticket</MText>
            </ElevatedButton>
          </>,
        )}
      </Demo>
      <Demo title="Outlined and text (paired with a filled button only)">
        {row(
          <>
            <MButton onClick={say("Refund sent")}>
              <MText>Refund €24.50</MText>
            </MButton>
            <OutlinedButton onClick={say("Kept")}>
              <MText>Keep order</MText>
            </OutlinedButton>
            <TextButton onClick={say("Undone")}>
              <MText>Undo</MText>
            </TextButton>
          </>,
        )}
      </Demo>
      <Demo title="Icon buttons">
        {row(
          <>
            <IconButton onClick={say("More")}>
              <Icon source={MI.moreVert} contentDescription="More" />
            </IconButton>
            <FilledIconButton onClick={say("Item added")}>
              <Icon source={MI.add} contentDescription="Add item" />
            </FilledIconButton>
            <FilledTonalIconButton onClick={say("Searching")}>
              <Icon source={MI.search} contentDescription="Search" />
            </FilledTonalIconButton>
            <OutlinedIconButton onClick={say("Item removed")}>
              <Icon source={MI.delete} contentDescription="Remove item" />
            </OutlinedIconButton>
          </>,
        )}
      </Demo>
      <Demo title="Toggle buttons">
        {row(
          <>
            <ToggleButton checked={open} onCheckedChange={setOpen}>
              <MText>{open ? "Open" : "Closed"}</MText>
            </ToggleButton>
            <IconToggleButton checked={starred} onCheckedChange={setStarred}>
              <Icon source={MI.check} contentDescription="Favourite" />
            </IconToggleButton>
            <FilledIconToggleButton checked={starred} onCheckedChange={setStarred}>
              <Icon source={MI.check} contentDescription="Favourite" />
            </FilledIconToggleButton>
            <OutlinedIconToggleButton checked={starred} onCheckedChange={setStarred}>
              <Icon source={MI.check} contentDescription="Favourite" />
            </OutlinedIconToggleButton>
          </>,
        )}
      </Demo>
      <Demo title="Split button">
        <ComposeHost matchContents>
          <SplitButtonLayout>
            <SplitButtonLayout.LeadingButton>
              <SplitButtonLeadingButton onClick={say("Kitchen ticket printed")}>
                <MText>Print kitchen ticket</MText>
              </SplitButtonLeadingButton>
            </SplitButtonLayout.LeadingButton>
            <SplitButtonLayout.TrailingButton>
              <SplitButtonTrailingButton
                checked={printMenu}
                onCheckedChange={(v) => {
                  setPrintMenu(v);
                  if (v) Toast.info("Receipt, label or kitchen ticket");
                }}
              >
                <Icon source={MI.arrowDown} contentDescription="Print options" />
              </SplitButtonTrailingButton>
            </SplitButtonLayout.TrailingButton>
          </SplitButtonLayout>
        </ComposeHost>
      </Demo>
      <Note>iOS: SwiftUI Button in glass and bordered styles; apps use NativeButton.</Note>
    </>
  );
}
