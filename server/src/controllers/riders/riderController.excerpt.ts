// Excerpt of hq-node src/controllers/riders/riderController.ts (main, 16 Oct 2026).
// Two handlers verbatim: a GET that reads with res.locals, a POST validated with zod.
import { Request, Response } from "express";
import { z } from "zod";
import supabase from "@/config/supabase";
import { logger } from "@/utils/logger";

export async function getRiderProfile(req: Request, res: Response) {
  const user = res.locals.user;

  try {
    // Select uses columns added by migration - cast to any
    const { data: rider, error } = await supabase
      .from("riders")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !rider) {
      return res.status(404).json({ error: "Rider profile not found" });
    }

    const r = rider as any;
    return res.status(200).json({
      id: r.id,
      is_live: r.is_live,
      status: r.status,
      current_lat: r.current_lat,
      current_lng: r.current_lng,
      vehicle_type: r.vehicle_type,
      reliability_score: r.reliability_score,
      accept_rate: r.accept_rate ?? 1.0,
      today_deliveries: r.today_deliveries ?? 0,
      today_declines: r.today_declines ?? 0,
      today_earnings_cents: r.today_earnings_cents ?? 0,
      location_updated_at: r.location_updated_at,
      referral_code: r.referral_code ?? null,
    });
  } catch (error: unknown) {
    logger.error("Error fetching rider profile", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const redeemReferralSchema = z.object({
  code: z.string().min(1).max(32),
});

export async function redeemReferralCode(req: Request, res: Response) {
  const rider = res.locals.rider as { id: string };

  try {
    const { code } = redeemReferralSchema.parse(req.body);

    const { data: current } = await supabase
      .from("riders")
      .select("referred_by_rider_id")
      .eq("id", rider.id)
      .single();

    if (current?.referred_by_rider_id) {
      return res.status(400).json({ error: "Referral code already set" });
    }

    // Escape ILIKE wildcards (%, _) in the human-entered code so it's matched
    // literally - otherwise a code like "A%" lets a caller enumerate/guess
    // real referral codes one character at a time via the match/no-match
    // response, rather than needing the exact code.
    const escapedCode = code
      .trim()
      .replace(/\\/g, "\\\\")
      .replace(/%/g, "\\%")
      .replace(/_/g, "\\_");

    const { data: referrer } = await supabase
      .from("riders")
      .select("id")
      .ilike("referral_code", escapedCode)
      .maybeSingle();

    if (!referrer) {
      return res.status(404).json({ error: "Referral code not found" });
    }

    if (referrer.id === rider.id) {
      return res.status(400).json({ error: "You can't refer yourself" });
    }

    const { error } = await supabase
      .from("riders")
      .update({ referred_by_rider_id: referrer.id })
      .eq("id", rider.id);

    if (error) {
      logger.error("Failed to set referred_by_rider_id", error);
      return res.status(500).json({ error: "Failed to redeem code" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: err.issues });
    }
    logger.error("redeemReferralCode error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
