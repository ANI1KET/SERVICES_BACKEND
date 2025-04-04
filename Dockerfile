# # # FROM node:20
# # # WORKDIR /app
# # # COPY package*.json ./
# # # RUN npm install
# # # COPY . .
# # # RUN npx prisma generate
# # # RUN npm run build
# # # CMD [ "npm","run","start" ]

# # FROM node:20-slim
# # RUN apt-get update && apt-get install -y openssl
# # WORKDIR /app
# # COPY package*.json ./
# # RUN npm install
# # COPY prisma/schema.prisma prisma/
# # RUN npx prisma generate
# # COPY . .
# # RUN npm run build
# # RUN rm -rf src/
# # RUN rm -rf tsconfig.json
# # RUN rm -rf prisma/
# # # RUN rm -rf src/ tsconfig.json prisma/
# # CMD [ "npm","run","start" ]

# FROM node:20-slim AS builder
# WORKDIR /app
# RUN apt-get update && apt-get install -y openssl libssl-dev
# COPY package*.json ./
# RUN npm install
# COPY prisma/ ./prisma/
# # COPY prisma/schema.prisma prisma/
# RUN npx prisma generate
# COPY . .
# RUN npm run build
# RUN rm -rf src/ tsconfig.json prisma/ node_modules/.cache node_modules/@prisma/engines

# FROM node:20-slim AS production
# WORKDIR /app
# RUN apt-get update && apt-get install -y openssl libssl-dev
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/build ./build
# COPY --from=builder /app/package.json ./

# CMD ["node", "build/server.js"]

# --- Builder Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
# RUN apk add --no-cache openssl
# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev --omit=optional
# Install TypeScript (if needed for build)
RUN npm install typescript --no-save
# Copy only necessary files for Prisma
COPY prisma/ ./prisma/
RUN npx prisma generate --no-engine
# Copy the entire source code
COPY . .
# Build the application
RUN npm run build
# Remove unnecessary files to reduce final image size
RUN rm -rf src/ tsconfig.json prisma/ node_modules/.cache node_modules/@prisma/engines

# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app
# RUN apk add --no-cache openssl
# Set environment variable
ENV NODE_ENV=production
# Copy only necessary files from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

# Run the application
CMD ["node", "build/server.js"]
