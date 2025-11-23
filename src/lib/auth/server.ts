import { cache } from "@solidjs/router";
import { db } from "~/lib/db";
import {
  getSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from "./cookies";
import { getSessionByToken, createSession, deleteSession } from "./session";
import { hashPassword, verifyPassword } from "./password";
import type { User, Profile, Role } from "~/generated/prisma";
import { getRequestEvent } from "solid-js/web";

export type AuthUser = User & { profile: Profile | null };

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  "use server";

  const token = getSessionToken();
  if (!token) {
    return null;
  }

  const session = await getSessionByToken(db, token);
  if (!session) {
    return null;
  }

  // Update last login timestamp
  await db.user.update({
    where: { id: session.user.id },
    data: { lastLoginAt: new Date() },
  });

  return session.user;
}, "current_user");

export async function requireAuth(): Promise<AuthUser> {
  "use server";

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: Role): Promise<AuthUser> {
  "use server";

  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error("Forbidden");
  }
  return user;
}

function getUserAgent(): string | undefined {
  const event = getRequestEvent();
  return event?.request.headers.get("user-agent") || undefined;
}

function getIpAddress(): string | undefined {
  const event = getRequestEvent();
  return (
    event?.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    event?.request.headers.get("x-real-ip") ||
    undefined
  );
}

export async function signUp(data: {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}): Promise<{ success: boolean; error?: string }> {
  "use server";

  try {
    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      return { success: false, error: "Email already in use" };
    }

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      return { success: false, error: "Username already in use" };
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user with profile
    const user = await db.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        displayName: data.displayName,
        profile: {
          create: {},
        },
      },
      include: {
        profile: true,
      },
    });

    // Create session
    const session = await createSession(
      db,
      user.id,
      getUserAgent(),
      getIpAddress()
    );

    // Set cookie
    setSessionCookie(session.token, session.expiresAt);

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.id,
        eventType: "user_registered",
        ipAddress: getIpAddress(),
        userAgent: getUserAgent(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: "An error occurred during sign up" };
  }
}

export async function signIn(data: {
  emailOrUsername: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  "use server";

  try {
    // Find user by email or username
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: data.emailOrUsername },
          { username: data.emailOrUsername },
        ],
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    // Verify password
    const valid = await verifyPassword(data.password, user.passwordHash);

    if (!valid) {
      return { success: false, error: "Invalid credentials" };
    }

    // Create session
    const session = await createSession(
      db,
      user.id,
      getUserAgent(),
      getIpAddress()
    );

    // Set cookie
    setSessionCookie(session.token, session.expiresAt);

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.id,
        eventType: "user_logged_in",
        ipAddress: getIpAddress(),
        userAgent: getUserAgent(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error: "An error occurred during sign in" };
  }
}

export async function signOut(): Promise<{ success: boolean }> {
  "use server";

  try {
    const token = getSessionToken();

    if (token) {
      const session = await getSessionByToken(db, token);

      if (session) {
        // Log activity
        await db.activityLog.create({
          data: {
            userId: session.user.id,
            eventType: "user_logged_out",
            ipAddress: getIpAddress(),
            userAgent: getUserAgent(),
          },
        });

        await deleteSession(db, token);
      }
    }

    clearSessionCookie();

    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false };
  }
}
