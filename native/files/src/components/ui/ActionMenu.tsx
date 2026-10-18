// The "..." menu: a header button (or inline glyph) that opens a list of
// actions. iOS renders SwiftUI's Menu, so it gets the native pull-down with
// SF Symbols and the red destructive style; elsewhere a HeaderIconButton that
// opens an Alert list.
//
// For a header: <Stack.Screen options={{ headerRight: () => <ActionMenu ... /> }} />
import { useThemeColors } from "@/hooks/useThemeColors";
import { Button, Host, Image, Menu } from "@expo/ui/swift-ui";
import { accessibilityLabel as a11yLabel } from "@expo/ui/swift-ui/modifiers";
import { Ellipsis, type LucideIcon } from "lucide-react-native";
import type { ComponentProps } from "react";
import { Alert, Platform } from "react-native";
import { HeaderIconButton } from "./HeaderIconButton";

export type SFSymbolName = NonNullable<ComponentProps<typeof Image>["systemName"]>;

export interface MenuAction {
  label: string;
  /** iOS menu glyph. */
  systemImage?: SFSymbolName;
  destructive?: boolean;
  onPress: () => void;
}

export interface ActionMenuProps {
  actions: readonly MenuAction[];
  accessibilityLabel: string;
  /** Title shown on the fallback Alert. */
  title?: string;
  /** iOS trigger glyph. */
  systemImage?: SFSymbolName;
  /** Non-iOS trigger glyph. */
  icon?: LucideIcon;
}

export function ActionMenu({
  actions,
  accessibilityLabel,
  title,
  systemImage = "ellipsis",
  icon = Ellipsis,
}: ActionMenuProps) {
  const colors = useThemeColors();

  if (Platform.OS === "ios") {
    return (
      <Host matchContents>
        <Menu
          label={<Image systemName={systemImage} size={18} color={colors.tint} />}
          modifiers={[a11yLabel(accessibilityLabel)]}
        >
          {actions.map((a) => (
            <Button
              key={a.label}
              label={a.label}
              systemImage={a.systemImage}
              role={a.destructive ? "destructive" : undefined}
              onPress={a.onPress}
            />
          ))}
        </Menu>
      </Host>
    );
  }

  return (
    <HeaderIconButton
      icon={icon}
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
  );
}
