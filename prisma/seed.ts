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

  // Create blog categories
  const categories = [
    {
      name: "อสังหาริมทรัพย์",
      nameEn: "Real Estate",
      nameZh: "房地产",
      slug: "real-estate",
      color: "#eb3838",
      order: 1,
    },
    {
      name: "แนวโน้มตลาด",
      nameEn: "Market Trends",
      nameZh: "市场趋势",
      slug: "market-trends",
      color: "#3B82F6",
      order: 2,
    },
    {
      name: "เคล็ดลับ",
      nameEn: "Tips & Guides",
      nameZh: "技巧指南",
      slug: "tips",
      color: "#10B981",
      order: 3,
    },
    {
      name: "การลงทุน",
      nameEn: "Investment",
      nameZh: "投资",
      slug: "investment",
      color: "#F59E0B",
      order: 4,
    },
    {
      name: "ข่าวสาร",
      nameEn: "News",
      nameZh: "新闻",
      slug: "news",
      color: "#8B5CF6",
      order: 5,
    },
    {
      name: "ไลฟ์สไตล์",
      nameEn: "Lifestyle",
      nameZh: "生活方式",
      slug: "lifestyle",
      color: "#EC4899",
      order: 6,
    },
  ];

  for (const category of categories) {
    const created = await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log("Created/updated category:", created.name);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
