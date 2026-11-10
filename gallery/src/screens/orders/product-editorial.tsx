import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { PhotoCard } from "@/components/ui/surfaces/PhotoCard";
import { DemoScreen } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { ITEMS, PRODUCT, eur } from "./data";
import { GUTTER } from "./parts";

const GALLERY_HREF = "/screens/orders/product-gallery";

// The same shoe sold as a story, the way Nike's member pages and Aesop do
// it: one tall photo carrying the name and price on glass, the reason it
// exists in two paragraphs, four numbers, and what to wear it with.
export default function ProductEditorial() {
  const colors = useThemeColors();

  return (
    <>
      <ActionMenu
        accessibilityLabel="Product actions"
        actions={[
          { label: "Save for later", systemImage: "heart", onPress: () => Toast.success("Saved") },
          { label: "Share", systemImage: "square.and.arrow.up", onPress: () => Toast.info("Link ready to share") },
        ]}
      />
      <DemoScreen footer={<InsetFooter primaryCta={{ label: "Choose a size", onPress: () => router.push(GALLERY_HREF) }} />}>
        <View style={{ paddingHorizontal: GUTTER }}>
          <PhotoCard
            source={PRODUCT.photo}
            title={PRODUCT.name}
            subtitle={`${PRODUCT.line}, 7 sizes in stock`}
            figure={eur(PRODUCT.price)}
            height={470}
            badge={<Badge>New this week</Badge>}
          />
        </View>

        <View style={{ paddingHorizontal: GUTTER, paddingTop: 24, rowGap: 12 }}>
          <Text weight="semibold" accessibilityRole="header" style={TYPE.title}>{PRODUCT.headline}</Text>
          {PRODUCT.story.map((p) => (
            <Text key={p} weight="medium" style={TYPE.body}>{p}</Text>
          ))}
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: GUTTER, marginTop: 24, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
          {PRODUCT.specs.map((s) => (
            <View key={s.label} style={{ width: "50%", paddingVertical: 14, rowGap: 1, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
              <Text weight="semibold" style={[TYPE.title, TABULAR]}>{s.value}</Text>
              <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <SectionHeader title="Pairs with" count={PRODUCT.pairs.length} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, columnGap: 10 }}>
          {PRODUCT.pairs.map((id) => {
            const item = ITEMS[id];
            return (
              <PhotoCard
                key={id}
                compact
                source={item.photo}
                title={item.name}
                subtitle={item.colour}
                figure={eur(item.price)}
                width={156}
                height={200}
                onPress={() => Toast.info(item.name)}
              />
            );
          })}
        </ScrollView>
      </DemoScreen>
    </>
  );
}
