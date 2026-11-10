import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { CopyButton } from "@/components/ui/actions/CopyButton";
import { BrandMark } from "@/components/ui/primitives/BrandMark";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { TicketCard } from "@/components/ui/surfaces/TicketCard";
import { DemoScreen } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { DELIVERED, ITEMS, SHOP, eur2, lineDetail, subtotal, total, vatIn } from "./data";
import { GUTTER } from "./parts";

const BASKET_HREF = "/screens/orders/product-gallery";

// A delivered order as the receipt itself, the way Stripe and Apple send
// one: who took the money, how much, then every line to the cent. The stub
// under the tear carries the number you quote when something is wrong.
export default function Receipt() {
  const colors = useThemeColors();
  const order = DELIVERED;
  const sum = total(order);
  const hairline = <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: 14 }} />;
  const line = (label: string, value: string, strong = false) => (
    <View key={label} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
      <Text weight={strong ? "semibold" : "medium"} style={[strong ? TYPE.headline : TYPE.body, strong ? null : { color: colors.muted }]}>{label}</Text>
      <Text weight={strong ? "semibold" : "medium"} style={[strong ? TYPE.headline : TYPE.body, TABULAR]}>{value}</Text>
    </View>
  );

  return (
    <>
      <ActionMenu
        accessibilityLabel="Receipt actions"
        title={`Order ${order.number}`}
        actions={[
          { label: "Download PDF", systemImage: "arrow.down.doc", onPress: () => Toast.success("Receipt saved to Files") },
          { label: "Email receipt", systemImage: "envelope", onPress: () => Toast.success("Sent to aoife@byrne.ie") },
          { label: "Get help", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with Runlab") },
        ]}
      />
      <DemoScreen
        secondary
        footer={
          <InsetFooter
            primaryCta={{ label: "Buy again", onPress: () => router.push(BASKET_HREF) }}
            secondaryCta={{ label: "Return an item", onPress: () => Toast.info("Returns are open until 21 Nov") }}
          />
        }
      >
        <View style={{ marginHorizontal: GUTTER, marginTop: 4 }}>
          <TicketCard
            stub={
              <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
                <View style={{ flex: 1, rowGap: 1 }}>
                  <Text weight="semibold" style={[TYPE.body, TABULAR]}>{`Order ${order.number}`}</Text>
                  <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${order.outcome}, signed for by A. Byrne`}</Text>
                </View>
                <CopyButton value={order.number} label="order number" />
              </View>
            }
          >
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
              <View style={{ flex: 1, rowGap: 1 }}>
                <Text weight="semibold" style={TYPE.headline}>{SHOP.name}</Text>
                <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{`${SHOP.street}, ${SHOP.area}`}</Text>
              </View>
              <Badge variant="success">Paid</Badge>
            </View>
            <Text weight="semibold" style={[TYPE.display, TABULAR, { marginTop: 18 }]}>{eur2(sum)}</Text>
            <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginTop: 2 }]}>{`${order.placed.replace(",", " 2026 at")}`}</Text>

            {hairline}
            <View style={{ rowGap: 12 }}>
              {order.lines.map((l) => {
                const item = ITEMS[l.item];
                return (
                  <View key={l.item} style={{ flexDirection: "row", columnGap: 10 }}>
                    <Text weight="medium" style={[TYPE.body, TABULAR, { width: 26, color: colors.muted }]}>{`${l.qty} ×`}</Text>
                    <View style={{ flex: 1, rowGap: 1 }}>
                      <Text weight="medium" numberOfLines={1} style={TYPE.body}>{item.name}</Text>
                      <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>
                        {[lineDetail(l), l.qty > 1 ? `${eur2(item.price)} each` : null].filter(Boolean).join(", ")}
                      </Text>
                    </View>
                    <Text weight="medium" style={[TYPE.body, TABULAR]}>{eur2(item.price * l.qty)}</Text>
                  </View>
                );
              })}
            </View>

            {hairline}
            <View style={{ rowGap: 6 }}>
              {line("Subtotal", eur2(subtotal(order)))}
              {line(order.delivery.method, eur2(order.delivery.fee))}
              <View style={{ height: 2 }} />
              {line("Total", eur2(sum), true)}
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`Includes ${eur2(vatIn(sum))} VAT at 23%. VAT no. ${SHOP.vatNo}`}</Text>
            </View>

            {hairline}
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
              <BrandMark brand={order.paidWith.brand} size={24} />
              <Text weight="medium" style={[TYPE.body, TABULAR, { flex: 1 }]}>{order.paidWith.label}</Text>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>Auth 038214</Text>
            </View>
          </TicketCard>
        </View>
      </DemoScreen>
    </>
  );
}
