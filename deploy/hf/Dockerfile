# Hugging Face Space (Docker SDK) image: NestJS backend + embedded Redis.
# Build context = backend/ root (assemble with deploy_hf.sh before pushing).
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=7860
RUN apk add --no-cache redis \
    && addgroup -S -g 1001 nodejs && adduser -S -u 1001 nestjs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/config ./src/config
COPY start.sh ./start.sh
RUN chmod +x start.sh && mkdir -p /data/redis && chown -R nestjs:nodejs /app /data/redis
USER nestjs
EXPOSE 7860
CMD ["./start.sh"]
