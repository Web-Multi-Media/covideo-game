FROM node:12-alpine

# Create app directory and use it as the working directory
RUN mkdir -p /srv/app/wildcard-front
WORKDIR /srv/app/wildcard-front

COPY package* ./

RUN npm install

COPY . /srv/app/wildcard-front

CMD ["npm", "start"]