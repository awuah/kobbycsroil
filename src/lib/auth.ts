/**
 * Authorized Administrative Passcodes for CSIR-OPRI & WUSC-Ghana Palm Oil Training Portal
 */

export const VALID_ADMIN_PASSCODES = [
  "KBD9482ADMN",
  "KBD-9482-ADMN",
  "TAK7261DRVE",
  "TAK-7261-DRVE",
  "FREE8394DRV",
  "FREE-8394-DRV",
  "MP6153KOBBY",
  "MP-6153-KOBBY",
  "KBOIL2026ADMN",
  "KBOIL-2026-ADMN",
];

export const SUPER_ADMIN_PASSCODES = [
  "KOBBY9900SUPER",
  "KOBBY-9900-SUPER",
  "KBD7741SUPER",
  "KBD-7741-SUPER",
];

export interface AdminIdentity {
  id: string;
  name: string;
  role: "superadmin" | "admin";
}

export function isSuperAdminPasscode(passcode: string): boolean {
  if (!passcode) return false;
  const clean = passcode.replace(/[\s-]/g, "").toUpperCase();
  if (SUPER_ADMIN_PASSCODES.some((c) => c.replace(/[\s-]/g, "").toUpperCase() === clean)) {
    return true;
  }
  const envSuper = process.env.SUPER_ADMIN_PASSCODE;
  if (envSuper && envSuper.replace(/[\s-]/g, "").toUpperCase() === clean) {
    return true;
  }
  return false;
}

export function isValidAdminPasscode(passcode: string): boolean {
  if (!passcode) return false;
  const cleaned = passcode.trim();
  if (cleaned.toLowerCase() === "admin2026") return false;
  if (isSuperAdminPasscode(cleaned)) return true;

  const cleanAlphanumeric = cleaned.replace(/[\s-]/g, "").toUpperCase();
  if (
    VALID_ADMIN_PASSCODES.some(
      (code) => code.replace(/[\s-]/g, "").toUpperCase() === cleanAlphanumeric
    )
  ) {
    return true;
  }

  const envKey = process.env.ADMIN_SECRET_KEY;
  if (envKey && envKey.toLowerCase() !== "admin2026") {
    const keys = envKey.split(",").map((k) => k.replace(/[\s-]/g, "").toUpperCase());
    if (keys.includes(cleanAlphanumeric)) return true;
  }

  return false;
}

export function getAdminIdentity(passcode: string): AdminIdentity {
  const clean = passcode.replace(/[\s-]/g, "").toUpperCase();
  if (isSuperAdminPasscode(clean)) {
    return { id: "superadmin", name: "Super Admin", role: "superadmin" };
  }
  return { id: clean.slice(0, 6) || "admin", name: `Coordinator (${clean.slice(0, 4)}***)`, role: "admin" };
}

export function getAdminFromRequest(req: {
  headers: { get: (name: string) => string | null };
  cookies: { get: (name: string) => { value: string } | undefined };
}): { isAuthenticated: boolean; isSuperAdmin: boolean; identity: AdminIdentity } {
  let token = "";

  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    token = authHeader.replace("Bearer ", "").trim();
  }
  if (!token) {
    const customHeader = req.headers.get("x-admin-passcode");
    if (customHeader) token = customHeader.trim();
  }
  if (!token) {
    const cookiePass = req.cookies.get("kboil_admin_auth")?.value;
    if (cookiePass) token = decodeURIComponent(cookiePass).trim();
  }

  if (token && isValidAdminPasscode(token)) {
    return {
      isAuthenticated: true,
      isSuperAdmin: isSuperAdminPasscode(token),
      identity: getAdminIdentity(token),
    };
  }

  return {
    isAuthenticated: false,
    isSuperAdmin: false,
    identity: { id: "guest", name: "Guest", role: "admin" },
  };
}
