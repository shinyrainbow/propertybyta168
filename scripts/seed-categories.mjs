import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'อสังหาริมทรัพย์',
    nameEn: 'Real Estate',
    nameZh: '房地产',
    slug: 'real-estate',
    color: '#3B82F6',
    order: 1,
  },
  {
    name: 'แนวโน้มตลาด',
    nameEn: 'Market Trends',
    nameZh: '市场趋势',
    slug: 'market-trends',
    color: '#10B981',
    order: 2,
  },
  {
    name: 'เคล็ดลับ',
    nameEn: 'Tips & Advice',
    nameZh: '提示和建议',
    slug: 'tips',
    color: '#F59E0B',
    order: 3,
  },
  {
    name: 'การลงทุน',
    nameEn: 'Investment',
    nameZh: '投资',
    slug: 'investment',
    color: '#8B5CF6',
    order: 4,
  },
  {
    name: 'ข่าวสาร',
    nameEn: 'News',
    nameZh: '新闻',
    slug: 'news',
    color: '#EF4444',
    order: 5,
  },
];

async function main() {
  console.log('🌱 Seeding blog categories...');

  for (const category of categories) {
    try {
      const existing = await prisma.blogCategory.findUnique({
        where: { slug: category.slug },
      });

      if (existing) {
        console.log(`⏭️  Category "${category.nameEn}" already exists, skipping...`);
        continue;
      }

      await prisma.blogCategory.create({
        data: category,
      });
      console.log(`✅ Created category: ${category.nameEn}`);
    } catch (error) {
      console.error(`❌ Error creating category "${category.nameEn}":`, error.message);
    }
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
