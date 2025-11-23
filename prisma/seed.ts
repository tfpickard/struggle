import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create admin user
  const adminPasswordHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      displayName: "Administrator",
      profile: {
        create: {
          preferredTheme: "dark",
          publicProfile: true,
        },
      },
    },
  });
  console.log("Created admin user:", admin.username);

  // Create demo user
  const demoPasswordHash = await bcrypt.hash("demo123", 12);
  const demo = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      username: "demo",
      passwordHash: demoPasswordHash,
      role: "USER",
      displayName: "Demo User",
      bio: "Just exploring chaotic systems!",
      profile: {
        create: {
          preferredTheme: "system",
          publicProfile: true,
        },
      },
    },
  });
  console.log("Created demo user:", demo.username);

  // Create sample simulation
  const simulation = await prisma.simulation.create({
    data: {
      ownerId: demo.id,
      visibility: "PUBLIC",
      name: "Three Body Dance",
      description: "A chaotic three-body gravitational system",
      slug: "three-body-dance",
      tags: ["gravity", "n-body", "chaotic"],
      configurationType: "N_BODY_GRAVITY",
      parameters: {
        numBodies: 3,
        gravitationalConstant: 1.0,
        damping: 0.01,
        timeStep: 0.016,
        targetConfiguration: "circular-orbit",
      },
      metaTitle: "Three Body Dance - Chaotic Unity",
      metaDescription: "Watch three celestial bodies dance in chaotic harmony",
    },
  });
  console.log("Created sample simulation:", simulation.slug);

  // Create sample simulation state
  await prisma.simulationState.create({
    data: {
      simulationId: simulation.id,
      label: "Interesting Configuration",
      description: "Near-stable figure-eight configuration",
      stateData: {
        bodies: [
          { position: [0, 0], velocity: [0.5, 0.8] },
          { position: [1, 0], velocity: [-0.5, 0.8] },
          { position: [0.5, 0.866], velocity: [0, -1.6] },
        ],
      },
      energy: 2.5,
      errorMetric: 0.3,
      isInteresting: true,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
