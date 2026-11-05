import type { Tables, TablesInsert, TablesUpdate } from "./index";

type TableName = keyof import("./index").Database["public"]["Tables"];

export type TableRow<T extends TableName> = Tables<T>;
export type TableInsert<T extends TableName> = TablesInsert<T>;
export type TableUpdate<T extends TableName> = TablesUpdate<T>;
