// Excerpt of hq-node src/main.ts (main, 16 Oct 2026): order of middleware, 404 and the
// global error handler. "// ..." marks hq-node-only code left out.

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
// ... public routers (no auth), then:
app.use(generalRateLimit);
// ... authenticated routers (each router does router.use(path, requireAuth, ...))

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
    path: req.path,
  });
});

// Global error handler - must be last
// Express error-handler: `err` must be typed as `unknown` (or a base Error),
// but Express's ErrorRequestHandler signature uses `any` by design - we narrow
// it ourselves to avoid propagating `any` further.
app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const e = err as {
      message?: string;
      stack?: string;
      name?: string;
      statusCode?: number;
      status?: number;
      type?: string;
      code?: string;
    };
    // Log the error
    logger.error("💥 Unhandled error:", {
      message: e.message,
      stack: e.stack,
      path: req.path,
      method: req.method,
    });

    // Handle specific error types
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation Error",
        details: err.issues,
      });
    }

    // Stripe errors
    if (e.type && e.type.startsWith("Stripe")) {
      return res.status(e.statusCode || 500).json({
        error: "Payment Error",
        message: e.message,
        code: e.code,
      });
    }

    // Default error response
    const statusCode = e.statusCode || e.status || 500;
    res.status(statusCode).json({
      error: e.name || "Internal Server Error",
      message:
        env.NODE_ENV === "production" ? "Something went wrong" : e.message,
      ...(env.NODE_ENV === "development" && { stack: e.stack }),
    });
  },
);
