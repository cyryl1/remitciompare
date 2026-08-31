# RemitCompare 💱

RemitCompare is a full-stack platform that helps users find the best exchange rates and lowest fees for international money transfers. It aggregates real-time data from various remittance providers, allowing users to compare quotes, set up price alerts, and save their favorite currency corridors. 

The platform also includes a comprehensive Admin Dashboard for managing providers, tracking affiliate conversions, and monitoring system health.

## 🚀 Key Features

### For Users
- **Real-Time Comparisons:** Instantly compare exchange rates, fees, and delivery times across multiple providers (e.g., Sendwave, LemFi, WorldRemit, etc.).
- **Price Alerts:** Set a target exchange rate or recipient amount for a specific currency pair. A background worker continuously monitors the rates and emails the user as soon as their target is hit.
- **Saved Routes:** Quickly save frequent transfer routes (e.g., GBP to NGN) for easy access.
- **Authentication:** Secure signup and login powered by Firebase Authentication.

### For Administrators
- **Dashboard Analytics:** Live database aggregations of active users, popular currency corridors, and quote volumes.
- **Provider & Route Management:** Enable or disable supported providers and specific currency routes on the fly.
- **Referral Tracking:** Configure affiliate/referral links for providers with UTM parameters. The backend intercepts user clicks, tracks conversions, and safely redirects to the affiliate destination.
- **Activity & Health Monitoring:** View comprehensive logs of user actions, API timeout errors, and backend quote fetch failures.

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (with custom utility classes and design tokens)
- **State Management:** Zustand
- **Routing:** React Router v6
- **Icons:** Lucide React

### Backend
- **Framework:** NestJS (Node.js)
- **Database ORM:** Prisma
- **Database Engine:** PostgreSQL
- **Authentication:** Firebase Admin SDK & JWTs
- **Background Tasks:** NestJS Schedule (Cron Jobs) for Alert Processing
- **Integrations:** Custom adapter pattern using Axios & Puppeteer to fetch rates from third-party remittance providers.

## 📁 Project Structure

This repository is structured as a monorepo containing two main directories:

- `/frontend` - The React web application.
- `/backend` - The NestJS API server and background workers.

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL database
- Firebase Project (for Authentication)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup your environment variables
cp .env.example .env
# Make sure to fill in your DATABASE_URL, JWT_SECRET, and FIREBASE credentials in the .env file

# Run database migrations
npx prisma migrate dev

# Start the development server (runs on port 3000 by default)
npm run start:dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup your environment variables
cp .env.example .env
# Make sure to fill in your VITE_API_URL and VITE_FIREBASE config in the .env file

# Start the frontend development server
npm run dev
```

## 🔒 Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/remitcompare?schema=public"
JWT_SECRET="your-super-secret-jwt-key"

# Firebase Admin SDK settings
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="http://localhost:3000"

# Firebase Client settings
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
```

## 📜 License
All rights reserved.
