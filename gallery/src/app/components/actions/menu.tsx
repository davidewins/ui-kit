import { Text, View } from "@/components/ui";
import { Menu } from "@/components/ui/actions/Menu";
import { ComposeHost } from "@/components/ui/native/NativeHost";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { PREP_TIMES } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import {
  Box,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPopup,
  FilledTonalButton,
  Text as MText,
} from "@expo/ui/jetpack-compose";
import { useState } from "react";

const SORTS = ["Newest first", "Oldest first", "Highest total"] as const;

export default function MenuPage() {
  const colors = useThemeColors();
  const [sort, setSort] = useState<string>(SORTS[0]);
  const [prep, setPrep] = useState<string>(PREP_TIMES[1]);

  return (
    <DemoPage usage='import { Menu } from "@/components/ui/actions/Menu". iOS: SwiftUI Menu. Android: Compose DropdownMenu.'>
      <Demo title="Actions">
        <View style={{ flexDirection: "row" }}>
          <Menu
            label="Order #1042"
            systemImage="ellipsis.circle"
            items={[
              { label: "Print ticket", systemImage: "printer", onPress: () => Toast.success("Ticket printed") },
              { label: "Message customer", systemImage: "message", onPress: () => Toast.info("Opening chat with Aoife") },
              { label: "Cancel order", systemImage: "xmark.circle", destructive: true, onPress: () => Toast.error("Order cancelled") },
            ]}
          />
        </View>
      </Demo>
      <Demo title="Single choice">
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Menu
            label={sort}
            systemImage="arrow.up.arrow.down"
            items={SORTS.map((s) => ({ label: s, selected: s === sort, onPress: () => setSort(s) }))}
          />
          <Menu label={`Prep ${prep}`} items={PREP_TIMES.map((p) => ({ label: p, selected: p === prep, onPress: () => setPrep(p) }))} />
        </View>
        <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>
          Orders sorted {sort.toLowerCase()}, prep time {prep}.
        </Text>
      </Demo>
      {isIOS ? (
        <Note>Android: the same Menu opens a Material 3 DropdownMenu; grouped menus use DropdownMenuPopup and DropdownMenuGroup.</Note>
      ) : (
        <GroupedMenu />
      )}
    </DemoPage>
  );
}

// Material 3 expressive grouped menu: a popup holding separate groups.
function GroupedMenu() {
  const colors = useThemeColors();
  const [open, setOpen] = useState(false);
  const pick = (m: string) => () => {
    setOpen(false);
    Toast.info(m);
  };
  return (
    <Demo title="Grouped (DropdownMenuPopup + DropdownMenuGroup)">
      <ComposeHost matchContents>
        <Box>
          <FilledTonalButton onClick={() => setOpen(true)}>
            <MText>Store status</MText>
          </FilledTonalButton>
          <DropdownMenuPopup expanded={open} onDismissRequest={() => setOpen(false)}>
          <DropdownMenuGroup shapes={{ index: 0, count: 2 }}>
            <DropdownMenuItem onClick={pick("Pausing for 30 min")}>
              <DropdownMenuItem.Text>
                <MText>Pause 30 min</MText>
              </DropdownMenuItem.Text>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={pick("Busy mode on")}>
              <DropdownMenuItem.Text>
                <MText>Busy mode</MText>
              </DropdownMenuItem.Text>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup shapes={{ index: 1, count: 2 }}>
            <DropdownMenuItem onClick={pick("Closed for the day")} elementColors={{ textColor: colors.error }}>
              <DropdownMenuItem.Text>
                <MText>Close for the day</MText>
              </DropdownMenuItem.Text>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          </DropdownMenuPopup>
        </Box>
      </ComposeHost>
    </Demo>
  );
}
