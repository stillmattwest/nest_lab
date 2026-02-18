#!/usr/bin/env bash
set -e

# Linux Setup Script
# Applies Linux compatibility changes to nest_lab for Docker volume permissions
# and Laravel/Node tooling. Run from project root. Idempotent.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Applying Linux compatibility changes..."

# 1. docker-compose.yml - add user directives and environment for Linux
cat > docker-compose.yml << 'DOCKER_COMPOSE_EOF'
services:
  # The shared database container
  postgres:
    image: postgres:16.3-alpine
    container_name: lab_postgres
    restart: always
    environment:
      POSTGRES_DB: lab_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: lab_password
    ports:
      - "5433:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  # the dispacher
  nginx:
    image: nginx:alpine
    container_name: lab_nginx
    ports:
      - "8000:80" # This is where you test on your Mac
    volumes:
      - ./laravel_monolith:/var/www
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro # Fixed path
    depends_on:
      - laravel_monolith

  # The Nervous System
  nats:
    image: nats:latest
    container_name: lab_nats
    restart: always
    ports:
      - "4222:4222"
      - "8222:8222"

  nats_tools:
    image: natsio/nats-box
    container_name: lab_nats_tools
    entrypoint: sleep infinity # Keeps it alive so you can "dce" into it
    networks:
      - default # This ensures it's on the same wire as lab_nats
    depends_on:
      - nats

  # Phase 1: The Monolith
  laravel_monolith:
    build:
      context: ./laravel_monolith
      dockerfile: Dockerfile
    container_name: lab_laravel
    user: "${UID:-1000}:${GID:-1000}"
    environment:
      - HOME=/tmp
    restart: unless-stopped
    working_dir: /var/www
    # REMOVED ports: - "80:80" to avoid protocol confusion
    volumes:
      - ./laravel_monolith:/var/www
    depends_on:
      - postgres
      - nats

  # Phase 2: The Entry Point
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile # Changed from Dockerfile.next
    container_name: lab_nextjs
    environment:
      - UID=${UID:-1000}
      - GID=${GID:-1000}
      - NODE_ENV=development
      - WATCHPACK_POLLING=true
    volumes:
      - ./frontend:/app
      - /app/node_modules # Added the colon prefix to keep these in Docker
      - /app/.next        # Added the colon prefix for the build cache
    ports:
      - "3000:3000"
    depends_on:
      - laravel_monolith

  # Phase 3: The Strangler Pattern
  nest_app:
    build: ./nest_app
    container_name: lab_nest_app
    user: "${UID:-1000}:${GID:-1000}"
    volumes:
      - ./nest_app:/app
    ports:
      - "5000:3000"
    depends_on:
      - laravel_monolith
      - nats

volumes:
  db_data:
DOCKER_COMPOSE_EOF

# 2. laravel_monolith/Dockerfile - add Node.js for Vite/npm
cat > laravel_monolith/Dockerfile << 'LARAVEL_DOCKERFILE_EOF'
FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (including pdo_pgsql for your database)
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js for Vite/frontend assets
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www

USER www-data
LARAVEL_DOCKERFILE_EOF

# 3. frontend/Dockerfile - add gosu and entrypoint for volume permissions
cat > frontend/Dockerfile << 'FRONTEND_DOCKERFILE_EOF'
FROM node:20-slim
WORKDIR /app

# Cypress (and other headless browsers) need X11 and related libs on Linux
# gosu for switching to non-root after fixing volume permissions
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gosu \
        libgtk-3-0 \
        libgbm-dev \
        libnotify-dev \
        libnss3 \
        libxss1 \
        libasound2 \
        libxtst6 \
        xauth \
        xvfb \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# No COPY . . needed here for dev
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
FRONTEND_DOCKERFILE_EOF

# 4. frontend/docker-entrypoint.sh - fix volume ownership, run as host user
cat > frontend/docker-entrypoint.sh << 'ENTRYPOINT_EOF'
#!/bin/sh
set -e
# Fix ownership of anonymous volumes so non-root user can write (Linux)
mkdir -p /app/.next /app/node_modules
chown -R "${UID:-1000}:${GID:-1000}" /app/.next /app/node_modules
exec gosu "${UID:-1000}:${GID:-1000}" "$@"
ENTRYPOINT_EOF
chmod +x frontend/docker-entrypoint.sh

# 5. laravel_monolith/.env - create with PostgreSQL config for Docker
cat > laravel_monolith/.env << 'LARAVEL_ENV_EOF'
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=lab_db
DB_USERNAME=admin
DB_PASSWORD=lab_password

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"
LARAVEL_ENV_EOF

echo ""
echo "Linux setup complete."
echo ""
echo "Next steps:"
echo "  docker compose up --build -d"
echo "  dce laravel_monolith php artisan key:generate"
echo "  dce laravel_monolith php artisan migrate"
echo ""
