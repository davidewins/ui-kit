import { EmptyState } from "@/components/ui/EmptyState";
import { Inbox } from "lucide-react-native";

export default function EmptyIcon() {
  return <EmptyState art={{ icon: Inbox }} title="No messages yet" body="Start a chat to see it here" />;
}
