# backend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy the built artifacts from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Expose the port the app runs on (defaults to 3000 for Nest)
EXPOSE 3000

# Start the application (running migrations first)
CMD npx prisma migrate deploy && npm run start:prod
