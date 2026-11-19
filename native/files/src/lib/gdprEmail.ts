// A GDPR rights request by email, the same in every app (David, 19 Nov:
// "present an alert to the user that they're about to create an email. make
// that standard in all apps"). The native alert says Mail is about to open
// with the request written out, and that sending it is what makes the
// request. Open Mail opens the composer; Cancel does nothing.
//
//   requestByEmail({ to: CONTACT_EMAIL, subject: "Data Export Request", name })
import { Toast } from "@/lib/toast";
import { Alert, Linking } from "react-native";

export function requestByEmail({ to, subject, name, body: written }: { to: string; subject: string; name?: string; body?: string }) {
  const body = written ?? `Hi,\n\nI'd like to submit a ${subject.toLowerCase()} under GDPR.\n${name ? `\nName: ${name}` : ""}`;
  const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  Alert.alert(
    "Create an Email?",
    `Mail opens with your ${subject.toLowerCase()} to ${to}, written out. Your request is made when you send it.`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open Mail",
        onPress: () => {
          Linking.openURL(url).catch(() => Toast.error(`Couldn't open Mail. Email us at ${to}`));
        },
      },
    ],
  );
}
