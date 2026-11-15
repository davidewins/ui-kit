// A native SwiftUI menu as a header button (Filter and the like). The SwiftUI
// Host has no padding of its own, so next to a HeaderIconButton its glyph sat
// against the capsule edge (David, 15 Nov: Orders' Filter "doesnt have much
// space"). Same 32pt box and px-2 as HeaderIconButton. iOS only: the children
// are an @expo/ui/swift-ui Menu.
import { View } from "@/components/ui";
import { Host } from "@expo/ui/swift-ui";
import type { ReactNode } from "react";

export function HeaderMenuButton({ children }: { children: ReactNode }) {
  return (
    <View className="px-2" style={{ height: 32, justifyContent: "center" }}>
      <Host matchContents>{children}</Host>
    </View>
  );
}
