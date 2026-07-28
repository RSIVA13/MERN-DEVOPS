FROM node:22-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy frontend package files
COPY frontend/package*.json ./frontend/

# Install backend dependencies
RUN npm install

# Install frontend dependencies
RUN npm install --prefix frontend

# Copy complete project
COPY . .

# Build React application
RUN npm run build

# Expose backend port
EXPOSE 5000

# Start Express server
CMD ["npm", "start"]