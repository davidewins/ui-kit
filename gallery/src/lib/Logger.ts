// Gallery stand-in for the kit's Logger: console only, no Sentry.
const Logger = {
  log: (...args: unknown[]) => console.log(...args),
  info: (...args: unknown[]) => console.info(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.warn(...args),
  debug: (..._args: unknown[]) => {},
};
export default Logger;
export { Logger };
