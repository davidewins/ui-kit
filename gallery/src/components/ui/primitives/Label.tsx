// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/primitives/Label.tsx. Edit it there and sync; local edits fail ui-kit:check.
import React from "react";
import { Text } from "./Text";

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  className = "",
}) => {
  return (
    <Text
      weight="medium"
      className={`text-xs text-foreground tracking-tight ${className}`}
    >
      {children}
      {required && (
        <Text weight="medium" className="text-error">
          {" "}
          *
        </Text>
      )}
    </Text>
  );
};
