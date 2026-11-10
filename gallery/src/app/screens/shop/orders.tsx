import { Badge, EmptyState } from "@/components/ui";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ART, SHOP_ORDERS, STATUS_BADGE, euro, productById } from "@/gallery/demo/data";
import { DemoScreen, MEDIA_INSET, MediaRow, useStates } from "@/gallery/demo/parts";
import { router } from "expo-router";
import { SkeletonTitle, SkeletonMediaRows } from "@/gallery/demo/skeletons";

const STATES = ["Loaded", "Loading", "Empty"] as const;

// Order history: one photo row per order, status as a badge, newest first.
export default function Orders() {
  const { state } = useStates(STATES);

  if (state === "Empty") {
    return (
      <DemoScreen scroll={false}>
        <EmptyState art={{ image: ART.box }} title="No orders yet" body="Your orders and their tracking show up here" action={{ label: "Start shopping", onPress: () => router.push("/screens/shop/home") }} />
      </DemoScreen>
    );
  }

  const active = SHOP_ORDERS.filter((o) => o.status === "Processing" || o.status === "On the way");
  const past = SHOP_ORDERS.filter((o) => o.status !== "Processing" && o.status !== "On the way");
  const rows = (list: readonly (typeof SHOP_ORDERS)[number][]) =>
    list.map((o) => (
      <MediaRow
        key={o.id}
        image={productById(o.items[0]).photos[0]}
        title={`#${o.id}, ${euro(o.total)}`}
        subtitle={`${o.placed}, ${o.items.length} ${o.items.length === 1 ? "item" : "items"}`}
        accessory={<Badge variant={STATUS_BADGE[o.status]}>{o.status}</Badge>}
        href={`/screens/shop/order/${o.id}`}
      />
    ));

  return (
    <DemoScreen>
      {state === "Loading" ? (
        <>
          <SkeletonTitle />
          <SkeletonMediaRows count={2} trailing="badge" />
          <SkeletonTitle />
          <SkeletonMediaRows count={2} trailing="badge" />
        </>
      ) : (
        <>
          <SectionTitle>In progress</SectionTitle>
          <SettingsGroup separatorInset={MEDIA_INSET}>{rows(active)}</SettingsGroup>
          <SectionTitle>Past orders</SectionTitle>
          <SettingsGroup separatorInset={MEDIA_INSET}>{rows(past)}</SettingsGroup>
        </>
      )}
    </DemoScreen>
  );
}
