// Pull-to-refresh with a haptic (David, 6 Nov: "every refresh control should
// have haptic"). Drop-in for react-native's RefreshControl: same props, one
// light impact the moment the pull triggers a refresh.
//
// The spinner shows only for a pull the user made, until that refresh is done
// (David, 15 Nov: after editing opening hours and going back the spinner sat
// stuck half pulled, as on Orders). Screens pass TanStack's isRefetching as
// `refreshing`, and that is true for every background refetch too (an
// invalidate after a save, refetch on focus, a poll); iOS then draws a spinner
// nobody pulled and can leave it stuck. So `refreshing` is only read while a
// pull is in flight: the pull ends when onRefresh's promise settles, or when
// `refreshing` goes true then false, or after 10 s at most.
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  RefreshControl as RNRefreshControl,
  type RefreshControlProps,
} from "react-native";

const MAX_PULL_MS = 10_000;

export function RefreshControl({ onRefresh, refreshing, ...props }: RefreshControlProps) {
  const [pulling, setPulling] = useState(false);
  const sawRefreshing = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const end = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    sawRefreshing.current = false;
    setPulling(false);
  };

  useEffect(() => {
    if (!pulling) return;
    if (refreshing) sawRefreshing.current = true;
    else if (sawRefreshing.current) end();
  }, [refreshing, pulling]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <RNRefreshControl
      {...props}
      refreshing={pulling}
      onRefresh={
        onRefresh
          ? () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              sawRefreshing.current = false;
              setPulling(true);
              timer.current = setTimeout(end, MAX_PULL_MS);
              const result: unknown = (onRefresh as () => unknown)();
              if (result && typeof (result as Promise<unknown>).then === "function") {
                (result as Promise<unknown>).then(end, end);
              }
            }
          : undefined
      }
    />
  );
}
