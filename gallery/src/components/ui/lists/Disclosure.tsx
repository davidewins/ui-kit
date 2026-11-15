// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/lists/Disclosure.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A titled block that opens to show more: an order's item list, allergens,
// "How payouts work". Remixed from @expo/ui's universal Collapsible.
// iOS: SwiftUI DisclosureGroup (system chevron and animation).
// Android: a Material 3 ListItem header with a rotating arrow and an
// AnimatedVisibility body, the expressive expandable-list pattern.
//
// A plain-text body (an FAQ answer) renders as native Text, so SwiftUI /
// Compose size it on the first frame and the open animates as the system's
// own does. A React Native body goes through RNHostView, which is measured
// after the group opens: the group grows twice, the bounce David saw on
// Help & Support (14 Nov). Use text wherever the body is text.
// Controlled when `open` is passed.
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
import { font, foregroundStyle, padding as swiftPadding } from "@expo/ui/swift-ui/modifiers";
import { useFontFamily } from "@/hooks/useFontFamily";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import type { ReactElement } from "react";
import { useState } from "react";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "../native/NativeHost";

const ARROW = require("../../../assets/icons/keyboard_arrow_down.xml");
const ENTER = EnterTransition.expandVertically().plus(EnterTransition.fadeIn());
const EXIT = ExitTransition.shrinkVertically().plus(ExitTransition.fadeOut());

export interface DisclosureProps {
  title: string;
  /** The body: a string (native text, preferred) or one React Native element. */
  children: string | ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export function Disclosure({ title, children, open, onOpenChange, defaultOpen = false }: DisclosureProps) {
  // The app's chosen font (Appearance), not a fixed Geist: SwiftUI finds a
  // loaded font by its registered name.
  const fontFamily = useFontFamily();
  const colors = useThemeColors();
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
            <Text modifiers={[font({ family: fontFamily("medium"), size: 15 })]}>{title}</Text>
          </DisclosureGroup.Label>
          {typeof children === "string" ? (
            <Text
              modifiers={[
                font({ family: fontFamily("medium"), size: 15 }),
                foregroundStyle(colors.muted),
                swiftPadding({ top: 4 }),
              ]}
            >
              {children}
            </Text>
          ) : (
            <RNHostView matchContents={{ vertical: true }}>{children}</RNHostView>
          )}
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
            {typeof children === "string" ? (
              <ComposeText color={colors.muted} style={{ fontFamily: "Geist-Medium", fontSize: 15 }}>{children}</ComposeText>
            ) : (
              <ComposeRNHostView matchContents={{ vertical: true }}>{children}</ComposeRNHostView>
            )}
          </Column>
        </AnimatedVisibility>
      </Column>
    </ComposeHost>
  );
}
