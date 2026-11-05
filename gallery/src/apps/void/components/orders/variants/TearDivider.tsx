// The perforation the customer already likes: two circles cut into the card's
// side edges, filled with the page colour so the surface reads as torn, joined
// by a dashed line. Kept exactly as it shipped, lifted into its own file so all
// three variants tear the same way.
import { FC } from "react";
import { View } from "react-native";

export const TearDivider: FC<{
  /** The colour behind the card, so the notches read as holes. */
  pageColor: string;
  dashColor: string;
  /** Notch diameter. 22 is the shipped size. */
  size?: number;
}> = ({ pageColor, dashColor, size = 22 }) => (
  <View style={{ height: size, justifyContent: "center" }}>
    <View
      style={{
        position: "absolute",
        left: -size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: pageColor,
      }}
    />
    <View
      style={{
        position: "absolute",
        right: -size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: pageColor,
      }}
    />
    <View style={{ flexDirection: "row", marginHorizontal: 16, height: 1 }}>
      {Array.from({ length: 32 }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 1,
            backgroundColor: i % 2 === 0 ? dashColor : "transparent",
          }}
        />
      ))}
    </View>
  </View>
);
