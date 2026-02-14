FROM node:20-slim
WORKDIR /app

# Cypress (and other headless browsers) need X11 and related libs on Linux
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
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
# No COPY . . needed here for dev
EXPOSE 3000
CMD ["npm", "run", "dev"]