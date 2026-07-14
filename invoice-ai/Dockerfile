# Multi-stage Dockerfile for production Next.js app (invoice-ai)
FROM node:18-bullseye AS builder
WORKDIR /app

# Copy package manifests and install deps first (cache layer)
COPY package.json package-lock.json* ./
COPY invoice-ai/package.json invoice-ai/package-lock.json* ./invoice-ai/
WORKDIR /app/invoice-ai
RUN npm ci --silent

# Copy source and build
COPY invoice-ai/ ./
RUN npm run build

FROM node:18-bullseye-slim AS runner
WORKDIR /app/invoice-ai
ENV NODE_ENV=production

# Copy built assets and node_modules
COPY --from=builder /app/invoice-ai/.next .next
COPY --from=builder /app/invoice-ai/public ./public
COPY --from=builder /app/invoice-ai/package.json ./package.json
COPY --from=builder /app/invoice-ai/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]
