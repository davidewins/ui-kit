import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { ShareLink } from "@/components/ui/actions/ShareLink";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { Popover } from "@/components/ui/overlays/Popover";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { PhotoCard } from "@/components/ui/surfaces/PhotoCard";
import { DemoScreen } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { ITEMS, PRODUCT, eur } from "./data";
import { GUTTER } from "./parts";

const GALLERY_HREF = "/screens/orders/product-gallery";
const STORY_URL = "https://runlab.example/stories/trail-mix";
const PAIR_WIDTH = 156;

// The same shoe sold as a story, the way Nike's member pages and Aesop do
// it: one tall photo carrying the name and price on glass, the reason it
// exists in two paragraphs on a panel, four numbers on another, and what to
// wear it with. Long press one of those for bag, save and share.
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

        <Panel style={{ marginTop: 12, rowGap: 12 }}>
          <Text weight="semibold" accessibilityRole="header" style={TYPE.title}>{PRODUCT.headline}</Text>
          {PRODUCT.story.map((p) => (
            <Text key={p} weight="medium" style={TYPE.body}>{p}</Text>
          ))}
          <View style={{ flexDirection: "row", marginTop: 2 }}>
            <ShareLink url={STORY_URL} label="Share the story" message={`${PRODUCT.name}: ${PRODUCT.headline}`} />
          </View>
        </Panel>

        <Panel style={{ marginTop: 12 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {PRODUCT.specs.map((s, i) => (
              <View key={s.label} style={{ width: "50%", paddingTop: i > 1 ? 14 : 0, paddingBottom: 14, rowGap: 1, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
                <Text weight="semibold" style={[TYPE.title, TABULAR]}>{s.value}</Text>
                <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{s.label}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", marginTop: 14 }}>
            <Popover label="How recycled is counted" systemImage="info.circle">
              <View style={{ width: 280, padding: 16, rowGap: 8 }}>
                <Text weight="medium" style={TYPE.body}>It is the share of the upper, by weight, that came off last season's cutting room floor.</Text>
                <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>The suede, mesh and webbing are offcuts. The foam stack and the rubber cupsole are new, so they are not in the figure.</Text>
              </View>
            </Popover>
          </View>
        </Panel>

        <SectionHeader title={`${PRODUCT.pairs.length} things it pairs with`} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, columnGap: 10 }}>
          {PRODUCT.pairs.map((id) => {
            const item = ITEMS[id];
            return (
              <View key={id} style={{ width: PAIR_WIDTH }}>
                <ContextMenu
                  actions={[
                    { label: "Add to bag", systemImage: "bag.badge.plus", onPress: () => Toast.success(`${item.name} added to your bag`) },
                    { label: "Save for later", systemImage: "heart", onPress: () => Toast.success("Saved") },
                    { label: "Share", systemImage: "square.and.arrow.up", onPress: () => Toast.info("Link ready to share") },
                  ]}
                >
                  <PhotoCard compact source={item.photo} title={item.name} subtitle={item.colour} figure={eur(item.price)} width={PAIR_WIDTH} height={200} onPress={() => Toast.info(item.name)} />
                </ContextMenu>
              </View>
            );
          })}
        </ScrollView>
      </DemoScreen>
    </>
  );
}
