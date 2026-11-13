// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/actions/Menu.tsx. Edit it there and sync; local edits fail ui-kit:check.
// An in-content menu button: "Sort: Newest", "Prep time: 15 min", a row's
// "Move to". The header "..." menu is ActionMenu, not this.
// iOS: SwiftUI Menu in a small glass capsule. Android: a Material 3 tonal
// button that opens a DropdownMenu. Items with `selected` show as a
// single-choice list (checkmark on iOS, selectable items on Android).
import {
  DropdownMenu,
  DropdownMenuItem,
  FilledTonalButton,
  SelectableDropdownMenuItem,
  Text as ComposeText,
} from "@expo/ui/jetpack-compose";
import { Button, Menu as SwiftMenu } from "@expo/ui/swift-ui";
import { buttonBorderShape, buttonStyle, controlSize } from "@expo/ui/swift-ui/modifiers";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "../native/NativeHost";

type SFSymbol = NonNullable<ComponentProps<typeof Button>["systemImage"]>;

export interface MenuItem {
  label: string;
  /** iOS glyph. */
  systemImage?: SFSymbol;
  destructive?: boolean;
  /** Set on every item to make the menu a single choice. */
  selected?: boolean;
  onPress: () => void;
}

export interface MenuProps {
  /** The button text, e.g. "Newest first". */
  label: string;
  systemImage?: SFSymbol;
  items: readonly MenuItem[];
}

export function Menu({ label, systemImage, items }: MenuProps) {
  const colors = useThemeColors();
  const [open, setOpen] = useState(false);
  const choose = (item: MenuItem) => {
    haptic("selection");
    setOpen(false);
    item.onPress();
  };

  if (Platform.OS === "ios") {
    return (
      <SwiftHost matchContents>
        <SwiftMenu
          label={label}
          systemImage={systemImage}
          modifiers={[buttonStyle("glass"), buttonBorderShape("capsule"), controlSize("small")]}
        >
          {items.map((item, i) => (
            <Button
              key={`${i}-${item.label}`}
              label={item.label}
              systemImage={item.selected ? "checkmark" : item.systemImage}
              role={item.destructive ? "destructive" : "default"}
              onPress={() => choose(item)}
            />
          ))}
        </SwiftMenu>
      </SwiftHost>
    );
  }

  const single = items.some((i) => i.selected !== undefined);
  return (
    <ComposeHost matchContents>
      <DropdownMenu expanded={open} onDismissRequest={() => setOpen(false)}>
        <DropdownMenu.Trigger>
          <FilledTonalButton onClick={() => setOpen(true)}>
            <ComposeText>{label}</ComposeText>
          </FilledTonalButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          {items.map((item, i) =>
            single ? (
              <SelectableDropdownMenuItem key={`${i}-${item.label}`} selected={!!item.selected} onClick={() => choose(item)}>
                <SelectableDropdownMenuItem.Text>
                  <ComposeText>{item.label}</ComposeText>
                </SelectableDropdownMenuItem.Text>
              </SelectableDropdownMenuItem>
            ) : (
              <DropdownMenuItem
                key={`${i}-${item.label}`}
                onClick={() => choose(item)}
                elementColors={item.destructive ? { textColor: colors.error } : undefined}
              >
                <DropdownMenuItem.Text>
                  <ComposeText>{item.label}</ComposeText>
                </DropdownMenuItem.Text>
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenu.Items>
      </DropdownMenu>
    </ComposeHost>
  );
}
