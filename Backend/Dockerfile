FROM node

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json tsconfig.json ./

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg libffmpeg-nvenc-dev

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run the app (production)
CMD [ "npm", "run", "start:prod" ]