import { ComposeHost } from "@/components/ui/native/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { Toast } from "@/lib/toast";
import {
  ExtendedFloatingActionButton,
  FloatingActionButton,
  Icon,
  LargeFloatingActionButton,
  Row,
  SmallFloatingActionButton,
  Text as MText,
} from "@expo/ui/jetpack-compose";
import { useState } from "react";

// Shown for completeness. ZESTY's main action is the full-width button at the
// bottom of the screen (DESIGN.md), so apps don't use a FAB.
export default function FabPage() {
  const [expanded, setExpanded] = useState(true);
  if (isIOS) {
    return (
      <DemoPage usage="Compose only. iOS has no floating action button.">
        <Note>iOS: no FAB. A screen's main action is the full-width Button at the bottom; secondary actions go in the header.</Note>
      </DemoPage>
    );
  }
  const add = () => Toast.success("New product");
  return (
    <DemoPage usage='Compose: import { FloatingActionButton, SmallFloatingActionButton, LargeFloatingActionButton, ExtendedFloatingActionButton } from "@expo/ui/jetpack-compose". Not used in apps: the main action is the bottom Button.'>
      <Demo title="Small, regular and large">
        <ComposeHost matchContents>
          <Row horizontalArrangement={{ spacedBy: 16 }} verticalAlignment="center">
            <SmallFloatingActionButton onClick={add}>
              <SmallFloatingActionButton.Icon>
                <MIcon />
              </SmallFloatingActionButton.Icon>
            </SmallFloatingActionButton>
            <FloatingActionButton onClick={add}>
              <FloatingActionButton.Icon>
                <MIcon />
              </FloatingActionButton.Icon>
            </FloatingActionButton>
            <LargeFloatingActionButton onClick={add}>
              <LargeFloatingActionButton.Icon>
                <MIcon />
              </LargeFloatingActionButton.Icon>
            </LargeFloatingActionButton>
          </Row>
        </ComposeHost>
      </Demo>
      <Demo title="Extended (tap to collapse)">
        <ComposeHost matchContents>
          <ExtendedFloatingActionButton expanded={expanded} onClick={() => setExpanded((e) => !e)}>
            <ExtendedFloatingActionButton.Icon>
              <MIcon />
            </ExtendedFloatingActionButton.Icon>
            <ExtendedFloatingActionButton.Text>
              <MText>New product</MText>
            </ExtendedFloatingActionButton.Text>
          </ExtendedFloatingActionButton>
        </ComposeHost>
      </Demo>
      <Note>iOS: no FAB; the main action is the full-width Button at the bottom.</Note>
    </DemoPage>
  );
}

function MIcon() {
  return <Icon source={MI.add} contentDescription="New product" />;
}
