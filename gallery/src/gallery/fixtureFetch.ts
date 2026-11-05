// Stands in for an app's fetchWithTimeout: answers the app's API URLs from
// fixtures instead of the network. Unknown routes get a 404, which every
// caller already handles.
type Handler = (match: RegExpMatchArray, init?: RequestInit) => unknown;

export function makeFixtureFetch(routes: [RegExp, Handler][]) {
  return async function fetchWithTimeout(
    url: string,
    options?: RequestInit,
    _timeout: number = 10000,
  ): Promise<Response> {
    const path = url.replace(/^https?:\/\/[^/]+/, "").split("?")[0];
    for (const [pattern, handler] of routes) {
      const match = path.match(pattern);
      if (match) {
        await new Promise((r) => setTimeout(r, 250));
        return new Response(JSON.stringify(handler(match, options) ?? {}), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    return new Response(JSON.stringify({ error: "Not in the gallery" }), { status: 404 });
  };
}
