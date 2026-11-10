// A shop's day so far, the Shopify / Square way: takings against the same
// day last week, the day hour by hour with the forecast to close, where the
// sales came from, what is being packed right now, and what is selling.
import { Text, View } from "@/components/ui";
import { BarChart } from "@/components/ui/data/BarChart";
import { BarList } from "@/components/ui/data/BarList";
import { SegmentBar } from "@/components/ui/data/SegmentBar";
import { Trend } from "@/components/ui/data/Trend";
import { Badge } from "@/components/ui/feedback/Badge";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { CHANNELS, HOURS, LIVE_ORDERS, NOW_HOUR, SALES, TOP_PRODUCTS, euro0 } from "./data";

export default function MoneySales() {
  const colors = useThemeColors();
  const hues = useHues();
  const [hour, setHour] = useState(NOW_HOUR);
  const up = Math.round(((SALES.today - SALES.lastThursday) / SALES.lastThursday) * 100);
  const channelColors = [hues.blue, hues.pink, hues.orange];
  const h = HOURS[hour];

  return (
    <DemoScreen>
      <View style={{ paddingHorizontal: GUTTER, paddingTop: 4 }}>
        <Text style={TABULAR}>
          <Text weight="semibold" style={TYPE.display}>{euro0(SALES.today)}</Text>
          <Text weight="semibold" style={[TYPE.title, { color: colors.muted }]}> today</Text>
        </Text>
        <View style={{ marginTop: 4 }}>
          <Trend value={`${up}%`} direction="up" note={`on last Thursday by now (${euro0(SALES.lastThursday)})`} />
        </View>
        <Text weight="medium" style={[TYPE.body, TABULAR, { marginTop: 10 }]}>
          {`${SALES.orders} orders, €${SALES.average.toFixed(2)} each on average. On course for ${euro0(SALES.forecast)} by close.`}
        </Text>
      </View>

      <SectionHeader title="By the hour" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginBottom: 8 }]}>
          {h.forecast ? `${h.label}:00, about ${euro0(h.value)} expected` : hour === NOW_HOUR ? `${h.label}:00 so far, ${euro0(h.value)}` : `${h.label}:00, ${euro0(h.value)} taken`}
        </Text>
        <BarChart
          data={HOURS.map((x) => ({ label: x.label, value: x.value, muted: x.forecast }))}
          selected={hour}
          onSelect={setHour}
          format={euro0}
          height={150}
          accessibilityLabel="Sales by hour, with the forecast to close"
        />
      </View>

      <SectionHeader title="Where it came from" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <SegmentBar height={14} segments={CHANNELS.map((c, i) => ({ label: c.label, value: c.value, display: euro0(c.value), color: channelColors[i] }))} />
      </View>

      <SectionHeader title="Being packed" count={LIVE_ORDERS.length} action={{ label: "All orders", onPress: () => Toast.info("Opening orders") }} />
      {LIVE_ORDERS.map((o, i) => (
        <Pressable
          key={o.id}
          onPress={() => Toast.info(`Order #${o.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Order ${o.id}, ${o.who}, ${o.status}`}
          style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", columnGap: 12, paddingHorizontal: GUTTER, backgroundColor: pressed ? colors.border : "transparent" })}
        >
          <Image source={o.photo} style={{ width: 44, height: 44, borderRadius: 10 }} contentFit="cover" />
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", columnGap: 10, minHeight: 64, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
            <View style={{ flex: 1 }}>
              <Text weight="medium" numberOfLines={1} style={[TYPE.body, TABULAR]}>{`${o.who}, #${o.id}`}</Text>
              <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${o.items}, ${euro0(o.total)}`}</Text>
            </View>
            <View style={{ alignItems: "flex-end", rowGap: 3 }}>
              <Badge variant={o.status === "Ready" ? "success" : o.late ? "error" : "warning"}>{o.status}</Badge>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: o.late ? colors.error : colors.muted }]}>{o.late ? `${o.minutes} min, late` : `${o.minutes} min`}</Text>
            </View>
          </View>
        </Pressable>
      ))}

      <SectionHeader title="Selling today" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <BarList
          color={hues.blue}
          items={TOP_PRODUCTS.map((p) => ({
            label: p.label,
            value: p.value,
            display: euro0(p.value),
            detail: `${p.sold} sold`,
            leading: <Image source={p.photo} style={{ width: 40, height: 40, borderRadius: 10 }} contentFit="cover" />,
          }))}
        />
      </View>
    </DemoScreen>
  );
}
