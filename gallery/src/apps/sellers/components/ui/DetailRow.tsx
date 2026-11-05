import { Badge } from "@/components/ui/feedback/Badge";
import { Text } from "@/components/ui/primitives/Text";
import { View } from "@/components/ui/primitives/View";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ChevronRight } from "lucide-react-native";
import { Pressable } from "react-native";

interface DetailRowProps {
  label: string;
  value: string | null | undefined;
  onPress?: () => void;
  valueColor?: string;
}

export function DetailRow({
  label,
  value,
  onPress,
  valueColor,
}: DetailRowProps) {
  const colors = useThemeColors();

  const content = (
    <View className="flex-row items-center justify-between py-3.5">
      <Text className="text-sm text-muted">{label}</Text>
      <View className="flex-row items-center flex-shrink ml-4">
        <Badge className={`bg-[${value}] items-center justify-center`}>
          <Text
            className="text-sm"
            weight="medium"
            style={valueColor ? { color: valueColor } : undefined}
            numberOfLines={1}
          >
            {value || "Not set"}
          </Text>
          {onPress && (
            <ChevronRight size={12} color={colors.muted} className="ml-1" />
          )}
        </Badge>
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}
