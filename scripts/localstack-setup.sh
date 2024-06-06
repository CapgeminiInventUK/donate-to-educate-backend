#!/bin/bash

apt-get install jq -y

rm /scripts/.env

# Setup public resolver #
awslocal lambda create-function \
    --function-name localstack-public-resolver \
    --runtime nodejs18.x \
    --zip-file fileb:///build/publicResolver.zip \
    --handler ./src/handlers/publicResolver.handler \
    --environment "Variables={MONGO_URL=mongodb://localhost:27017}" \
    --role arn:aws:iam::000000000000:role/lambda-role \

url=$(awslocal lambda create-function-url-config \
    --function-name localstack-public-resolver \
    --auth-type NONE | jq -r '.FunctionUrl')

echo PUBLIC_RESOLVER_URL=$url >> /scripts/.env
# End of public resolver #

# Setup private resolver #
awslocal lambda create-function \
    --function-name localstack-private-resolver \
    --runtime nodejs18.x \
    --zip-file fileb:///build/privateResolver.zip \
    --handler ./src/handlers/privateResolver.handler \
    --role arn:aws:iam::000000000000:role/lambda-role

url=$(awslocal lambda create-function-url-config \
    --function-name localstack-private-resolver \
    --auth-type NONE | jq -r '.FunctionUrl')
echo PRIVATE_RESOLVER_URL=$url >> /scripts/.env
# Setup private resolver #
