import { View } from "@/components/ui";
import { LAB_PHOTOS } from "@/gallery/motion/data";
import { LabHeader } from "@/gallery/motion/parts";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image as RNImage, StyleSheet, useWindowDimensions } from "react-native";
import Transition from "react-native-screen-transitions";

// The photo viewer, on black. The photo is the zoom's matching boundary, so
// the tile grows exactly into it. Drag any way or pinch in to send it back.
export default function LabPhoto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const src = LAB_PHOTOS[Number(id) || 0];
  // The photo at its own aspect ratio, full width: a viewer never crops.
  const { width: w = 1, height: h = 1 } = RNImage.resolveAssetSource(src) ?? {};
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Transition.Boundary id={`photo-${id}`}>
          <Image source={src} style={{ width, height: width * (h / w) }} contentFit="contain" />
        </Transition.Boundary>
      </View>
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <LabHeader onDark />
      </View>
    </View>
  );
}
