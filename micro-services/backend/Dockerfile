FROM node:18-alpine
WORKDIR /app
COPY package.json ./

# Add necessary build dependencies for bcrypt
RUN apk add --no-cache make gcc g++ python3

# Install dependencies and rebuild bcrypt
RUN npm install
RUN npm rebuild bcrypt --build-from-source

COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]