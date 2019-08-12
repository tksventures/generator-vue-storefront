#!/bin/sh
set -e

migration.sh

if [ "$VS_ENV" = 'dev' ]; then
  yarn dev
else
  yarn start
fi
