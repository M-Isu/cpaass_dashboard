# Use Node.js 16 Alpine image as base
#FROM node:18.18.0-alpine

# Set the working directory inside the container
#WORKDIR /app

# Copy package files first (to leverage Docker cache)
#COPY package.json package-lock.json* ./

# Install production dependencies (npm install --production)
#RUN npm install

# Install 'serve' globally to serve the React build
#RUN npm install -g serve

# Copy application source code (just the necessary files)
#COPY src/ src/
#COPY public/ public/

# Run build (this will generate the build directory)
 #RUN npm run build

# Expose port for the app
#EXPOSE  4384

# Command to serve the build directory on port 8995
#CMD ["npm", "run", "build"]

#CMD ["serve", "-s", "build", "-l", "4384"]


# Use Node.js base image
FROM node:18.18.0-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all application source code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose your Next.js port
EXPOSE 4384

# Start Next.js server (uses "next start")
CMD ["npm", "start"]
