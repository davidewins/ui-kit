// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/ActionMenu.tsx. Edit it there and sync; local edits fail ui-kit:check.
// The header's right side: optional icon buttons, then the "..." menu.
// Render it in the screen body (NOT inside headerRight), anywhere in the tree:
//
//   <ActionMenu
//     accessibilityLabel="Product actions"
//     buttons={[{ label: "Edit", systemImage: "pencil", icon: Pencil, onPress: edit }]}
//     actions={[{ label: "Delete product", systemImage: "trash", destructive: true, onPress: confirmDelete }]}
//   />
//
// iOS uses expo-router's native header toolbar (Stack.Toolbar), the same
// mechanism as SELLERS analytics' date-range menu: a real UIMenu with SF
// Symbols and the red destructive style, drawn in the iOS 26 glass. (The old
// SwiftUI Menu hosted inside headerRight rendered but never opened.)
// Android sets headerRight to HeaderIconButtons; "..." opens an Alert list.
// The toolbar replaces the whole right side of the header, so anything else
// that belongs there (a Save text button) goes in `extra`, never headerRight.
import { Stack } from "expo-router";
import { Ellipsis, type LucideIcon } from "lucide-react-native";
import type { ComponentProps, ReactElement } from "react";
import { Alert, Platform } from "react-native";
import { HeaderIconButton } from "./HeaderIconButton";
import { View } from "./View";

export type SFSymbolName = NonNullable<ComponentProps<typeof Stack.Toolbar.Button>["icon"]> & string;

export interface MenuAction {
  label: string;
  /** iOS menu glyph. */
  systemImage?: SFSymbolName;
  destructive?: boolean;
  onPress: () => void;
}

export interface HeaderButton {
  /** Spoken label (the button shows only its icon). */
  label: string;
  /** iOS glyph. */
  systemImage: SFSymbolName;
  /** Android glyph. */
  icon: LucideIcon;
  onPress: () => void;
}

export interface ActionMenuProps {
  actions: readonly MenuAction[];
  accessibilityLabel: string;
  /** Title shown at the top of the menu / Android Alert. */
  title?: string;
  /** Icon buttons shown left of the "..." menu. */
  buttons?: readonly HeaderButton[];
  /** A custom header element shown first (e.g. a Save text button). */
  extra?: ReactElement;
}

export function ActionMenu({ actions, accessibilityLabel, title, buttons = [], extra }: ActionMenuProps) {
  if (Platform.OS === "ios") {
    return (
      <Stack.Toolbar placement="right">
        {extra ? <Stack.Toolbar.View>{extra}</Stack.Toolbar.View> : null}
        {buttons.map((b) => (
          <Stack.Toolbar.Button
            key={b.label}
            icon={b.systemImage}
            accessibilityLabel={b.label}
            onPress={b.onPress}
          />
        ))}
        {actions.length > 0 ? (
          <Stack.Toolbar.Menu icon="ellipsis" accessibilityLabel={accessibilityLabel} title={title}>
            {actions.map((a) => (
              <Stack.Toolbar.MenuAction
                key={a.label}
                icon={a.systemImage}
                destructive={a.destructive}
                onPress={a.onPress}
              >
                {a.label}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
        ) : null}
      </Stack.Toolbar>
    );
  }

  return (
    <Stack.Screen
      options={{
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            {extra}
            {buttons.map((b) => (
              <HeaderIconButton key={b.label} icon={b.icon} accessibilityLabel={b.label} onPress={b.onPress} />
            ))}
            {actions.length > 0 ? (
              <HeaderIconButton
                icon={Ellipsis}
                accessibilityLabel={accessibilityLabel}
                onPress={() =>
                  Alert.alert(title ?? accessibilityLabel, undefined, [
                    ...actions.map((a) => ({
                      text: a.label,
                      style: a.destructive ? ("destructive" as const) : ("default" as const),
                      onPress: a.onPress,
                    })),
                    { text: "Cancel", style: "cancel" as const },
                  ])
                }
              />
            ) : null}
          </View>
        ),
      }}
    />
  );
}
