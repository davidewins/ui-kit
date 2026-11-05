import { ContentUnavailable } from "@/components/ui/ContentUnavailable";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { Toast } from "@/lib/toast";

export default function ContentUnavailablePage() {
  return (
    <DemoPage usage='import { ContentUnavailable } from "@/components/ui/ContentUnavailable". iOS: SwiftUI ContentUnavailableView. For illustrated empty states use EmptyState.'>
      <Demo title="No results">
        <ContentUnavailable
          systemImage="magnifyingglass"
          title={'No stores match "ramen"'}
          body="Try another dish, or widen your delivery area."
          action={{ label: "Widen area", onPress: () => Toast.success("Showing stores within 10 km") }}
        />
      </Demo>
      <Demo title="Nothing yet">
        <ContentUnavailable
          systemImage="bag"
          title="No orders yet"
          body="New orders show up here as they come in. Share your store to get the first one."
          action={{ label: "Share store", onPress: () => Toast.success("Store link copied") }}
        />
      </Demo>
      <Demo title="Offline (no action)">
        <ContentUnavailable systemImage="wifi.slash" title="You're offline" body="Orders will load again when you're back online." />
      </Demo>
      <Note>{isIOS ? "Android: the same content as a centred Compose column with a filled button." : "iOS: SwiftUI ContentUnavailableView."}</Note>
    </DemoPage>
  );
}
