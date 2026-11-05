import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { BottomSwitch } from "@/gallery/BottomSwitch";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { MENU } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  AnimatedVisibility,
  Box,
  Column,
  CompositionLocalProvider,
  EnterTransition,
  ExitTransition,
  FilledTonalButton,
  FlowRow,
  HorizontalDivider,
  IconButton,
  Icon,
  Row,
  Shape,
  Spacer as MSpacer,
  Text as MText,
  VerticalDivider,
} from "@expo/ui/jetpack-compose";
import {
  background as mBackground,
  fillMaxWidth,
  height,
  paddingAll,
  size,
  weight,
} from "@expo/ui/jetpack-compose/modifiers";
import {
  Background,
  Button,
  Capsule,
  Circle,
  ConcentricRectangle,
  Divider,
  EdgeCornerStyle,
  Ellipse,
  Grid,
  Group,
  HStack,
  Mask,
  Namespace,
  Overlay,
  Rectangle,
  RoundedRectangle,
  ScrollView,
  Spacer,
  Text,
  UnevenRoundedRectangle,
  VStack,
  ZStack,
  withAnimation,
} from "@expo/ui/swift-ui";
import {
  Animation,
  background,
  buttonStyle,
  font,
  foregroundStyle,
  frame,
  matchedGeometryEffect,
  padding,
  shapes,
} from "@expo/ui/swift-ui/modifiers";
import { MI } from "@/gallery/composeIcons";
import { useId, useState } from "react";

const PARTS = ["Stacks", "Shapes", "Effects"] as const;
const HOURS = [
  ["Mon to Thu", "11:00", "22:00"],
  ["Fri, Sat", "11:00", "23:30"],
  ["Sun", "12:00", "21:00"],
] as const;

// Pure layout primitives: no kit wrappers, used inside native islands.
export default function LayoutPage() {
  const [part, setPart] = useState(0);
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: VStack, HStack, ZStack, Spacer, Divider, Grid, Group, ScrollView, shapes, Overlay, Background, Mask, Namespace from "@expo/ui/swift-ui".'
          : 'Compose: Row, Column, Box, FlowRow, Spacer, dividers, Shape, AnimatedVisibility, CompositionLocalProvider from "@expo/ui/jetpack-compose".'
      }
      bottom={<BottomSwitch values={PARTS} selectedIndex={part} onChange={setPart} accessibilityLabel="Layout part" />}
    >
      {isIOS ? <SwiftLayout part={part} /> : <ComposeLayout part={part} />}
      <Note>{isIOS ? "Android: Compose Row, Column, Box, FlowRow, Shape and AnimatedVisibility." : "iOS: SwiftUI stacks, Grid, shapes, Overlay, Mask and matched geometry."}</Note>
    </DemoPage>
  );
}

