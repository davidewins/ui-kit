import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { ShareLink } from "@/components/ui/actions/ShareLink";
import { Chip } from "@/components/ui/inputs/Chip";
import { Carousel } from "@/components/ui/lists/Carousel";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { Popover } from "@/components/ui/overlays/Popover";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { router } from "expo-router";
import { RotateCcw, Star, Store, Truck } from "lucide-react-native";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { PRODUCT, RATING, REVIEWS, SHOP, eur } from "./data";
import { GUTTER, LEAD, Row, RowPanel } from "./parts";

const EDITORIAL_HREF = "/screens/orders/product-editorial";
const PRODUCT_URL = "https://runlab.example/p/trail-mix";
const PHOTO_HEIGHT = 420;
/** EU size to UK and US, for the size guide. */
const SIZE_GUIDE: Record<string, string> = { "38": "UK 5, US 6", "39": "UK 6, US 7", "40": "UK 6.5, US 7.5", "41": "UK 7, US 8", "42": "UK 8, US 9", "43": "UK 9, US 10", "44": "UK 9.5, US 10.5", "45": "UK 10.5, US 11.5" };

// A product page led by its photos, the way Nike and Zara sell a shoe: swipe
// the shots, pick a size from chips that say what is left, see how it gets to
// you, read what buyers thought, and add it from the footer. The name, the
// ways to get it and the reviews are panels; the size chips stay on the page.
// The size guide opens as a popover and a long press on a review marks it
// helpful or reports it.
export default function ProductGallery() {
  const colors = useThemeColors();
  const hues = useHues();
  const { width } = useWindowDimensions();
  const [size, setSize] = useState<string | null>(null);
  const picked = PRODUCT.sizes.find((s) => s.eu === size);
  const itemWidth = width - GUTTER * 2 - 24;

  const shot = (s: (typeof PRODUCT.shots)[number]) => <Shot key={s.label} shot={s} width={itemWidth} />;

  return (
    <>
      <ActionMenu
        accessibilityLabel="Product actions"
        actions={[
          { label: "Save for later", systemImage: "heart", onPress: () => Toast.success("Saved") },
          { label: "Share", systemImage: "square.and.arrow.up", onPress: () => Toast.info("Link ready to share") },
          { label: "Read the story", systemImage: "book", onPress: () => router.push(EDITORIAL_HREF) },
        ]}
      />
      <DemoScreen
        footer={
          <InsetFooter
            primaryCta={{
              label: picked ? `Add EU ${picked.eu} to bag, ${eur(PRODUCT.price)}` : "Choose a size",
              disabled: !picked,
              onPress: () => Toast.success(`${PRODUCT.name}, EU ${size} added to your bag`),
            }}
          />
        }
      >
        {Platform.OS === "web" ? (
          // Browser preview only: the kit Carousel is SwiftUI and Compose.
          <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={itemWidth + 12} decelerationRate="fast" contentContainerStyle={{ paddingHorizontal: GUTTER, columnGap: 12 }}>
            {PRODUCT.shots.map(shot)}
          </ScrollView>
        ) : (
          <Carousel data={PRODUCT.shots} keyExtractor={(s) => s.label} itemWidth={itemWidth} height={PHOTO_HEIGHT} renderItem={shot} />
        )}

        <Panel style={{ marginTop: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 12 }}>
            <Text weight="semibold" accessibilityRole="header" numberOfLines={1} style={[TYPE.title, { flex: 1 }]}>{PRODUCT.name}</Text>
            <Text weight="semibold" style={[TYPE.title, TABULAR]}>{eur(PRODUCT.price)}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6, marginTop: 6 }}>
            <Text weight="medium" numberOfLines={1} style={[TYPE.body, { flex: 1, color: colors.muted }]}>{`${PRODUCT.line}, ${PRODUCT.colour.toLowerCase()}`}</Text>
            <Star size={13} color={hues.yellow} fill={hues.yellow} />
            <Text weight="medium" style={[TYPE.body, TABULAR, { color: colors.muted }]}>{`${RATING.avg} from ${RATING.count}`}</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 14 }}>
            <ShareLink url={PRODUCT_URL} label="Share" message={`${PRODUCT.name} at ${SHOP.name}, ${eur(PRODUCT.price)}:`} />
          </View>
        </Panel>

        <SectionHeader title={picked ? `Size EU ${picked.eu}` : "Size"} />
        {/* Chips stay on the page: their fill is the card colour in dark mode, so on a panel they would vanish. */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: GUTTER }}>
          {PRODUCT.sizes.map((s) => (
            <Chip
              key={s.eu}
              label={s.left === 0 ? `${s.eu} sold out` : s.left <= 2 ? `${s.eu} · ${s.left} left` : s.eu}
              selected={size === s.eu}
              disabled={s.left === 0}
              onPress={() => setSize(s.eu)}
            />
          ))}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8, paddingHorizontal: GUTTER, marginTop: 12 }}>
          <Badge variant={picked && picked.left <= 2 ? "warning" : "success"}>{picked && picked.left <= 2 ? "Low stock" : "In stock"}</Badge>
          <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { flex: 1, color: colors.muted }]}>
            {picked ? `${picked.left} ${picked.left === 1 ? "pair" : "pairs"} of EU ${picked.eu} at ${SHOP.street}` : "7 of 8 sizes, fits true to size"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: GUTTER, marginTop: 14 }}>
          <Popover label="Size guide" systemImage="ruler">
            <View style={{ width: 260, padding: 16, rowGap: 6 }}>
              {PRODUCT.sizes.map((s) => (
                <View key={s.eu} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text weight={s.eu === size ? "semibold" : "medium"} style={[TYPE.body, TABULAR]}>{`EU ${s.eu}`}</Text>
                  <Text weight={s.eu === size ? "semibold" : "medium"} style={[TYPE.body, TABULAR]}>{SIZE_GUIDE[s.eu]}</Text>
                </View>
              ))}
            </View>
          </Popover>
        </View>

        <SectionHeader title="Getting it" />
        <RowPanel>
          <Row leading={<IconTile Icon={Truck} color={hues.green} size={LEAD} />} title="Free delivery tomorrow" sub="Order in the next 2 h 14 min, DPD Predict" />
          <Row leading={<IconTile Icon={Store} color={hues.blue} size={LEAD} />} title="Collect today from 16:00" sub={`${SHOP.name}, ${SHOP.street}, open until 19:00`} />
          <Row leading={<IconTile Icon={RotateCcw} color={hues.orange} size={LEAD} />} title="Free returns for 30 days" sub="Post it back or drop it to the shop" />
        </RowPanel>

        <SectionHeader title="Ratings and reviews" action={{ label: "See all", onPress: () => Toast.info("All reviews") }} />
        <Panel>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 16 }}>
            <View style={{ alignItems: "center", width: 88 }}>
              <Text weight="semibold" style={[TYPE.numeral, TABULAR]}>{RATING.avg}</Text>
              <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>out of 5</Text>
            </View>
            <View style={{ flex: 1, rowGap: 3 }}>
              {RATING.split.map((share, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
                  <Text weight="medium" numberOfLines={1} style={[TYPE.caption, { color: colors.muted, width: 56, textAlign: "right" }]}>{"★".repeat(5 - i)}</Text>
                  <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border, overflow: "hidden" }}>
                    <View style={{ width: `${share * 100}%`, height: 4, backgroundColor: colors.text }} />
                  </View>
                </View>
              ))}
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, textAlign: "right", marginTop: 2 }]}>{`${RATING.count} ratings`}</Text>
            </View>
          </View>
        </Panel>
        <Panel flush style={{ marginTop: 12 }}>
          {REVIEWS.map((r, i) => (
            <ContextMenu
              key={r.name}
              actions={[
                { label: "Helpful", systemImage: "hand.thumbsup", onPress: () => Toast.success(`Thanks, ${r.name.split(" ")[0]} will see that`) },
                { label: "Report review", systemImage: "flag", destructive: true, onPress: () => Toast.info("Review reported") },
              ]}
            >
              <View style={{ marginLeft: 16, paddingRight: 16, paddingVertical: 14, rowGap: 4, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
                <Text weight="semibold" numberOfLines={1} style={TYPE.body}>{r.title}</Text>
                <View accessible accessibilityLabel={`${r.stars} out of 5 stars, ${r.name}, EU ${r.size}, ${r.fit}, ${r.date}`} style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
                  <View style={{ flexDirection: "row", columnGap: 1 }}>
                    {Array.from({ length: 5 }, (_, n) => (
                      <Star key={n} size={12} color={n < r.stars ? hues.yellow : colors.border} fill={n < r.stars ? hues.yellow : colors.border} />
                    ))}
                  </View>
                  <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { flex: 1, color: colors.muted }]}>{`${r.name}, EU ${r.size}, ${r.fit}, ${r.date}`}</Text>
                </View>
                <Text weight="medium" style={TYPE.body}>{r.body}</Text>
              </View>
            </ContextMenu>
          ))}
        </Panel>
      </DemoScreen>
    </>
  );
}

/** One crop of the product photo: zoomed, with the given point kept centred. */
function Shot({ shot, width }: { shot: (typeof PRODUCT.shots)[number]; width: number }) {
  const colors = useThemeColors();
  // Size the photo to cover the frame, then zoom and slide it, clamped to its edges.
  const cover = Math.max(width / PRODUCT.photoRatio, PHOTO_HEIGHT);
  const h = cover * shot.zoom;
  const w = h * PRODUCT.photoRatio;
  const left = Math.min(0, Math.max(width - w, width / 2 - shot.x * w));
  const top = Math.min(0, Math.max(PHOTO_HEIGHT - h, PHOTO_HEIGHT / 2 - shot.y * h));
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={`${PRODUCT.name}, ${shot.label}`} style={{ width, height: PHOTO_HEIGHT, borderRadius: 28, borderCurve: "continuous", overflow: "hidden", backgroundColor: colors.border }}>
      <Image source={PRODUCT.photo} style={{ position: "absolute", left, top, width: w, height: h }} contentFit="cover" />
    </View>
  );
}
