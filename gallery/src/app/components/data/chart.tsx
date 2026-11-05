import { Text, View } from "@/components/ui";
import { Sparkline } from "@/components/analytics/Sparkline";
import { SwiftHost } from "@/components/ui/NativeHost";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { SALES_WEEK } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Chart, type ChartDataPoint } from "@expo/ui/swift-ui";
import { useWindowDimensions } from "react-native";

const AVERAGE = Math.round(SALES_WEEK.reduce((a, p) => a + p.y, 0) / SALES_WEEK.length);

export default function ChartPage() {
  if (!isIOS) return <AndroidChart />;
  return <SwiftCharts />;
}

function SwiftCharts() {
  const colors = useThemeColors();
  const mono = (pts: { x: string; y: number }[]): ChartDataPoint[] => pts.map((p) => ({ ...p, color: colors.text }));
  const greys = [colors.text, colors.muted, colors.border];
  const channels: ChartDataPoint[] = [
    { x: "VOID app", y: 62, color: greys[0] },
    { x: "Website", y: 28, color: greys[1] },
    { x: "Phone", y: 10, color: greys[2] },
  ];
  const style = { height: 200 };
  return (
    <DemoPage usage='SwiftUI only: import { Chart } from "@expo/ui/swift-ui" (Swift Charts). Android has no Compose chart in @expo/ui; apps use Sparkline.'>
      <Demo title={`Line: sales this week, average €${AVERAGE}`}>
        <SwiftHost style={style}>
          <Chart type="line" data={mono(SALES_WEEK)} lineStyle={{ color: colors.text, width: 2, pointStyle: "circle", pointSize: 6 }} referenceLines={[{ x: "Average", y: AVERAGE, color: colors.muted }]} ruleStyle={{ color: colors.muted, dashArray: [4, 4] }} showGrid animate />
        </SwiftHost>
      </Demo>
      <Demo title="Bar">
        <SwiftHost style={style}>
          <Chart type="bar" data={mono(SALES_WEEK)} barStyle={{ cornerRadius: 6 }} showGrid animate />
        </SwiftHost>
      </Demo>
      <Demo title="Area">
        <SwiftHost style={style}>
          <Chart type="area" data={mono(SALES_WEEK)} areaStyle={{ color: colors.text }} animate />
        </SwiftHost>
      </Demo>
      <Demo title="Point">
        <SwiftHost style={style}>
          <Chart type="point" data={mono(SALES_WEEK)} pointStyle={{ pointStyle: "diamond", pointSize: 10 }} showGrid />
        </SwiftHost>
      </Demo>
      <Demo title="Rectangle">
        <SwiftHost style={style}>
          <Chart type="rectangle" data={mono(SALES_WEEK)} rectangleStyle={{ color: colors.text, cornerRadius: 4 }} />
        </SwiftHost>
      </Demo>
      <Demo title="Pie: orders by channel">
        <SwiftHost style={style}>
          <Chart type="pie" data={channels} pieStyle={{ innerRadius: 0.6, angularInset: 2, cornerRadius: 4 }} showLegend />
        </SwiftHost>
      </Demo>
      <Note>Android: no Compose chart in @expo/ui; apps draw the kit Sparkline (react-native-svg).</Note>
    </DemoPage>
  );
}

function AndroidChart() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  return (
    <DemoPage usage='Chart is SwiftUI only. Android equivalent: import { Sparkline } from "@/components/analytics/Sparkline".'>
      <Demo title={`Sales this week, average €${AVERAGE}`}>
        <Sparkline values={SALES_WEEK.map((p) => p.y)} width={width - 40} height={120} color={colors.text} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {SALES_WEEK.map((p) => (
            <Text key={p.x} weight="medium" style={{ fontSize: 12, color: colors.muted }}>{p.x}</Text>
          ))}
        </View>
      </Demo>
      <Note>iOS: Swift Charts through the SwiftUI Chart view (line, bar, area, point, rectangle, pie).</Note>
    </DemoPage>
  );
}
