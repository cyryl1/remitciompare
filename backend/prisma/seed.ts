import { PrismaClient, ProviderStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seeding...');

  // 1. Providers
  const providers = [
    {
      slug: 'wise',
      name: 'Wise',
      logoUrl: 'https://wise.com/public-resources/assets/logos/wise/brand_logo.svg',
      description: 'The cheapest and fastest way to send money abroad.',
      websiteUrl: 'https://wise.com',
      status: ProviderStatus.INTEGRATED,
      isActive: true,
      countriesSupported: 80,
      currenciesSupported: 50,
      trustpilotRating: 4.5,
      trustpilotCount: 150000,
    },
    {
      slug: 'lemfi',
      name: 'LemFi',
      logoUrl: 'https://www.lemfi.com/images/lemfi-logo.svg',
      description: 'Send money to Africa with zero fees.',
      websiteUrl: 'https://lemfi.com',
      status: ProviderStatus.INTEGRATED,
      isActive: true,
      countriesSupported: 20,
      currenciesSupported: 10,
      trustpilotRating: 4.4,
      trustpilotCount: 10000,
    },
    {
      slug: 'remitly',
      name: 'Remitly',
      logoUrl: 'https://www.remitly.com/assets/logo.svg',
      description: 'Promises delivered.',
      websiteUrl: 'https://remitly.com',
      status: ProviderStatus.INTEGRATED,
      isActive: true,
      countriesSupported: 170,
      currenciesSupported: 75,
      trustpilotRating: 4.1,
      trustpilotCount: 40000,
    },
    {
      slug: 'worldremit',
      name: 'WorldRemit',
      logoUrl: 'https://www.worldremit.com/logo.svg',
      description: 'Fast, secure and low-cost money transfers.',
      websiteUrl: 'https://worldremit.com',
      status: ProviderStatus.INTEGRATED,
      isActive: true,
      countriesSupported: 130,
      currenciesSupported: 70,
      trustpilotRating: 4.0,
      trustpilotCount: 60000,
    },
    {
      slug: 'westernunion',
      name: 'Western Union',
      logoUrl: 'https://www.westernunion.com/content/dam/wu/logo/WU_Logo_Yellow_Black.svg',
      description: 'Moving money for better.',
      websiteUrl: 'https://westernunion.com',
      status: ProviderStatus.INTEGRATED,
      isActive: true,
      countriesSupported: 200,
      currenciesSupported: 130,
      trustpilotRating: 3.9,
      trustpilotCount: 50000,
    },
    {
      slug: 'revolut',
      name: 'Revolut',
      logoUrl: 'https://www.revolut.com/revolut-logo.svg',
      description: 'One app, all things money.',
      websiteUrl: 'https://revolut.com',
      status: ProviderStatus.INTEGRATED,
      isActive: true,
      countriesSupported: 150,
      currenciesSupported: 30,
      trustpilotRating: 4.3,
      trustpilotCount: 140000,
    },
    {
      slug: 'sendwave',
      name: 'Sendwave',
      logoUrl: 'https://www.sendwave.com/sendwave-logo.svg',
      description: 'Instant, no-fee money transfers.',
      websiteUrl: 'https://sendwave.com',
      status: ProviderStatus.INTEGRATED,
      isActive: true,
      countriesSupported: 15,
      currenciesSupported: 15,
      trustpilotRating: 4.6,
      trustpilotCount: 30000,
    },
    {
      slug: 'ria',
      name: 'Ria',
      logoUrl: 'https://www.riamoneytransfer.com/assets/img/ria-logo.svg',
      description: 'Fast, secure, and affordable money transfers.',
      websiteUrl: 'https://riamoneytransfer.com',
      status: ProviderStatus.INTEGRATED,
      isActive: true,
      countriesSupported: 160,
      currenciesSupported: 60,
      trustpilotRating: 4.2,
      trustpilotCount: 20000,
    },
  ];

  for (const p of providers) {
    await prisma.provider.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log('Providers seeded.');

  // 2. Initial Admin User (optional, good for testing)
  await prisma.user.upsert({
    where: { email: 'admin@remitcompare.com' },
    update: {},
    create: {
      email: 'admin@remitcompare.com',
      fullName: 'Admin User',
      passwordHash: 'dummyhash', // In reality, use bcrypt
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log('Admin user seeded.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
