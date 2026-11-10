// ZESTY_WEB=1 serves src/preview in a browser instead of src/app: only the
// screens listed in src/preview/registry.ts, with native-only modules stubbed
// (metro.config.js), so a page's layout can be checked without a phone.
// Without the variable this returns app.json untouched.
module.exports = ({ config }) => {
  if (!process.env.ZESTY_WEB) return config;
  return {
    ...config,
    plugins: config.plugins.map((p) => (p === "expo-router" ? ["expo-router", { root: "src/preview" }] : p)),
    extra: { ...config.extra, router: { ...config.extra?.router, root: "src/preview" } },
  };
};
