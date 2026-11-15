// The one row for header buttons (headerLeft / headerRight). David, 15 Nov:
// "give some breathing room to the headers ... its own rule or component in
// zesty that ur locked to". iOS 26 draws one glass capsule around everything
// in a header side; px-1 keeps 4pt more room between the capsule's edge and
// the outer icons, gap-1 the same between icons (RIDERS' header spacing).
// Children are HeaderIconButton / HeaderTextButton / a SwiftUI menu Host.
// ui-kit check fails a header side that renders a raw <View> row instead.
import { View } from "@/components/ui";
import type { ReactNode } from "react";

export function HeaderActions({ children }: { children: ReactNode }) {
  return <View className="flex-row items-center gap-1 px-1">{children}</View>;
}
