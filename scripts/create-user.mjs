import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Demo account credentials
const EMAIL = "demo@skypro.com";
const PASSWORD = "demo1234";
const NAME = "Demo Admin";
const ROLE = "admin"; // "user", "admin", or "agent"

async function main() {
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  const user = await prisma.user.create({
    data: {
      email: EMAIL,
      name: NAME,
      password: hashedPassword,
      role: ROLE,
    },
  });

  console.log("Created user:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
