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
import { Platform, Pressable } from "react-native";
import { ComposeHost, SwiftHost } from "./NativeHost";

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
  const run = (a: ContextMenuAction) => {
    setOpen(false);
    a.onPress();
  };

  if (Platform.OS === "ios") {
    return (
      <SwiftHost matchContents={{ vertical: true }}>
        <SwiftContextMenu>
          <SwiftContextMenu.Items>
            {actions.map((a) => (
              <Button
                key={a.label}
                label={a.label}
                systemImage={a.systemImage}
                role={a.destructive ? "destructive" : "default"}
                onPress={() => run(a)}
              />
            ))}
          </SwiftContextMenu.Items>
          <SwiftContextMenu.Trigger>
            <RNHostView matchContents={{ vertical: true }}>
              {onPress ? <Pressable onPress={onPress}>{children}</Pressable> : children}
            </RNHostView>
          </SwiftContextMenu.Trigger>
        </SwiftContextMenu>
      </SwiftHost>
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
          {actions.map((a) => (
            <DropdownMenuItem
              key={a.label}
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
