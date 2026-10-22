/**
 * Format a phone/contact number into a clean, human-readable standard format.
 * Examples:
 *   "+917845120369"  -> "+91 78451 20369"
 *   "917845120369"   -> "+91 78451 20369"
 *   "7845120369"     -> "+91 78451 20369"
 *   "+12125551234"   -> "+1 (212) 555-1234"
 *   "+447911123456"  -> "+44 7911 123456"
 */
export function formatPhoneNumber(phone) {
  if (!phone || typeof phone !== "string") return phone || "";
  const trimmed = phone.trim();
  if (!trimmed) return "";

  // Extract digits only
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return trimmed;

  // 1. Indian numbers:
  // a) 12 digits starting with 91 (e.g. +917845120369 or 917845120369)
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  // b) 11 digits starting with 0 (e.g. 07845120369)
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+91 ${digits.slice(1, 6)} ${digits.slice(6)}`;
  }
  // c) 10 digits starting with 6, 7, 8, 9 (standard Indian mobile numbers)
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // 2. US / Canada numbers:
  // 11 digits starting with 1 (e.g. +12125551234)
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  // 10 digits starting with 2-5
  if (digits.length === 10 && /^[2-5]/.test(digits)) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // 3. Generic international numbers with '+':
  if (trimmed.startsWith("+")) {
    if (digits.length === 12) {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
    }
    if (digits.length > 10) {
      const ccLen = digits.length - 10;
      return `+${digits.slice(0, ccLen)} ${digits.slice(ccLen, ccLen + 5)} ${digits.slice(ccLen + 5)}`;
    }
  }

  // If already contains formatting spaces or dashes, return as-is
  if (/[\s-]/.test(trimmed)) {
    return trimmed;
  }

  // Fallback: chunk into two blocks
  if (digits.length > 5) {
    const half = Math.ceil(digits.length / 2);
    return `${digits.slice(0, half)} ${digits.slice(half)}`;
  }

  return trimmed;
}
