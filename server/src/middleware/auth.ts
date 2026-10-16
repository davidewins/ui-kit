import { Request, Response, NextFunction } from "express";
import * as Sentry from "@sentry/node";
import supabase from "@/config/supabase";

/**
 * For endpoints that accept anonymous traffic but must never trust a
 * client-supplied user id for attribution. Verifies the Bearer token if one
 * is present and returns its real user id; returns null for a missing or
 * invalid token instead of rejecting the request. Never derive a user id
 * from the request body for these endpoints - always use this instead.
 */
export const resolveOptionalUserId = async (
  req: Request,
): Promise<string | null> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.substring(7);
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return user?.id ?? null;
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No authorization token provided" });
  }

  const token = authHeader.substring(7);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Attach user to res.locals
  res.locals.user = user;

  // Tag Sentry with authenticated user for error context
  Sentry.setUser({ id: user.id, email: user.email ?? undefined });

  next();
};

/**
 * requireRider - must run AFTER requireAuth.
 * Confirms the authenticated user has a row in the `riders` table.
 * Attaches the rider record to `res.locals.rider` for downstream handlers.
 */
export const requireRider = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user as { id: string } | undefined;
  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { data: rider, error } = await supabase
    .from("riders")
    .select("id, user_id, status, is_live")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return res
      .status(500)
      .json({ error: "Failed to verify rider identity" });
  }

  if (!rider) {
    return res
      .status(403)
      .json({ error: "Rider access required" });
  }

  res.locals.rider = rider;
  next();
};
