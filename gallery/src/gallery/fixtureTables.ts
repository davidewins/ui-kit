// Rows the fake supabase client serves, by table name. Each app's fixtures
// register theirs; the tables are one shared database, so shapes agree.
const tables: Record<string, unknown[]> = {};
type Rpc = (args: Record<string, unknown>) => unknown;
const rpcs: Record<string, Rpc> = {};

export function registerTables(rows: Record<string, unknown[]>) {
  Object.assign(tables, rows);
}

export function registerRpcs(results: Record<string, Rpc>) {
  Object.assign(rpcs, results);
}

export function tableRows(name: string): unknown[] {
  return tables[name] ?? [];
}

export function rpcResult(name: string, args: Record<string, unknown> = {}): unknown {
  return rpcs[name]?.(args) ?? null;
}
