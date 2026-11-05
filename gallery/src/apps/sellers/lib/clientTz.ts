// Browser/device IANA timezone for server-side aggregations that need to
// bucket by the seller's local day. Falls back to UTC if Intl is unavailable.

export function clientTz(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
