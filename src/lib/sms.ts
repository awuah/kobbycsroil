/**
 * Arkesel SMS Gateway Integration
 * Sender ID: KOBBYMP
 */

const DEFAULT_ARKESEL_KEY = "OmpKdHhGSDdoTkVDclpseHg=";

export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[^\d+]/g, "").trim();
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

export async function sendArkeselSMS(
  recipient: string,
  message: string,
  customApiKey?: string
): Promise<{ success: boolean; error?: string; response?: string }> {
  try {
    const apiKey =
      customApiKey ||
      process.env.ARKESEL_API_KEY ||
      DEFAULT_ARKESEL_KEY;

    const formattedRecipient = sanitizePhoneNumber(recipient);

    if (!formattedRecipient) {
      console.warn("Arkesel SMS: Empty or invalid recipient number.");
      return { success: false, error: "Invalid recipient phone number" };
    }

    const url = new URL("https://sms.arkesel.com/sms/api");
    url.searchParams.set("action", "send-sms");
    url.searchParams.set("api_key", apiKey.trim());
    url.searchParams.set("to", formattedRecipient);
    url.searchParams.set("from", "KOBBYMP");
    url.searchParams.set("sms", message);

    console.log(`[SMS] Sending via KOBBYMP to: ${formattedRecipient}...`);

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(`[SMS] Arkesel HTTP Failed (${response.status}):`, responseText);
      return { success: false, error: `HTTP ${response.status}: ${responseText}` };
    }

    console.log(`[SMS] Arkesel response:`, responseText);
    return { success: true, response: responseText };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    console.error("[SMS] Arkesel SMS error:", msg);
    return { success: false, error: msg };
  }
}

/**
 * Sends immediate confirmation SMS upon registration/expression of interest submission.
 * Simply informs the applicant of receipt and to await confirmation on the success of their application.
 */
export async function sendRegistrationReceivedSMS(applicant: {
  full_name: string;
  phone_number: string;
  registration_number: string;
}) {
  const firstName = applicant.full_name.trim().split(/\s+/)[0] || applicant.full_name;
  const message = `Dear ${firstName}, your application for the 5-Day Palm Oil Processing & Value Addition Training (Ref: ${applicant.registration_number}) has been received. Please await confirmation on the success of your application. Thank you!`;

  return await sendArkeselSMS(applicant.phone_number, message);
}

/**
 * Sends confirmation SMS when an admin confirms an applicant's seat.
 */
export async function sendRegistrationConfirmedSMS(applicant: {
  full_name: string;
  phone_number: string;
  registration_number: string;
}) {
  const firstName = applicant.full_name.trim().split(/\s+/)[0] || applicant.full_name;
  const message = `Congratulations ${firstName}! Your application for the 5-Day Palm Oil Processing & Value Addition Training (Ref: ${applicant.registration_number}) has been CONFIRMED. Date: 26th-30th Nov 2026, 08:00 AM at Government Secretariat, Takoradi. Contact Abena: +233242108535.`;

  return await sendArkeselSMS(applicant.phone_number, message);
}
