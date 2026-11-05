import { Text, View } from "@/components/ui";
import { Carousel } from "@/components/ui/Carousel";
import { ComposeHost } from "@/components/ui/NativeHost";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { MENU, STORES } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  Box,
  HorizontalCenteredHeroCarousel,
  HorizontalUncontainedCarousel,
  Text as MText,
} from "@expo/ui/jetpack-compose";
import { background, fillMaxSize, height } from "@expo/ui/jetpack-compose/modifiers";
import { Image } from "expo-image";

const PHOTO = require("@/assets/images/glass-bg.jpeg");

export default function CarouselPage() {
  const colors = useThemeColors();
  return (
    <DemoPage usage='import { Carousel } from "@/components/ui/Carousel". iOS: SwiftUI ScrollView with view-aligned snapping. Android: Compose HorizontalMultiBrowseCarousel.'>
      <Demo title="Featured stores">
        <View style={{ marginHorizontal: -20 }}>
          <Carousel
            data={STORES}
            keyExtractor={(s) => s.name}
            itemWidth={240}
            height={180}
            renderItem={(s) => (
              <View style={{ flex: 1, borderRadius: 24, borderCurve: "continuous", overflow: "hidden" }}>
                <Image source={PHOTO} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" />
                <View style={{ flex: 1, justifyContent: "flex-end", padding: 14, backgroundColor: "rgba(0,0,0,0.35)" }}>
                  <Text weight="semibold" style={{ fontSize: 17, color: "#ffffff" }}>{s.name}</Text>
                  <Text weight="medium" style={{ fontSize: 13, color: "#ffffff" }}>{s.meta}</Text>
                </View>
              </View>
            )}
          />
        </View>
        <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>Swipe; each card snaps into place.</Text>
      </Demo>
      {isIOS ? <Note>Android: also HorizontalCenteredHeroCarousel and HorizontalUncontainedCarousel.</Note> : <MaterialCarousels />}
    </DemoPage>
  );
}

function MaterialCarousels() {
  const colors = useThemeColors();
  const card = (label: string) => (
    <Box key={label} contentAlignment="bottomStart" modifiers={[fillMaxSize(), background(colors.text)]}>
      <MText color={colors.background} style={{ fontFamily: "Geist-SemiBold", fontSize: 15 }}>{`  ${label}`}</MText>
    </Box>
  );
  return (
    <>
      <Demo title="HorizontalCenteredHeroCarousel">
        <ComposeHost style={{ height: 180 }}>
          <HorizontalCenteredHeroCarousel itemSpacing={8} modifiers={[height(180)]}>
            {MENU.map((m) => card(m.name))}
          </HorizontalCenteredHeroCarousel>
        </ComposeHost>
      </Demo>
      <Demo title="HorizontalUncontainedCarousel">
        <ComposeHost style={{ height: 140 }}>
          <HorizontalUncontainedCarousel itemWidth={160} itemSpacing={8} modifiers={[height(140)]}>
            {MENU.map((m) => card(m.price))}
          </HorizontalUncontainedCarousel>
        </ComposeHost>
      </Demo>
      <Note>iOS: a SwiftUI ScrollView that snaps to each card.</Note>
    </>
  );
}
