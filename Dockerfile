# Monolith: Vite frontend + Express API. Build from repo root.

# --- Stage 1: build the SPA (Vite) ---
FROM node:22-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY frontend/ ./

# Browser calls /api on the same host as the page.
ENV VITE_API_URL=

# Public Clerk key is embedded in client JS.
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN npm run build


# --- Stage 2: prepare the backend ---
FROM node:22-bookworm-slim AS backend-build

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm install --no-audit --no-fund

COPY backend/ ./


# --- Stage 3: runtime image ---
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY backend/package.json backend/package-lock.json ./

RUN npm install --omit=dev --no-audit --no-fund \
    && npm cache clean --force

# Copy backend source because there is no compilation step.
COPY --from=backend-build /app/src ./src

# Copy built frontend.
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001

USER node

CMD ["node", "src/index.js"]