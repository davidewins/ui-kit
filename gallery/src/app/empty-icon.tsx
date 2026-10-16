import { EmptyState } from "@/components/ui/EmptyState";
import { Inbox } from "lucide-react-native";

export default function EmptyIcon() {
  return <EmptyState icon={Inbox} title="No messages yet" message="Start a chat to see it here" />;
}
