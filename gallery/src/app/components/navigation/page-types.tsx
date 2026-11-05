import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow, type SettingsIcon } from "@/components/ui/lists/SettingsRow";
import { PAGE_TYPES, type PageType } from "@/gallery/catalog";
import { DemoPage, Note } from "@/gallery/DemoPage";
import type { Href } from "expo-router";
import {
  AppWindow,
  ArrowRight,
  Layers,
  Maximize,
  PanelBottom,
  PanelBottomOpen,
  PictureInPicture2,
  RectangleVertical,
  SquareStack,
} from "lucide-react-native";

const ICONS: Record<PageType, SettingsIcon> = {
  card: ArrowRight,
  modal: AppWindow,
  formSheet: PanelBottom,
  fittedFormSheet: PanelBottomOpen,
  pageSheet: RectangleVertical,
  fullScreenModal: Maximize,
  transparentModal: Layers,
  containedModal: SquareStack,
  containedTransparentModal: PictureInPicture2,
};

// What Android shows instead, from react-native-screens' stackPresentation docs.
const ANDROID: [PageType, string][] = [
  ["modal", "Push"],
  ["formSheet", "Bottom sheet"],
  ["fittedFormSheet", "Bottom sheet"],
  ["pageSheet", "Push"],
  ["fullScreenModal", "Push"],
  ["containedModal", "Push"],
  ["containedTransparentModal", "Transparent"],
];

export default function PageTypesPage() {
  return (
    <DemoPage usage='<Stack.Screen name="..." options={{ presentation: "formSheet" }} /> in the _layout.tsx that owns the route. Each row opens a real route declared that way on the gallery root Stack.'>
      <SectionTitle inset={32}>Same on iOS and Android</SectionTitle>
      <Rows types={[["card", undefined], ["transparentModal", undefined]]} />
      <SectionTitle inset={32}>Different on Android</SectionTitle>
      <Rows types={ANDROID} />
      <Note>Android pushes modal like a normal screen, and pageSheet, fullScreenModal and containedModal fall back to modal. formSheet is a Material bottom sheet with no grabber and at most 3 detents. containedTransparentModal falls back to transparentModal.</Note>
    </DemoPage>
  );
}

function Rows({ types }: { types: [PageType, string | undefined][] }) {
  return (
    <SettingsGroup>
      {types.map(([type, android]) => (
        <SettingsRow
          key={type}
          label={PAGE_TYPES[type].title}
          Icon={ICONS[type]}
          trailing={android}
          href={`/${PAGE_TYPES[type].route}` as Href}
          navigates
        />
      ))}
    </SettingsGroup>
  );
}
