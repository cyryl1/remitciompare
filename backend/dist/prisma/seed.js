"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/remitcompare?schema=public" });
const prisma = new PrismaClient({ adapter });
const providers = [
    {
        slug: 'wise',
        name: 'Wise',
        description: 'Global money transfer service offering real exchange rates.',
        about: 'Wise is an international money transfer and multi-currency services provider. Users can send money internationally and access supported currency services through Wise.',
        tagline: 'The smart way to send money abroad.',
        websiteUrl: 'https://wise.com',
        affiliateUrl: '',
        trustpilotRating: 4.3,
        trustpilotCount: 230000,
        regulatoryInfo: 'Wise Payments Limited is authorised as an Electronic Money Institution (EMI) by the Financial Conduct Authority (FCA) in the UK.',
        countriesSupported: 170,
        currenciesSupported: 40,
        paymentMethods: ['BANK_TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD'],
        payoutMethods: ['BANK_ACCOUNT', 'MOBILE_WALLET'],
        deliveryMethods: ['BANK_TRANSFER'],
        features: ['MOBILE_APP', 'RATE_NOTIFICATIONS', 'MULTI_CURRENCY_ACCOUNT', 'BANK_DEPOSITS'],
        status: 'INTEGRATED',
        routes: {
            fromCurrency: 'GBP',
            toCurrency: 'NGN',
            fromCountry: 'GB',
            toCountry: 'NG',
        },
    },
    {
        slug: 'lemfi',
        name: 'LemFi',
        description: 'Zero-fee international transfers focused on African corridors.',
        about: 'LemFi (formerly Lemonade Finance) offers zero-fee international money transfers specialising in routes to Africa and Asia.',
        tagline: 'Zero fees. Real rates. Africa first.',
        websiteUrl: 'https://lemfi.com',
        affiliateUrl: '',
        trustpilotRating: 4.1,
        trustpilotCount: 12000,
        regulatoryInfo: null,
        countriesSupported: 20,
        currenciesSupported: 15,
        paymentMethods: ['BANK_TRANSFER', 'DEBIT_CARD'],
        payoutMethods: ['BANK_ACCOUNT'],
        deliveryMethods: ['BANK_TRANSFER'],
        features: ['MOBILE_APP', 'ZERO_FEES'],
        status: 'PENDING',
        routes: {
            fromCurrency: 'GBP',
            toCurrency: 'NGN',
            fromCountry: 'GB',
            toCountry: 'NG',
        },
    },
    {
        slug: 'remitly',
        name: 'Remitly',
        description: 'Promotional rates for new customers and fast delivery options.',
        about: 'Remitly is a reliable global money transfers service with promotional rates for first-time users.',
        tagline: 'Promises delivered.',
        websiteUrl: 'https://remitly.com',
        affiliateUrl: '',
        trustpilotRating: 4.1,
        trustpilotCount: 50000,
        regulatoryInfo: null,
        countriesSupported: 170,
        currenciesSupported: 100,
        paymentMethods: ['BANK_TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD'],
        payoutMethods: ['BANK_ACCOUNT', 'MOBILE_WALLET', 'CASH_PICKUP'],
        deliveryMethods: ['BANK_TRANSFER', 'MOBILE_WALLET'],
        features: ['MOBILE_APP', 'FIRST_TRANSFER_PROMOTION', 'EXPRESS_DELIVERY'],
        status: 'PENDING',
        routes: {
            fromCurrency: 'GBP',
            toCurrency: 'NGN',
            fromCountry: 'GB',
            toCountry: 'NG',
        },
    },
    {
        slug: 'worldremit',
        name: 'WorldRemit',
        description: 'Flexible delivery options including cash pickup and mobile money.',
        about: 'WorldRemit is a global money transfer service offering bank transfers, mobile money, cash pickup and airtime top-up.',
        tagline: 'Send money your way.',
        websiteUrl: 'https://worldremit.com',
        affiliateUrl: '',
        trustpilotRating: 3.9,
        trustpilotCount: 40000,
        regulatoryInfo: null,
        countriesSupported: 130,
        currenciesSupported: 70,
        paymentMethods: ['BANK_TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD'],
        payoutMethods: ['BANK_ACCOUNT', 'MOBILE_WALLET', 'CASH_PICKUP'],
        deliveryMethods: ['BANK_TRANSFER', 'MOBILE_WALLET', 'CASH_PICKUP'],
        features: ['MOBILE_APP', 'CASH_PICKUP', 'MOBILE_MONEY'],
        status: 'PENDING',
        routes: {
            fromCurrency: 'GBP',
            toCurrency: 'NGN',
            fromCountry: 'GB',
            toCountry: 'NG',
        },
    },
];
async function main() {
    console.log('🌱 Seeding providers...');
    for (const provider of providers) {
        const { routes, ...providerData } = provider;
        const created = await prisma.provider.upsert({
            where: { slug: providerData.slug },
            update: providerData,
            create: {
                ...providerData,
                routes: {
                    create: {
                        fromCurrency: routes.fromCurrency,
                        toCurrency: routes.toCurrency,
                        fromCountry: routes.fromCountry,
                        toCountry: routes.toCountry,
                        isActive: true,
                    },
                },
            },
        });
        console.log(`  ✓ ${created.name} (${created.status})`);
    }
    console.log('✅ Seed complete.');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map