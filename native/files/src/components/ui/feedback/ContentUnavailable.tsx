// The platform's own "nothing here" view: no results for a search, no
// orders yet, a store with no menu. Say what is missing and give the next
// action (DESIGN.md §2). For illustrated empty states use EmptyState.
// iOS: SwiftUI ContentUnavailableView (SF Symbol, title, description, action).
// Android: the same content as a centred Material 3 column with a filled button.
import { Button as ComposeButton, Column, Text as ComposeText } from "@expo/ui/jetpack-compose";
import { fillMaxWidth, paddingAll } from "@expo/ui/jetpack-compose/modifiers";
import { Button, ContentUnavailableView } from "@expo/ui/swift-ui";
import { buttonBorderShape, buttonStyle, tint } from "@expo/ui/swift-ui/modifiers";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ComponentProps } from "react";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "../native/NativeHost";

type SFSymbol = NonNullable<ComponentProps<typeof Button>["systemImage"]>;

export interface ContentUnavailableProps {
  /** What is missing: "No orders yet". */
  title: string;
  /** Why, and what happens next: "New orders show up here as they come in." */
  body: string;
  /** iOS glyph. */
  systemImage?: SFSymbol;
  action?: { label: string; onPress: () => void };
}

export function ContentUnavailable({ title, body, systemImage, action }: ContentUnavailableProps) {
  const colors = useThemeColors();

  if (Platform.OS === "ios") {
    return (
      <SwiftHost matchContents={{ vertical: true }}>
        <ContentUnavailableView
          title={title}
          systemImage={systemImage}
          description={body}
          actions={
            action ? (
              <Button
                label={action.label}
                onPress={action.onPress}
                modifiers={[buttonStyle("glassProminent"), buttonBorderShape("capsule"), tint(colors.text)]}
              />
            ) : undefined
          }
        />
      </SwiftHost>
    );
  }

  return (
    <ComposeHost matchContents={{ vertical: true }}>
      <Column
        horizontalAlignment="center"
        verticalArrangement={{ spacedBy: 8 }}
        modifiers={[fillMaxWidth(), paddingAll(24)]}
      >
        <ComposeText style={{ fontFamily: "Geist-SemiBold", fontSize: 20, textAlign: "center" }}>{title}</ComposeText>
        <ComposeText color={colors.muted} style={{ fontFamily: "Geist-Medium", fontSize: 15, textAlign: "center" }}>
          {body}
        </ComposeText>
        {action ? (
          <ComposeButton onClick={action.onPress}>
            <ComposeText>{action.label}</ComposeText>
          </ComposeButton>
        ) : null}
      </Column>
    </ComposeHost>
  );
}
