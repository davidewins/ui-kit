import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Chip } from "@/components/ui/inputs/Chip";
import { Carousel } from "@/components/ui/lists/Carousel";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
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
import { GUTTER, LEAD, Row, TEXT_INSET } from "./parts";

const EDITORIAL_HREF = "/screens/orders/product-editorial";
const PHOTO_HEIGHT = 420;

// A product page led by its photos, the way Nike and Zara sell a shoe: swipe
// the shots, pick a size from chips that say what is left, see how it gets to
// you, read what buyers thought, and add it from the footer.
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

        <View style={{ paddingHorizontal: GUTTER, paddingTop: 16, rowGap: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 12 }}>
            <Text weight="semibold" accessibilityRole="header" numberOfLines={1} style={[TYPE.title, { flex: 1 }]}>{PRODUCT.name}</Text>
            <Text weight="semibold" style={[TYPE.title, TABULAR]}>{eur(PRODUCT.price)}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
            <Text weight="medium" numberOfLines={1} style={[TYPE.body, { flex: 1, color: colors.muted }]}>{`${PRODUCT.line}, ${PRODUCT.colour.toLowerCase()}`}</Text>
            <Star size={13} color={hues.yellow} fill={hues.yellow} />
            <Text weight="semibold" style={[TYPE.body, TABULAR]}>{RATING.avg}</Text>
            <Text weight="medium" style={[TYPE.body, TABULAR, { color: colors.muted }]}>{`(${RATING.count})`}</Text>
          </View>
        </View>

        <SectionHeader title={picked ? `Size EU ${picked.eu}` : "Size"} action={{ label: "Size guide", onPress: () => Toast.info("EU 42 is UK 8, US 9") }} />
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

        <SectionHeader title="Getting it" />
        <SettingsGroup separatorInset={TEXT_INSET}>
          <Row leading={<IconTile Icon={Truck} color={hues.green} size={LEAD} />} title="Free delivery tomorrow" sub="Order in the next 2 h 14 min, DPD Predict" />
          <Row leading={<IconTile Icon={Store} color={hues.blue} size={LEAD} />} title="Collect today from 16:00" sub={`${SHOP.name}, ${SHOP.street}, open until 19:00`} />
          <Row leading={<IconTile Icon={RotateCcw} color={hues.orange} size={LEAD} />} title="Free returns for 30 days" sub="Post it back or drop it to the shop" />
        </SettingsGroup>

        <SectionHeader title="Ratings and reviews" count={RATING.count} action={{ label: "See all", onPress: () => Toast.info("All reviews") }} />
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 16, paddingHorizontal: GUTTER, marginBottom: 12 }}>
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
        <View style={{ paddingHorizontal: GUTTER }}>
          {REVIEWS.map((r) => (
            <View key={r.name} style={{ paddingVertical: 12, rowGap: 4, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
              <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 8 }}>
                <Text weight="semibold" numberOfLines={1} style={[TYPE.body, { flex: 1 }]}>{r.title}</Text>
                <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{r.date}</Text>
              </View>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>
                <Text style={{ color: colors.text }}>{"★".repeat(r.stars) + "☆".repeat(5 - r.stars)}</Text>
                {`  ${r.name}, EU ${r.size}, ${r.fit}`}
              </Text>
              <Text weight="medium" style={TYPE.body}>{r.body}</Text>
            </View>
          ))}
        </View>
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
