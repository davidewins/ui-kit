// Gallery-only: brand marks for the demo apps (card networks, couriers).
// Card marks are VOID's own card-icons; the courier mark is drawn here.
import { Text, View } from "@/components/ui";
import { Image } from "expo-image";
import { Platform, Share } from "react-native";
import { Toast } from "@/lib/toast";

const CARDS = {
  visa: require("@/assets/images/brands/VisaBlue.png"),
  mastercard: require("@/assets/images/brands/Mastercard.png"),
  applepay: require("@/assets/images/brands/ApplePay.png"),
} as const;

export function CardMark({ brand, size = 40 }: { brand: keyof typeof CARDS; size?: number }) {
  return <Image source={CARDS[brand]} style={{ width: size, height: size }} contentFit="contain" />;
}

const COURIERS = {
  DPD: { bg: "#DC0032", fg: "#fff", label: "dpd" },
  "An Post": { bg: "#00704A", fg: "#FFD100", label: "post" },
} as const;

export function CourierMark({ courier, size = 40 }: { courier: keyof typeof COURIERS; size?: number }) {
  const c = COURIERS[courier];
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.28, borderCurve: "continuous", backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}>
      <Text weight="bold" style={{ color: c.fg, fontSize: size * 0.36, letterSpacing: -0.6 }}>{c.label}</Text>
    </View>
  );
}

/** Copy to the clipboard. expo-clipboard is native: a dev build made before
 *  it was added has no module, so fall back to the share sheet (Copy is its
 *  first action there). */
export async function copyText(text: string, what: string) {
  try {
    const Clipboard = require("expo-clipboard") as typeof import("expo-clipboard");
    await Clipboard.setStringAsync(text);
    Toast.success(`${what} copied`);
  } catch {
    Share.share(Platform.OS === "ios" ? { message: text } : { message: text, title: what }).catch(() => {});
  }
}
