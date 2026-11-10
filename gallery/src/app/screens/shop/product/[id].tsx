import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Gauge } from "@/components/ui/feedback/Gauge";
import { Carousel } from "@/components/ui/lists/Carousel";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { PRODUCTS, productById, euro } from "@/gallery/demo/data";
import { Avatar, DataTable, DemoScreen, GUTTER, MEDIA_INSET, MediaRow, MetricGrid, PhotoGrid, PhotoTile, RADIUS, TitleBlock, useStates } from "@/gallery/demo/parts";
import { priceLine } from "@/gallery/demo/shop";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";

const STATES = ["In stock", "Sold out"] as const;

/** Pairs left per size, cycled across the size run. */
const SIZE_STOCK = [4, 2, 6, 8, 1, 5, 3, 0];
const RATING = {
  avg: "4.6",
  count: 212,
  split: [
    { stars: 5, share: 0.71 },
    { stars: 4, share: 0.18 },
    { stars: 3, share: 0.06 },
    { stars: 2, share: 0.03 },
    { stars: 1, share: 0.02 },
  ],
};
const REVIEWS = [
  { name: "Ciara Walsh", title: "Light and fast, fits true", size: "39", fit: "true to size", stars: 5 },
  { name: "Liam Kearney", title: "Great on tempo days", size: "44", fit: "slightly narrow", stars: 4 },
  { name: "Orla Dunne", title: "Comfy all day at work", size: "38", fit: "true to size", stars: 5 },
];

function specsFor(p: { category: string; colour: string }): [string, string][] {
  return p.category === "Running" || p.category === "Lifestyle"
    ? [["Weight (EU 42)", "268 g"], ["Heel to toe drop", "8 mm"], ["Stack height", "38 / 30 mm"], ["Upper", "Engineered knit"], ["Colour", p.colour], ["Made in", "Vietnam"]]
    : [["Weight", "254 g"], ["Battery", "40 h"], ["Charging", "USB-C, 10 min = 5 h"], ["Colour", p.colour], ["Warranty", "2 years"]];
}

