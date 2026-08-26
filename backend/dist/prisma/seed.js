"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Starting database seeding...');
    const providers = [
        {
            slug: 'wise',
            name: 'Wise',
            logoUrl: 'https://wise.com/public-resources/assets/logos/wise/brand_logo.svg',
            description: 'The cheapest and fastest way to send money abroad.',
            websiteUrl: 'https://wise.com',
            status: client_1.ProviderStatus.INTEGRATED,
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
            status: client_1.ProviderStatus.INTEGRATED,
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
            status: client_1.ProviderStatus.INTEGRATED,
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
            status: client_1.ProviderStatus.INTEGRATED,
            isActive: true,
            countriesSupported: 130,
            currenciesSupported: 70,
            trustpilotRating: 4.0,
            trustpilotCount: 60000,
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
    await prisma.user.upsert({
        where: { email: 'admin@remitcompare.com' },
        update: {},
        create: {
            email: 'admin@remitcompare.com',
            fullName: 'Admin User',
            passwordHash: 'dummyhash',
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
//# sourceMappingURL=seed.js.map