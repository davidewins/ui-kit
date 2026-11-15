// ui-kit: copy of davidewins/ui-kit native/files/src/screens/LegalScreen.tsx. Edit it there and sync; local edits fail ui-kit:check.
// LegalScreen: Terms and Privacy policy for every app. Same reading page as
// SELLERS' (aux)/terms and privacy (14/21 body, page inset, 8 top and 32
// bottom padding, spinner while loading, LoadErrorState on failure), with the
// kit SectionTitle for each heading and selectable kit Text for the body.
//
// The screen sets no header options. The app's route:
//   <Stack.Screen options={{ title: "Terms", ...LARGE_TITLE }} />
//   <Stack.Screen options={{ title: "Privacy policy", ...LARGE_TITLE }} />
// LARGE_TITLE comes from lib/stackHeader. The ScrollView is the first child
// with contentInsetAdjustmentBehavior="automatic", so the large title works.
//
// Body text: paragraphs split on a blank line. Apps holding the document as
// markdown (SELLERS' legal_documents.content_markdown) pass it through
// legalSectionsFromMarkdown.
import { LoadErrorState } from "@/components/LoadErrorState";
import { ScrollView, Text, View } from "@/components/ui";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ActivityIndicator } from "react-native";

export interface LegalSection {
  /** Leave out for an opening paragraph with no heading. */
  heading?: string;
  /** Plain text; a blank line starts a new paragraph. */
  body: string;
}

export interface LegalScreenProps {
  /** The document's name, used in the error state ("Couldn't load Terms"). */
  title: string;
  /** When it last changed, shown as "Last updated 3 November 2026". */
  updated?: string;
  sections: readonly LegalSection[];
  /** Closing line, e.g. "Questions? Email privacy@takeover.software". */
  contact?: string;
  onContactPress?: () => void;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export function LegalScreen({ title, updated, sections, contact, onContactPress, loading, error, onRetry }: LegalScreenProps) {
  const colors = useThemeColors();

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }
  if (error) {
    return (
      <LoadErrorState
        title={`Couldn't load ${title}`}
        message="Check your connection and try again."
        onRetry={() => onRetry?.()}
      />
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
    >
      {updated ? (
        <Text selectable weight="medium" style={{ fontSize: 13, lineHeight: 18, color: colors.muted, marginHorizontal: 16 }}>
          Last updated {updated}
        </Text>
      ) : null}
      {sections.map((section, i) => (
        <View key={`${i}-${section.heading ?? ""}`}>
          {section.heading ? <SectionTitle>{section.heading}</SectionTitle> : null}
          {/* A section with no heading follows on at the paragraph gap. */}
          <View style={{ marginHorizontal: 16, gap: 12, marginTop: !section.heading && (i > 0 || updated) ? 12 : 0 }}>
            {paragraphs(section.body).map((p, j) => (
              <Text key={j} selectable style={{ fontSize: 14, lineHeight: 21, color: colors.text }}>
                {p}
              </Text>
            ))}
          </View>
        </View>
      ))}
      {contact ? (
        <Text
          selectable={!onContactPress}
          onPress={onContactPress}
          accessibilityRole={onContactPress ? "link" : undefined}
          weight="medium"
          style={{ fontSize: 13, lineHeight: 18, color: colors.muted, marginHorizontal: 16, marginTop: 24 }}
        >
          {contact}
        </Text>
      ) : null}
    </ScrollView>
  );
}

function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Markdown legal document to sections: each ## or ### heading starts a
 * section, the # title line is dropped (the header carries it), bold and
 * italic markers and link targets are removed, "- " bullets become "• ".
 */
export function legalSectionsFromMarkdown(markdown: string): LegalSection[] {
  const out: LegalSection[] = [];
  let current: { heading?: string; lines: string[] } = { lines: [] };
  const flush = () => {
    const body = current.lines.join("\n").trim();
    if (current.heading || body) out.push({ heading: current.heading, body });
  };
  for (const raw of markdown.split("\n")) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(raw);
    if (heading) {
      if (heading[1].length === 1) continue;
      flush();
      current = { heading: clean(heading[2]), lines: [] };
      continue;
    }
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(raw)) {
      current.lines.push("");
      continue;
    }
    current.lines.push(clean(raw.replace(/^(\s*)[-*+]\s+/, "$1• ")));
  }
  flush();
  return out;
}

function clean(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[^*\w])[*_]([^*_\n]+)[*_](?=[^*\w]|$)/g, "$1$2")
    .trim();
}
