import { EmptyState } from "@/components/ui/EmptyState";

export default function Empty() {
  return (
    <EmptyState
      image={require("../assets/images/empty/delivery-truck.png")}
      title="No deliveries yet"
      message="New orders show up here"
      actionLabel="Go online"
      onAction={() => {}}
    />
  );
}
