FROM node:10-alpine

ENV VS_ENV prod

WORKDIR /var/www

COPY package.json ./
COPY yarn.lock ./

RUN apk add --no-cache --virtual .build-deps ca-certificates wget git \
  && yarn install --no-cache \
  && apk del .build-deps

COPY . .

COPY docker/vue-storefront/vue-storefront.sh /usr/local/bin/

RUN yarn install

CMD ["vue-storefront.sh"]
