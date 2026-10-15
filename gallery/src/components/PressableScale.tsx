// ui-kit: copy of davidewins/ui-kit native/files/src/components/PressableScale.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { FC, ReactNode } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const PressableScale: FC<Props> = ({
  children,
  style,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const pressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.get() * 0.02 }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      style={[style, animatedStyle]}
      onPressIn={(event) => {
        pressed.set(withTiming(1, { duration: 110 }));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.set(withTiming(0, { duration: 140 }));
        onPressOut?.(event);
      }}
    >
      {children}
    </AnimatedPressable>
  );
};
