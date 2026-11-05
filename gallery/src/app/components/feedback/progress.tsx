import { Text, View } from "@/components/ui";
import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  ContainedLoadingIndicator,
  LinearProgressIndicator,
  LinearWavyProgressIndicator,
  LoadingIndicator,
  Row,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, size } from "@expo/ui/jetpack-compose/modifiers";
import { ProgressView, Text as SText, useNativeState } from "@expo/ui/swift-ui";
import { useMemo } from "react";

// Determinate progress only: a task with a known end. Waiting for data is a
// Skeleton, never a spinner (DESIGN.md §2).
export default function ProgressPage() {
  const colors = useThemeColors();
  return (
    <DemoPage usage='import { ProgressBar } from "@/components/ui/feedback/ProgressBar". iOS: SwiftUI ProgressView. Loading data uses Skeleton, not a spinner.'>
      <Demo title="ProgressBar: uploading menu photos">
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text weight="medium" style={{ fontSize: 13 }}>3 of 5 photos</Text>
          <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>60%</Text>
        </View>
        <ProgressBar value={0.6} accessibilityLabel="Photo upload" />
      </Demo>
      {isIOS ? <Swift /> : <Compose />}
    </DemoPage>
  );
}

function Swift() {
  const window = useMemo(() => {
    const lower = new Date();
    return { lower, upper: new Date(lower.getTime() + 12 * 60 * 1000) };
  }, []);
  return (
    <>
      <Demo title="Timer: order #1042 ready in">
        <SwiftHost matchContents={{ vertical: true }}>
          <ProgressView timerInterval={window} countsDown>
            <SText>Pork belly bao x2</SText>
          </ProgressView>
        </SwiftHost>
      </Demo>
      <Note>Android: Compose linear, circular and wavy progress indicators, plus the expressive LoadingIndicator.</Note>
    </>
  );
}

function Compose() {
  const colors = useThemeColors();
  const progress = useNativeState<number | null>(0.7);
  return (
    <>
      <Demo title="Linear, with stop indicator">
        <ComposeHost matchContents={{ vertical: true }}>
          <LinearProgressIndicator progress={0.6} drawStopIndicator={{ color: colors.text }} modifiers={[fillMaxWidth()]} />
        </ComposeHost>
      </Demo>
      <Demo title="Linear wavy: rider on the way">
        <ComposeHost matchContents={{ vertical: true }}>
          <LinearWavyProgressIndicator progress={0.45} modifiers={[fillMaxWidth()]} />
        </ComposeHost>
      </Demo>
      <Demo title="Circular, circular wavy and loading indicators at 70%">
        <ComposeHost matchContents>
          <Row horizontalArrangement={{ spacedBy: 20 }} verticalAlignment="center">
            <CircularProgressIndicator progress={0.7} modifiers={[size(48, 48)]} />
            <CircularWavyProgressIndicator progress={0.7} modifiers={[size(48, 48)]} />
            <LoadingIndicator progress={progress} />
            <ContainedLoadingIndicator progress={progress} />
          </Row>
        </ComposeHost>
      </Demo>
      <Note>iOS: SwiftUI ProgressView, including a live countdown from a time window.</Note>
    </>
  );
}
