import { Badge, View } from "@/components/ui";
import { CountBadge } from "@/components/ui/feedback/CountBadge";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SellersTrendChip } from "@/compare/status/Pills";
import { TkvrBadge } from "@/compare/status/TkvrBadge";
import type { ReactNode } from "react";
import { ScrollView } from "react-native";

function Rowed({ children }: { children: ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 20, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
      {children}
    </View>
  );
}

// David, 15 Oct: kit Badge = solid in light, tint in dark. TKVR's all-solid
// badge kept as the backup.
export default function CompareStatus() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>Kit Badge (solid in light, tint in dark)</SectionTitle>
      <Rowed>
        <Badge>Draft</Badge>
        <Badge variant="success">Delivered</Badge>
        <Badge variant="warning">Late</Badge>
        <Badge variant="error">Cancelled</Badge>
      </Rowed>

      <SectionTitle>Backup: TKVR Badge (solid in both)</SectionTitle>
      <Rowed>
        <TkvrBadge>Draft</TkvrBadge>
        <TkvrBadge variant="success">Delivered</TkvrBadge>
        <TkvrBadge variant="warning">Late</TkvrBadge>
        <TkvrBadge variant="error">Cancelled</TkvrBadge>
      </Rowed>

      <SectionTitle>SELLERS trend chip (Today revenue)</SectionTitle>
      <Rowed>
        <SellersTrendChip changePct={12.4} />
        <SellersTrendChip changePct={-3.1} />
      </Rowed>

      <SectionTitle>CountBadge</SectionTitle>
      <Rowed>
        <CountBadge count={3} />
        <CountBadge count={12} size="sm" />
      </Rowed>
    </ScrollView>
  );
}
