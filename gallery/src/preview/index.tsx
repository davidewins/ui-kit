import { Text, View } from "@/components/ui";
import { REGISTRY } from "@/preview/registry";
import { Link } from "expo-router";
import { ScrollView } from "react-native";

export default function PreviewIndex() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      {Object.entries(REGISTRY).map(([path, { title }]) => (
        <Link key={path} href={`/${path}` as never}>
          <View>
            <Text weight="medium" style={{ fontSize: 15 }}>{`${title}  /${path}`}</Text>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}
