// ============================================
// UNIVERSAL USER PROFILE (public.users)
// Data shared across ALL apps (delivery, gymbros, shopping, etc.)

import { useSafeMutation } from "@/hooks/useSafeMutation";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { supabase } from "@/lib/supabase";
import { Database, Tables, TablesUpdate } from "@/apps/void/types/index";
import { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

// ============================================
// AUTH USER (from auth.users)
// ============================================
export function useUserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

// ============================================
// PUBLIC USER DATA (from public.users)
// ============================================
export function useCurrentUser() {
  return useSafeQuery({
    name: "currentUser",
    queryKey: ["current_user"],
    queryFn: async (): Promise<Tables<"users"> | null> => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        throw new Error("No authenticated user found");
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    },
    requiresAuth: true,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// ============================================
// UPDATE PUBLIC USER DATA
// ============================================
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useSafeMutation({
    name: "updateUserProfile",
    mutationFn: async (updates: TablesUpdate<"users">) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    requiresAuth: true,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["current_user"],
      });
    },
  });
}

// ============================================
export const updateUserProfile = async (updates: {
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  date_of_birth?: string; // ISO date string
  height_cm?: number;
  current_weight_kg?: number;
}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Build the update payload
  const updatePayload: UserUpdate = {};

  if (updates.avatar_url !== undefined) {
    updatePayload.avatar_url = updates.avatar_url;
  }
  if (updates.first_name !== undefined) {
    updatePayload.first_name = updates.first_name;
  }
  if (updates.last_name !== undefined) {
    updatePayload.last_name = updates.last_name;
  }
  if (updates.phone_number !== undefined) {
    updatePayload.phone_number = updates.phone_number;
  }
  if (updates.gender !== undefined) {
    updatePayload.gender = updates.gender;
  }
  if (updates.date_of_birth !== undefined) {
    updatePayload.date_of_birth = updates.date_of_birth;
  }
  if (updates.height_cm !== undefined) {
    updatePayload.height_cm = updates.height_cm;
  }
  if (updates.current_weight_kg !== undefined) {
    updatePayload.current_weight_kg = updates.current_weight_kg;
  }

  // Always set updated_at timestamp
  updatePayload.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("users")
    .update(updatePayload)
    .eq("id", user.id);

  if (error) throw error;

};
