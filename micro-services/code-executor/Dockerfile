FROM node:18
WORKDIR /app
COPY package.json ./

# Install dependencies
RUN apt-get update && apt-get install -y docker.io make gcc g++ python3

RUN npm install
RUN npm rebuild bcrypt --build-from-source

COPY . .
EXPOSE 7000
CMD ["npm", "run", "dev"]
