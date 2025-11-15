# Basis-Image mit Node 20 (LTS, Debian – gut für sqlite3)
FROM node:20-bullseye

# Arbeitsverzeichnis im Container
WORKDIR /app

# Nur package-Dateien kopieren und Dependencies installieren
COPY package*.json ./

# Saubere Installation anhand der package-lock.json, ohne Dev-Dependencies
RUN npm ci --omit=dev

# Restlichen Code kopieren (public, server.js, test.db, etc.)
COPY . .

# Umgebungsvariablen
ENV NODE_ENV=production
ENV PORT=3000

# Port, den der Container nach außen anbietet
EXPOSE 3000

# Startkommando
CMD ["npm", "start"]
