FROM node:16.13.2

ENV NODE_ENV=production
# Create app directory

WORKDIR /app

# Install app dependencies

COPY package*.json ./

RUN npm install 

# If you are building your code for production
# Bundle app source
COPY . ./
EXPOSE 3000

CMD [ "npm", "start" ]