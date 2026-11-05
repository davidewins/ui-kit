// Share a link (a storefront, an order's tracking page, a referral code).
// iOS: SwiftUI ShareLink in a small glass capsule, which opens the system
// share sheet with a rich preview. Android: a Material 3 tonal button that
// opens the Android share sheet through React Native's Share API.
import { FilledTonalButton, Text as ComposeText } from "@expo/ui/jetpack-compose";
import { Label, ShareLink as SwiftShareLink } from "@expo/ui/swift-ui";
import { buttonBorderShape, buttonStyle, controlSize } from "@expo/ui/swift-ui/modifiers";
import { Platform, Share } from "react-native";
import { ComposeHost, SwiftHost } from "./NativeHost";

export interface ShareLinkProps {
  /** The URL that is shared. */
  url: string;
  /** Button text. */
  label?: string;
  /** Subject line (mail) and the message sent with the link. */
  subject?: string;
  message?: string;
}

export function ShareLink({ url, label = "Share", subject, message }: ShareLinkProps) {
  if (Platform.OS === "ios") {
    return (
      <SwiftHost matchContents>
        <SwiftShareLink
          item={url}
          subject={subject}
          message={message}
          modifiers={[buttonStyle("glass"), buttonBorderShape("capsule"), controlSize("small")]}
        >
          <Label title={label} systemImage="square.and.arrow.up" />
        </SwiftShareLink>
      </SwiftHost>
    );
  }

  return (
    <ComposeHost matchContents>
      <FilledTonalButton
        onClick={() => {
          Share.share({ title: subject, message: message ? `${message} ${url}` : url }).catch(() => {});
        }}
      >
        <ComposeText>{label}</ComposeText>
      </FilledTonalButton>
    </ComposeHost>
  );
}
