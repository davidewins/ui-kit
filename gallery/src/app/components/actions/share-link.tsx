import { View } from "@/components/ui";
import { ShareLink } from "@/components/ui/actions/ShareLink";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { STORE } from "@/gallery/demoData";

export default function ShareLinkPage() {
  return (
    <DemoPage usage='import { ShareLink } from "@/components/ui/actions/ShareLink"'>
      <Demo title="Share a storefront">
        <View style={{ flexDirection: "row" }}>
          <ShareLink url={STORE.url} label="Share store" subject={`${STORE.name} on VOID`} message={`Order from ${STORE.name} on VOID:`} />
        </View>
      </Demo>
      <Demo title="Share order tracking">
        <View style={{ flexDirection: "row" }}>
          <ShareLink url="https://void.ie/t/1042" label="Share tracking" message="Track order #1042:" />
        </View>
      </Demo>
      <Note>{isIOS ? "Android: a tonal button opening the Android share sheet." : "iOS: SwiftUI ShareLink opening the system share sheet."}</Note>
    </DemoPage>
  );
}
