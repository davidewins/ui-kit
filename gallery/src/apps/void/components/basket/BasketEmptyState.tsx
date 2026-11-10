import { EmptyState } from "@/components/ui";
import { router } from "expo-router";
import React from "react";

export const BasketEmptyState = () => (
  <EmptyState
    art={{ image: require("@/apps/void/assets/images/empty/shopping-cart.png") }}
    action={{ label: "Browse stores", onPress: () => router.dismissTo("/(protected)/(tabs)/home") }}
    title="Your basket is empty"
    body="Browse stores and add items to get started."
  />
);
