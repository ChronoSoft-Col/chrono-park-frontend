# ============================================
# STAGE 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Instalar dependencias necesarias para builds
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci

# ============================================
# STAGE 2: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para el build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DEBOUNCE_TIME=1000
ARG NEXT_PUBLIC_PRINTER_API_URL
ARG NEXT_PUBLIC_PRINTER_NAME=EPSON
ARG SESSION_SECRET=build-time-secret-placeholder-1234567890

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_DEBOUNCE_TIME=$NEXT_PUBLIC_DEBOUNCE_TIME
ENV NEXT_PUBLIC_PRINTER_API_URL=$NEXT_PUBLIC_PRINTER_API_URL
ENV NEXT_PUBLIC_PRINTER_NAME=$NEXT_PUBLIC_PRINTER_NAME
ENV SESSION_SECRET=$SESSION_SECRET

# Desactivar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================
# STAGE 3: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copiar standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

CMD ["node", "server.js"]
