import { queryClient } from "@/apps/sellers/lib/queryClient";
import { Card } from "@/components/ui/surfaces/Card";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { GlassButton } from "@/components/ui/actions/GlassButton";
import { SkeletonBlock } from "@/components/ui/feedback/SkeletonBlock";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { LoadErrorState } from "@/components/LoadErrorState";
import { Badge, Pressable, ScrollView, SectionTitle, Text, View } from "@/apps/sellers/components/ui";
import { ProductPhoto } from "@/apps/sellers/components/products/ProductPhoto";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { supabase } from "@/lib/supabase";
import { EnhancedProduct } from "@/apps/sellers/types/simple";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { AlertTriangle, Boxes } from "lucide-react-native";
import { Alert, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

function alpha(a: number) {
  return Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");
}

function eurFromCents(cents: number | null | undefined) {
  const n = cents ?? 0;
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: n % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n / 100);
}

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function relativeTime(date: string | null) {
  if (!date) return "Never";
  const t = new Date(date).getTime();
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return formatDate(date);
}

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const {
    data: product,
    error,
    isPending,
    refetch: refetchMain,
  } = useSafeQuery({
    name: "productDetails",
    queryKey: ["product", id],
    requiresAuth: true,
    queryFn: () => fetchProductDetails(id!),
    enabled: !!id,
  });

  const { data: stats } = useSafeQuery({
    name: "productStats",
    queryKey: ["product_stats", id],
    requiresAuth: true,
    queryFn: async () => {
      const { data } = await supabase
        .from("order_items")
        .select("quantity, subtotal, created_at")
        .eq("product_id", id!)
        .order("created_at", { ascending: false });
      const items = data ?? [];
      let unitsSold = 0;
      let revenueCents = 0;
      for (const i of items) {
        unitsSold += i.quantity ?? 0;
        revenueCents += i.subtotal ?? 0;
      }
      return {
        unitsSold,
        revenueCents,
        lastSold: items[0]?.created_at ?? null,
        ordersCount: items.length,
      };
    },
    enabled: !!id,
  });

  const { data: createdByUser } = useSafeQuery({
    name: "productCreatedBy",
    queryKey: ["product_created_by", product?.created_by],
    requiresAuth: true,
    queryFn: async () => {
      if (!product?.created_by) return null;
      const { data } = await supabase
        .from("users")
        .select("id, first_name, last_name, email")
        .eq("id", product.created_by)
        .maybeSingle();
      return data;
    },
    enabled: !!product?.created_by,
  });

  const { data: lastEdit } = useSafeQuery({
    name: "productLastEdit",
    queryKey: ["product_last_edit", id],
    requiresAuth: true,
    queryFn: async () => {
      const { data: log } = await supabase
        .from("product_audit_logs")
        .select("action, created_at, user_id")
        .eq("product_id", id!)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!log) return null;
      let userName: string | null = null;
      if (log.user_id) {
        const { data: u } = await supabase
          .from("users")
          .select("first_name, last_name, email")
          .eq("id", log.user_id)
          .maybeSingle();
        if (u) {
          userName =
            [u.first_name, u.last_name].filter(Boolean).join(" ") ||
            u.email ||
            null;
        }
      }
      return { ...log, userName };
    },
    enabled: !!id,
  });

  async function fetchProductDetails(
    productId: string,
  ): Promise<EnhancedProduct> {
    const { data: rawData, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_categories(categories(id, name)),
        product_variants!product_id(*),
        product_inventory(
          *,
          vendor_locations(id, address, city, state, postcode)
        ),
        product_allergens(allergens(id, name)),
        product_certifications(certifications(id, name, description)),
        product_ingredients(ingredients(id, name)),
        product_attribute_values(*, category_attributes(name)),
        product_tags(tags(id, name)),
        variant_groups(id, name, sort_order, variant_options(id, value, sort_order)),
        product_images(id, path, is_primary, order_index),
        product_media(id, url, media_type, sort_order),
        product_discounts(*),
        product_ratings(*),
        product_questions(*),
        related_products:related_products!product_id(related_product:products!related_product_id(id, name, slug)),
        vendor_storefronts!storefront_id(
          *,
          vendor_categories(name),
          storefront_locations(
            vendor_locations(address, city, state, postcode)
          )
        )
      `,
      )
      .eq("id", productId)
      .single();

    if (error) throw new Error(error.message);
    if (!rawData) throw new Error("Product not found");

    const data = {
      ...rawData,
      vendor_storefronts: rawData.vendor_storefronts
        ? {
            ...rawData.vendor_storefronts,
            vendor_locations:
              rawData.vendor_storefronts.storefront_locations?.[0]
                ?.vendor_locations || null,
          }
        : null,
    };

    return data as unknown as EnhancedProduct;
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      `Delete "${product?.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id!);
              if (error) throw error;
              queryClient.invalidateQueries({ queryKey: ["vendor_products"] });
              router.back();
            } catch (err: unknown) {
              const msg =
                err instanceof Error ? err.message : "Failed to delete";
              Alert.alert("Error", msg);
            }
          },
        },
      ],
    );
  };

  const getPublicImageUrl = (path: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return (
      supabase.storage.from("product-images").getPublicUrl(path).data
        ?.publicUrl || ""
    );
  };

  if (isPending) {
    // Skeleton in the page's own shape: photo, title lines, then rows.
    return (
      <View className="flex-1 bg-background">
        <Stack.Screen options={{ title: "" }} />
        <View className="px-4 pt-3 gap-3">
          <SkeletonBlock height={240} radius={24} />
          <SkeletonBlock height={26} width="70%" />
          <SkeletonBlock height={14} width="40%" />
          <SkeletonBlock height={56} radius={16} />
          <SkeletonBlock height={140} radius={24} />
        </View>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 bg-background">
        <Stack.Screen options={{ title: "Error" }} />
        <LoadErrorState title="Error loading product" onRetry={() => refetchMain()} />
      </View>
    );
  }

  const inventoryByLocation = product.product_inventory ?? [];
  const totalStock =
    inventoryByLocation.reduce(
      (sum, inv) => sum + (inv.current_stock || 0),
      0,
    ) ||
    product.current_stock ||
    0;

  const lowStockLocations = inventoryByLocation.filter((inv) => {
    const threshold = inv.low_stock_threshold;
    return (
      threshold != null &&
      threshold > 0 &&
      (inv.current_stock || 0) <= threshold
    );
  });
  const isOutOfStock = product.track_stock && totalStock <= 0;
  const isLowStock = product.track_stock && !isOutOfStock && lowStockLocations.length > 0;

  const activeDiscount = product.product_discounts?.find((d) => {
    const now = new Date();
    const start = d.start_date ? new Date(d.start_date) : null;
    const end = d.end_date ? new Date(d.end_date) : null;
    return (!start || now >= start) && (!end || now <= end);
  });

  const ratings = product.product_ratings ?? [];
  const thumbsUp = ratings.reduce((s, r) => s + (Number(r.thumbs_up) || 0), 0);
  const thumbsDown = ratings.reduce(
    (s, r) => s + (Number(r.thumbs_down) || 0),
    0,
  );
  const totalVotes = thumbsUp + thumbsDown;
  const approvalRate =
    totalVotes > 0 ? Math.round((thumbsUp / totalVotes) * 100) : null;

  const createdByDisplay = createdByUser
    ? [createdByUser.first_name, createdByUser.last_name]
        .filter(Boolean)
        .join(" ") ||
      createdByUser.email ||
      null
    : null;

  const basePrice = Number(product.base_price) || 0;
  const compareAt =
    typeof product.compare_at_price === "number"
      ? product.compare_at_price
      : null;
  const showCompareAt = compareAt !== null && compareAt > basePrice;

  const statusColor = product.is_live ? colors.success : colors.warning;
  const statusLabel = product.is_live ? "Live" : "Draft";

  const stockColor = isOutOfStock
    ? colors.error
    : isLowStock
      ? colors.warning
      : colors.success;
  const stockLabel = isOutOfStock
    ? "Out of stock"
    : `${totalStock} in stock`;

  const productImages = (product.product_images ?? [])
    .slice()
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  const thumbUrl = product.thumbnail
    ? getPublicImageUrl(product.thumbnail)
    : "";

  const categoryNames = (product.product_categories ?? [])
    .filter((pc) => pc?.categories != null)
    .map((pc) => pc.categories.name);
  const tagNames = (product.product_tags ?? [])
    .filter((pt) => pt?.tags?.name != null)
    .map((pt) => pt.tags.name as string);
  const allergenNames = (product.product_allergens ?? [])
    .filter((pa) => pa?.allergens != null)
    .map((pa) => pa.allergens.name);
  const ingredientNames = (product.product_ingredients ?? [])
    .filter((pi) => pi?.ingredients != null)
    .map((pi) => pi.ingredients.name);
  const certificationNames = (product.product_certifications ?? [])
    .filter((pc) => pc?.certifications != null)
    .map((pc) => pc.certifications.name);
  // One "Details" list instead of a card per fact; empty facts are left out.
  const details: { label: string; value: string; mono?: boolean; color?: string }[] = [
    ...(categoryNames.length ? [{ label: "Category", value: categoryNames.join(", ") }] : []),
    ...(tagNames.length ? [{ label: "Tags", value: tagNames.join(", ") }] : []),
    ...(allergenNames.length ? [{ label: "Allergens", value: allergenNames.join(", "), color: colors.error }] : []),
    ...(ingredientNames.length ? [{ label: "Ingredients", value: ingredientNames.join(", ") }] : []),
    ...(certificationNames.length ? [{ label: "Certified", value: certificationNames.join(", ") }] : []),
    ...(product.product_attribute_values ?? [])
      .filter((a) => a?.category_attributes != null && a.value != null && String(a.value) !== "")
      .map((a) => ({ label: a.category_attributes?.name || "Attribute", value: String(a.value) })),
    ...(product.barcode ? [{ label: "Barcode", value: product.barcode, mono: true }] : []),
    ...(product.manufacturer ? [{ label: "Manufacturer", value: product.manufacturer }] : []),
    ...(product.country_of_origin ? [{ label: "Origin", value: product.country_of_origin }] : []),
  ];

  const activity = [
    `Created ${formatDate(product.created_at)}${createdByDisplay ? ` by ${createdByDisplay}` : ""}`,
    product.updated_at ? `updated ${relativeTime(product.updated_at)}` : null,
    lastEdit?.created_at && lastEdit.userName ? `last change by ${lastEdit.userName}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const heroImages = productImages.length
    ? productImages.map((img) => getPublicImageUrl(img.path))
    : thumbUrl
      ? [thumbUrl]
      : [];

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          // The name is the title in the body, so the bar stays untitled.
          title: "",
        }}
      />
      {/* Delete lives in the header "..." menu (DESIGN.md §5.2); Edit is the
          one big button at the bottom. */}
      <ActionMenu
        accessibilityLabel="Product actions"
        title={product.name || "Product"}
        actions={[{ label: "Delete product", systemImage: "trash", destructive: true, onPress: handleDelete }]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Photos: swipe through them, full width */}
        {heroImages.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8 }}
          >
            {heroImages.map((uri, i) => (
              <View key={uri + i} style={{ width: screenWidth, paddingHorizontal: 16 }}>
                <ProductPhoto
                  uri={uri}
                  style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 24, borderCurve: "continuous" }}
                />
              </View>
            ))}
          </ScrollView>
        ) : null}

        {/* Name, where it sells, price, badges, description */}
        <View className="px-5 pt-4 gap-1">
          <Text weight="semibold" style={{ fontSize: 26, lineHeight: 31, letterSpacing: -0.6 }} numberOfLines={3}>
            {product.name}
          </Text>
          {product.vendor_storefronts ? (
            <Text className="text-[15px] text-muted" numberOfLines={1}>
              {product.vendor_storefronts.name}
              {product.vendor_storefronts.vendor_locations?.city
                ? ` · ${product.vendor_storefronts.vendor_locations.city}`
                : ""}
            </Text>
          ) : null}
          <View className="flex-row items-baseline gap-2 mt-2">
            <Text weight="semibold" style={{ fontSize: 22, letterSpacing: -0.4, fontVariant: ["tabular-nums"] }}>
              {eurFromCents(basePrice)}
            </Text>
            {showCompareAt ? (
              <Text
                className="text-muted"
                style={{ fontSize: 15, textDecorationLine: "line-through", fontVariant: ["tabular-nums"] }}
              >
                {eurFromCents(compareAt)}
              </Text>
            ) : null}
          </View>
          <View className="flex-row flex-wrap gap-1.5 mt-2">
            <Badge variant={product.is_live ? "success" : "warning"}>{statusLabel}</Badge>
            {activeDiscount ? (
              <Badge variant="success">
                {activeDiscount.discount_type === "percentage"
                  ? `${activeDiscount.value}% off`
                  : `${eurFromCents(Number(activeDiscount.value))} off`}
              </Badge>
            ) : null}
            {product.is_featured ? <Badge>Popular</Badge> : null}
            {product.is_on_sale ? <Badge variant="success">On sale</Badge> : null}
            {product.is_eighteen_plus ? <Badge variant="error">18+</Badge> : null}
            {product.is_manufactured ? <Badge>Made in-house</Badge> : null}
          </View>
          {product.description ? (
            <Text className="text-[15px] text-text mt-3" style={{ lineHeight: 22 }}>
              {product.description}
            </Text>
          ) : null}
        </View>

        {/* Sales: only once it has sold */}
        {stats && stats.ordersCount > 0 ? (
          <View className="px-4 mt-5">
            <Card className="flex-row">
              <KpiCell label="Sold" value={String(stats.unitsSold)} first />
              <KpiCell label="Revenue" value={eurFromCents(stats.revenueCents)} />
              {approvalRate != null ? (
                <KpiCell
                  label="Liked"
                  value={`${approvalRate}%`}
                  valueColor={
                    approvalRate >= 80 ? colors.success : approvalRate >= 50 ? colors.warning : colors.error
                  }
                />
              ) : null}
            </Card>
          </View>
        ) : null}

        {/* Stock */}
        {product.track_stock ? (
          <View className="px-4">
            <SectionLabel>Stock</SectionLabel>
            <Group>
              <SettingsRow
                label={isLowStock ? `${stockLabel} · low at ${lowStockLocations.length}` : stockLabel}
                Icon={isLowStock ? AlertTriangle : Boxes}
                navigates
                onPress={() => router.push(`/products/${product.id}/manage-stock`)}
                accessory={<View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: stockColor }} />}
              />
              {inventoryByLocation.map((inv, idx) => {
                const threshold = inv.low_stock_threshold;
                const stock = inv.current_stock ?? 0;
                const low = threshold != null && threshold > 0 && stock <= threshold;
                const out = stock <= 0;
                return (
                  <Row
                    key={idx}
                    label={inv.vendor_locations?.city || inv.vendor_locations?.address || "Location"}
                    value={out ? "Out" : String(stock)}
                    valueColor={out ? colors.error : low ? colors.warning : colors.text}
                    mono
                  />
                );
              })}
            </Group>
          </View>
        ) : null}

        {/* Variants */}
        {product.product_variants && product.product_variants.length > 0 ? (
          <View className="px-4">
            <SectionLabel>{`Variants · ${product.product_variants.length}`}</SectionLabel>
            <Group>
              {product.product_variants.map((v) => {
                const variantPrice = basePrice + (Number(v.price_adjustment) || 0);
                return (
                  <View key={v.id} className="flex-row items-center px-4 gap-3" style={{ minHeight: 60, paddingVertical: 8 }}>
                    {v.thumbnail ? (
                      <ProductPhoto
                        uri={getPublicImageUrl(v.thumbnail)}
                        style={{ width: 44, height: 44, borderRadius: 10, borderCurve: "continuous" }}
                      />
                    ) : null}
                    <View className="flex-1">
                      <View className="flex-row items-center gap-1.5">
                        <Text weight="medium" className="text-[15px] text-text" numberOfLines={1}>
                          {v.name || "Unnamed"}
                        </Text>
                        {v.is_default ? <Badge>Default</Badge> : null}
                        {!v.is_active ? <Badge variant="error">Off</Badge> : null}
                        {v.requires_id ? <Badge variant="error">18+</Badge> : null}
                      </View>
                      <Text className="text-[13px] mt-0.5 text-muted" numberOfLines={1}>
                        {v.sku ? `SKU ${v.sku}` : "No SKU"}
                        {v.track_stock ? ` · ${v.current_stock || 0} in stock` : ""}
                      </Text>
                    </View>
                    <Text weight="medium" className="text-[15px] text-text" style={{ fontVariant: ["tabular-nums"] }}>
                      {eurFromCents(variantPrice)}
                    </Text>
                  </View>
                );
              })}
            </Group>
          </View>
        ) : null}

        {/* Options */}
        {product.variant_groups && product.variant_groups.length > 0 ? (
          <View className="px-4">
            <SectionLabel>Options</SectionLabel>
            <Group>
              {product.variant_groups
                .slice()
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map((group) => (
                  <Row
                    key={group.id}
                    label={group.name}
                    value={(group.variant_options ?? [])
                      .slice()
                      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                      .map((o) => o.value)
                      .join(", ")}
                  />
                ))}
            </Group>
          </View>
        ) : null}

        {/* Details */}
        {details.length > 0 ? (
          <View className="px-4">
            <SectionLabel>Details</SectionLabel>
            <Group>
              {details.map((d) => (
                <Row key={d.label} label={d.label} value={d.value} mono={d.mono} valueColor={d.color} />
              ))}
            </Group>
          </View>
        ) : null}

        {/* Reviews */}
        {ratings.length > 0 ? (
          <View className="px-4">
            <SectionLabel>{`Reviews · ${ratings.length}`}</SectionLabel>
            <Group>
              {ratings.slice(0, 3).map((r) => (
                <View key={r.id} className="px-4" style={{ paddingVertical: 12 }}>
                  <View className="flex-row items-center gap-3">
                    <Text weight="medium" className="text-[13px]" style={{ color: colors.success, fontVariant: ["tabular-nums"] }}>
                      {`↑ ${r.thumbs_up || 0}`}
                    </Text>
                    <Text weight="medium" className="text-[13px]" style={{ color: colors.error, fontVariant: ["tabular-nums"] }}>
                      {`↓ ${r.thumbs_down || 0}`}
                    </Text>
                    {r.created_at ? (
                      <Text className="text-[13px] ml-auto text-muted">{relativeTime(r.created_at)}</Text>
                    ) : null}
                  </View>
                  {r.comment ? (
                    <Text className="text-[15px] mt-1.5 text-text" style={{ lineHeight: 21 }}>
                      {r.comment}
                    </Text>
                  ) : null}
                </View>
              ))}
            </Group>
          </View>
        ) : null}

        {/* Related */}
        {product.related_products && product.related_products.length > 0 ? (
          <View className="px-4">
            <SectionLabel>Related</SectionLabel>
            <Group>
              {product.related_products
                .filter((rp) => rp?.related_product != null)
                .map((rp) => (
                  <SettingsRow
                    key={rp.related_product.id}
                    label={rp.related_product.name ?? "Product"}
                    Icon={Boxes}
                    navigates
                    onPress={() => router.push(`/products/${rp.related_product.id}`)}
                  />
                ))}
            </Group>
          </View>
        ) : null}

        <Text className="text-[13px] text-muted px-5 mt-6 leading-5">{activity}</Text>
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: (insets.bottom || 16) + 4 }}>
        <GlassButton
          label="Edit product"
          tone="primary"
          size="lg"
          onPress={() => router.push(`/edit-product?id=${product.id}`)}
        />
      </View>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <SectionTitle inset={16}>{children}</SectionTitle>;
}


function Group({ children }: { children: React.ReactNode }) {
  return (
    <SettingsGroup separatorInset={16} style={{ marginHorizontal: 0, marginBottom: 0 }}>
      {children}
    </SettingsGroup>
  );
}

function Row({
  label,
  value,
  mono,
  valueColor,
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueColor?: string;
}) {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center px-4 gap-3" style={{ minHeight: 44, paddingVertical: 10 }}>
      <Text style={{ fontSize: 15, color: colors.muted }}>{label}</Text>
      <Text
        weight="medium"
        className="flex-1 text-right"
        numberOfLines={2}
        style={{ fontSize: 15, color: valueColor ?? colors.text, fontVariant: mono ? ["tabular-nums"] : undefined }}
      >
        {value}
      </Text>
    </View>
  );
}


// Same cell as the shared KpiGrid: 13pt muted label over a SemiBold 21 value.
function KpiCell({
  label,
  value,
  valueColor,
  first,
  strike,
}: {
  label: string;
  value: string;
  valueColor?: string;
  first?: boolean;
  strike?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View
      className="flex-1 px-3"
      style={first ? undefined : { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: colors.border }}
    >
      <Text className="text-muted" numberOfLines={1} style={{ fontSize: 13, lineHeight: 17 }}>
        {label}
      </Text>
      <Text
        weight="semibold"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={{
          fontSize: 21,
          letterSpacing: -0.4,
          marginTop: 4,
          color: valueColor ?? colors.text,
          fontVariant: ["tabular-nums"],
          textDecorationLine: strike ? "line-through" : "none",
        }}
      >
        {value}
      </Text>
    </View>
  );
}


// Kit Badge, picked from the status colour the caller passes.
function Pill({ color, label }: { color: string; label: string }) {
  const colors = useThemeColors();
  const variant =
    color === colors.success ? "success" : color === colors.error ? "error" : color === colors.warning ? "warning" : "default";
  return <Badge variant={variant}>{label}</Badge>;
}


