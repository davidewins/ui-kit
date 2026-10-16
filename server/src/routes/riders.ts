/**
 * Rider Routes
 *
 * API endpoints consumed by the Riders mobile app.
 * All endpoints require auth (Bearer token from Supabase Auth).
 */

import { Router } from "express";
import { requireAuth, requireRider } from "@/middleware/auth";
import {
  riderActionRateLimit,
  riderLocationRateLimit,
} from "@/middleware/rateLimit";
import {
  updateLocation,
  updateOnlineStatus,
  acceptAssignment,
  declineAssignment,
  markPickedUp,
  markDelivered,
  markAgeCheckFailed,
  getRiderProfile,
  getActiveAssignment,
  getEarnings,
  getDeliveryHistory,
  redeemReferralCode,
  getReferralSummary,
} from "@/controllers/riders/riderController";
import {
  onboardRider,
  getRiderStatus,
  updateRiderBankAccount,
} from "@/controllers/stripe/riderOnboardingController";
import {
  createIdentityVerification,
  getVerificationStatus,
  getVerifiedData,
} from "@/controllers/stripe/identityController";

const router = Router();

// All rider routes require authentication AND rider role.
// requireRider runs after requireAuth and rejects any user without a row in `riders`.
router.use("/api/riders", requireAuth, requireRider);

// Profile & status
router.get("/api/riders/me", getRiderProfile);
router.post("/api/riders/status", riderActionRateLimit, updateOnlineStatus);

// Location updates (called frequently by background geolocation)
router.post("/api/riders/location", riderLocationRateLimit, updateLocation);

// Active assignment
router.get("/api/riders/active-assignment", getActiveAssignment);

// Earnings & history
router.get("/api/riders/earnings", getEarnings);
router.get("/api/riders/delivery-history", getDeliveryHistory);

// Referrals (TAK-1063)
router.get("/api/riders/referrals", getReferralSummary);
router.post("/api/riders/redeem-referral", riderActionRateLimit, redeemReferralCode);

// Assignment lifecycle
router.post("/api/riders/assignments/:id/accept", acceptAssignment);
router.post("/api/riders/assignments/:id/decline", declineAssignment);
router.post("/api/riders/assignments/:id/picked-up", riderActionRateLimit, markPickedUp);
router.post("/api/riders/assignments/:id/delivered", riderActionRateLimit, markDelivered);
router.post("/api/riders/assignments/:id/age-check-failed", riderActionRateLimit, markAgeCheckFailed);

// Stripe onboarding (for payouts)
router.post("/api/riders/onboard", onboardRider);
router.post("/api/riders/update-bank-account", riderActionRateLimit, updateRiderBankAccount);
router.get("/api/riders/:userId/stripe-status", getRiderStatus);

// Stripe Identity verification (document verification)
router.post("/api/riders/:riderId/verify-identity", createIdentityVerification);
router.get("/api/riders/:riderId/verification-status", getVerificationStatus);
router.get("/api/riders/:riderId/verified-data", getVerifiedData);

export default router;
