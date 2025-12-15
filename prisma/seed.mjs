import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@budgetwiseproperty.com" },
    update: {},
    create: {
      email: "admin@budgetwiseproperty.com",
      name: "Admin",
      password: adminPassword,
      role: "admin",
    },
  });

  console.log("Created admin user:", admin.email);

  // Create demo user
  const demoPassword = await bcrypt.hash("demo123", 10);

  const demo = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: demoPassword,
      role: "user",
    },
  });

  console.log("Created demo user:", demo.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
