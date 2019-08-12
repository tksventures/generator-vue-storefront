#!/bin/sh
set -e

node ./core/scripts/auto-config.js

yarn build:client && yarn build:server && yarn build:sw || exit $?

if [ "$VS_ENV" = 'dev' ]; then
  yarn dev
else
  yarn start
fi
