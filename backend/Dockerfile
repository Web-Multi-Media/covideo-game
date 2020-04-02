FROM node:12-alpine

# Create app directory and use it as the working directory
RUN mkdir -p /srv/app/wildcard-backend
WORKDIR /srv/app/wildcard-backend

COPY package* ./

RUN npm install

COPY . /srv/app/wildcard-backend

CMD ["npm", "run", "dev"]