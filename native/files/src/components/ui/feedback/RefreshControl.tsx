// Pull-to-refresh with a haptic (David, 6 Nov: "every refresh control should
// have haptic"). Drop-in for react-native's RefreshControl: same props, one
// light impact the moment the pull triggers a refresh.
import * as Haptics from "expo-haptics";
import {
  RefreshControl as RNRefreshControl,
  type RefreshControlProps,
} from "react-native";

export function RefreshControl({ onRefresh, ...props }: RefreshControlProps) {
  return (
    <RNRefreshControl
      {...props}
      onRefresh={
        onRefresh
          ? () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onRefresh();
            }
          : undefined
      }
    />
  );
}
