FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy source files
COPY . .

# Build frontend
RUN npm run build

# Create production image
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm i --omit=dev

# Copy built frontend and necessary backend files
COPY --from=builder /app/dist ./dist
COPY src/utils/server.js ./server.js

# Install nginx for serving static files
RUN apk add --no-cache nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for nginx pid file
RUN mkdir -p /run/nginx

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose ports (80 for frontend, 3000 for backend)
EXPOSE 80 3000

# Start both nginx and node server
CMD sh -c "nginx && node server.js"