import { View } from "@/components/ui";
import { SkeletonList } from "@/components/ui";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { ScrollView } from "react-native";

// Recipe §3.1: skeleton while a list loads.
export default function Loading() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 12 }}>
        <SkeletonBlock height={40} width="55%" />
        <SkeletonBlock height={14} width="35%" />
      </View>
      <SkeletonList count={6} />
    </ScrollView>
  );
}
