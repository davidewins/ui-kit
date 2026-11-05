import { LoadErrorState } from "@/components/LoadErrorState";
import { OrderRow } from "@/apps/void/components/orders/OrderRow";
import { EmptyState, SafeAreaView, Skeleton, View } from "@/components/ui";
import {
  useCurrentUserId,
  useOrdersListRealtime,
} from "@/apps/void/hooks/useOrderRealtime";
import { OrderListItem, useOrders } from "@/apps/void/hooks/useOrders";
import { useReorder } from "@/apps/void/hooks/useReorder";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useRouter } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function OrdersSkeleton({ topInset }: { topInset: number }) {
  return (
    <View className="flex-1 bg-background px-4" style={{ paddingTop: topInset + 16 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <View key={i} className="flex-row items-center gap-3 mb-3.5">
          <Skeleton width={48} height={48} radius={12} />
          <View className="flex-1 gap-2">
            <Skeleton width="60%" height={15} />
            <Skeleton width="38%" height={12} />
          </View>
          <Skeleton width={64} height={26} radius={13} />
        </View>
      ))}
    </View>
  );
}

export default function OrdersListScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // The header is transparent (same as Profile), so the list reserves its
  // height itself and the automatic inset stays off: on with a transparent
  // header it reserved the LARGE title height for a title that never drew.
  const headerHeight = useHeaderHeight();
  const userId = useCurrentUserId();
  const { reorder, reorderingId } = useReorder();

  // Subscribe to real-time order updates for this user
  useOrdersListRealtime(userId);

  const { data: orders, isLoading, error, refetch, isRefetching } = useOrders();

  // A handful of orders: show each one's items instead of a sliver per row.
  const expanded = (orders?.length ?? 0) <= 4;
  const renderOrder = ({ item }: { item: OrderListItem }) => (
    <OrderRow
      item={item}
      onReorder={reorder}
      isReordering={reorderingId === item.id}
      expanded={expanded}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-background"
        style={{ backgroundColor: colors.background }}
        edges={["bottom"]}
      >
        <OrdersSkeleton topInset={headerHeight} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        className="flex-1 bg-background"
        style={{ backgroundColor: colors.background }}
        edges={["bottom"]}
      >
        <View style={{ height: headerHeight }} />
        <LoadErrorState
          title="Couldn't load your orders"
          message="Check your connection and try again."
          onRetry={() => refetch()}
          retrying={isRefetching}
        />
      </SafeAreaView>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <SafeAreaView
        className="flex-1 bg-background"
        style={{ backgroundColor: colors.background }}
        edges={["bottom"]}
      >
        <View style={{ height: headerHeight }} />
        <EmptyState
          art={{ image: require("@/apps/void/assets/images/empty/receipt.png") }}
          action={{ label: "Browse stores", onPress: () => router.dismissTo("/") }}
          title="No orders yet"
          body="Your order history will appear here."
        />
      </SafeAreaView>
    );
  }

  return (
    <>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerClassName="bg-background"
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: insets.bottom + 24,
        }}
        className="bg-background flex-1"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: colors.border,
              marginLeft: 74,
            }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        contentInsetAdjustmentBehavior="never"
        progressViewOffset={headerHeight}
      />
    </>
  );
}
