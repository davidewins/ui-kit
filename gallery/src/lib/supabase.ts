// Gallery stand-in for the kit's supabase client. Nothing here touches the
// network: auth returns a demo session, realtime channels never fire,
// storage URLs point at the real public bucket (logos and photos only), and
// table reads come from src/gallery/fixtureTables.
import { rpcResult, tableRows } from "@/gallery/fixtureTables";
import type { Database } from "@/apps/sellers/types/index";
import type { SupabaseClient } from "@supabase/supabase-js";

const STORAGE_URL = "https://tjrvfndaatuhgnvuqslo.supabase.co/storage/v1/object/public";

const user = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "aoife@example.com",
  email_confirmed_at: "2026-01-01T00:00:00Z",
  phone: "",
  app_metadata: {},
  user_metadata: { first_name: "Aoife", last_name: "Byrne" },
  aud: "authenticated",
  created_at: "2026-01-01T00:00:00Z",
};
const session = {
  access_token: "gallery",
  refresh_token: "gallery",
  expires_in: 3600,
  token_type: "bearer",
  user,
};

const ok = <T,>(data: T) => Promise.resolve({ data, error: null });

function query(table: string) {
  let single = false;
  const builder: Record<string, unknown> = {};
  const chain = () => builder;
  for (const m of [
    "select", "eq", "neq", "in", "is", "gt", "gte", "lt", "lte", "like", "ilike",
    "or", "not", "match", "filter", "contains", "order", "limit", "range",
    "insert", "update", "upsert", "delete", "returns", "abortSignal",
  ]) builder[m] = chain;
  builder.single = () => ((single = true), builder);
  builder.maybeSingle = () => ((single = true), builder);
  builder.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) => {
    const rows = tableRows(table);
    const data = single ? (rows[0] ?? null) : rows;
    return Promise.resolve({ data, error: null, count: rows.length }).then(resolve, reject);
  };
  return builder;
}

function channel() {
  const c: Record<string, unknown> = {};
  c.on = () => c;
  c.subscribe = () => c;
  c.unsubscribe = () => Promise.resolve("ok");
  c.send = () => Promise.resolve("ok");
  return c;
}

export const supabase = {
  auth: {
    getSession: () => ok({ session }),
    getUser: () => ok({ user }),
    refreshSession: () => ok({ session, user }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signInWithOtp: () => ok({ user: null, session: null }),
    verifyOtp: () => ok({ user, session }),
    signInWithPassword: () => ok({ user, session }),
    signInWithIdToken: () => ok({ user, session }),
    resetPasswordForEmail: () => ok({}),
    updateUser: () => ok({ user }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: (table: string) => query(table),
  rpc: (name: string, args?: Record<string, unknown>) => ok(rpcResult(name, args)),
  channel,
  removeChannel: () => Promise.resolve("ok"),
  removeAllChannels: () => Promise.resolve([]),
  storage: {
    from: (bucket: string) => ({
      getPublicUrl: (path: string) => ({ data: { publicUrl: `${STORAGE_URL}/${bucket}/${path}` } }),
      createSignedUrl: (path: string) => ok({ signedUrl: `${STORAGE_URL}/${bucket}/${path}` }),
      upload: () => ok({ path: "" }),
      remove: () => ok([]),
    }),
  },
  functions: { invoke: () => ok(null) },
} as unknown as SupabaseClient<Database>; // typed as the real client (same schema in every app) so callers keep their types
