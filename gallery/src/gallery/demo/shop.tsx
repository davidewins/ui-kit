// Gallery-only: the Shop demo's shared bits (price line, stock badge).
import { Badge } from "@/components/ui";
import { type Product, euro } from "@/gallery/demo/data";

export const priceLine = (p: Product) => (p.was ? `${euro(p.price)}, was ${euro(p.was)}` : euro(p.price));

export function stockBadge(p: Product) {
  if (p.stock === "Sold out") return <Badge variant="error">Sold out</Badge>;
  if (p.was) return <Badge variant="success">Sale</Badge>;
  if (p.stock === "Low stock") return <Badge variant="warning">Low stock</Badge>;
  return undefined;
}
