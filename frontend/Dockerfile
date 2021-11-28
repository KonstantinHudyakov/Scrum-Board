FROM node:17-alpine3.14
WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm install
ENV PATH="./node_modules/.bin:$PATH"
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY . ./
CMD ["npm", "start"]
