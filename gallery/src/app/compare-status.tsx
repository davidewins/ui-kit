import { Badge, View } from "@/components/ui";
import { CountBadge } from "@/components/ui/CountBadge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AdminDotPill, AdminTintPill, SellersTrendChip } from "@/compare/status/Pills";
import { TkvrBadge } from "@/compare/status/TkvrBadge";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ReactNode } from "react";
import { ScrollView } from "react-native";

function Rowed({ children }: { children: ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 20, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
      {children}
    </View>
  );
}

// Every status badge / chip in the six apps, same four states.
export default function CompareStatus() {
  const colors = useThemeColors();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>A. Kit Badge: tint fill, coloured text (VOID, SELLERS)</SectionTitle>
      <Rowed>
        <Badge>Draft</Badge>
        <Badge variant="success">Delivered</Badge>
        <Badge variant="warning">Late</Badge>
        <Badge variant="error">Cancelled</Badge>
      </Rowed>

      <SectionTitle>B. TKVR Badge: saturated fill, white text</SectionTitle>
      <Rowed>
        <TkvrBadge>Draft</TkvrBadge>
        <TkvrBadge variant="success">Delivered</TkvrBadge>
        <TkvrBadge variant="warning">Late</TkvrBadge>
        <TkvrBadge variant="error">Cancelled</TkvrBadge>
      </Rowed>

      <SectionTitle>C. ADMIN TintPill: saturated, small caps</SectionTitle>
      <Rowed>
        <AdminTintPill color={colors.muted} label="Draft" />
        <AdminTintPill color={colors.success} label="Delivered" />
        <AdminTintPill color={colors.warning} label="Late" />
        <AdminTintPill color={colors.error} label="Cancelled" />
      </Rowed>

      <SectionTitle>D. ADMIN dot pill, tint</SectionTitle>
      <Rowed>
        <AdminDotPill color={colors.muted}>Draft</AdminDotPill>
        <AdminDotPill color={colors.success}>Delivered</AdminDotPill>
        <AdminDotPill color={colors.warning}>Late</AdminDotPill>
        <AdminDotPill color={colors.error}>Cancelled</AdminDotPill>
      </Rowed>

      <SectionTitle>E. ADMIN dot pill, solid</SectionTitle>
      <Rowed>
        <AdminDotPill solid color={colors.muted}>Draft</AdminDotPill>
        <AdminDotPill solid color={colors.success}>Delivered</AdminDotPill>
        <AdminDotPill solid color={colors.warning}>Late</AdminDotPill>
        <AdminDotPill solid color={colors.error}>Cancelled</AdminDotPill>
      </Rowed>

      <SectionTitle>F. SELLERS trend chip (Today revenue)</SectionTitle>
      <Rowed>
        <SellersTrendChip changePct={12.4} />
        <SellersTrendChip changePct={-3.1} />
      </Rowed>

      <SectionTitle>G. CountBadge (VOID, RIDERS)</SectionTitle>
      <Rowed>
        <CountBadge count={3} />
        <CountBadge count={12} size="sm" />
      </Rowed>
    </ScrollView>
  );
}
