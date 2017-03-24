
# Quick-start guide

## Configure your AWS credentials

Use https://serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/, modify by hand ~/.aws/credentials if needed (explain format)

## Deployment

If you change the app:
./node_modules/serverless/bin/serverless deploy function -f demo

Only update a function:
./node_modules/serverless/bin/serverless deploy function -f demo

## Run locally

./node_modules/serverless/bin/serverless invoke local  -f demo

## Run Database Migration

./node_modules/db-migrate/bin/db-migrate up --config config/db.json -e prod
