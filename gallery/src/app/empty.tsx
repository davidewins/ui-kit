import { EmptyState } from "@/components/ui/EmptyState";

export default function Empty() {
  return (
    <EmptyState
      art={{ image: require("../assets/images/empty/delivery-truck.png") }}
      title="No deliveries yet"
      body="New orders show up here"
      action={{ label: "Go online", onPress: () => {} }}
    />
  );
}
