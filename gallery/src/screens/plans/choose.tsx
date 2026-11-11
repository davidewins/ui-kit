// Choosing a plan inside a setup flow, the Linear / Notion way: the choice is
// three rows you can read in one glance, the price follows the billing
// switch, and the list underneath rewrites itself for the plan you picked.
import { SelectRow } from "@/components/onboarding/SelectRow";
import { InsetShell } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { Badge } from "@/components/ui/feedback/Badge";
import { SegmentedControl } from "@/components/ui/inputs/SegmentedControl";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { GlassGroup } from "@/components/ui/surfaces/GlassGroup";
import { GUTTER } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Building2, Check, Minus, Sparkles, User } from "lucide-react-native";
import { useState } from "react";

const PLANS = [
  { key: "starter", name: "Starter", icon: User, monthly: 0, line: "3 accounts, 10 scheduled posts a month" },
  { key: "creator", name: "Creator", icon: Sparkles, monthly: 12, line: "10 accounts, unlimited posts, best times" },
  { key: "studio", name: "Studio", icon: Building2, monthly: 29, line: "5 seats, approvals, a workspace per client" },
] as const;

const FEATURES: { label: string; from: number; detail: [string, string, string] }[] = [
  { label: "Connected accounts", from: 0, detail: ["3", "10", "Unlimited"] },
  { label: "Best time to post", from: 1, detail: ["", "Per network", "Per network"] },
  { label: "One inbox for DMs", from: 1, detail: ["", "All networks", "All networks"] },
  { label: "Results history", from: 0, detail: ["30 days", "2 years", "For ever"] },
  { label: "Team seats and approvals", from: 2, detail: ["", "", "5 seats"] },
];

export default function ChoosePlan() {
  const colors = useThemeColors();
  const [yearly, setYearly] = useState(1);
  const [picked, setPicked] = useState(1);
  const plan = PLANS[picked];
  const price = (monthly: number) => (monthly === 0 ? "free" : yearly ? `€${monthly * 10} a year` : `€${monthly} a month`);

  return (
    <InsetShell
      step={3}
      total={4}
      primaryCta={{ label: plan.monthly ? `Try ${plan.name} free for 14 days` : "Continue on Starter", onPress: () => Toast.success(`${plan.name} it is`) }}
      secondaryCta={plan.monthly ? { label: "Decide later", onPress: () => Toast.info("You are on Starter for now") } : undefined}
    >
      <View style={{ paddingHorizontal: GUTTER, paddingTop: 4 }}>
        <Text weight="semibold" style={TYPE.title}>How much do you post?</Text>
        <Text weight="medium" style={[TYPE.body, { color: colors.muted, marginTop: 4 }]}>Change or cancel any time. No card needed for the trial.</Text>
      </View>

      <View style={{ paddingHorizontal: GUTTER, marginTop: 18, flexDirection: "row", alignItems: "center", columnGap: 10 }}>
        <View style={{ flex: 1 }}>
          <SegmentedControl values={["Monthly", "Yearly"]} selectedIndex={yearly} onChange={setYearly} accessibilityLabel="Billing period" />
        </View>
        {yearly ? <Badge variant="success">2 months free</Badge> : null}
      </View>

      <GlassGroup style={{ marginHorizontal: GUTTER, marginTop: 14 }}>
        {PLANS.map((p, i) => (
          <SelectRow
            key={p.key}
            icon={p.icon}
            label={`${p.name}, ${price(p.monthly)}`}
            description={p.line}
            selected={i === picked}
            isLast={i === PLANS.length - 1}
            onPress={() => setPicked(i)}
          />
        ))}
      </GlassGroup>

      <SectionHeader title={`What ${plan.name} gives you`} />
      <View style={{ paddingHorizontal: GUTTER, rowGap: 12 }}>
        {FEATURES.map((f) => {
          const has = picked >= f.from;
          return (
            <View key={f.label} style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: has ? colors.success : colors.border }}>
                {has ? <Check size={13} color="#fff" strokeWidth={3} /> : <Minus size={13} color={colors.muted} strokeWidth={3} />}
              </View>
              <Text weight="medium" style={[TYPE.body, { flex: 1, color: has ? colors.text : colors.muted }]}>{f.label}</Text>
              <Text weight="semibold" style={[TYPE.body, TABULAR, { color: has ? colors.text : colors.muted }]}>{has ? f.detail[picked] : `From ${PLANS[f.from].name}`}</Text>
            </View>
          );
        })}
      </View>
    </InsetShell>
  );
}
