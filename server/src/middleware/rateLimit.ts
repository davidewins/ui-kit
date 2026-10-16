import { Request, Response, NextFunction } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import {
  generalRateLimiter,
  authRateLimiter,
  paymentRateLimiter,
  orderRateLimiter,
  refundRateLimiter,
  adminRateLimiter,
  riderLocationRateLimiter,
  riderActionRateLimiter,
  assistantRateLimiter,
} from "@/config/upstash";
import { logger } from "@/utils/logger";

type RateLimiterType =
  | "general"
  | "auth"
  | "payment"
  | "order"
  | "refund"
  | "admin"
  | "riderLocation"
  | "riderAction"
  | "assistant";

const limiters: Record<RateLimiterType, Ratelimit | null> = {
  general: generalRateLimiter,
  auth: authRateLimiter,
  payment: paymentRateLimiter,
  order: orderRateLimiter,
  refund: refundRateLimiter,
  admin: adminRateLimiter,
  riderLocation: riderLocationRateLimiter,
  riderAction: riderActionRateLimiter,
  assistant: assistantRateLimiter,
};

/**
 * Get the client identifier for rate limiting
 * Uses user ID if authenticated, otherwise falls back to IP.
 *
 * Uses req.ip (set by Express) rather than reading X-Forwarded-For
 * directly - the raw header can be spoofed to bypass IP-based limits.
 * Set `app.set("trust proxy", 1)` in main.ts if behind a trusted proxy.
 */
function getIdentifier(req: Request, res: Response): string {
  // If user is authenticated, use their ID
  const userId = res.locals.user?.id;
  if (userId) {
    return `user:${userId}`;
  }

  // Use req.ip - Express resolves this correctly when trust proxy is set.
  // Never read X-Forwarded-For directly; it can be spoofed by clients.
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return `ip:${ip}`;
}

// Security-critical limiters that must fail closed (block requests)
// when Redis is unavailable. A Redis outage must not allow unlimited
// OTP attempts or brute-force login attempts.
const FAIL_CLOSED_TYPES: ReadonlySet<RateLimiterType> = new Set([
  "auth",
  "payment",
  // Every assistant turn is paid Claude traffic (TAK-1379).
  "assistant",
]);

/**
 * Create a rate limiting middleware
 * @param type - The type of rate limiter to use
 * @param useUserId - Whether to use user ID (if authenticated) or always use IP
 */
export function createRateLimiter(
  type: RateLimiterType = "general",
  useUserId: boolean = true,
) {
  const failClosed = FAIL_CLOSED_TYPES.has(type);

  return async (req: Request, res: Response, next: NextFunction) => {
    const limiter = limiters[type];

    // If no limiter configured (Upstash not set up):
    // - Security-critical routes: block in production, allow in dev
    // - Everything else: allow through with a warning
    if (!limiter) {
      if (failClosed && process.env.NODE_ENV === "production" && process.env.FF_DEMO_MODE !== "true") {
        logger.error(
          `Rate limiting NOT configured for '${type}' in production - blocking request`
        );
        return res.status(503).json({
          error: "Service Unavailable",
          message: "Please try again later.",
        });
      }
      logger.warn(`Rate limiting disabled for '${type}' - Upstash not configured`);
      return next();
    }

    try {
      const identifier = useUserId
        ? getIdentifier(req, res)
        : `ip:${req.ip || "unknown"}`;

      const { success, limit, remaining, reset } = await limiter.limit(
        identifier,
      );

      // Set rate limit headers
      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", reset);

      if (!success) {
        logger.warn(`Rate limit exceeded for ${identifier} on ${type}`, {
          path: req.path,
          method: req.method,
          identifier,
          type,
        });

        return res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
          retry_after: Math.ceil((reset - Date.now()) / 1000),
        });
      }

      next();
    } catch (error) {
      logger.error(`Rate limiting error (${type}):`, error);

      if (failClosed) {
        // Auth/payment: Redis is down, block the request rather than
        // allowing unlimited OTP/payment attempts
        return res.status(503).json({
          error: "Service Unavailable",
          message: "Please try again later.",
        });
      }

      // Non-critical: allow through so a Redis blip doesn't break the app
      next();
    }
  };
}

// Pre-configured middleware exports for convenience
export const generalRateLimit = createRateLimiter("general");
export const authRateLimit = createRateLimiter("auth", false); // Always use IP for auth
export const paymentRateLimit = createRateLimiter("payment");
export const orderRateLimit = createRateLimiter("order");
export const refundRateLimit = createRateLimiter("refund");
export const adminRateLimit = createRateLimiter("admin"); // For authenticated admin dashboard browsing
export const riderLocationRateLimit = createRateLimiter("riderLocation");
export const riderActionRateLimit = createRateLimiter("riderAction");
