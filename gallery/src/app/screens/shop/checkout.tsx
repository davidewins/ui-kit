import { Input, View } from "@/components/ui";
import { SelectRow } from "@/components/onboarding/SelectRow";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { BASKET, euro, productById } from "@/gallery/demo/data";
import { DemoScreen, Summary, useStates } from "@/gallery/demo/parts";
import { haptic } from "@/lib/haptics";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { CreditCard, MapPin, Package, Store, Truck, Zap } from "lucide-react-native";
import { useState } from "react";

const STATES = ["Ready", "No address", "Paying"] as const;
const OPTIONS = [
  { id: "standard", label: "Standard", description: "2 to 3 working days", price: 0, icon: Truck },
  { id: "next", label: "Next day", description: "Order by 4pm", price: 7.5, icon: Zap },
  { id: "collect", label: "Collect in store", description: "Grafton Street, ready in 2 hours", price: 0, icon: Store },
] as const;

// Checkout: where it goes, how fast, how you pay, the totals, and Pay in the
// footer. No address = the address row asks for one and Pay is off.
export default function Checkout() {
  const { state, bar } = useStates(STATES);
  const [option, setOption] = useState<(typeof OPTIONS)[number]["id"]>("standard");
  const [promo, setPromo] = useState("");
  const subtotal = BASKET.reduce((n, l) => n + productById(l.product).price * l.qty, 0);
  const delivery = OPTIONS.find((o) => o.id === option)!.price;
  const discount = promo.trim().toUpperCase() === "WELCOME10" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + delivery - discount;
  const noAddress = state === "No address" && option !== "collect";

  return (
    <DemoScreen
      bar={bar}
      footer={
        <InsetFooter
          primaryCta={{
            label: state === "Paying" ? "Paying…" : `Pay ${euro(total)}`,
            disabled: noAddress || state === "Paying",
            onPress: () => {
              haptic("success");
              Toast.success("Order placed");
              router.replace("/screens/shop/order/4821");
            },
          }}
        />
      }
    >
      <SectionTitle>Delivery</SectionTitle>
      <SettingsGroup>
        {OPTIONS.map((o, i) => (
          <SelectRow
            key={o.id}
            icon={o.icon}
            label={o.price ? `${o.label}, ${euro(o.price)}` : `${o.label}, free`}
            description={o.description}
            selected={option === o.id}
            isLast={i === OPTIONS.length - 1}
            onPress={() => setOption(o.id)}
          />
        ))}
      </SettingsGroup>

      {option !== "collect" ? (
        <SettingsGroup>
          <SettingsRow
            label={noAddress ? "Add a delivery address" : "14 Clanbrassil Street, Dublin 8"}
            Icon={MapPin}
            alert={noAddress}
            navigates
            onPress={() => Toast.info("Addresses")}
          />
        </SettingsGroup>
      ) : null}

      <SectionTitle>Payment</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Visa ending 4242" Icon={CreditCard} trailing="Default" navigates onPress={() => Toast.info("Payment methods")} />
      </SettingsGroup>

      <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
        <Input
          label="Promo code"
          placeholder="WELCOME10"
          autoCapitalize="characters"
          value={promo}
          onChangeText={setPromo}
          hint={discount ? `${euro(discount)} off applied` : undefined}
        />
      </View>

      <SectionTitle>{`${BASKET.reduce((n, l) => n + l.qty, 0)} items`}</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Review your bag" Icon={Package} navigates onPress={() => router.back()} />
      </SettingsGroup>
      <Summary
        lines={[
          ["Subtotal", euro(subtotal)],
          ["Delivery", delivery ? euro(delivery) : "Free"],
          ...(discount ? ([["WELCOME10", `-${euro(discount)}`]] as [string, string][]) : []),
        ]}
        total={["Total", euro(total)]}
      />
    </DemoScreen>
  );
}
