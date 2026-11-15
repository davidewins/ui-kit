// The one row for header buttons (headerLeft / headerRight). David, 15 Nov:
// "give some breathing room to the headers ... its own rule or component in
// zesty that ur locked to". iOS 26 draws one glass capsule around everything
// in a header side; with two or more buttons px-1 keeps 4pt more room between
// the capsule's edge and the outer icons, gap-1 the same between icons
// (RIDERS' header spacing). One button gets no extra room: its capsule stays
// the round one iOS draws (David, 15 Nov: Schedule's lone + was "too fat").
// Children are HeaderIconButton / HeaderTextButton / HeaderMenuButton.
// ui-kit check fails a header side that renders a raw <View> row instead.
import { View } from "@/components/ui";
import { Children, type ReactNode } from "react";

export function HeaderActions({ children }: { children: ReactNode }) {
  // Children.toArray drops null/false, so a button hidden by a condition
  // does not count.
  if (Children.toArray(children).length < 2) return <>{children}</>;
  return <View className="flex-row items-center gap-1 px-1">{children}</View>;
}
