// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/Disclosure.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A titled block that opens to show more: an order's item list, allergens,
// "How payouts work". Remixed from @expo/ui's universal Collapsible.
// iOS: SwiftUI DisclosureGroup (system chevron and animation).
// Android: a Material 3 ListItem header with a rotating arrow and an
// AnimatedVisibility body, the expressive expandable-list pattern.
//
// Children are React Native views. Controlled when `open` is passed.
import {
  AnimatedVisibility,
  Column,
  EnterTransition,
  ExitTransition,
  Icon,
  ListItem,
  RNHostView as ComposeRNHostView,
  Text as ComposeText,
} from "@expo/ui/jetpack-compose";
import { animated, clickable, graphicsLayer, padding, spring } from "@expo/ui/jetpack-compose/modifiers";
import { DisclosureGroup, RNHostView, Text } from "@expo/ui/swift-ui";
import { font } from "@expo/ui/swift-ui/modifiers";
import { haptic } from "@/lib/haptics";
import type { ReactElement } from "react";
import { useState } from "react";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "./NativeHost";

const ARROW = require("../../assets/icons/keyboard_arrow_down.xml");
const ENTER = EnterTransition.expandVertically().plus(EnterTransition.fadeIn());
const EXIT = ExitTransition.shrinkVertically().plus(ExitTransition.fadeOut());

export interface DisclosureProps {
  title: string;
  /** One React Native element: the body. */
  children: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export function Disclosure({ title, children, open, onOpenChange, defaultOpen = false }: DisclosureProps) {
  const [own, setOwn] = useState(defaultOpen);
  const isOpen = open ?? own;
  const toggle = (next: boolean) => {
    haptic("selection");
    setOwn(next);
    onOpenChange?.(next);
  };

  if (Platform.OS === "ios") {
    return (
      <SwiftHost matchContents={{ vertical: true }}>
        <DisclosureGroup isExpanded={isOpen} onIsExpandedChange={toggle}>
          <DisclosureGroup.Label>
            <Text modifiers={[font({ family: "Geist-Medium", size: 15 })]}>{title}</Text>
          </DisclosureGroup.Label>
          <RNHostView matchContents={{ vertical: true }}>{children}</RNHostView>
        </DisclosureGroup>
      </SwiftHost>
    );
  }

  return (
    <ComposeHost matchContents={{ vertical: true }}>
      <Column>
        <ListItem colors={{ containerColor: "transparent" }} modifiers={[clickable(() => toggle(!isOpen))]}>
          <ListItem.HeadlineContent>
            <ComposeText style={{ fontFamily: "Geist-Medium", fontSize: 15 }}>{title}</ComposeText>
          </ListItem.HeadlineContent>
          <ListItem.TrailingContent>
            <Icon source={ARROW} modifiers={[graphicsLayer({ rotationZ: animated(isOpen ? 180 : 0, spring()) })]} />
          </ListItem.TrailingContent>
        </ListItem>
        <AnimatedVisibility visible={isOpen} enterTransition={ENTER} exitTransition={EXIT}>
          <Column modifiers={[padding(16, 0, 16, 16)]}>
            <ComposeRNHostView matchContents={{ vertical: true }}>{children}</ComposeRNHostView>
          </Column>
        </AnimatedVisibility>
      </Column>
    </ComposeHost>
  );
}
