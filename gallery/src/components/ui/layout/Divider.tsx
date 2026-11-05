// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/layout/Divider.tsx. Edit it there and sync; local edits fail ui-kit:check.
import React from "react";
import { View } from "../primitives/View";

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
