// Gallery: react-native-bottom-tabs is a native module Expo Go doesn't ship.
// FuseTopTabs only reads its tab bar height; the gallery has no tab bar.
import { createContext } from "react";

export const BottomTabBarHeightContext = createContext<number | undefined>(undefined);