function SwiftLayout({ part }: { part: number }) {
  const colors = useThemeColors();
  const body = [font({ family: "Geist-Medium", size: 15 })];
  const muted = [font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted)];
  const ns = useId();
  const [sel, setSel] = useState(0);

  if (part === 0) {
    return (
      <>
        <Demo title="VStack, HStack, Spacer, Divider">
          <SwiftHost matchContents={{ vertical: true }}>
            <VStack alignment="leading" spacing={10}>
              {MENU.slice(0, 3).map((m, i) => (
                <Group key={m.name}>
                  {i > 0 ? <Divider /> : null}
                  <HStack>
                    <Text modifiers={body}>{m.name}</Text>
                    <Spacer />
                    <Text modifiers={muted}>{m.price}</Text>
                  </HStack>
                </Group>
              ))}
            </VStack>
          </SwiftHost>
        </Demo>
        <Demo title="ZStack: rider avatar with initials">
          <SwiftHost matchContents>
            <ZStack>
              <Circle modifiers={[frame({ width: 56, height: 56 }), foregroundStyle(colors.text)]} />
              <Text modifiers={[font({ family: "Geist-SemiBold", size: 18 }), foregroundStyle(colors.background)]}>CM</Text>
            </ZStack>
          </SwiftHost>
        </Demo>
        <Demo title="Grid: opening hours">
          <SwiftHost matchContents={{ vertical: true }}>
            <Grid alignment="leading" horizontalSpacing={24} verticalSpacing={8}>
              {HOURS.map(([d, o, c]) => (
                <Grid.Row key={d}>
                  <Text modifiers={body}>{d}</Text>
                  <Text modifiers={muted}>{o}</Text>
                  <Text modifiers={muted}>{c}</Text>
                </Grid.Row>
              ))}
            </Grid>
          </SwiftHost>
        </Demo>
        <Demo title="ScrollView (horizontal)">
          <SwiftHost style={{ height: 44 }}>
            <ScrollView axes="horizontal" showsIndicators={false}>
              <HStack spacing={8}>
                {MENU.map((m) => (
                  <Text key={m.name} modifiers={[...body, padding({ horizontal: 14, vertical: 10 }), background(colors.surface, shapes.capsule())]}>
                    {m.tag}
                  </Text>
                ))}
              </HStack>
            </ScrollView>
          </SwiftHost>
        </Demo>
      </>
    );
  }

  if (part === 1) {
    const box = [frame({ width: 64, height: 64 }), foregroundStyle(colors.text)];
    return (
      <Demo title="Rectangle, RoundedRectangle, Circle, Ellipse, Capsule, UnevenRoundedRectangle, ConcentricRectangle">
        <SwiftHost matchContents={{ vertical: true }}>
          <VStack alignment="leading" spacing={12}>
            <HStack spacing={12}>
              <Rectangle modifiers={box} />
              <RoundedRectangle cornerRadius={16} modifiers={box} />
              <Circle modifiers={box} />
              <Ellipse modifiers={[frame({ width: 88, height: 56 }), foregroundStyle(colors.text)]} />
            </HStack>
            <HStack spacing={12}>
              <Capsule cornerStyle="continuous" modifiers={[frame({ width: 100, height: 44 }), foregroundStyle(colors.text)]} />
              <UnevenRoundedRectangle topLeadingRadius={24} bottomTrailingRadius={24} modifiers={box} />
              <ConcentricRectangle
                corners={{ topLeadingCorner: EdgeCornerStyle.concentric(12), bottomTrailingCorner: EdgeCornerStyle.fixed(4) }}
                modifiers={box}
              />
            </HStack>
          </VStack>
        </SwiftHost>
      </Demo>
    );
  }

  return (
    <>
      <Demo title="Overlay: a count on a basket">
        <SwiftHost matchContents>
          <Overlay alignment="topTrailing">
            <RoundedRectangle cornerRadius={16} modifiers={[frame({ width: 64, height: 64 }), foregroundStyle(colors.surface)]} />
            <Overlay.Content>
              <Text modifiers={[font({ family: "Geist-SemiBold", size: 12 }), foregroundStyle("#ffffff"), padding({ horizontal: 7, vertical: 3 }), background(colors.error, shapes.capsule())]}>3</Text>
            </Overlay.Content>
          </Overlay>
        </SwiftHost>
      </Demo>
      <Demo title="Background: content behind a label">
        <SwiftHost matchContents>
          <Background alignment="center">
            <Text modifiers={[font({ family: "Geist-SemiBold", size: 15 }), foregroundStyle(colors.background), padding({ horizontal: 16, vertical: 10 })]}>Open until 22:00</Text>
            <Background.Content>
              <Capsule modifiers={[foregroundStyle(colors.text)]} />
            </Background.Content>
          </Background>
        </SwiftHost>
      </Demo>
      <Demo title="Mask: text cut out of a gradient">
        <SwiftHost matchContents>
          <Mask>
            <Rectangle
              modifiers={[
                frame({ width: 220, height: 44 }),
                foregroundStyle({ type: "linearGradient", colors: [colors.text, colors.muted], startPoint: { x: 0, y: 0 }, endPoint: { x: 1, y: 0 } }),
              ]}
            />
            <Mask.Content>
              <Text modifiers={[font({ family: "Geist-Bold", size: 34 })]}>BAO HOUSE</Text>
            </Mask.Content>
          </Mask>
        </SwiftHost>
      </Demo>
      <Demo title="Namespace + matchedGeometryEffect + withAnimation">
        <SwiftHost matchContents>
          <Namespace id={ns}>
            <HStack spacing={4} modifiers={[padding({ all: 4 }), background(colors.surface, shapes.capsule())]}>
              {["Delivery", "Collection"].map((label, i) => (
                <Button key={label} onPress={() => withAnimation(Animation.snappy(), () => setSel(i))} modifiers={[buttonStyle("plain")]}>
                  <Background>
                    <Text
                      modifiers={[
                        font({ family: "Geist-SemiBold", size: 15 }),
                        foregroundStyle(sel === i ? colors.background : colors.text),
                        padding({ horizontal: 16, vertical: 8 }),
                      ]}
                    >
                      {label}
                    </Text>
                    <Background.Content>
                      {sel === i ? <Capsule modifiers={[foregroundStyle(colors.text), matchedGeometryEffect("pill", ns)]} /> : <Spacer />}
                    </Background.Content>
                  </Background>
                </Button>
              ))}
            </HStack>
          </Namespace>
        </SwiftHost>
      </Demo>
    </>
  );
}

