# Seventeen Pockets v1.0.0 — standalone Bun runtime
# Multi-stage: install deps → build → slim runtime

# ── Stage 1: dependencies ─────────────────────────────────────────────
FROM oven/bun:1.3-slim AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY vendor/space-sdk.tgz ./vendor/space-sdk.tgz
RUN bun install --frozen-lockfile

# ── Stage 2: build ──────────────────────────────────────────────────────
FROM oven/bun:1.3-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV HATCH_SPACES_BUILD_DRIVER=1
# build:server → server/dist/standalone.js, build:client → client/dist/
RUN bun run build

# ── Stage 3: runtime ────────────────────────────────────────────────────
FROM oven/bun:1.3-slim AS run
WORKDIR /app
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/client/dist ./client/dist
COPY drizzle ./drizzle
COPY vendor ./vendor
RUN mkdir -p /app/data && chown -R bun:bun /app
ENV PORT=3000 \
    DATABASE_PATH=/app/data/app.db
EXPOSE 3000
VOLUME /app/data
USER bun
CMD ["bun", "./server/dist/standalone.js"]
