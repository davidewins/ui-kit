import { EmptyState, Text, View } from "@/components/ui";
import { LoadErrorState } from "@/components/LoadErrorState";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { Chip } from "@/components/ui/inputs/Chip";
import { ART, BASKET, PRODUCTS } from "@/gallery/demo/data";
import { priceLine, stockBadge } from "@/gallery/demo/shop";
import { ChipRow, DemoScreen, GUTTER, PhotoGrid, PhotoTile, RADIUS, useStates, Section } from "@/gallery/demo/parts";
import { Skeleton } from "@/components/ui/feedback/Skeleton";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Link, Stack, router } from "expo-router";
import { ShoppingBag } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { SkeletonSection, SkeletonPhotoGrid } from "@/gallery/demo/skeletons";

const CATEGORIES = ["All", "Running", "Lifestyle", "Audio", "Accessories"] as const;
const STATES = ["Loaded", "Loading", "Couldn't load"] as const;
const FEATURED = PRODUCTS.find((p) => p.id === "aero")!;

// Shop home: Search and Bag in the header, category chips, one featured
// product, then everything in a two-up grid.
export default function ShopHome() {
  const { state } = useStates(STATES);
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const shown = PRODUCTS.filter((p) => (cat === "All" || p.category === cat) && (!query || `${p.name} ${p.colour} ${p.category}`.toLowerCase().includes(query)));
  const inBag = BASKET.reduce((n, l) => n + l.qty, 0);

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: { placeholder: "Search the shop", onChangeText: (e) => setQ(e.nativeEvent.text) },
          headerRight: () => (
            <HeaderIconButton icon={ShoppingBag} badge={inBag} accessibilityLabel={`Bag, ${inBag} items`} onPress={() => router.push("/screens/shop/basket")} />
          ),
        }}
      />
      <DemoScreen scroll={state !== "Couldn't load"}>
        {state === "Couldn't load" ? (
          <LoadErrorState title="Couldn't load the shop" message="We're having trouble reaching the shop right now. Check your connection and try again." onRetry={() => Toast.info("Retrying")} />
        ) : (
          <>
            <ChipRow>
              {CATEGORIES.map((c) => (
                <Chip key={c} label={c} selected={cat === c} onPress={() => setCat(c)} />
              ))}
            </ChipRow>
            {state === "Loading" ? (
              <>
                {cat === "All" ? <SkeletonFeatured /> : null}
                <SkeletonSection />
                <SkeletonPhotoGrid count={4} />
              </>
            ) : (
              <>
                {cat === "All" && !query ? <Featured /> : null}
                <Section title={query ? "Results" : cat === "All" ? "New in" : cat} art="shop" trailing={`${shown.length} items`} />
                {shown.length === 0 ? (
                  <EmptyState layout="inline" art={{ image: ART.magnifier }} title={`Nothing for "${q.trim()}"`} body="Check the spelling, or try another category" />
                ) : null}
                <PhotoGrid
                  data={shown}
                  keyOf={(p) => p.id}
                  render={(p, width) => (
                    <PhotoTile image={p.photos[0]} title={p.name} subtitle={priceLine(p)} width={width} href={`/screens/shop/product/${p.id}`} badge={stockBadge(p)} />
                  )}
                />
              </>
            )}
          </>
        )}
      </DemoScreen>
    </>
  );
}

/** One wide photo with the offer under it. Zooms into the product like the
 *  tiles do (SettingsRow's Link pattern), and press and hold peeks. */
function Featured() {
  const [pressed, setPressed] = useState(false);
  return (
    <Link href={`/screens/shop/product/${FEATURED.id}`} asChild>
      <Link.Trigger>
        <Pressable
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => Haptics.selectionAsync().catch(() => {})}
          accessibilityRole="link"
          accessibilityLabel={`${FEATURED.name}, ${priceLine(FEATURED)}`}
          style={{ marginHorizontal: GUTTER, marginBottom: 8, transform: [{ scale: pressed ? 0.98 : 1 }] }}
        >
          <Link.AppleZoom>
            <Image source={FEATURED.photos[0]} style={{ height: 220, borderRadius: RADIUS, borderCurve: "continuous" }} contentFit="cover" />
          </Link.AppleZoom>
          <View style={{ paddingTop: 12, gap: 2 }}>
            <Text weight="semibold" style={{ fontSize: 21, lineHeight: 26, letterSpacing: -0.4 }}>Aero Knit, now €109</Text>
            <Text weight="medium" className="text-muted" style={{ fontSize: 15, lineHeight: 20 }}>€30 off until Sunday, while sizes last</Text>
          </View>
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
    </Link>
  );
}

/** Featured's loading shape: the same photo and two caption lines. */
function SkeletonFeatured() {
  return (
    <View style={{ marginHorizontal: GUTTER, marginBottom: 8 }}>
      <Skeleton height={220} radius={RADIUS} />
      <View style={{ paddingTop: 12, gap: 2 }}>
        <View style={{ height: 26, justifyContent: "center" }}><Skeleton width="62%" height={17} radius={5} /></View>
        <View style={{ height: 20, justifyContent: "center" }}><Skeleton width="48%" height={12} radius={4} /></View>
      </View>
    </View>
  );
}
