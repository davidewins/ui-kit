/**
 * How much store credit this basket actually uses (TAK-1218).
 *
 * hq-node recomputes and clamps this on the way in, so this number only ever
 * decides what the customer is shown and what the PaymentIntent is created
 * for. It is never the authority.
 */
export function creditToApply({
  available,
  orderTotal,
  enabled,
}: {
  available: number;
  orderTotal: number;
  enabled: boolean;
}): number {
  if (!enabled) return 0;
  return Math.max(0, Math.min(available, orderTotal));
}

/**
 * Whether the Stripe payment sheet should open (TAK-1218).
 *
 * Must mirror the display gate (vendorAcceptsCard || isConcierge) - otherwise
 * a concierge storefront without a card method in accepted_payment_methods
 * shows "Card" but skips the payment sheet, placing an UNPAID order that
 * auto-dispatches a rider (VOID is merchant of record and collects nothing).
 *
 * Credit covering the whole total means there is nothing to charge, so
 * amountDueOnCard > 0 is part of the gate too: getting this wrong is how an
 * unpaid order reaches a concierge storefront and auto-dispatches a rider
 * against money nobody collected.
 */
export function canUseStripeForCheckout({
  vendorAcceptsCard,
  isConcierge,
  selectedPaymentMethod,
  amountDueOnCard,
}: {
  vendorAcceptsCard: boolean;
  isConcierge: boolean;
  selectedPaymentMethod: "card" | "cash";
  amountDueOnCard: number;
}): boolean {
  return (
    (vendorAcceptsCard || isConcierge) &&
    selectedPaymentMethod === "card" &&
    amountDueOnCard > 0
  );
}

/**
 * The basket total shown to the customer (TAK-1218, fix round 1).
 *
 * Mirrors basket.tsx's amountDueOnCard formula so the displayed Order Total
 * matches what Stripe is actually charged, instead of the pre-credit amount.
 */
export function basketTotalCents({
  subtotal,
  serviceFee,
  deliveryFee,
  tip,
  discountAmountCents,
  creditApplied,
}: {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  tip: number;
  discountAmountCents: number;
  creditApplied: number;
}): number {
  return Math.max(
    0,
    subtotal + serviceFee + deliveryFee + tip - discountAmountCents - creditApplied,
  );
}

/**
 * Whether the Order button should show pay-in-store copy ("Order for
 * Collection") instead of "Place Order" (TAK-1218, fix round 1).
 *
 * This used to be derived straight from `!canUseStripe`, which broke the day
 * canUseStripe started closing for a reason OTHER than cash: a delivery
 * order already paid in full by credit has nothing left to pay in store, but
 * canUseStripe is false for it too (amountDueOnCard === 0). Pay-in-store
 * specifically means "there is something to hand over" - which is exactly
 * amountDueOnCard > 0.
 */
export function shouldPayInStore({
  canUseStripe,
  amountDueOnCard,
}: {
  canUseStripe: boolean;
  amountDueOnCard: number;
}): boolean {
  return !canUseStripe && amountDueOnCard > 0;
}
