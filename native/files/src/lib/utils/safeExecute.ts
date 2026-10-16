/**
 * Safe Execution Wrapper
 *
 * A utility that wraps async functions with common cross-cutting concerns:
 * - Network connectivity check
 * - Authentication verification
 * - Sentry error tracking with rich context
 * - PostHog analytics
 * - Retry with backoff (transient errors only)
 * - Typed error codes for support/admin triage
 * - Operation timing for SLO tracking
 * - Consistent error handling
 *
 * Usage:
 * ```typescript
 * const result = await safeExecute({
 *   name: 'fetchOrders',
 *   fn: () => fetchOrders(userId),
 *   requiresAuth: true,
 *   requiresNetwork: true,
 *   posthog,
 * });
 *
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.errorCode, result.error);
 * }
 * ```
 */

import { supabase } from "@/lib/supabase";
import NetInfo from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";
import { Alert, Platform } from "react-native";

// ============================================================================
// ERROR CODES
// ============================================================================

/**
 * Canonical error codes for filtering in Sentry/PostHog dashboards,
 * support triage, and automated alerting.
 */
export enum ErrorCode {
  // Pre-flight failures
  NETWORK_OFFLINE = "NETWORK_OFFLINE",
  AUTH_REQUIRED = "AUTH_REQUIRED",
  AUTH_EXPIRED = "AUTH_EXPIRED",

  // Execution failures
  TIMEOUT = "TIMEOUT",
  SERVER_ERROR = "SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  RATE_LIMITED = "RATE_LIMITED",
  CONFLICT = "CONFLICT",

  // Catch-all
  UNKNOWN = "UNKNOWN",
}

/**
 * Maps raw error signals to a canonical ErrorCode.
 * Keeps classification logic in one place for consistency.
 */
function getErrorDetails(error: unknown): { message: string; status?: number } {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : "";
  const status =
    typeof error === "object" && error !== null
      ? ((error as { status?: number; statusCode?: number; code?: number })
          .status ??
        (error as { status?: number; statusCode?: number; code?: number })
          .statusCode ??
        (error as { status?: number; statusCode?: number; code?: number }).code)
      : undefined;
  return { message, status };
}

function classifyError(error: unknown): ErrorCode {
  const { message: msg, status } = getErrorDetails(error);
  const m = (msg || "").toLowerCase();

  // Supabase / HTTP status codes
  if (status === 401 || m.includes("jwt expired"))
    return ErrorCode.AUTH_EXPIRED;
  if (status === 403 || m.includes("permission denied"))
    return ErrorCode.PERMISSION_DENIED;
  if (status === 404 || m.includes("not found")) return ErrorCode.NOT_FOUND;
  if (status === 409 || m.includes("conflict") || m.includes("duplicate"))
    return ErrorCode.CONFLICT;
  if (status === 422 || m.includes("validation"))
    return ErrorCode.VALIDATION_ERROR;
  if (status === 429 || m.includes("rate limit") || m.includes("too many"))
    return ErrorCode.RATE_LIMITED;
  if (
    (status !== undefined && status >= 500) ||
    m.includes("server error") ||
    m.includes("internal")
  )
    return ErrorCode.SERVER_ERROR;

  // Network / timeout patterns
  if (m.includes("timeout") || m.includes("timed out") || m.includes("aborted"))
    return ErrorCode.TIMEOUT;
  if (
    m.includes("network") ||
    m.includes("fetch failed") ||
    m.includes("econnrefused")
  )
    return ErrorCode.NETWORK_OFFLINE;

  return ErrorCode.UNKNOWN;
}

/** Errors that are safe to retry (transient) */
const RETRYABLE_CODES = new Set<ErrorCode>([
  ErrorCode.NETWORK_OFFLINE,
  ErrorCode.TIMEOUT,
  ErrorCode.SERVER_ERROR,
  ErrorCode.RATE_LIMITED,
]);

// ============================================================================
// TYPES
// ============================================================================

export type ErrorType = "network" | "auth" | "execution" | "unknown";

export interface SafeExecuteOptions<T> {
  /** Name of the operation (for logging and analytics) */
  name: string;

  /** The async function to execute */
  fn: () => Promise<T>;

  /** Whether this operation requires authentication */
  requiresAuth?: boolean;

  /** Whether this operation requires network connectivity */
  requiresNetwork?: boolean;

  /** PostHog instance for analytics tracking */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posthog?: { capture: (event: string, properties?: any) => void };

  /** Custom error message to show user */
  errorMessage?: string;

  /** Whether to show alerts to user on error */
  showAlerts?: boolean;

  /** Additional context to log with errors */
  context?: Record<string, unknown>;

  /** Whether to track success events in PostHog */
  trackSuccess?: boolean;

  /** Whether to silence console logs */
  silent?: boolean;

  /**
   * Retry config for transient failures.
   * - `true` → default 2 retries with exponential backoff
   * - `number` → that many retries
   * - `false` / omitted → no retries (current behaviour)
   */
  retry?: boolean | number;

  /**
   * Per-operation timeout in ms. If the fn doesn't resolve
   * within this window it rejects with TIMEOUT.
   */
  timeout?: number;

