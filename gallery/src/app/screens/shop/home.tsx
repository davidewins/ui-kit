import { Text, View } from "@/components/ui";
import { LoadErrorState } from "@/components/LoadErrorState";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { Chip } from "@/components/ui/inputs/Chip";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { BASKET, PRODUCTS } from "@/gallery/demo/data";
import { priceLine, stockBadge } from "@/gallery/demo/shop";
import { ChipRow, DemoScreen, GUTTER, PhotoGrid, PhotoTile, RADIUS, useStates } from "@/gallery/demo/parts";
import { Skeleton } from "@/components/ui/feedback/Skeleton";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { Stack, router } from "expo-router";
import { Search, ShoppingBag } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { SkeletonTitle, SkeletonPhotoGrid } from "@/gallery/demo/skeletons";

const CATEGORIES = ["All", "Running", "Lifestyle", "Audio", "Accessories"] as const;
const STATES = ["Loaded", "Loading", "Offline"] as const;
const FEATURED = PRODUCTS.find((p) => p.id === "aero")!;

// Shop home: Search and Bag in the header, category chips, one featured
// product, then everything in a two-up grid.
export default function ShopHome() {
  const { state } = useStates(STATES);
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const shown = PRODUCTS.filter((p) => cat === "All" || p.category === cat);
  const inBag = BASKET.reduce((n, l) => n + l.qty, 0);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 4 }}>
              <HeaderIconButton icon={Search} accessibilityLabel="Search" onPress={() => Toast.info("Search")} />
              <HeaderIconButton icon={ShoppingBag} badge={inBag} accessibilityLabel={`Bag, ${inBag} items`} onPress={() => router.push("/screens/shop/basket")} />
            </View>
          ),
        }}
      />
      <DemoScreen scroll={state !== "Offline"}>
        {state === "Offline" ? (
          <LoadErrorState title="You're offline" message="We couldn't load the shop. Check your connection and try again." onRetry={() => Toast.info("Retrying")} />
        ) : (
          <>
            <ChipRow>
              {CATEGORIES.map((c) => (
                <Chip key={c} label={c} selected={cat === c} onPress={() => setCat(c)} />
              ))}
            </ChipRow>
            {state === "Loading" ? (
              <>
                {cat === "All" ? <Skeleton height={220} radius={RADIUS} style={{ marginHorizontal: GUTTER, marginBottom: 18 }} /> : null}
                <SkeletonTitle />
                <SkeletonPhotoGrid count={4} />
              </>
            ) : (
              <>
                {cat === "All" ? <Featured /> : null}
                <SectionTitle>{cat === "All" ? "New in" : cat}</SectionTitle>
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

/** One wide photo with the offer under it. */
function Featured() {
  return (
    <Pressable
      onPress={() => router.push(`/screens/shop/product/${FEATURED.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${FEATURED.name}, ${priceLine(FEATURED)}`}
      style={({ pressed }) => ({ marginHorizontal: GUTTER, marginBottom: 8, opacity: pressed ? 0.85 : 1 })}
    >
      <Image source={FEATURED.photos[0]} style={{ height: 220, borderRadius: RADIUS }} contentFit="cover" />
      <View style={{ paddingHorizontal: 4, paddingTop: 12, gap: 2 }}>
        <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4 }}>Aero Knit, now €109</Text>
        <Text weight="medium" className="text-muted" style={{ fontSize: 15 }}>€30 off until Sunday, while sizes last</Text>
      </View>
    </Pressable>
  );
}
