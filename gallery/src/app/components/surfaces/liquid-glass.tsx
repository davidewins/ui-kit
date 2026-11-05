import { Text, View } from "@/components/ui";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GlassEffectContainer, Host, HStack, Image as SFImage, Slider, Text as SwiftText } from "@expo/ui/swift-ui";
import { glassEffect, padding } from "@expo/ui/swift-ui/modifiers";
import { GlassContainer, GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Image } from "expo-image";
import { Heart, Share2, ShoppingBag } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";

const PHOTO = require("@/assets/images/glass-bg.jpeg");

/** A photo for the glass to refract, with content floating over it. */
function Stage({ children, height = 180 }: { children: ReactNode; height?: number }) {
  return (
    <View style={{ marginHorizontal: 16, height, borderRadius: 24, borderCurve: "continuous", overflow: "hidden" }}>
      <Image source={PHOTO} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 16 }}>{children}</View>
    </View>
  );
}

const PILL = { borderRadius: 999, paddingHorizontal: 22, height: 48, alignItems: "center" as const, justifyContent: "center" as const };

// Liquid Glass on iOS 26 (expo-glass-effect + @expo/ui). Older phones get
// GlassView's plain fallback, which is why the kit wraps it in GlassSurface.
export default function GlassScreen() {
  const [gap, setGap] = useState(0.3);
  if (!isLiquidGlassAvailable()) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Liquid Glass needs iOS 26. This phone gets the BlurView fallback (see Surfaces).</Text>
      </View>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 64 }}>
      <SectionTitle>Regular and clear</SectionTitle>
      <Stage>
        <GlassView glassEffectStyle="regular" style={PILL}>
          <Text weight="semibold">Regular</Text>
        </GlassView>
        <GlassView glassEffectStyle="clear" style={PILL}>
          <Text weight="semibold" style={{ color: "#fff" }}>Clear</Text>
        </GlassView>
      </Stage>

      <SectionTitle>Tinted</SectionTitle>
      <Stage>
        <GlassView glassEffectStyle="regular" tintColor="rgba(0,0,0,0.55)" style={PILL}>
          <Text weight="semibold" style={{ color: "#fff" }}>Black tint</Text>
        </GlassView>
        <GlassView glassEffectStyle="regular" tintColor="rgba(220,38,38,0.6)" style={PILL}>
          <Text weight="semibold" style={{ color: "#fff" }}>Red tint (status only)</Text>
        </GlassView>
      </Stage>

      <SectionTitle>Interactive (press and hold)</SectionTitle>
      <Stage>
        <GlassView glassEffectStyle="regular" isInteractive style={[PILL, { height: 56, paddingHorizontal: 28 }]}>
          <Text weight="semibold">Touch me</Text>
        </GlassView>
      </Stage>

      <SectionTitle>GlassContainer: shapes merge as they get close</SectionTitle>
      <Stage height={200}>
        <GlassContainer spacing={24} style={{ flexDirection: "row", gap: 4 + gap * 60 }}>
          <GlassView glassEffectStyle="regular" isInteractive style={styles.circle}>
            <Heart size={22} color="#000" strokeWidth={1.8} />
          </GlassView>
          <GlassView glassEffectStyle="regular" isInteractive style={styles.circle}>
            <Share2 size={22} color="#000" strokeWidth={1.8} />
          </GlassView>
          <GlassView glassEffectStyle="regular" isInteractive style={styles.circle}>
            <ShoppingBag size={22} color="#000" strokeWidth={1.8} />
          </GlassView>
        </GlassContainer>
      </Stage>
      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <Host matchContents={{ vertical: true }}>
          <Slider value={gap} onValueChange={setGap} />
        </Host>
      </View>

      <SectionTitle>SwiftUI glassEffect in a GlassEffectContainer</SectionTitle>
      <Stage>
        <Host matchContents>
          <GlassEffectContainer spacing={20}>
            <HStack spacing={10}>
              <SwiftText modifiers={[padding({ horizontal: 18, vertical: 12 }), glassEffect({ glass: { variant: "regular", interactive: true }, shape: "capsule" })]}>
                Pickup
              </SwiftText>
              <SwiftText modifiers={[padding({ horizontal: 18, vertical: 12 }), glassEffect({ glass: { variant: "regular", interactive: true }, shape: "capsule" })]}>
                Delivery
              </SwiftText>
              <SFImage systemName="bag.fill" modifiers={[padding({ all: 14 }), glassEffect({ glass: { variant: "regular", interactive: true }, shape: "circle" })]} />
            </HStack>
          </GlassEffectContainer>
        </Host>
      </Stage>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  circle: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
});
