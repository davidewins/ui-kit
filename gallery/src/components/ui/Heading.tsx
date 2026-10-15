// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/Heading.tsx. Edit it there and sync; local edits fail ui-kit:check.
import React from "react";
import { Text } from "./Text";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

interface HeadingProps {
  level?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<HeadingLevel, { className: string; weight: "bold" | "semibold" }> = {
  h1: { className: "text-4xl text-foreground", weight: "bold" },
  h2: { className: "text-3xl text-foreground", weight: "bold" },
  h3: { className: "text-2xl text-foreground", weight: "semibold" },
  h4: { className: "text-xl text-foreground", weight: "semibold" },
};

export const Heading: React.FC<HeadingProps> = ({
  level = "h2",
  children,
  className = "",
}) => {
  const style = styles[level];

  return (
    <Text weight={style.weight} className={`${style.className} ${className}`}>
      {children}
    </Text>
  );
};
