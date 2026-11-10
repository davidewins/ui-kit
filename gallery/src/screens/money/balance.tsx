// A business balance, the Revolut / Stripe way: the figure, its curve (drag
// to read any day), the next payout, then money in and out by day.
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Card, Text, View } from "@/components/ui";
import { LineChart } from "@/components/ui/data/LineChart";
import { Trend } from "@/components/ui/data/Trend";
import { Badge } from "@/components/ui/feedback/Badge";
import { Chip } from "@/components/ui/inputs/Chip";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Landmark, Mail, Package, Percent, ShoppingBag, Undo2, Users } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { BALANCE, type Category, PAYOUT, RANGES, type Range, TRANSACTIONS, euro2 } from "./data";

const RANGE_KEYS = Object.keys(RANGES) as Range[];

export default function MoneyBalance() {
  const colors = useThemeColors();
  const hues = useHues();
  const [range, setRange] = useState<Range>("1M");
  const [at, setAt] = useState<number | undefined>(undefined);
  const values = RANGES[range].values;
  const shown = at === undefined ? BALANCE.now : values[at];
  const [whole, cents] = euro2(shown).split(".");

  const marks: Record<Category, { Icon: typeof Landmark; color: string }> = {
    sales: { Icon: ShoppingBag, color: hues.green },
    stock: { Icon: Package, color: hues.orange },
    wages: { Icon: Users, color: hues.blue },
    rent: { Icon: Landmark, color: hues.pink },
    fees: { Icon: Percent, color: hues.gray },
    refund: { Icon: Undo2, color: hues.red },
    post: { Icon: Mail, color: hues.teal },
  };

  return (
    <DemoScreen footer={<InsetFooter primaryCta={{ label: "Pay out now", onPress: () => Toast.info("Payout started") }} />}>
      <View style={{ paddingHorizontal: GUTTER, paddingTop: 4 }}>
        <Text style={TABULAR}>
          <Text weight="semibold" style={TYPE.display}>{whole}</Text>
          <Text weight="semibold" style={[TYPE.title, { color: colors.muted }]}>{`.${cents}`}</Text>
        </Text>
        <View style={{ marginTop: 6, marginBottom: 14 }}>
          <Trend value={euro2(BALANCE.monthChange)} direction="up" note={at === undefined ? "this month, all of it available now" : "this month"} />
        </View>
        <LineChart series={[{ values: [...values], color: hues.green }]} area height={150} labels={[...RANGES[range].labels]} selected={at} onSelect={setAt} accessibilityLabel={`Balance over ${range}`} />
        <View style={{ flexDirection: "row", justifyContent: "center", columnGap: 8, marginTop: 14 }}>
          {RANGE_KEYS.map((r) => (
            <Chip
              key={r}
              label={r}
              selected={r === range}
              onPress={() => {
                setRange(r);
                setAt(undefined);
              }}
            />
          ))}
        </View>
      </View>

      <View style={{ marginHorizontal: GUTTER, marginTop: 24 }}>
        <Card raised className="p-0">
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, padding: 14 }}>
            <IconTile Icon={Landmark} color={colors.text} glyph={colors.background} round />
            <View style={{ flex: 1 }}>
              <Text weight="semibold" style={TYPE.body}>{`Payout ${PAYOUT.day}`}</Text>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${PAYOUT.bank} ending ${PAYOUT.last4}, in by 09:00`}</Text>
            </View>
            <Text weight="semibold" style={[TYPE.headline, TABULAR]}>{euro2(PAYOUT.amount)}</Text>
          </View>
        </Card>
      </View>

      {TRANSACTIONS.map((group) => (
        <View key={group.day}>
          <SectionHeader title={group.day} count={`${group.net >= 0 ? "+" : "−"}${euro2(group.net)}`} />
          {group.items.map((t, i) => {
            const mark = marks[t.category];
            return (
              <Pressable
                key={t.id}
                onPress={() => Toast.info(t.who)}
                accessibilityRole="button"
                accessibilityLabel={`${t.who}, ${t.amount >= 0 ? "in" : "out"} ${euro2(t.amount)}`}
                style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", columnGap: 12, paddingHorizontal: GUTTER, backgroundColor: pressed ? colors.border : "transparent" })}
              >
                <IconTile Icon={mark.Icon} color={mark.color} />
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", columnGap: 10, minHeight: 60, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
                  <View style={{ flex: 1 }}>
                    <Text weight="medium" numberOfLines={1} style={TYPE.body}>{t.who}</Text>
                    <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${t.what}, ${t.time}`}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end", rowGap: 3 }}>
                    <Text weight="semibold" style={[TYPE.body, TABULAR, { color: t.amount >= 0 ? colors.success : colors.text }]}>
                      {`${t.amount >= 0 ? "+" : "−"}${euro2(t.amount)}`}
                    </Text>
                    {t.pending ? <Badge variant="warning">Pending</Badge> : null}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </DemoScreen>
  );
}
