// Gallery-only: loading skeletons shaped like each demo page's real content
// (DESIGN.md §5.6: same row height, same separators, same edges), built from
// the kit Skeleton. One per row type the pages use.
import { View } from "@/components/ui";
import { Skeleton } from "@/components/ui/feedback/Skeleton";
import { SETTINGS_ROW } from "@/components/ui/lists/SettingsRow";
import { useThemeColors } from "@/hooks/useThemeColors";
import { StyleSheet, useWindowDimensions } from "react-native";
import { GUTTER, MEDIA_INSET } from "./parts";

const THUMB = 52;

function Hairline({ inset }: { inset: number }) {
  const colors = useThemeColors();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: inset }} />;
}

/** Two text lines at MediaRow's 15 / 13 sizes. */
function Lines({ first = "55%", second = "35%" }: { first?: `${number}%`; second?: `${number}%` }) {
  return (
    <View style={{ flex: 1, gap: 7 }}>
      <Skeleton width={first} height={13} radius={4} />
      <Skeleton width={second} height={11} radius={4} />
    </View>
  );
}

type Lead = "photo" | "avatar" | "time";

/** MediaRow-shaped rows: 72pt, photo / avatar / time column, two lines, an
 *  optional trailing figure or badge, hairlines from the text. */
export function SkeletonMediaRows({ count = 4, lead = "photo", trailing }: { count?: number; lead?: Lead; trailing?: "figure" | "badge" }) {
  return (
    <View style={{ marginBottom: 18 }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i}>
          {i > 0 ? <Hairline inset={MEDIA_INSET} /> : null}
          <View style={{ flexDirection: "row", alignItems: "center", minHeight: 72, paddingHorizontal: SETTINGS_ROW.paddingHorizontal, columnGap: SETTINGS_ROW.gap }}>
            {lead === "photo" ? (
              <Skeleton width={THUMB} height={THUMB} radius={14} />
            ) : lead === "avatar" ? (
              <Skeleton width={THUMB} height={THUMB} radius={THUMB / 2} />
            ) : (
              <View style={{ width: THUMB, gap: 7 }}>
                <Skeleton width={40} height={13} radius={4} />
                <Skeleton width={34} height={11} radius={4} />
              </View>
            )}
            <Lines first={i % 2 ? "48%" : "62%"} second={i % 3 ? "38%" : "28%"} />
            {trailing === "figure" ? <Skeleton width={44} height={13} radius={4} /> : null}
            {trailing === "badge" ? <Skeleton width={68} height={22} radius={11} /> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

/** SettingsRow-shaped rows: 52pt, icon, label, optional badge. */
export function SkeletonSettingsRows({ count = 4, badge = false }: { count?: number; badge?: boolean }) {
  return (
    <View style={{ marginBottom: 18 }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i}>
          {i > 0 ? <Hairline inset={SETTINGS_ROW.separatorInset} /> : null}
          <View style={{ flexDirection: "row", alignItems: "center", height: SETTINGS_ROW.height, paddingHorizontal: SETTINGS_ROW.paddingHorizontal, columnGap: SETTINGS_ROW.gap }}>
            <Skeleton width={SETTINGS_ROW.glyphWidth - 2} height={SETTINGS_ROW.glyphWidth - 2} radius={6} />
            <View style={{ flex: 1 }}>
              <Skeleton width={i % 2 ? "44%" : "58%"} height={13} radius={4} />
            </View>
            {badge ? <Skeleton width={72} height={22} radius={11} /> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

/** PhotoGrid-shaped: two-up tiles with title and price lines under each. */
export function SkeletonPhotoGrid({ count = 4, ratio = 1 }: { count?: number; ratio?: number }) {
  const { width } = useWindowDimensions();
  const w = (width - GUTTER * 2 - 12) / 2;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 12, rowGap: 20, marginHorizontal: GUTTER, marginBottom: 24 }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ width: w, gap: 10 }}>
          <Skeleton width={w} height={w / ratio} radius={20} />
          <View style={{ gap: 7, paddingHorizontal: 2 }}>
            <Skeleton width={i % 2 ? "70%" : "82%"} height={13} radius={4} />
            <Skeleton width="40%" height={11} radius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** A raised headline card: label, big figure, a chart strip. */
export function SkeletonChartCard() {
  return (
    <View style={{ marginHorizontal: GUTTER, marginBottom: 18, gap: 8 }}>
      <Skeleton width="30%" height={13} radius={4} />
      <Skeleton width="45%" height={30} radius={6} />
      <Skeleton width="38%" height={11} radius={4} />
      <Skeleton width="100%" height={64} radius={10} style={{ marginTop: 6 }} />
    </View>
  );
}

/** A row of three small stat tiles. */
export function SkeletonTiles() {
  return (
    <View style={{ flexDirection: "row", gap: 10, marginHorizontal: GUTTER, marginBottom: 18 }}>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} height={58} radius={16} style={{ flex: 1 }} />
      ))}
    </View>
  );
}

/** A section title's line, at SectionTitle's position. */
export function SkeletonTitle() {
  return <Skeleton width={96} height={13} radius={4} style={{ marginHorizontal: 20, marginTop: 6, marginBottom: 10 }} />;
}

/** Bar gauges: a label line over a thin track, at the gauges' 12pt rhythm. */
export function SkeletonBars({ count = 4 }: { count?: number }) {
  return (
    <View style={{ marginHorizontal: GUTTER, marginBottom: 18, gap: 12 }}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ gap: 8 }}>
          <Skeleton width={i % 2 ? "30%" : "22%"} height={11} radius={4} />
          <Skeleton width="100%" height={6} radius={3} />
        </View>
      ))}
    </View>
  );
}
