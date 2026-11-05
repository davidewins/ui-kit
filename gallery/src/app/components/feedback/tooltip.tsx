import { ComposeHost } from "@/components/ui/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { FilledTonalIconButton, Icon, Row, Text as MText, TooltipBox, type TooltipBoxRef } from "@expo/ui/jetpack-compose";
import { useRef } from "react";

// Tooltips are banned in the apps (DESIGN.md §2: they don't exist on touch).
// Shown so the Compose component is documented, with a long-press trigger.
export default function TooltipPage() {
  if (isIOS) {
    return (
      <DemoPage usage="Compose only. Not used in apps: tooltips don't exist on touch (DESIGN.md §2).">
        <Note>iOS: no tooltip. Put the explanation on screen, or in a Popover.</Note>
      </DemoPage>
    );
  }
  return <ComposeTooltips />;
}

function ComposeTooltips() {
  const rich = useRef<TooltipBoxRef>(null);
  return (
    <DemoPage usage='Compose: import { TooltipBox } from "@expo/ui/jetpack-compose". Not used in apps (DESIGN.md §2); explain on screen or use Popover.'>
      <Demo title="Plain and rich (long press each button)">
        <ComposeHost matchContents>
          <Row horizontalArrangement={{ spacedBy: 16 }}>
            <TooltipBox>
              <TooltipBox.PlainTooltip>
                <MText>Add item</MText>
              </TooltipBox.PlainTooltip>
              <FilledTonalIconButton onClick={() => {}}>
                <Icon source={MI.add} contentDescription="Add item" />
              </FilledTonalIconButton>
            </TooltipBox>
            <TooltipBox ref={rich} isPersistent hasAction>
              <TooltipBox.RichTooltip>
                <TooltipBox.RichTooltip.Title>
                  <MText>Busy mode</MText>
                </TooltipBox.RichTooltip.Title>
                <TooltipBox.RichTooltip.Text>
                  <MText>New orders get 15 extra minutes of prep time until you turn it off.</MText>
                </TooltipBox.RichTooltip.Text>
              </TooltipBox.RichTooltip>
              <FilledTonalIconButton onClick={() => rich.current?.show()}>
                <Icon source={MI.moreVert} contentDescription="About busy mode" />
              </FilledTonalIconButton>
            </TooltipBox>
          </Row>
        </ComposeHost>
      </Demo>
      <Note>iOS: no tooltip; explain on screen or use Popover.</Note>
    </DemoPage>
  );
}
