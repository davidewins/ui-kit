// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/Popover.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A small panel of extra detail opened from a button: a fee breakdown, why a
// payout is on hold, a store's hours. Read-only detail, never a form (that is
// a Sheet) and never the only place a fact lives.
// iOS: SwiftUI popover from a small glass button (on iPhone SwiftUI presents
// it as a sheet; on iPad it is a true popover with an arrow). Android: a
// Material 3 tonal button that opens a DropdownMenu panel holding the content.
//
// Children are React Native views; give them a fixed width.
import {
  DropdownMenu,
  FilledTonalButton,
  RNHostView as ComposeRNHostView,
  Text as ComposeText,
} from "@expo/ui/jetpack-compose";
import { Button, Popover as SwiftPopover, RNHostView } from "@expo/ui/swift-ui";
import { buttonBorderShape, buttonStyle, controlSize } from "@expo/ui/swift-ui/modifiers";
import type { ComponentProps, ReactElement } from "react";
import { useState } from "react";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "./NativeHost";

type SFSymbol = NonNullable<ComponentProps<typeof Button>["systemImage"]>;

export interface PopoverProps {
  /** Button text, e.g. "Fees". */
  label: string;
  systemImage?: SFSymbol;
  /** One React Native element: the panel content. */
  children: ReactElement;
}

export function Popover({ label, systemImage, children }: PopoverProps) {
  const [open, setOpen] = useState(false);

  if (Platform.OS === "ios") {
    return (
      <SwiftHost matchContents>
        <SwiftPopover isPresented={open} onIsPresentedChange={setOpen} arrowEdge="top">
          <SwiftPopover.Trigger>
            <Button
              label={label}
              systemImage={systemImage}
              onPress={() => setOpen(true)}
              modifiers={[buttonStyle("glass"), buttonBorderShape("capsule"), controlSize("small")]}
            />
          </SwiftPopover.Trigger>
          <SwiftPopover.Content>
            <RNHostView matchContents>{children}</RNHostView>
          </SwiftPopover.Content>
        </SwiftPopover>
      </SwiftHost>
    );
  }

  return (
    <ComposeHost matchContents>
      <DropdownMenu expanded={open} onDismissRequest={() => setOpen(false)}>
        <DropdownMenu.Trigger>
          <FilledTonalButton onClick={() => setOpen(true)}>
            <ComposeText>{label}</ComposeText>
          </FilledTonalButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <ComposeRNHostView matchContents>{children}</ComposeRNHostView>
        </DropdownMenu.Items>
      </DropdownMenu>
    </ComposeHost>
  );
}
