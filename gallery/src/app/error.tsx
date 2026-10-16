import { LoadErrorState } from "@/components/LoadErrorState";
import { useState } from "react";

export default function ErrorScreen() {
  const [retrying, setRetrying] = useState(false);
  return (
    <LoadErrorState
      retrying={retrying}
      onRetry={() => {
        setRetrying(true);
        setTimeout(() => setRetrying(false), 1200);
      }}
    />
  );
}
