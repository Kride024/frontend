// packages/utils/src/validatePhone.ts
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * Validates a phone number using google-libphonenumber + India-specific rules
 * @param iso   Country ISO code e.g. "IN", "US"
 * @param code  Country calling code e.g. "+91", "+1"
 * @param num   Phone number without country code e.g. "9876543210"
 * @returns boolean
 */
export function isValidPhone(iso: string | undefined, code: string | undefined, num: string | undefined): boolean {
  if (!iso || !code || !num) return false;

  const clean = num.replace(/\D/g, "");
  const full = `${code}${clean}`;

  try {
    const parsed = phoneUtil.parse(full, iso);

    if (phoneUtil.isValidNumber(parsed)) {
      // Special rule: India must start with 6–9 and be exactly 10 digits
      if (iso === "IN") {
        return clean.length === 10 && /^[6-9]/.test(clean);
      }
      return true;
    }

    // Fallback for India (in case parsing fails but format is correct)
    if (iso === "IN") {
      return clean.length === 10 && /^[6-9]/.test(clean);
    }

    return false;
  } catch (error) {
    // Final fallback — especially useful in SSR or if lib fails
    if (iso === "IN") {
      return clean.length === 10 && /^[6-9]/.test(clean);
    }
    return false;
  }
}