function ComposeLayout({ part }: { part: number }) {
  const colors = useThemeColors();
  const [shown, setShown] = useState(true);

  if (part === 0) {
    return (
      <>
        <Demo title="Column, Row, Spacer, HorizontalDivider">
          <ComposeHost matchContents={{ vertical: true }}>
            <Column verticalArrangement={{ spacedBy: 10 }} modifiers={[fillMaxWidth()]}>
              {MENU.slice(0, 3).map((m) => (
                <Column key={m.name} verticalArrangement={{ spacedBy: 10 }}>
                  <Row modifiers={[fillMaxWidth()]}>
                    <MText>{m.name}</MText>
                    <MSpacer modifiers={[weight(1)]} />
                    <MText color={colors.muted}>{m.price}</MText>
                  </Row>
                  <HorizontalDivider />
                </Column>
              ))}
            </Column>
          </ComposeHost>
        </Demo>
        <Demo title="Box: rider avatar with initials">
          <ComposeHost matchContents>
            <Box contentAlignment="center" modifiers={[size(56, 56)]}>
              <Shape.Circle color={colors.text} modifiers={[size(56, 56)]} />
              <MText color={colors.background} style={{ fontFamily: "Geist-SemiBold", fontSize: 18 }}>CM</MText>
            </Box>
          </ComposeHost>
        </Demo>
        <Demo title="Row with VerticalDivider">
          <ComposeHost matchContents={{ vertical: true }}>
            <Row horizontalArrangement={{ spacedBy: 16 }} verticalAlignment="center" modifiers={[height(40)]}>
              <MText>38 orders</MText>
              <VerticalDivider />
              <MText>€912.40</MText>
              <VerticalDivider />
              <MText>4.8 rating</MText>
            </Row>
          </ComposeHost>
        </Demo>
        <Demo title="FlowRow: tags wrap">
          <ComposeHost matchContents={{ vertical: true }}>
            <FlowRow horizontalArrangement={{ spacedBy: 8 }} verticalArrangement={{ spacedBy: 8 }}>
              {MENU.map((m) => (
                <Box key={m.name} modifiers={[mBackground(colors.border), paddingAll(10)]}>
                  <MText>{m.name}</MText>
                </Box>
              ))}
            </FlowRow>
          </ComposeHost>
        </Demo>
      </>
    );
  }

  if (part === 1) {
    const s = [size(64, 64)];
    return (
      <Demo title="Shape: Star, PillStar, Pill, Circle, Rectangle, Polygon, RoundedCorner">
        <ComposeHost matchContents={{ vertical: true }}>
          <FlowRow horizontalArrangement={{ spacedBy: 12 }} verticalArrangement={{ spacedBy: 12 }}>
            <Shape.Star verticesCount={8} innerRadius={0.7} cornerRounding={0.1} color={colors.text} modifiers={s} />
            <Shape.PillStar verticesCount={10} innerRadius={0.8} color={colors.text} modifiers={s} />
            <Shape.Pill color={colors.text} modifiers={[size(100, 44)]} />
            <Shape.Circle color={colors.text} modifiers={s} />
            <Shape.Rectangle cornerRounding={0.2} color={colors.text} modifiers={s} />
            <Shape.Polygon verticesCount={6} cornerRounding={0.1} color={colors.text} modifiers={s} />
            <Shape.RoundedCorner cornerRadii={{ topStart: 24, bottomEnd: 24 }} color={colors.text} modifiers={s} />
          </FlowRow>
        </ComposeHost>
      </Demo>
    );
  }

  return (
    <>
      <Demo title="AnimatedVisibility">
        <ComposeHost matchContents={{ vertical: true }}>
          <Column verticalArrangement={{ spacedBy: 12 }}>
            <FilledTonalButton onClick={() => setShown((v) => !v)}>
              <MText>{shown ? "Hide allergens" : "Show allergens"}</MText>
            </FilledTonalButton>
            <AnimatedVisibility
              visible={shown}
              enterTransition={EnterTransition.expandVertically().plus(EnterTransition.fadeIn())}
              exitTransition={ExitTransition.shrinkVertically().plus(ExitTransition.fadeOut())}
            >
              <MText color={colors.muted}>Contains gluten, soy and sesame.</MText>
            </AnimatedVisibility>
          </Column>
        </ComposeHost>
      </Demo>
      <Demo title="CompositionLocalProvider: compact touch targets">
        <ComposeHost matchContents>
          <CompositionLocalProvider values={{ minimumInteractiveComponentSize: 0 }}>
            <Row horizontalArrangement={{ spacedBy: 0 }}>
              <IconButton onClick={() => {}}>
                <Icon source={MI.remove} contentDescription="Remove one" />
              </IconButton>
              <IconButton onClick={() => {}}>
                <Icon source={MI.add} contentDescription="Add one" />
              </IconButton>
            </Row>
          </CompositionLocalProvider>
        </ComposeHost>
      </Demo>
    </>
  );
}
