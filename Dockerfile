FROM node:18

RUN mkdir -p /home/app

WORKDIR /home/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]