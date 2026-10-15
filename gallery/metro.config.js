const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);
// The Colours screen reads ../tokens.json straight from the kit.
config.watchFolders = [path.resolve(__dirname, "..")];

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./src/globals.css",
  dtsFile: "./src/uniwind-types.d.ts",
});
