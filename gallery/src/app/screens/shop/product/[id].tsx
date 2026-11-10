import { Badge, Text, View } from "@/components/ui";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Chip } from "@/components/ui/inputs/Chip";
import { Carousel } from "@/components/ui/lists/Carousel";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { PRODUCTS, productById, euro } from "@/gallery/demo/data";
import { DemoScreen, GUTTER, PhotoGrid, PhotoTile, RADIUS, TitleBlock, useStates } from "@/gallery/demo/parts";
import { priceLine } from "@/gallery/demo/shop";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { RotateCcw, Ruler, Truck } from "lucide-react-native";
import { useState } from "react";
import { useWindowDimensions } from "react-native";

const STATES = ["In stock", "Sold out"] as const;

// Product: swipeable photos, name and price, size chips, delivery and returns
// rows, and Add to bag in the footer (enabled once a size is picked).
export default function Product() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = productById(id);
  const { state, bar } = useStates(STATES);
  const [size, setSize] = useState<string | null>(null);
  const soldOut = state === "Sold out" || p.stock === "Sold out";
  const needsSize = !!p.sizes && !size;
  const photos = p.photos.length > 1 ? p.photos : [p.photos[0], p.photos[0]];

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
        bar={bar}
        footer={
          soldOut ? (
            <InsetFooter primaryCta={{ label: "Tell me when it's back", onPress: () => Toast.success("We'll email you when it's back") }} />
          ) : (
            <InsetFooter
              primaryCta={{
                label: needsSize ? "Choose a size" : `Add to bag, ${euro(p.price)}`,
                disabled: needsSize,
                onPress: () => {
                  haptic("success");
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
          renderItem={(src) => <Image source={src} style={{ flex: 1, borderRadius: RADIUS }} contentFit="cover" />}
        />
        <TitleBlock title={p.name} subtitle={p.colour} figure={priceLine(p)} />
        <View style={{ marginHorizontal: 20, marginTop: -8, marginBottom: 18, flexDirection: "row", gap: 8 }}>
          <Badge variant={soldOut ? "error" : p.stock === "Low stock" ? "warning" : "success"}>{soldOut ? "Sold out" : p.stock}</Badge>
        </View>

        {p.sizes ? (
          <>
            <SectionTitle>Size (EU)</SectionTitle>
            <View style={{ marginHorizontal: GUTTER, marginBottom: 18, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {p.sizes.map((s) => (
                <Chip key={s} label={s} selected={size === s} disabled={soldOut} onPress={() => setSize(s)} />
              ))}
            </View>
          </>
        ) : null}

        <Text weight="medium" style={{ fontSize: 15, lineHeight: 22, color: colors.muted, marginHorizontal: 20, marginBottom: 18 }}>{p.description}</Text>

        <SettingsGroup>
          <SettingsRow label="Free delivery over €50" Icon={Truck} trailing="2 to 3 days" />
          <SettingsRow label="Free returns" Icon={RotateCcw} trailing="30 days" />
          {p.sizes ? <SettingsRow label="Size guide" Icon={Ruler} navigates onPress={() => Toast.info("Size guide")} /> : null}
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
