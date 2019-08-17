#!/bin/sh
set -e

response=$(curl --request GET http://${ELASTICSEARCH_HOST}:9200/_cluster/health | jq -r '.status') || exit 1

if [ "$response" = 'green' ] || [ "$response" = 'yellow' ]; then
  echo "Elasticsearch can accept connections. Status is $response"
else
  echo "Invalid status $response"
  exit 1
fi

migration.sh

if [ "$VS_ENV" = 'dev' ]; then
  yarn dev
else
  yarn start
fi
