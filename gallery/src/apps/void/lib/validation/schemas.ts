/**
 * Shared Zod schemas and form validation helpers.
 * Use parseForm() to validate and get field-level errors for UI.
 */

import { z } from "zod/v3";

// --- Name ---
export const nameSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .regex(
      /^[a-zA-Z\s\-']+$/,
      "Only letters, spaces, hyphens and apostrophes allowed",
    ),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .regex(
      /^[a-zA-Z\s\-']+$/,
      "Only letters, spaces, hyphens and apostrophes allowed",
    ),
});
export type NameFormData = z.infer<typeof nameSchema>;

// --- Email ---
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});
export type EmailFormData = z.infer<typeof emailSchema>;

// --- Phone ---
export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (s) => s.replace(/\D/g, "").length >= 10,
      "Please enter a valid phone number (at least 10 digits)",
    ),
});
export type PhoneFormData = z.infer<typeof phoneSchema>;

// --- Address ---
export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postal code is required"),
  apartmentNumber: z.string().optional(),
});
export type AddressFormData = z.infer<typeof addressSchema>;

// --- Feedback message (support / app feedback) ---
export const feedbackSubjectSchema = z.enum([
  "General Feedback",
  "Bug Report",
  "Feature Request",
  "Delivery Issue",
  "App Experience",
  "Payment Issue",
  "Other",
]);
export const feedbackMessageSchema = z.object({
  subject: feedbackSubjectSchema.optional(),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Please provide at least 10 characters"),
});
export type FeedbackMessageFormData = z.infer<typeof feedbackMessageSchema>;

/** Support feedback form: topic required + message min 10 chars */
export const supportFeedbackSchema = z.object({
  subject: feedbackSubjectSchema,
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Please provide at least 10 characters"),
});
export type SupportFeedbackFormData = z.infer<typeof supportFeedbackSchema>;

/** App feedback (type + message) */
export const appFeedbackSchema = z.object({
  type: z.enum(["general", "bug", "feature", "compliment"], {
    errorMap: () => ({ message: "Please select a feedback type" }),
  }),
  message: z
    .string()
    .min(1, "Feedback is required")
    .min(10, "Please provide at least 10 characters"),
});
export type AppFeedbackFormData = z.infer<typeof appFeedbackSchema>;

// --- Refund request ---
export const refundDescriptionSchema = z.object({
  description: z
    .string()
    .min(1, "Please describe the issue")
    .min(20, "Please provide more detail (at least 20 characters)"),
});
export type RefundDescriptionFormData = z.infer<typeof refundDescriptionSchema>;

// --- OTP ---
export const otpSchema = z.object({
  code: z.string().length(6, "Please enter the 6-digit code"),
});
export type OtpFormData = z.infer<typeof otpSchema>;

// --- Order notes (optional max length) ---
export const orderNoteSchema = z.object({
  note: z.string().max(500, "Note must be 500 characters or less").optional(),
});

/**
 * Parse form data with a Zod schema and return either success + data
 * or failure + field errors for UI (keyed by field name).
 */
export function parseForm<T>(
  schema: z.ZodType<T>,
  data: unknown,
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path[0];
    if (path != null && typeof path === "string" && !errors[path]) {
      errors[path] = err.message;
    }
  });
  return { success: false, errors };
}
