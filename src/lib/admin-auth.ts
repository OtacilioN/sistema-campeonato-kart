import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "velozes_admin";

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function adminToken() {
  const password = process.env.ADMIN_PASSWORD;
  return password ? digest(`velozes:${password}`) : null;
}

export function isAdminCookieValid(value?: string) {
  const expected = adminToken();
  if (!value || !expected || value.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