  /**
   * Severity hint for Sentry. Defaults to "error" for failures.
   * Use "warning" for expected/recoverable issues, "fatal" for
   * critical paths (e.g. payment, onboarding submission).
   */
  severity?: "warning" | "error" | "fatal";
}

export interface SafeExecuteResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorType?: ErrorType;

  /** Canonical error code for dashboards/alerting/support */
  errorCode?: ErrorCode;

  /** Wall-clock ms the operation took (including retries) */
  duration?: number;

  /** How many retry attempts were made (0 = first try succeeded/failed) */
  retryCount?: number;
}

// ============================================================================
// HELPERS
// ============================================================================

/** Race a promise against a timeout */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(
          Object.assign(new Error("Operation timed out"), { code: "TIMEOUT" }),
        ),
      ms,
    );
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

/** Exponential back-off: 1s, 2s, 4s... capped at 8s */
function backoffMs(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt), 8000);
}

/** Build a base context object for Sentry/PostHog enrichment */
function buildBaseContext(name: string, extra: Record<string, unknown>) {
  return {
    operation: name,
    platform: Platform.OS,
    platformVersion: String(Platform.Version),
    ...extra,
  };
}

// ============================================================================
// CORE
// ============================================================================

/**
 * Wraps an async function with safety checks and monitoring
 */
export async function safeExecute<T>({
  name,
  fn,
  requiresAuth = false,
  requiresNetwork = true,
  posthog,
  errorMessage,
  showAlerts = false,
  context = {},
  trackSuccess = false,
  silent = false,
  retry = false,
  timeout,
  severity = "error",
}: SafeExecuteOptions<T>): Promise<SafeExecuteResult<T>> {
  const startTime = Date.now();
  const maxRetries = retry === true ? 2 : typeof retry === "number" ? retry : 0;

  if (!silent) {
    console.log(`🔄 [${name}] Starting execution...`);
  }

  // Pre-flights (network probe + auth.getSession) removed - they added
  // 50-300ms per query and serialized N parallel queries on cold start.
  // Network/auth failures are now caught by classifyError() in the catch
  // below and routed to the same error paths. requiresNetwork and
  // requiresAuth flags are kept on the options type for callers who still
  // pass them, but they no longer block execution.

  // ------------------------------------------------------------------
  // 3. Execute with optional retry + timeout
  // ------------------------------------------------------------------
  let lastError: unknown;
  let attempts = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    attempts = attempt;

    try {
      const task = fn();
      const result = timeout ? await withTimeout(task, timeout) : await task;
      const duration = Date.now() - startTime;

      if (!silent) {
        console.log(
          `✅ [${name}] Completed in ${duration}ms` +
            (attempt > 0 ? ` (after ${attempt} retries)` : ""),
        );
      }

      // Track success in PostHog
      if (trackSuccess && posthog) {
        posthog.capture(`${name}_success`, {
          ...buildBaseContext(name, context),
          duration,
          retryCount: attempt,
        });
      }

      return {
        success: true,
        data: result,
        duration,
        retryCount: attempt,
      };
    } catch (err: unknown) {
      lastError = err;
      const code = classifyError(err);

      // Only retry transient errors; bail immediately on auth/validation/etc.
      if (attempt < maxRetries && RETRYABLE_CODES.has(code)) {
        const delay = backoffMs(attempt);
        if (!silent) {
          console.warn(
            `⏳ [${name}] Attempt ${attempt + 1} failed (${code}), retrying in ${delay}ms...`,
          );
        }
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      // No more retries - fall through to error handling below
      break;
    }
  }

  // ------------------------------------------------------------------
  // 4. All attempts exhausted - handle failure
  // ------------------------------------------------------------------
  const duration = Date.now() - startTime;
  const errorMsg =
    lastError instanceof Error ? lastError.message : "Unknown error occurred";
  const errorCode = classifyError(lastError);

  if (!silent) {
    console.error(
      `❌ [${name}] Failed after ${duration}ms (${attempts + 1} attempt${attempts > 0 ? "s" : ""}):`,
      lastError,
    );
  }

  // Show alert to user
  if (showAlerts) {
    Alert.alert("Error", errorMessage || errorMsg);
  }

  // PostHog event
  posthog?.capture(`${name}_error`, {
    ...buildBaseContext(name, context),
    error: errorMsg,
    errorCode,
    duration,
    retryCount: attempts,
  });

  // Sentry with full context
  Sentry.withScope((scope) => {
    scope.setContext("operation", {
      name,
      errorCode,
      requiresAuth,
      requiresNetwork,
      duration,
      retryCount: attempts,
      ...context,
    });

    scope.setTag("operation", name);
    scope.setTag("errorCode", errorCode);

    scope.setLevel(severity);

    Sentry.addBreadcrumb({
      category: "safeExecute",
      message: `${name} failed [${errorCode}]`,
      level: "error",
      data: { ...context, duration, retryCount: attempts },
    });

    Sentry.captureException(lastError);
  });

  return {
    success: false,
    error: errorMsg,
    errorType: "execution",
    errorCode,
    duration,
    retryCount: attempts,
  };
}

/**
 * React Hook version - automatically provides network and auth state
 */
export function useSafeExecute() {
  return { safeExecute };
}
