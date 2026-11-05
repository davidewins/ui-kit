import { Text } from "@/components/ui";
import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { MENU } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Column, DockedSearchBar, Icon, ListItem, SearchBar, Text as MText } from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { List, NavigationStack, Text as SText, useNativeState } from "@expo/ui/swift-ui";
import { navigationBarTitleDisplayMode, navigationTitle, searchable } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

const match = (q: string) => MENU.filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase()));

// The ZESTY home page's header search (headerSearchBarOptions on the
// expo-router Stack) is the app pattern on both platforms. These are the
// in-island native search fields.
export default function SearchPage() {
  const colors = useThemeColors();
  return (
    <DemoPage usage='Screens: headerSearchBarOptions on the expo-router Stack.Screen (see the ZESTY home page). Islands: SwiftUI searchable(), Compose SearchBar / DockedSearchBar.'>
      {isIOS ? <SwiftSearch /> : <ComposeSearch />}
      <Text weight="medium" style={{ fontSize: 13, color: colors.muted, paddingHorizontal: 20, paddingTop: 16 }}>
        {isIOS ? "Android: Compose SearchBar and DockedSearchBar." : "iOS: SwiftUI searchable() on a NavigationStack."}
      </Text>
    </DemoPage>
  );
}

function SwiftSearch() {
  const text = useNativeState("");
  const [q, setQ] = useState("");
  return (
    <Demo title="searchable(): filter the menu">
      <Frame height={400}>
        <SwiftHost style={{ flex: 1 }}>
          <NavigationStack>
            <List
              modifiers={[
                navigationTitle("Menu"),
                navigationBarTitleDisplayMode("inline"),
                searchable(text, { placement: "navigationBarDrawer", prompt: "Search the menu", onChange: setQ }),
              ]}
            >
              {match(q).map((m) => (
                <SText key={m.name}>{`${m.name}   ${m.price}`}</SText>
              ))}
            </List>
          </NavigationStack>
        </SwiftHost>
      </Frame>
    </Demo>
  );
}

function ComposeSearch() {
  const colors = useThemeColors();
  const [docked, setDocked] = useState("");
  const [submitted, setSubmitted] = useState("");
  return (
    <>
      <Demo title={`DockedSearchBar: ${match(docked).length} of ${MENU.length} items`}>
        <ComposeHost matchContents={{ vertical: true }}>
          <Column>
            <DockedSearchBar onQueryChange={setDocked} modifiers={[fillMaxWidth()]}>
              <DockedSearchBar.LeadingIcon>
                <Icon source={MI.search} contentDescription="" />
              </DockedSearchBar.LeadingIcon>
              <DockedSearchBar.Placeholder>
                <MText>Search the menu</MText>
              </DockedSearchBar.Placeholder>
            </DockedSearchBar>
            {match(docked).map((m) => (
              <ListItem key={m.name} colors={{ containerColor: "transparent" }}>
                <ListItem.HeadlineContent>
                  <MText>{m.name}</MText>
                </ListItem.HeadlineContent>
                <ListItem.TrailingContent>
                  <MText color={colors.muted}>{m.price}</MText>
                </ListItem.TrailingContent>
              </ListItem>
            ))}
          </Column>
        </ComposeHost>
      </Demo>
      <Demo title={submitted ? `SearchBar: searched "${submitted}"` : "SearchBar: type and press search"}>
        <ComposeHost matchContents={{ vertical: true }}>
          <SearchBar onSearch={setSubmitted} modifiers={[fillMaxWidth()]}>
            <SearchBar.Placeholder>
              <MText>Search stores</MText>
            </SearchBar.Placeholder>
          </SearchBar>
        </ComposeHost>
      </Demo>
    </>
  );
}
