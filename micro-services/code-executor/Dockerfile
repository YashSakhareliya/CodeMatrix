FROM node:18
WORKDIR /app
COPY package.json ./

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends docker.io make gcc g++ python3 && rm -rf /var/lib/apt/lists/*
RUN npm install
RUN npm rebuild bcrypt --build-from-source

COPY . .
EXPOSE 7000
CMD ["npm", "run", "dev"]
