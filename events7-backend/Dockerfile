# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install NestJS application dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build the NestJS application (if necessary)
RUN npm run build

# Expose the port your NestJS application is listening on (e.g., 3000)
EXPOSE 3000

# Start your NestJS application
CMD ["npm", "run", "start:prod"]
