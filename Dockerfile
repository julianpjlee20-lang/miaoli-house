# ============================================
# Build Next.js frontend for Zeabur
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy frontend files
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ .

# Build with standalone output
RUN npm run build

# ============================================
# Runner
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create necessary directories
RUN mkdir -p /app/public /app/src/data

# Copy standalone output (required)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy static files from builder if they exist
# (public folder may not exist in Next.js projects)
RUN if [ -d /app/public ]; then \
      cp -r /app/public ./public; \
    fi

# Copy data files if they exist
RUN if [ -d /app/src/data ]; then \
      cp -r /app/src/data ./src/data; \
    fi

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
