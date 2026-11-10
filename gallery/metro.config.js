const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);
// The Colours screen reads ../tokens.json straight from the kit.
config.watchFolders = [path.resolve(__dirname, "..")];

// Native modules the copied app pages import that Expo Go doesn't ship
// (TAK-1491). Mirrored in tsconfig paths.
const STUBS = {
  "posthog-react-native": "src/gallery/stubs/posthog-react-native.ts",
  "@react-native-google-signin/google-signin": "src/gallery/stubs/google-signin.ts",
  "react-native-mmkv": "src/gallery/stubs/react-native-mmkv.ts",
  "react-native-bottom-tabs": "src/gallery/stubs/react-native-bottom-tabs.ts",
};
// Browser preview (ZESTY_WEB=1, see app.config.js): @expo/ui's SwiftUI and
// Compose modules have no web build, so they render their children.
const WEB_STUB = /^(@expo\/ui\/(swift-ui|jetpack-compose|community)(\/.*)?|expo-symbols)$/;
const resolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) =>
  STUBS[moduleName]
    ? { type: "sourceFile", filePath: path.resolve(__dirname, STUBS[moduleName]) }
    : process.env.ZESTY_WEB && platform === "web" && WEB_STUB.test(moduleName)
      ? { type: "sourceFile", filePath: path.resolve(__dirname, "src/gallery/stubs/web-native.js") }
      : (resolveRequest ?? context.resolveRequest)(context, moduleName, platform);

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./src/globals.css",
  dtsFile: "./src/uniwind-types.d.ts",
});
