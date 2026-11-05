// Flow trace
//   1. User goal: see what GDPR rights they have on Sellers and act on them -
//      access, rectify, erase, port, object.
//   2. State change: each row either opens the system mail composer (DPO
//      requests) or dismisses the (aux) modal stack and pushes into the
//      (protected) tree (e.g. /account/personal-info, /(aux)/delete-account).
//   3. Next: Privacy Policy / Terms rows push their own (aux) screens.
//
// Short on purpose (David, 3 Nov: "excessive"): each right is one row named
// by what it does, what we collect is one sentence, and the three groups carry
// small eyebrow labels (the one screen David asked to have them).

import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { ScrollView, Text } from "@/apps/sellers/components/ui";
import { CONTACT_EMAIL } from "@/apps/sellers/constants/keys";
import { useThemeColors } from "@/hooks/useThemeColors";
import { type RelativePathString, Stack, useRouter } from "expo-router";
import {
  Download,
  FileLock,
  FileText,
  type LucideIcon,
  Mail,
  Pencil,
  ScrollText,
  ShieldOff,
  Trash2,
} from "lucide-react-native";
import React from "react";
import { Alert, Linking } from "react-native";

type Action =
  | { kind: "mail"; subject: string; body: string }
  | { kind: "push"; href: RelativePathString }
  | { kind: "dismiss-and-push"; href: string };

type Right = {
  icon: LucideIcon;
  label: string;
  destructive?: boolean;
  action: Action;
};

function Eyebrow({ children }: { children: string }) {
  const colors = useThemeColors();
  return (
    <Text
      weight="semibold"
      accessibilityRole="header"
      style={{
        fontSize: 12,
        letterSpacing: 0.6,
        textTransform: "uppercase",
        color: colors.muted,
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 8,
      }}
    >
      {children}
    </Text>
  );
}

export default function GDPR() {
  const router = useRouter();
  const colors = useThemeColors();

  const openMail = async (subject: string, body: string) => {
    const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(
          "No mail app found",
          `Email ${CONTACT_EMAIL} from your preferred mail client to submit this request.`,
        );
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Couldn't open mail",
        `Email ${CONTACT_EMAIL} to submit this request.`,
      );
    }
  };

  const onAction = (action: Action) => {
    if (action.kind === "mail") {
      openMail(action.subject, action.body);
      return;
    }
    if (action.kind === "push") {
      router.push(action.href);
      return;
    }
    // We're inside an (aux) modal stack. Dismiss it before pushing into the
    // (protected) tree so the modal doesn't stay on top of the destination.
    router.dismissAll();
    router.push(action.href as RelativePathString);
  };

  const RIGHTS: Right[] = [
    {
      icon: FileText,
      label: "Get a copy of my data",
      action: {
        kind: "mail",
        subject: "GDPR Data Access Request",
        body: "Hi,\n\nI'd like to exercise my right of access under GDPR Article 15 and request a copy of all personal data you hold about me.\n\nAccount email:\nBusiness name:\n\nThanks.",
      },
    },
    {
      icon: Pencil,
      label: "Correct my details",
      action: {
        kind: "dismiss-and-push",
        href: "/(protected)/account/personal-info",
      },
    },
    {
      icon: Download,
      label: "Export my data",
      action: {
        kind: "mail",
        subject: "GDPR Data Portability Request",
        body: "Hi,\n\nI'd like to exercise my right to data portability under GDPR Article 20 and receive my personal data in a structured, machine-readable format (e.g. JSON or CSV).\n\nAccount email:\nBusiness name:\n\nThanks.",
      },
    },
    {
      icon: ShieldOff,
      label: "Object to marketing",
      action: {
        kind: "mail",
        subject: "GDPR Right to Object",
        body: "Hi,\n\nI'd like to exercise my right to object under GDPR Article 21.\n\nWhat I'm objecting to:\nAccount email:\n\nThanks.",
      },
    },
    {
      icon: Trash2,
      label: "Delete my account",
      destructive: true,
      action: {
        kind: "push",
        href: "/(aux)/delete-account" as RelativePathString,
      },
    },
  ];

  return (
    <>
      <Stack.Screen options={{ title: "GDPR" }} />
      <ScrollView
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Eyebrow>Your rights</Eyebrow>
        <SettingsGroup>
          {RIGHTS.map((right) => (
            <SettingsRow
              key={right.label}
              label={right.label}
              Icon={right.icon}
              destructive={right.destructive}
              navigates
              onPress={() => onAction(right.action)}
            />
          ))}
        </SettingsGroup>

        <Eyebrow>What we hold</Eyebrow>
        <Text className="text-[15px] leading-6 px-5" style={{ color: colors.text }}>
          Your business details, how you sign in, your orders, payout details
          (encrypted and held by Stripe), usage analytics and your messages.
        </Text>

        <Eyebrow>Contact</Eyebrow>
        <SettingsGroup>
          <SettingsRow
            label="Data Protection Officer"
            Icon={Mail}
            trailing={CONTACT_EMAIL}
            onPress={() =>
              Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=GDPR%20question`).catch(() => {})
            }
          />
          <SettingsRow
            label="Privacy Policy"
            Icon={FileLock}
            navigates
            href={"/(aux)/privacy" as RelativePathString}
          />
          <SettingsRow
            label="Terms of Service"
            Icon={ScrollText}
            navigates
            href={"/(aux)/terms" as RelativePathString}
          />
        </SettingsGroup>
        <Text className="text-[13px] text-muted px-5 leading-5">
          We reply to every request within 30 days.
        </Text>
      </ScrollView>
    </>
  );
}
