/**
 * Item-configuration (modifier) types + helpers.
 *
 * `products.modifier_groups` (jsonb) is populated from the scraped menu - pizza
 * sizes/toppings, drink flavors, meal-deal builders. Shape is stable:
 *   Array<{ id, name, required, min_select, max_select, options:[{id,name,price_delta_cents}] }>
 *
 * The DB column is `Json | null` in the generated types, so we read it through
 * `parseModifierGroups` (one place) rather than sprinkling casts.
 */

export interface ModifierOption {
  id: string;
  name: string;
  price_delta_cents: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  min_select: number;
  max_select: number;
  options: ModifierOption[];
}

/** A chosen option - stored on the basket line and sent to the order (rider reads it). */
export interface SelectedModifier {
  group_id: string;
  group_name: string;
  option_id: string;
  option_name: string;
  price_delta_cents: number;
}

export function parseModifierGroups(raw: unknown): ModifierGroup[] {
  if (!raw) return [];
  let val: unknown = raw;
  if (typeof raw === "string") {
    try {
      val = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(val)) return [];
  return (val as Record<string, unknown>[])
    .filter((g) => g && Array.isArray(g.options) && (g.options as unknown[]).length > 0)
    .map((g, gi) => {
      const max =
        typeof g.max_select === "number" && g.max_select > 0 ? g.max_select : 1;
      const required = !!g.required;
      return {
        id: String(g.id ?? `g${gi}`),
        name: String(g.name ?? "Options"),
        required,
        min_select:
          typeof g.min_select === "number" ? g.min_select : required ? 1 : 0,
        max_select: max,
        options: (g.options as Record<string, unknown>[]).map((o, oi) => ({
          id: String(o.id ?? `g${gi}o${oi}`),
          name: String(o.name ?? ""),
          price_delta_cents:
            typeof o.price_delta_cents === "number" ? o.price_delta_cents : 0,
        })),
      };
    });
}

export function modifierDeltaCents(selected: SelectedModifier[]): number {
  return selected.reduce((sum, m) => sum + (m.price_delta_cents || 0), 0);
}

/** Deterministic key so distinct configurations become distinct basket lines. */
export function buildConfigKey(selected: SelectedModifier[]): string {
  if (!selected.length) return "";
  return selected
    .map((m) => `${m.group_id}:${m.option_id}`)
    .sort()
    .join("|");
}

/** True if the customer must open the product screen before adding. */
export function requiresConfiguration(raw: unknown): boolean {
  const groups = parseModifierGroups(raw);
  return groups.some((g) => g.required || g.min_select > 0);
}

/** All required groups satisfied and no group over its max? */
export function isSelectionComplete(
  groups: ModifierGroup[],
  selected: SelectedModifier[],
): boolean {
  for (const g of groups) {
    const count = selected.filter((s) => s.group_id === g.id).length;
    if (g.required && count < Math.max(1, g.min_select)) return false;
    if (count > g.max_select) return false;
    // min_select even when not flagged required (bad scrape data)
    if (g.min_select > 0 && count < g.min_select) return false;
  }
  return true;
}

/** First unsatisfied required group name, for a helpful CTA hint. */
export function firstMissingGroup(
  groups: ModifierGroup[],
  selected: SelectedModifier[],
): string | null {
  for (const g of groups) {
    const count = selected.filter((s) => s.group_id === g.id).length;
    const need = Math.max(g.required ? 1 : 0, g.min_select);
    if (need > 0 && count < need) return g.name;
  }
  return null;
}

/**
 * Footer CTA when options are still missing.
 * Scraped names are often already "Please Choose Side" - don't prefix "Select ".
 */
export function incompleteConfigCta(groupName: string | null | undefined): string {
  const name = (groupName ?? "").trim();
  if (!name) return "Choose options";
  // Already an instruction from the platform
  if (/^(please\s+)?(choose|select|pick)\b/i.test(name)) return name;
  // Short label like "Side" / "Drink"
  if (name.length <= 24) return `Choose ${name}`;
  return name;
}
