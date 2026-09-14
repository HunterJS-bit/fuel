# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# Install SQLite and build dependencies required for the sqlite3 Node.js driver
RUN apk add --no-cache sqlite python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all project files, including stations.db
COPY . .

# Build the Nuxt 3 application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Configure host to 0.0.0.0 for Docker networking and define default port
ENV HOST=0.0.0.0
ENV PORT=3000

# Run the compiled Nuxt 3 application
CMD ["node", ".output/server/index.mjs"]
