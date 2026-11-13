// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/actions/ContextMenu.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Long-press actions on a piece of content (an order row, a product tile).
// iOS: SwiftUI ContextMenu (lifts the content, blurs the page, UIMenu with SF
// Symbols). Android: a Material 3 DropdownMenu anchored to the content,
// opened by a long press.
//
// Children are ordinary React Native views. Long press is a shortcut, never
// the only way to reach an action: keep each one on the detail screen too.
import {
  DropdownMenu,
  DropdownMenuItem,
  RNHostView as ComposeRNHostView,
  Text as ComposeText,
} from "@expo/ui/jetpack-compose";
import { Button, ContextMenu as SwiftContextMenu, RNHostView } from "@expo/ui/swift-ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import type { ComponentProps, ReactElement } from "react";
import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { ComposeHost, SwiftHost } from "../native/NativeHost";

type SFSymbol = NonNullable<ComponentProps<typeof Button>["systemImage"]>;

export interface ContextMenuAction {
  label: string;
  /** iOS glyph. */
  systemImage?: SFSymbol;
  destructive?: boolean;
  onPress: () => void;
}

export interface ContextMenuProps {
  actions: readonly ContextMenuAction[];
  /** One React Native element: the content that is long-pressed. */
  children: ReactElement;
  /** Tap (not long press) on the content, e.g. open the order. */
  onPress?: () => void;
}

export function ContextMenu({ actions, children, onPress }: ContextMenuProps) {
  const colors = useThemeColors();
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const run = (a: ContextMenuAction) => {
    setOpen(false);
    a.onPress();
  };

  if (Platform.OS === "ios") {
    // Inside the SwiftUI host the React Native content is laid out at its
    // natural width, so a row with long text ran past its panel instead of
    // wrapping (seen on the iOS simulator, 10 Nov). The outer view takes the
    // parent's width in normal layout and hands it to the content as a fixed
    // width. Give the child padding, not margins: a margin on the child still
    // pushed its row past the edge.
    //
    // The height goes the other way: React Native measures the content and
    // the host is given that height outright. Sizing the host from SwiftUI
    // (matchContents + boundedByHost) measured it at 0 before the content was
    // drawn, so every row collapsed and stacked on the next (device, 11 Nov).
    return (
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width ? (
          <SwiftHost style={{ height }}>
            <SwiftContextMenu>
              <SwiftContextMenu.Items>
                {actions.map((a, i) => (
                  <Button
                    key={`${i}-${a.label}`}
                    label={a.label}
                    systemImage={a.systemImage}
                    role={a.destructive ? "destructive" : "default"}
                    onPress={() => run(a)}
                  />
                ))}
              </SwiftContextMenu.Items>
              <SwiftContextMenu.Trigger>
                <RNHostView matchContents={{ vertical: true }}>
                  <View style={{ width }} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
                    {onPress ? <Pressable onPress={onPress}>{children}</Pressable> : children}
                  </View>
                </RNHostView>
              </SwiftContextMenu.Trigger>
            </SwiftContextMenu>
          </SwiftHost>
        ) : null}
      </View>
    );
  }

  return (
    <ComposeHost matchContents={{ vertical: true }}>
      <DropdownMenu expanded={open} onDismissRequest={() => setOpen(false)}>
        <DropdownMenu.Trigger>
          {/* RN owns touches inside an RNHostView, so the long press is an RN Pressable. */}
          <ComposeRNHostView matchContents={{ vertical: true }}>
            <Pressable
              onPress={onPress}
              onLongPress={() => {
                haptic("medium");
                setOpen(true);
              }}
            >
              {children}
            </Pressable>
          </ComposeRNHostView>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          {actions.map((a, i) => (
            <DropdownMenuItem
              key={`${i}-${a.label}`}
              onClick={() => run(a)}
              elementColors={a.destructive ? { textColor: colors.error } : undefined}
            >
              <DropdownMenuItem.Text>
                <ComposeText>{a.label}</ComposeText>
              </DropdownMenuItem.Text>
            </DropdownMenuItem>
          ))}
        </DropdownMenu.Items>
      </DropdownMenu>
    </ComposeHost>
  );
}
