import { Text, View } from "@/components/ui";
import { REGISTRY } from "@/preview/registry";
import { Stack, useLocalSearchParams } from "expo-router";

export default function PreviewPage() {
  const { path } = useLocalSearchParams<{ path: string[] }>();
  const key = (Array.isArray(path) ? path : [path]).join("/");
  const entry = REGISTRY[key];
  if (!entry) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>{`No preview registered for ${key}`}</Text>
      </View>
    );
  }
  const Page = entry.load().default;
  return (
    <>
      <Stack.Screen options={{ title: entry.title }} />
      <Page />
    </>
  );
}
