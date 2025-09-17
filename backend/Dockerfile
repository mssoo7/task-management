# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Runtime stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env
EXPOSE 3000
CMD ["node", "dist/main.js"] 