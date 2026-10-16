// src/utils/params.ts
import { Request } from "express";

/** Get a route param as a single string. Use for ids etc. */
export function param(req: Request, name: string): string {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

/** Get a query param as a single string. */
export function query(req: Request, name: string): string | undefined {
  const value = req.query[name];
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}

/** Get a query param or fallback string. */
export function queryOr(req: Request, name: string, fallback: string): string {
  return query(req, name) ?? fallback;
}

/** Parse integer query param with fallback and optional bounds. */
export function queryInt(
  req: Request,
  name: string,
  fallback: number,
  options?: { min?: number; max?: number },
): number {
  const raw = query(req, name);
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  let value = Number.isFinite(parsed) ? parsed : fallback;

  if (typeof options?.min === "number") {
    value = Math.max(options.min, value);
  }
  if (typeof options?.max === "number") {
    value = Math.min(options.max, value);
  }

  return value;
}
