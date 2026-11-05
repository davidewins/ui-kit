import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo } from "react";

interface VendorLogoProps {
  /** The logo path from the vendor/storefront record (not the full URL) */
  logoPath: string | null | undefined;
  /** Storefront name used to derive a monogram placeholder */
  name?: string | null;
  /** Size in pixels (width and height) */
  size?: number;
  /** Whether the logo should be circular */
  rounded?: boolean;
  /** Optional placeholder icon name (ignored when name provides a monogram) */
  placeholderIcon?: keyof typeof Ionicons.glyphMap;
  /** Storage bucket name (defaults to vendor-assets) */
  bucket?: string;
}

export function VendorLogo({
  logoPath,
  name,
  size = 48,
  rounded = true,
  placeholderIcon = "storefront-outline",
  bucket = "vendor-assets",
}: VendorLogoProps) {
  const colors = useThemeColors();

  const logoUrl = useMemo(() => {
    if (!logoPath) return null;
    return supabase.storage.from(bucket).getPublicUrl(logoPath).data?.publicUrl;
  }, [logoPath, bucket]);

  const borderRadius = rounded ? size / 2 : 8;

  if (!logoUrl) {
    const monogram = name?.trim()?.[0]?.toUpperCase();
    return (
      <View
        className="items-center justify-center bg-secondary-background border border-border"
        style={{
          width: size,
          height: size,
          borderRadius,
        }}
      >
        {monogram ? (
          <Text weight="semibold" style={{ color: colors.text, fontSize: size * 0.42 }}>
            {monogram}
          </Text>
        ) : (
          <Ionicons
            name={placeholderIcon}
            size={size * 0.5}
            color={colors.muted}
          />
        )}
      </View>
    );
  }

  return (
    <Image
      source={{ uri: logoUrl }}
      style={{
        width: size,
        height: size,
        borderRadius,
        // Placeholder tile while the logo loads on a slow connection.
        backgroundColor: colors.secondaryBackground,
      }}
      contentFit="cover"
      transition={200}
    />
  );
}
