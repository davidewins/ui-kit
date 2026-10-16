import { EmptyState } from "@/components/ui/EmptyState";

export default function EmptyList() {
  return (
    <EmptyState
      art="list"
      title="No orders yet"
      body="They'll show up here as they come in"
      secondary={{ label: "Clear filters", onPress: () => {} }}
    />
  );
}
