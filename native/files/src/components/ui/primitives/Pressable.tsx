// Metro (uniwind/metro) already resolves react-native's Pressable to uniwind's,
// which handles className, active: variants and function styles. Wrapping it
// again with withUniwind turned style into [classStyles, fn] and RN dropped
// the function, so every style={({ pressed }) => ...} fill vanished.
export { Pressable } from "react-native";
