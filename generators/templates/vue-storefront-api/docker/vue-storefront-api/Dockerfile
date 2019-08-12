FROM node:10-alpine

ENV VS_ENV prod

WORKDIR /var/www

RUN apk add --no-cache curl git

COPY package.json ./
COPY yarn.lock ./

RUN apk add --no-cache --virtual .build-deps ca-certificates wget && \
    yarn install --no-cache && \
    apk del .build-deps

COPY . .

COPY docker/vue-storefront-api/migration.sh /usr/local/bin/
COPY docker/vue-storefront-api/vue-storefront-api.sh /usr/local/bin/

RUN yarn install

CMD ["vue-storefront-api.sh"]