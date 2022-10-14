FROM node:16-slim

WORKDIR /opt/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["node", "--unhandled-rejections=strict", "build/index.js"]
