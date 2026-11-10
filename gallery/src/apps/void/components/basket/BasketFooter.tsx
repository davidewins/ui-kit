/**
 * Footer component for basket screen including:
 * - Store closed warning
 * - Travel time display
 * - Order notes button
 * - Payment method selector
 * - Basket summary
 * - Order/checkout button
 * - Error messages
 */

import BasketPaymentMethod from "@/apps/void/components/BasketPaymentMethod";
import { BasketSummary } from "@/apps/void/components/BasketSummary";
import { Ionicons } from "@expo/vector-icons";
import OrderButton from "@/apps/void/components/OrderButton";
import { Button, Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { shouldPayInStore } from "@/apps/void/lib/utils/creditToApply";
import {
  hasKnownHours,
  isOrderingBlocked,
  OpeningHoursMap,
} from "@/apps/void/lib/utils/storeStatus";
import { BasketItemInterface } from "@/apps/void/types/basket";
import React from "react";
import { Platform } from "react-native";

type FulfillmentType = "pickup" | "platform_delivery" | "vendor_delivery";

interface BasketFooterProps {
  items: BasketItemInterface[];
  totalCost: number;
  serviceFee: number;
  tip: number;
  deliveryFee: number;
  fulfillmentType: FulfillmentType;
  deliveryAvailable: boolean;
  vendorUsesOwnDelivery: boolean;
  deliveryStatusMessage: string | null;
  onFulfillmentTypeChange: (type: FulfillmentType) => void;
  storeStatus: {
    isOpen: boolean;
    statusText: string;
  };
  openingHoursData: OpeningHoursMap | null;
  vendorNote: string;
  riderNote: string;
  paymentSheetInitialized: boolean;
  isLoading: boolean;
  hasOutOfStockItems: boolean;
  canUseStripe: boolean;
  canAcceptCards: boolean;
  initError: string | null;
  deliveryEta: string | null;
  prepTimeMins: number | null;
  handlePlaceOrder: () => Promise<void> | void;
  onRetryPaymentSetup: () => void;
  promoCode: string | null;
  discountAmountCents: number;
  /** Store credit applied at checkout (TAK-1218). */
  creditApplied: number;
  /** What's left to charge the card after credit (TAK-1218). Drives the
   * Order button's pay-in-store copy - see shouldPayInStore. */
  amountDueOnCard: number;
  surgeMultiplier?: number;
  surgeReason?: string;
}

export function BasketFooter({
  items,
  totalCost,
  serviceFee,
  tip,
  deliveryFee,
  fulfillmentType,
  deliveryAvailable,
  vendorUsesOwnDelivery,
  deliveryStatusMessage,
  onFulfillmentTypeChange,
  storeStatus,
  openingHoursData,
  vendorNote,
  riderNote,
  paymentSheetInitialized,
  isLoading,
  hasOutOfStockItems,
  canUseStripe,
  canAcceptCards,
  initError,
  deliveryEta,
  prepTimeMins,
  handlePlaceOrder,
  onRetryPaymentSetup,
  promoCode,
  discountAmountCents,
  creditApplied,
  amountDueOnCard,
  surgeMultiplier,
  surgeReason,
}: BasketFooterProps) {
  const colors = useThemeColors();

  if (items.length === 0) return null;

  return (
    <>
      {/* Store closed warning */}
      {/* {!storeStatus.isOpen && openingHoursData && (
        <View className="bg-secondary-background border border-border rounded-sm py-2 px-4 mx-4 my-2 flex-row items-center gap-2">
          <Clock size={16} color={colors.warningText} strokeWidth={2.2} />
          <View style={{ flex: 1 }}>
            <Text
              weight="semibold"
              className="text-warning-text"
              style={{
                fontSize: 13,
              }}
            >
              This store is currently closed
            </Text>
            <Text
              style={{
                color: colors.warningText,
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {storeStatus.statusText}
            </Text>
          </View>
        </View>
      )} */}

      {/* Main footer content */}
      <View
        style={{
          padding: 16,
          borderRadius: 6,
          backgroundColor: colors.background,
        }}
      >
        {/* Fulfillment type toggle
        {(deliveryAvailable || vendorUsesOwnDelivery) && (
          <View className="flex-row bg-secondary-background rounded-xl p-1 mb-3">
            <Pressable
              onPress={() => onFulfillmentTypeChange("pickup")}
              className={`flex-1 py-2.5 rounded-lg items-center ${
                fulfillmentType === "pickup" ? "bg-background" : ""
              }`}
              style={
                fulfillmentType === "pickup"
                  ? {
                      shadowColor: "#000",
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 1 },
                      elevation: 2,
                    }
                  : undefined
              }
            >
              <Text
                weight={fulfillmentType === "pickup" ? "semibold" : "regular"}
                className={
                  fulfillmentType === "pickup" ? "text-text" : "text-muted"
                }
              >
                Pickup
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (deliveryAvailable) {
                  onFulfillmentTypeChange("platform_delivery");
                } else if (vendorUsesOwnDelivery) {
                  onFulfillmentTypeChange("vendor_delivery");
                }
              }}
              className={`flex-1 py-2.5 rounded-lg items-center ${
                fulfillmentType !== "pickup" ? "bg-background" : ""
              }`}
              style={
                fulfillmentType !== "pickup"
                  ? {
                      shadowColor: "#000",
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 1 },
                      elevation: 2,
                    }
                  : undefined
              }
            >
              <Text
                weight={fulfillmentType !== "pickup" ? "semibold" : "regular"}
                className={
                  fulfillmentType !== "pickup" ? "text-text" : "text-muted"
                }
              >
                Delivery
              </Text>
            </Pressable>
          </View>
        )} */}

        {/* Delivery status message */}
        {fulfillmentType !== "pickup" && deliveryStatusMessage && (
          <View className="mb-2 px-2 py-1.5 bg-tint/10 rounded-lg">
            <Text weight="medium" className="text-xs text-tint text-center">
              {deliveryStatusMessage}
            </Text>
          </View>
        )}

        <View className="mt-2">
          <BasketPaymentMethod canAcceptCards={canAcceptCards} />
        </View>

        {/* Promo code is entered from Order Config (/config/promo-code); the
            applied discount still surfaces in BasketSummary below. */}

        <BasketSummary
          subtotal={totalCost}
          serviceFee={serviceFee}
          tip={tip}
          deliveryFee={deliveryFee}
          fulfillmentMode={fulfillmentType !== "pickup" ? "delivery" : "pickup"}
          promoCode={promoCode}
          discountAmountCents={discountAmountCents}
          creditApplied={creditApplied}
          surgeMultiplier={surgeMultiplier}
          surgeReason={surgeReason}
        />

        <View
          className="my-4"
          style={{ paddingBottom: Platform.OS === "android" ? 32 : 0 }}
        >
          <OrderButton
            handlePlaceOrder={handlePlaceOrder}
            items={items}
            // The button sat flat grey for the whole of payment setup,
            // because only isLoading drove the spinner while
            // paymentSheetInitialized drove disabled. Waiting on Stripe is a
            // loading state and should say so; a failed setup is not, and
            // gets the retry button above instead.
            loading={
              isLoading || (canUseStripe && !paymentSheetInitialized && !initError)
            }
            disabled={
              !paymentSheetInitialized ||
              isLoading ||
              hasOutOfStockItems ||
              isOrderingBlocked(openingHoursData, storeStatus)
            }
            // Pay-in-store means there is something to hand over, which
            // isn't the same as canUseStripe being false - a delivery order
            // already paid in full by credit has nothing left to collect
            // (see shouldPayInStore).
            payInStore={shouldPayInStore({ canUseStripe, amountDueOnCard })}
            storeStatus={
              hasKnownHours(openingHoursData) ? storeStatus : undefined
            }
          />
        </View>

        {hasOutOfStockItems && (
          <Text className="text-error text-center mb-4">
            Some items are out of stock or quantities exceed available stock
          </Text>
        )}

        {initError && canUseStripe && (
          <View className="mb-4">
            <Button
              onPress={onRetryPaymentSetup}
              accessibilityLabel="Retry payment setup"
              accessibilityHint="Sets up payment again so you can place the order"
              leftIcon={<Ionicons name="refresh" size={16} />}
            >
              Couldn&apos;t set up payment. Retry
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

