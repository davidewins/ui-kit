import { View } from "@/components/ui";
import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Card, Column, ElevatedCard, OutlinedCard, Surface, Text as MText } from "@expo/ui/jetpack-compose";
import { fillMaxWidth, paddingAll } from "@expo/ui/jetpack-compose/modifiers";
import { HStack, Text, VStack } from "@expo/ui/swift-ui";
import { background, font, frame, padding, shapes } from "@expo/ui/swift-ui/modifiers";
import { Image } from "expo-image";
import { useState } from "react";

const PHOTO = require("@/assets/images/glass-bg.jpeg");

// Platform surfaces, for reference. ZESTY's one look is Card, Card raised and
// Tile (see "Card, Tile and glass"), the same on both platforms.
export default function MaterialSurfacesPage() {
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: background() with a material ShapeStyle. Apps use Card / Card raised / Tile from "@/components/ui".'
          : 'Compose: import { Card, ElevatedCard, OutlinedCard, Surface } from "@expo/ui/jetpack-compose". Apps use Card / Card raised / Tile.'
      }
    >
      {isIOS ? <SwiftMaterials /> : <ComposeCards />}
    </DemoPage>
  );
}

function SwiftMaterials() {
  const tile = (m: "ultraThin" | "thin" | "regular" | "thick", label: string) => (
    <VStack modifiers={[frame({ width: 72, height: 72 }), background({ type: "material", material: m }, shapes.roundedRectangle({ cornerRadius: 16, roundedCornerStyle: "continuous" }))]}>
      <Text modifiers={[font({ family: "Geist-Medium", size: 12 })]}>{label}</Text>
    </VStack>
  );
  return (
    <>
      <Demo title="Materials over a photo">
        <View style={{ height: 120, borderRadius: 24, borderCurve: "continuous", overflow: "hidden", justifyContent: "center" }}>
          <Image source={PHOTO} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" />
          <SwiftHost matchContents>
            <HStack spacing={10} modifiers={[padding({ horizontal: 12 })]}>
              {tile("ultraThin", "Ultra thin")}
              {tile("thin", "Thin")}
              {tile("regular", "Regular")}
              {tile("thick", "Thick")}
            </HStack>
          </SwiftHost>
        </View>
      </Demo>
      <Note>Android: Compose Card, ElevatedCard, OutlinedCard and Surface. Apps use the kit Card on both.</Note>
    </>
  );
}

function ComposeCards() {
  const colors = useThemeColors();
  const [picked, setPicked] = useState(false);
  const body = (title: string, sub: string) => (
    <Column modifiers={[paddingAll(16)]}>
      <MText style={{ fontFamily: "Geist-SemiBold", fontSize: 15 }}>{title}</MText>
      <MText color={colors.muted}>{sub}</MText>
    </Column>
  );
  return (
    <>
      <Demo title="Card, ElevatedCard, OutlinedCard">
        <ComposeHost matchContents={{ vertical: true }}>
          <Column verticalArrangement={{ spacedBy: 12 }}>
            <Card modifiers={[fillMaxWidth()]}>{body("Today", "38 orders, €912.40")}</Card>
            <ElevatedCard modifiers={[fillMaxWidth()]}>{body("This week", "241 orders, €5,880.10")}</ElevatedCard>
            <OutlinedCard modifiers={[fillMaxWidth()]}>{body("Payout", "€1,284.60 on Monday")}</OutlinedCard>
          </Column>
        </ComposeHost>
      </Demo>
      <Demo title="Surface (selectable)">
        <ComposeHost matchContents={{ vertical: true }}>
          <Surface
            selected={picked}
            onClick={() => {
              setPicked((p) => !p);
              Toast.info(picked ? "Collection" : "Delivery");
            }}
            border={{ width: picked ? 2 : 1, color: picked ? colors.text : colors.border }}
            modifiers={[fillMaxWidth()]}
          >
            {body(picked ? "Delivery selected" : "Collection selected", "Tap to switch")}
          </Surface>
        </ComposeHost>
      </Demo>
      <Note>iOS: SwiftUI material backgrounds. Apps use the kit Card on both.</Note>
    </>
  );
}
