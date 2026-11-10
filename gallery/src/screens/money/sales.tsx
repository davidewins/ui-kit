// A shop's day so far, the Shopify / Square way: takings against the same
// day last week and the day hour by hour (with the forecast to close) on
// glass, then where the sales came from, what is being packed right now,
// and what is selling.
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { BarChart } from "@/components/ui/data/BarChart";
import { BarList } from "@/components/ui/data/BarList";
import { SegmentBar } from "@/components/ui/data/SegmentBar";
import { Trend } from "@/components/ui/data/Trend";
import { Badge } from "@/components/ui/feedback/Badge";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { Popover } from "@/components/ui/overlays/Popover";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
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
    <>
    <ActionMenu
      accessibilityLabel="Sales actions"
      actions={[
        { label: "Compare with yesterday", systemImage: "arrow.left.arrow.right", onPress: () => Toast.info("Comparing with Wednesday") },
        { label: "End of day report", systemImage: "doc.text", onPress: () => Toast.info("Report is ready at close") },
        { label: "Export today", systemImage: "square.and.arrow.up", onPress: () => Toast.success("Export sent to your email") },
      ]}
    />
    <DemoScreen>
      <Panel glass>
        <Text weight="semibold" style={[TYPE.display, TABULAR]}>{`${euro0(SALES.today)} today`}</Text>
        <View style={{ marginTop: 4 }}>
          <Trend value={`${up}%`} direction="up" note={`on last Thursday by now, ${euro0(SALES.lastThursday)}`} />
        </View>
        <Text weight="medium" style={[TYPE.body, TABULAR, { marginTop: 10, marginBottom: 16 }]}>
          {`${SALES.orders} orders, €${SALES.average.toFixed(2)} each on average. On course for ${euro0(SALES.forecast)} by close.`}
        </Text>
        <BarChart
          data={HOURS.map((x) => ({ label: x.label, value: x.value, muted: x.forecast }))}
          selected={hour}
          onSelect={setHour}
          format={euro0}
          height={150}
          accessibilityLabel="Sales by hour, with the forecast to close"
        />
        <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginTop: 10 }]}>
          {h.forecast ? `${h.label}:00, about ${euro0(h.value)} expected` : hour === NOW_HOUR ? `${h.label}:00 so far, ${euro0(h.value)}` : `${h.label}:00, ${euro0(h.value)} taken`}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Popover label="How the forecast works" systemImage="chart.line.uptrend.xyaxis">
            <View style={{ width: 280, padding: 16, rowGap: 8 }}>
              <Text weight="medium" style={TYPE.body}>The dashed hours are your last six Thursdays, scaled by how today is running.</Text>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>Today is 12% ahead, so each remaining hour is lifted by 12%. It has landed within €180 on five of the last six.</Text>
            </View>
          </Popover>
        </View>
      </Panel>

      <SectionHeader title="Where it came from" />
      <Panel>
        <SegmentBar height={14} segments={CHANNELS.map((c, i) => ({ label: c.label, value: c.value, display: euro0(c.value), color: channelColors[i] }))} />
      </Panel>

      <SectionHeader title={`${LIVE_ORDERS.length} being packed`} action={{ label: "All orders", onPress: () => Toast.info("Opening orders") }} />
      <Panel flush>
        {LIVE_ORDERS.map((o, i) => (
          <ContextMenu
            key={o.id}
            actions={[
              { label: "Mark as ready", systemImage: "checkmark.circle", onPress: () => Toast.success(`#${o.id} is ready`) },
              { label: "Print label", systemImage: "printer", onPress: () => Toast.success("Label printed") },
              { label: "Message customer", systemImage: "message", onPress: () => Toast.info(`Opening chat with ${o.who}`) },
              { label: "Cancel and refund", systemImage: "xmark.circle", destructive: true, onPress: () => Toast.info("Refund started") },
            ]}
          >
          <Pressable
            onPress={() => Toast.info(`Order #${o.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Order ${o.id}, ${o.who}, ${o.status}`}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              columnGap: 12,
              minHeight: 68,
              paddingHorizontal: 16,
              borderTopWidth: i ? StyleSheet.hairlineWidth : 0,
              borderColor: colors.border,
              backgroundColor: pressed ? colors.border : "transparent",
            })}
          >
            <Image source={o.photo} style={{ width: 44, height: 44, borderRadius: 10 }} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text weight="medium" numberOfLines={1} style={[TYPE.body, TABULAR]}>{`${o.who}, #${o.id}`}</Text>
              <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${o.items}, ${euro0(o.total)}`}</Text>
            </View>
            <View style={{ alignItems: "flex-end", rowGap: 3 }}>
              <Badge variant={o.status === "Ready" ? "success" : o.late ? "error" : "warning"}>{o.status}</Badge>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: o.late ? colors.error : colors.muted }]}>{o.late ? `${o.minutes} min, late` : `${o.minutes} min`}</Text>
            </View>
          </Pressable>
          </ContextMenu>
        ))}
      </Panel>

      <SectionHeader title="Selling today" />
      <Panel>
        <BarList
          color={hues.blue}
          items={TOP_PRODUCTS.map((p) => ({
            label: p.label,
            value: p.value,
            display: euro0(p.value),
            detail: `${p.sold} sold`,
            leading: <Image source={p.photo} style={{ width: 44, height: 44, borderRadius: 10 }} contentFit="cover" />,
          }))}
        />
      </Panel>
    </DemoScreen>
    </>
  );
}
