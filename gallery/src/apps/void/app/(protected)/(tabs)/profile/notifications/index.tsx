import { LoadErrorState } from "@/components/LoadErrorState";
import { ScrollView, SkeletonList, Text, View } from "@/components/ui";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SegmentedControl } from "@/components/ui/inputs/SegmentedControl";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow, type SettingsIcon } from "@/components/ui/lists/SettingsRow";
import { Switch } from "@/components/ui/inputs/Switch";
import { API_URL } from "@/apps/void/constants/keys";
import { useSafeMutation } from "@/hooks/useSafeMutation";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { useCurrentUser } from "@/apps/void/hooks/useUserProfile";
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/apps/void/lib/utils/fetchWithTimeout";
import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import {
  Heart,
  Mail,
  MessageCircle,
  Newspaper,
  Package,
  Receipt,
  Shield,
  ShoppingBasket,
  Tag,
} from "lucide-react-native";
import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "@/lib/toast";

type NotificationRow = {
  key: keyof NotificationSettings;
  title: string;
  icon: SettingsIcon;
  /** Always on: the switch shows on and can't be turned off. */
  locked?: boolean;
};

// iOS Settings > Notifications on kit parts: a plain section title over each
// group (so the groups read apart with or without a card fill), the switch as
// the row accessory, one footnote, and the Push / Email switch at the bottom.
type NotificationSection = { title: string; rows: NotificationRow[] };

const PUSH_SECTIONS: NotificationSection[] = [
  { title: "Orders", rows: [{ key: "order_updates", title: "Order updates", icon: Package }] },
  {
    title: "Messages",
    rows: [
      { key: "chat_messages", title: "Chat messages", icon: MessageCircle },
      { key: "chat_reactions", title: "Message reactions", icon: Heart },
    ],
  },
  {
    title: "Deals",
    rows: [
      { key: "promotions", title: "Promotions", icon: Tag },
      { key: "basket_reminders", title: "Basket reminders", icon: ShoppingBasket },
    ],
  },
  { title: "Security", rows: [{ key: "security_alerts", title: "Security alerts", icon: Shield, locked: true }] },
];

const EMAIL_SECTIONS: NotificationSection[] = [
  {
    title: "Orders",
    rows: [
      { key: "email_receipts", title: "Order receipts", icon: Receipt },
      { key: "email_order_updates", title: "Order status emails", icon: Mail },
    ],
  },
  {
    title: "Deals",
    rows: [
      { key: "email_promotions", title: "Marketing emails", icon: Tag },
      { key: "email_weekly_summary", title: "Weekly digest", icon: Newspaper },
    ],
  },
];

const TABS = ["Push", "Email"] as const;

interface NotificationSettings {
  // Push
  order_updates: boolean;
  chat_messages: boolean;
  chat_reactions: boolean;
  promotions: boolean;
  basket_reminders: boolean;
  security_alerts: boolean;
  // Email
  email_receipts: boolean;
  email_order_updates: boolean;
  email_promotions: boolean;
  email_weekly_summary: boolean;
}

interface NotificationMutationContext {
  previousSettings?: NotificationSettings | null;
}

export default function NotificationSettingsScreen() {
  const { data: profile } = useCurrentUser();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(0);
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: settings,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useSafeQuery({
    name: "notificationSettings",
    queryKey: ["notificationSettings", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      // Try API first
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.access_token) {
        try {
          const response = await fetchWithTimeout(
            `${API_URL}/api/notification-settings`,
            {
              headers: {
                Authorization: `Bearer ${session.session.access_token}`,
              },
            },
            8000,
          );

          if (response.ok) {
            const data = await response.json();
            return data.settings as NotificationSettings;
          }
        } catch {
          // Fall through to Supabase direct query
        }
      }

      // Fallback to direct Supabase query
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", profile.id)
        .single();

      if (error) {
        // Create default settings if none exist
        if (error.code === "PGRST116") {
          const { data: newSettings } = await supabase
            .from("notification_settings")
            .insert({ user_id: profile.id })
            .select()
            .single();
          return newSettings as NotificationSettings;
        }
        throw error;
      }
      return data as NotificationSettings;
    },
    enabled: !!profile?.id,
  });

  const mutation = useSafeMutation<void, Partial<NotificationSettings>>({
    name: "updateNotificationSettings",
    mutationFn: async (updates: Partial<NotificationSettings>) => {
      // Try API first
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.access_token) {
        const response = await fetchWithTimeout(
          `${API_URL}/api/notification-settings`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.session.access_token}`,
            },
            body: JSON.stringify(updates),
          },
          8000,
        );

        if (response.ok) {
          return;
        }
      }

      // Fallback to direct Supabase
      const { error } = await supabase.from("notification_settings").upsert({
        user_id: profile?.id || "",
        ...settings,
        ...updates,
      });

      if (error) throw error;
    },
    requiresAuth: true,
    onMutate: async (updates): Promise<NotificationMutationContext> => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: ["notificationSettings", profile?.id],
      });
      const previousSettings =
        queryClient.getQueryData<NotificationSettings | null>([
          "notificationSettings",
          profile?.id,
        ]);
      queryClient.setQueryData(
        ["notificationSettings", profile?.id],
        (old: NotificationSettings | null) => ({ ...old, ...updates }),
      );
      return { previousSettings };
    },
    onError: (_errorMessage, _variables, context) => {
      const mutationContext = context as
        | NotificationMutationContext
        | undefined;
      if (mutationContext?.previousSettings) {
        queryClient.setQueryData(
          ["notificationSettings", profile?.id],
          mutationContext.previousSettings,
        );
      }
      Toast.error("Failed to update setting");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notificationSettings", profile?.id],
      });
    },
  });

  const toggleSetting = (key: string) => {
    if (!settings) return;
    const currentValue = settings[key as keyof NotificationSettings];
    mutation.mutate({ [key]: !currentValue });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 8 }}
      >
        <Stack.Screen options={{ title: "Notifications" }} />
        <SkeletonList count={6} />
      </ScrollView>
    );
  }

  if (isError || !settings) {
    return (
      <View className="flex-1 bg-background">
        <Stack.Screen options={{ title: "Notifications" }} />
        <LoadErrorState
          title="Couldn't load settings"
          message="We couldn't load your notification settings. Try again."
          onRetry={() => refetch()}
          retrying={isRefetching}
        />
      </View>
    );
  }

  const sections = tab === 0 ? PUSH_SECTIONS : EMAIL_SECTIONS;

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: "Notifications" }} />
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {sections.map((section) => (
          <View key={section.title}>
            <SectionTitle>{section.title}</SectionTitle>
            <SettingsGroup>
              {section.rows.map((row) => (
                <SettingsRow
                  key={row.key}
                  label={row.title}
                  Icon={row.icon}
                  accessory={
                    <Switch
                      value={row.locked ? true : (settings[row.key] ?? true)}
                      onValueChange={() => toggleSetting(row.key)}
                      disabled={row.locked}
                      accessibilityLabel={row.title}
                    />
                  }
                />
              ))}
            </SettingsGroup>
          </View>
        ))}

        <Text className="text-[13px] text-muted px-5 leading-5">
          {tab === 0
            ? "Security alerts stay on so you always hear about changes to your account."
            : "Receipts arrive after every order. Marketing emails stay off unless you turn them on."}
        </Text>
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: (insets.bottom || 16) + 4 }}>
        <SegmentedControl
          values={TABS}
          selectedIndex={tab}
          onChange={setTab}
          size="large"
          accessibilityLabel="Notification type"
        />
      </View>
    </View>
  );
}
