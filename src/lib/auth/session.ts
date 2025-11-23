import { type PrismaClient } from "~/generated/prisma";
import { randomBytes } from "crypto";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(
  prisma: PrismaClient,
  userId: string,
  userAgent?: string,
  ipAddress?: string
) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const session = await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
      userAgent,
      ipAddress,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  return session;
}

export async function getSessionByToken(
  prisma: PrismaClient,
  token: string
) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session;
}

export async function deleteSession(prisma: PrismaClient, token: string) {
  await prisma.session.delete({ where: { token } });
}

export async function deleteAllUserSessions(
  prisma: PrismaClient,
  userId: string
) {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function cleanupExpiredSessions(prisma: PrismaClient) {
  await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
