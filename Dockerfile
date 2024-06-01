# Stage 1: Build the project
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies separately to take advantage of Docker's caching mechanism
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application code and the .env file
COPY . .
COPY .env .env

# Build the project
RUN yarn build

# Stage 2: Setup the serve environment
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/dist .

# Copy .env file to the final image if needed by the frontend (example path)
COPY --from=builder /app/.env .

# Optionally, if you have a custom nginx.conf, copy it
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 8005

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]


