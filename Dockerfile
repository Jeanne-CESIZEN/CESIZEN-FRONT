# syntax=docker/dockerfile:1

# ─── Étape 1 : build de l'application ───────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app

# L'URL de l'API est injectée au build (Vite l'inline dans le bundle)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Étape 2 : service statique via nginx ───────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Configuration nginx (fallback SPA pour React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fichiers statiques buildés
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
