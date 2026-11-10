// A business balance, the Revolut / Stripe way: the figure and its curve on
// glass (drag to read any day), the next payout, then money in and out by
// day, each day on its own surface.
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { Menu } from "@/components/ui/actions/Menu";
import { LineChart } from "@/components/ui/data/LineChart";
import { Trend } from "@/components/ui/data/Trend";
import { Badge } from "@/components/ui/feedback/Badge";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Popover } from "@/components/ui/overlays/Popover";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Landmark, Mail, Package, Percent, ShoppingBag, Undo2, Users } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { BALANCE, type Category, PAYOUT, RANGES, type Range, TRANSACTIONS, euro2 } from "./data";

const RANGE_KEYS = Object.keys(RANGES) as Range[];
const RANGE_NAME: Record<Range, string> = { "1W": "Past week", "1M": "Past month", "3M": "Past 3 months", "1Y": "Past year" };

export default function MoneyBalance() {
  const colors = useThemeColors();
  const hues = useHues();
  const [range, setRange] = useState<Range>("1M");
  const [at, setAt] = useState<number | undefined>(undefined);
  const [paying, setPaying] = useState(false);
  const values = RANGES[range].values;

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
    <>
    <ActionMenu
      accessibilityLabel="Balance actions"
      actions={[
        { label: "Statements", systemImage: "doc.text", onPress: () => Toast.info("Opening statements") },
        { label: "Export as CSV", systemImage: "square.and.arrow.up", onPress: () => Toast.success("Export sent to your email") },
        { label: "Bank account", systemImage: "building.columns", onPress: () => Toast.info("AIB ending 4471") },
      ]}
    />
    <DemoScreen footer={<InsetFooter primaryCta={{ label: "Pay out now", onPress: () => setPaying(true) }} />}>
      <Panel glass>
        <Text weight="semibold" style={[TYPE.display, TABULAR]}>{euro2(at === undefined ? BALANCE.now : values[at])}</Text>
        <View style={{ marginTop: 4, marginBottom: 14 }}>
          {at === undefined ? (
            <Trend value={euro2(BALANCE.monthChange)} direction="up" note="this month, all of it available" />
          ) : (
            <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>Your balance that day. Let go to come back to now.</Text>
          )}
        </View>
        <LineChart series={[{ values: [...values], color: hues.green }]} area height={150} labels={[...RANGES[range].labels]} selected={at} onSelect={setAt} accessibilityLabel={`Balance over ${range}`} />
        <View style={{ flexDirection: "row", marginTop: 14 }}>
          <Menu
            label={RANGE_NAME[range]}
            systemImage="calendar"
            items={RANGE_KEYS.map((r) => ({
              label: RANGE_NAME[r],
              selected: r === range,
              onPress: () => {
                setRange(r);
                setAt(undefined);
              },
            }))}
          />
        </View>
      </Panel>

      <Panel style={{ marginTop: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
          <IconTile Icon={Landmark} color={colors.text} glyph={colors.background} round />
          <View style={{ flex: 1 }}>
            <Text weight="semibold" numberOfLines={1} style={TYPE.body}>{`Payout ${PAYOUT.day}`}</Text>
            <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${PAYOUT.bank} ending ${PAYOUT.last4}, in by 09:00`}</Text>
          </View>
          <Text weight="semibold" style={[TYPE.body, TABULAR]}>{euro2(PAYOUT.amount)}</Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Popover label="Why Friday" systemImage="info.circle">
            <View style={{ width: 280, padding: 16, rowGap: 8 }}>
              <Text weight="medium" style={TYPE.body}>Card sales take two working days to clear, so Wednesday and Thursday land on Friday.</Text>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>Paying out now sends what has cleared today, €15,126.30, for a 1% fee.</Text>
            </View>
          </Popover>
        </View>
      </Panel>

      {TRANSACTIONS.map((group) => (
        <View key={group.day}>
          <SectionHeader title={`${group.day}, ${group.net >= 0 ? "up" : "down"} ${euro2(group.net)}`} />
          <Panel flush>
            {group.items.map((t, i) => {
              const mark = marks[t.category];
              return (
                <ContextMenu
                  key={t.id}
                  actions={[
                    { label: "Copy amount", systemImage: "doc.on.doc", onPress: () => Toast.success("Amount copied") },
                    { label: "Add a note", systemImage: "square.and.pencil", onPress: () => Toast.info("Note") },
                    { label: "Download receipt", systemImage: "arrow.down.doc", onPress: () => Toast.success("Receipt saved to Files") },
                    { label: "Report a problem", systemImage: "exclamationmark.bubble", destructive: true, onPress: () => Toast.info("Opening support") },
                  ]}
                >
                <Pressable
                  onPress={() => Toast.info(t.who)}
                  accessibilityRole="button"
                  accessibilityLabel={`${t.who}, ${t.amount >= 0 ? "in" : "out"} ${euro2(t.amount)}`}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 12,
                    minHeight: 64,
                    paddingHorizontal: 16,
                    borderTopWidth: i ? StyleSheet.hairlineWidth : 0,
                    borderColor: colors.border,
                    backgroundColor: pressed ? colors.border : "transparent",
                  })}
                >
                  <IconTile Icon={mark.Icon} color={mark.color} />
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
                </Pressable>
                </ContextMenu>
              );
            })}
          </Panel>
        </View>
      ))}
    </DemoScreen>
    <ConfirmDialog
      visible={paying}
      onClose={() => setPaying(false)}
      title="Pay out €15,126.30 now?"
      message="It reaches AIB ending 4471 within 30 minutes. The fee is €151.26. Waiting until Friday is free."
      confirmLabel="Pay out now"
      cancelLabel="Wait for Friday"
      onConfirm={() => Toast.success("Payout on its way")}
    />
    </>
  );
}
