# Dockerfile pour cocoti-web
FROM node:18-alpine AS base

# Installer les dépendances seulement quand nécessaire
FROM base AS deps
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild le code source seulement quand nécessaire
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build de l'application
RUN npm run build

# Image de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers publics
COPY --from=builder /app/public ./public

# Copier les fichiers de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 4000

ENV PORT 4000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
