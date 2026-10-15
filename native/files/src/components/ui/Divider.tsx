import React from "react";
import { View } from "./View";

interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export const Divider: React.FC<DividerProps> = ({
  className = "",
  orientation = "horizontal",
}) => {
  return (
    <View
      className={`
        bg-border
        ${orientation === "horizontal" ? "h-px w-full" : "w-px h-full"}
        ${className}
      `}
    />
  );
};
