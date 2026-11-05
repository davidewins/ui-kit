import { View } from "@/components/ui";
import { Chip } from "@/components/ui/Chip";
import { FilterChip } from "@/components/ui/FilterChip";
import { ComposeHost } from "@/components/ui/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { DIETARY } from "@/gallery/demoData";
import { Toast } from "@/lib/toast";
import { AssistChip, FlowRow, Icon, InputChip, SuggestionChip, Text as MText } from "@expo/ui/jetpack-compose";
import { Leaf } from "lucide-react-native";
import { useState } from "react";

const FILTERS = ["Open now", "Under 30 min", "Free delivery", "Rated 4.5+"] as const;

export default function ChipsPage() {
  const [on, setOn] = useState<string[]>(["Open now"]);
  const [diet, setDiet] = useState<string>("Vegan");
  const flip = (f: string) => setOn((l) => (l.includes(f) ? l.filter((x) => x !== f) : [...l, f]));
  return (
    <DemoPage usage='import { FilterChip } from "@/components/ui/FilterChip" (native) or { Chip } from "@/components/ui/Chip" (React Native glass).'>
      <Demo title="FilterChip: store filters">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {FILTERS.map((f) => (
            <FilterChip key={f} label={f} selected={on.includes(f)} onChange={() => flip(f)} />
          ))}
        </View>
      </Demo>
      <Demo title="Chip (kit, React Native)">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {DIETARY.map((d) => (
            <Chip key={d} label={d} icon={d === "Vegan" ? Leaf : undefined} selected={diet === d} onPress={() => setDiet(d)} />
          ))}
        </View>
      </Demo>
      {isIOS ? <Note>Android: Compose FilterChip, plus AssistChip, InputChip and SuggestionChip.</Note> : <MaterialChips />}
    </DemoPage>
  );
}

function MaterialChips() {
  const [tags, setTags] = useState<string[]>(["Spicy", "Bestseller"]);
  return (
    <>
      <Demo title="AssistChip">
        <ComposeHost matchContents={{ vertical: true }}>
          <FlowRow horizontalArrangement={{ spacedBy: 8 }}>
            <AssistChip onClick={() => Toast.info("Calling Bao House")}>
              <AssistChip.Label>
                <MText>Call store</MText>
              </AssistChip.Label>
            </AssistChip>
            <AssistChip onClick={() => Toast.info("Opening directions")}>
              <AssistChip.Label>
                <MText>Directions</MText>
              </AssistChip.Label>
            </AssistChip>
          </FlowRow>
        </ComposeHost>
      </Demo>
      <Demo title="InputChip (tap to remove a tag)">
        <ComposeHost matchContents={{ vertical: true }}>
          <FlowRow horizontalArrangement={{ spacedBy: 8 }}>
            {tags.map((t) => (
              <InputChip key={t} selected onClick={() => setTags((l) => l.filter((x) => x !== t))}>
                <InputChip.Label>
                  <MText>{t}</MText>
                </InputChip.Label>
                <InputChip.TrailingIcon>
                  <Icon source={MI.close} size={18} contentDescription={`Remove ${t}`} />
                </InputChip.TrailingIcon>
              </InputChip>
            ))}
          </FlowRow>
        </ComposeHost>
      </Demo>
      <Demo title="SuggestionChip">
        <ComposeHost matchContents={{ vertical: true }}>
          <FlowRow horizontalArrangement={{ spacedBy: 8 }}>
            {["Add a drink", "Add kimchi fries"].map((s) => (
              <SuggestionChip key={s} onClick={() => Toast.success(`${s.replace("Add ", "")} added`)}>
                <SuggestionChip.Label>
                  <MText>{s}</MText>
                </SuggestionChip.Label>
              </SuggestionChip>
            ))}
          </FlowRow>
        </ComposeHost>
      </Demo>
      <Note>iOS: FilterChip draws a SwiftUI glass capsule; there are no assist, input or suggestion chips.</Note>
    </>
  );
}
