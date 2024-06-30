# Use Node.js version 20 based on Alpine Linux as the base image for the installer stage
FROM node:20-alpine as installer

# Set npm's global installation directory, avoiding the need for sudo with npm
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# Update PATH to include the global npm bin directory
ENV PATH=$PATH:/home/node/.npm-global/bin

# Set the working directory to /home/node inside the image
WORKDIR /home/node

# Install node-gyp globally for building native addons, pm2 for process management, and pm2-logrotate plugin
RUN npm i -g node-gyp && npm i -g pm2 && pm2 install pm2-logrotate

# Copy package.json and package-lock.json (or npm's lockfile) to the working directory
COPY package*.json /home/node/

# Install project dependencies defined in package.json using the ci command for a clean install
RUN npm ci

# Start of the builder stage, using the previously defined installer stage as the base
FROM installer as builder

# Set the NODE_ENV environment variable to "build" for this stage
ENV NODE_ENV build

# Working directory remains the same as in the installer stage
WORKDIR /home/node

# Copy installed node_modules and other files from the installer stage
COPY --from=installer /home/node/node_modules /home/node/node_modules
COPY . /home/node

# Run the build script defined in package.json to compile the project
RUN npm run build

# Start of the production stage, using the Node.js 20 Alpine image as the base
FROM node:20-alpine as production

# Update PATH to include the global npm bin directory
ENV PATH=$PATH:/home/node/.npm-global/bin
# Set the NODE_ENV environment variable to "production" for this stage
ENV NODE_ENV production

# Set the system timezone to Europe/Belgrade
RUN ln -s /usr/share/zoneinfo/Europe/Belgrade /etc/localtime

# Copy pm2 configurations from the root directory in the installer stage to the .pm2 directory in the home folder for the node user
COPY --from=installer /root/.pm2 /home/node/.pm2
# Change the ownership of the .pm2 directory to the node user
RUN chown -R node:node /home/node/.pm2

# Switch to the 'node' user for security reasons
USER node
# Set the working directory to /home/node for the 'node' user
WORKDIR /home/node

# Copy the build artifacts, node_modules, global npm configurations, and relevant config files from the builder stage
COPY --from=builder /home/node/dist/ /home/node/dist/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/.npm-global/ /home/node/.npm-global/
COPY --from=builder /home/node/*config*.json /home/node/
COPY --from=builder /home/node/package.json /home/node/

# Switch to the 'node' user to run the application (repeated, only needed once)
USER node

#CMD ["pm2", "start", "dist/src/main.js", "--no-daemon", "-i", "max"]
# Command to start the application using pm2, ensuring it doesn't run in daemon mode
CMD ["pm2", "start", "dist/src/main.js", "--no-daemon"]
