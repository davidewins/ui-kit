import { useThemeColors } from "@/hooks/useThemeColors";
import { View as RNView } from "react-native";

export const TABLET_MAX_WIDTH = 820;

export function TabletContainer({ children }: { children: React.ReactNode }) {
  const colors = useThemeColors();
  return (
    <RNView
      style={{ flex: 1, backgroundColor: colors.secondaryBackground }}
    >
      <RNView
        style={{
          flex: 1,
          width: "100%",
          maxWidth: TABLET_MAX_WIDTH,
          alignSelf: "center",
          backgroundColor: colors.background,
        }}
      >
        {children}
      </RNView>
    </RNView>
  );
}
