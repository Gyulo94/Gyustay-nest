FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install pm2 -g

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8010

CMD ["pm2-runtime", "npm", "--", "run", "start:prod"]