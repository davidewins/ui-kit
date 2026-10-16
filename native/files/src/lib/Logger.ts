// src/lib/Logger.ts

// Toggle manually or via env vars
const IS_DEBUG_MODE = __DEV__;
const SHOW_INFO = true;

class Logger {
  static log(...args: unknown[]) {
    if (!IS_DEBUG_MODE || !SHOW_INFO) return;
    console.log("📝 [LOG]:", ...args);
  }

  static warn(...args: unknown[]) {
    if (!IS_DEBUG_MODE) return;
    console.warn("⚠️ [WARN]:", ...args);
  }

  static error(...args: unknown[]) {
    // We might ALWAYS want to see errors, even in production
    console.error("❌ [ERROR]:", ...args);

    // Optional: Send to Sentry here
    // Sentry.captureException(args[0]);
  }
}

export default Logger;