// Product: swipeable photos, name and price, size chips, delivery and returns
// rows, and Add to bag in the footer (enabled once a size is picked).
export default function Product() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = productById(id);
  const { state } = useStates(STATES);
  const [size, setSize] = useState<string | null>(null);
  const soldOut = state === "Sold out" || p.stock === "Sold out";
  const needsSize = !!p.sizes && !size;
  const photos = p.photos.length > 1 ? p.photos : [p.photos[0], p.photos[0]];
  // Four sizes a row, edge to edge.
  const cell = Math.floor((width - GUTTER * 2 - 6 * 3) / 4);

  return (
    <>
      <ActionMenu
        accessibilityLabel="Product actions"
        actions={[
          { label: "Save for later", systemImage: "heart", onPress: () => Toast.success("Saved") },
          { label: "Share", systemImage: "square.and.arrow.up", onPress: () => Toast.success("Link copied") },
        ]}
      />
      <DemoScreen
        footer={
          soldOut ? (
            <InsetFooter primaryCta={{ label: "Tell me when it's back", onPress: () => Toast.success("We'll email you when it's back") }} />
          ) : (
            <InsetFooter
              primaryCta={{
                label: needsSize ? "Choose a size" : `Add to bag, ${euro(p.price)}`,
                disabled: needsSize,
                onPress: () => {
                  Toast.success(`${p.name}${size ? `, size ${size}` : ""} added to your bag`);
                },
              }}
            />
          )
        }
      >
        <Carousel
          data={photos}
          keyExtractor={(_, i) => String(i)}
          itemWidth={width - GUTTER * 2 - 24}
          height={300}
          renderItem={(src, i) => {
            const photo = <Image source={src} style={{ flex: 1, borderRadius: RADIUS, borderCurve: "continuous" }} contentFit="cover" />;
            // Only the first photo is the zoom target, so a tile lands on it.
            return i === 0 ? <Link.AppleZoomTarget>{photo}</Link.AppleZoomTarget> : photo;
          }}
        />
        <TitleBlock title={p.name} subtitle={`${p.colour}, ${p.category}`} figure={priceLine(p)} />
        <View style={{ marginHorizontal: GUTTER, marginBottom: 12, flexDirection: "row", gap: 6 }}>
          <Badge variant={soldOut ? "error" : p.stock === "Low stock" ? "warning" : "success"}>{soldOut ? "Sold out" : p.stock}</Badge>
          <Badge>{`${RATING.avg} from ${RATING.count} reviews`}</Badge>
          {!soldOut ? <Badge>Delivered tomorrow</Badge> : null}
        </View>

        {p.sizes ? (
          <>
            <SectionTitle>{size ? `Size ${size} (EU)` : "Size (EU)"}</SectionTitle>
            <View style={{ marginHorizontal: GUTTER, marginBottom: 18, flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {p.sizes.map((sz, i) => {
                const left = soldOut ? 0 : SIZE_STOCK[i % SIZE_STOCK.length];
                const on = size === sz;
                return (
                  <Pressable
                    key={sz}
                    disabled={left === 0}
                    onPress={() => setSize(sz)}
                    accessibilityRole="button"
                    accessibilityLabel={`Size ${sz}, ${left ? `${left} left` : "sold out"}`}
                    accessibilityState={{ selected: on, disabled: left === 0 }}
                    style={{ width: cell, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: on ? colors.tint : colors.surface, opacity: left ? 1 : 0.4 }}
                  >
                    <Text weight="semibold" style={{ fontSize: 15, color: on ? colors.onTint : colors.text, fontVariant: ["tabular-nums"] }}>{sz}</Text>
                    <Text weight="medium" style={{ fontSize: 11, color: on ? colors.onTint : left && left <= 2 ? colors.warning : colors.muted }}>
                      {left ? (left <= 2 ? `${left} left` : "In stock") : "Sold out"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        <MetricGrid
          items={[
            { label: "Delivery", value: "Free", delta: "Tomorrow by 13:00", good: true },
            { label: "Collect", value: "2 h", delta: "Grafton Street", good: true },
            { label: "Returns", value: "30", unit: "days" },
          ]}
        />

        <Text weight="medium" style={{ fontSize: 15, lineHeight: 21, color: colors.muted, marginHorizontal: GUTTER, marginBottom: 6 }}>{p.description}</Text>

        <SectionTitle>Details</SectionTitle>
        <DataTable dense columns={[{ key: "k", label: "Spec" }, { key: "v", label: "", width: 170 }]} rows={specsFor(p).map(([k, v]) => ({ k, v }))} />

        <SectionTitle>{`Reviews, ${RATING.avg} average`}</SectionTitle>
        <View style={{ marginHorizontal: GUTTER, marginBottom: 12, gap: 6 }}>
          {RATING.split.map((r) => (
            <Gauge key={r.stars} variant="bar" label={`${r.stars} stars`} value={r.share} valueLabel={`${Math.round(r.share * RATING.count)}`} />
          ))}
        </View>
        <SettingsGroup separatorInset={MEDIA_INSET}>
          {REVIEWS.map((r) => (
            <MediaRow key={r.name} leading={<Avatar name={r.name} />} title={r.title} subtitle={`${r.name}, size ${r.size}, ${r.fit}`} trailing={`${r.stars}/5`} />
          ))}
        </SettingsGroup>

        <SectionTitle>You might like</SectionTitle>
        <PhotoGrid
          data={PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 2)}
          keyOf={(x) => x.id}
          render={(x, w) => <PhotoTile image={x.photos[0]} title={x.name} subtitle={priceLine(x)} width={w} href={`/screens/shop/product/${x.id}`} />}
        />
      </DemoScreen>
    </>
  );
}
