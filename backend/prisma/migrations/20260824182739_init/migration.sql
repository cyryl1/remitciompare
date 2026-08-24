-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('MOST_RECEIVED', 'FASTEST', 'LOWEST_COST');

-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('INTEGRATED', 'PENDING', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('SUCCESS', 'FAILED', 'TIMEOUT', 'RATE_LIMITED');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'PAUSED', 'TRIGGERED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('LIVE', 'ESTIMATED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    "countryOfResidence" TEXT,
    "defaultRoute" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpiry" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailAlerts" BOOLEAN NOT NULL DEFAULT true,
    "comparisonNotifications" BOOLEAN NOT NULL DEFAULT false,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedRoute" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "fromCountry" TEXT NOT NULL,
    "toCountry" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "description" TEXT,
    "about" TEXT,
    "tagline" TEXT,
    "websiteUrl" TEXT NOT NULL,
    "affiliateUrl" TEXT,
    "trustpilotRating" DOUBLE PRECISION,
    "trustpilotCount" INTEGER,
    "regulatoryInfo" TEXT,
    "countriesSupported" INTEGER NOT NULL DEFAULT 0,
    "currenciesSupported" INTEGER NOT NULL DEFAULT 0,
    "paymentMethods" TEXT[],
    "payoutMethods" TEXT[],
    "deliveryMethods" TEXT[],
    "features" TEXT[],
    "status" "ProviderStatus" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderRoute" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "fromCountry" TEXT,
    "toCountry" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comparison" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "anonymousSessionId" TEXT,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "fromCountry" TEXT NOT NULL,
    "toCountry" TEXT NOT NULL,
    "sendAmount" DOUBLE PRECISION NOT NULL,
    "priority" "Priority" NOT NULL,
    "paymentMethod" TEXT,
    "deliveryPreference" TEXT,
    "staleAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonQuote" (
    "id" TEXT NOT NULL,
    "comparisonId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "exchangeRate" DOUBLE PRECISION NOT NULL,
    "fees" JSONB NOT NULL,
    "totalFees" DOUBLE PRECISION NOT NULL,
    "grossRecipientAmount" DOUBLE PRECISION NOT NULL,
    "recipientAmount" DOUBLE PRECISION NOT NULL,
    "deliveryEstimate" TEXT NOT NULL,
    "deliveryMinutes" INTEGER,
    "paymentMethod" TEXT NOT NULL,
    "ranking" INTEGER,
    "isBestValue" BOOLEAN NOT NULL DEFAULT false,
    "status" "QuoteStatus" NOT NULL,
    "errorType" TEXT,
    "quoteTimestamp" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ComparisonQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "fromCountry" TEXT,
    "toCountry" TEXT,
    "sendAmount" DOUBLE PRECISION NOT NULL,
    "targetRecipientAmount" DOUBLE PRECISION NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MOST_RECEIVED',
    "providerPreference" TEXT,
    "paymentMethod" TEXT,
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastCheckedAt" TIMESTAMP(3),
    "lastTriggeredAt" TIMESTAMP(3),
    "triggeredValue" DOUBLE PRECISION,
    "triggeredProvider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateSnapshot" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "sendAmount" DOUBLE PRECISION NOT NULL,
    "exchangeRate" DOUBLE PRECISION NOT NULL,
    "recipientAmount" DOUBLE PRECISION NOT NULL,
    "totalFees" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "dataType" "DataType" NOT NULL DEFAULT 'LIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteFailureLog" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "errorType" TEXT NOT NULL,
    "errorDetail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteFailureLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralLink" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_key" ON "NotificationSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedRoute_userId_fromCurrency_toCurrency_key" ON "SavedRoute"("userId", "fromCurrency", "toCurrency");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderRoute_providerId_fromCurrency_toCurrency_key" ON "ProviderRoute"("providerId", "fromCurrency", "toCurrency");

-- CreateIndex
CREATE INDEX "Comparison_userId_createdAt_idx" ON "Comparison"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Comparison_anonymousSessionId_createdAt_idx" ON "Comparison"("anonymousSessionId", "createdAt");

-- CreateIndex
CREATE INDEX "ComparisonQuote_comparisonId_idx" ON "ComparisonQuote"("comparisonId");

-- CreateIndex
CREATE INDEX "Alert_status_fromCurrency_toCurrency_idx" ON "Alert"("status", "fromCurrency", "toCurrency");

-- CreateIndex
CREATE INDEX "RateSnapshot_provider_fromCurrency_toCurrency_createdAt_idx" ON "RateSnapshot"("provider", "fromCurrency", "toCurrency", "createdAt");

-- CreateIndex
CREATE INDEX "QuoteFailureLog_provider_createdAt_idx" ON "QuoteFailureLog"("provider", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralLink_provider_key" ON "ReferralLink"("provider");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_createdAt_idx" ON "ActivityLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRoute" ADD CONSTRAINT "SavedRoute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderRoute" ADD CONSTRAINT "ProviderRoute_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comparison" ADD CONSTRAINT "Comparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonQuote" ADD CONSTRAINT "ComparisonQuote_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
