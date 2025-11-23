import { appendResponseHeader, getCookie } from "vinxi/http";

const SESSION_COOKIE_NAME = "session_token";

export function getSessionToken(): string | undefined {
  return getCookie(SESSION_COOKIE_NAME);
}

export function setSessionCookie(token: string, expiresAt: Date) {
  const cookieValue = [
    `${SESSION_COOKIE_NAME}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
    `SameSite=Lax`,
    `Expires=${expiresAt.toUTCString()}`,
  ].join("; ");

  appendResponseHeader("Set-Cookie", cookieValue);
}

export function clearSessionCookie() {
  const cookieValue = [
    `${SESSION_COOKIE_NAME}=`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
    `SameSite=Lax`,
    `Max-Age=0`,
  ].join("; ");

  appendResponseHeader("Set-Cookie", cookieValue);
}
