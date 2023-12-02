FROM alpine
RUN apk add --no-cache --update nodejs npm

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit-dev
COPY . .

CMD node /app/dist/server.js