import { EmptyState } from "@/components/ui";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { StepButtons } from "@/components/ui/inputs/StepperRow";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ART, BASKET, euro, productById } from "@/gallery/demo/data";
import { DemoScreen, MEDIA_INSET, MediaRow, Summary, useStates } from "@/gallery/demo/parts";
import { haptic } from "@/lib/haptics";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { useState } from "react";

const STATES = ["Items", "Empty"] as const;
const DELIVERY = 0;

// Bag: each line with its own quantity buttons (down to zero removes it), the
// totals, and Checkout in the footer. Empty sends you back to the shop.
export default function Basket() {
  const { state, bar } = useStates(STATES);
  const [lines, setLines] = useState(BASKET);
  const subtotal = lines.reduce((n, l) => n + productById(l.product).price * l.qty, 0);

  const change = (i: number, by: number) => {
    haptic("selection");
    const next = lines.map((l, j) => (j === i ? { ...l, qty: l.qty + by } : l));
    if (next[i].qty === 0) Toast.info(`${productById(lines[i].product).name} removed`);
    setLines(next.filter((l) => l.qty > 0));
  };

  if (state === "Empty" || lines.length === 0) {
    return (
      <DemoScreen scroll={false} bar={bar}>
        <EmptyState
          art={{ image: ART.bag }}
          title="Your bag is empty"
          body="Things you add show up here"
          action={{ label: "Start shopping", onPress: () => router.push("/screens/shop/home") }}
        />
      </DemoScreen>
    );
  }

  return (
    <DemoScreen bar={bar} footer={<InsetFooter primaryCta={{ label: `Checkout, ${euro(subtotal + DELIVERY)}`, onPress: () => router.push("/screens/shop/checkout") }} />}>
      <SettingsGroup separatorInset={MEDIA_INSET}>
        {lines.map((l, i) => {
          const p = productById(l.product);
          return (
            <MediaRow
              key={l.product}
              image={p.photos[0]}
              title={p.name}
              subtitle={[l.size ? `Size ${l.size}` : p.colour, `${l.qty} × ${euro(p.price)}`].join(", ")}
              trailing={euro(p.price * l.qty)}
              accessory={
                <StepButtons
                  label={`${p.name} quantity`}
                  onDecrement={() => change(i, -1)}
                  onIncrement={() => change(i, 1)}
                  canDecrement
                  canIncrement={l.qty < 5}
                />
              }
            />
          );
        })}
      </SettingsGroup>
      <Summary lines={[["Subtotal", euro(subtotal)], ["Delivery", DELIVERY ? euro(DELIVERY) : "Free"]]} total={["Total", euro(subtotal + DELIVERY)]} />
    </DemoScreen>
  );
}
