import { Pressable, Text, View } from "@/apps/sellers/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useGroupSurface } from "@/gallery/groupStyle";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ProductBar } from "./ProductBar";
import { SectionTitle } from "./SectionTitle";
import { compactNum, eur } from "./utils";

export function StorefrontList({
  items,
}: {
  items: {
    id: string;
    name: string;
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    isActive: boolean;
  }[];
}) {
  const colors = useThemeColors();
  const { cardInGutter } = useGroupSurface({ raised: true });
  const maxRev = Math.max(...items.map((s) => s.totalRevenue), 1);

  return (
    <View className="px-4">
      <SectionTitle text="Storefronts" />
      <View
        style={cardInGutter(16)}
      >
        {items.map((s, i) => {
          const pct = (s.totalRevenue / maxRev) * 100;
          return (
            <View key={s.id}>
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  router.push(`/analytics/storefront/${s.id}`);
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.55 : 1 })}
              >
                <View className="px-4 py-3">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2 flex-1 mr-3">
                      <View
                        className="w-8 h-8 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.text + "0F" }}
                      >
                        <Text
                          weight="bold"
                          className="text-xs"
                          style={{ color: colors.text }}
                        >
                          {s.name.charAt(0)}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          weight="semibold"
                          className="text-sm"
                          numberOfLines={1}
                          style={{ color: colors.text, letterSpacing: -0.2 }}
                        >
                          {s.name}
                        </Text>
                        <Text
                          className="text-[11px]"
                          style={{ color: colors.muted }}
                        >
                          {compactNum(s.totalOrders)} orders
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text
                        weight="bold"
                        className="text-sm"
                        style={{ color: colors.text, letterSpacing: -0.3 }}
                      >
                        {eur(s.totalRevenue / 100)}
                      </Text>
                      <SymbolView
                        name="chevron.right"
                        size={11}
                        tintColor={colors.muted}
                        weight="bold"
                        fallback={null}
                      />
                    </View>
                  </View>
                  <ProductBar pct={pct} />
                </View>
              </Pressable>
              {i < items.length - 1 && (
                <View
                  className="h-px"
                  style={{ backgroundColor: colors.border, marginLeft: 56 }}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
