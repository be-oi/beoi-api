
# beOI API

This project is a lambda-powered micro-service library in support for various beOI service.

## Overview

This project uses [Serverless](https://serverless.com/) project to deploy easily serverless functions on [AWS Lambda](https://aws.amazon.com/lambda/). The developer should refer to [Serverless doc](https://serverless.com/framework/docs/) for more info.

### Requirements

The following list of tools is required. It may work with lower version, but with no guarantees.

* nodejs >= 6.10
* npm >= 4.1

## Quick-start

### Install the packages

To install locally the packages required for development and running the project, run `npm install`.

### Test the first service

You should already be able to call your first REST service locally:

    ./node_modules/serverless/bin/serverless invoke local -f index

You can follow the path from the service definition to the implementation through `serverless.yml`, `handle.js` and `lib/status.js`.

### Install a local database

To be able to test the services locally, you need to install a Postgres database. The easiest way to have exactly the same version as the production server and to avoid the installation hassle is to run it in a container. Install Docker, then run it with:

    docker run --name beoiapidb -p 5432:5432 --rm -e POSTGRES_PASSWORD=secret postgres:9.6.1

Then, configure your `config/db.json` file with your database settings. You can start by copying `config/db.sample.json` file and adapt it. Note the root keys are the environment, to run it locally only, keep "dev".

To manage your database (e.g., add content), use an external tool such as [PGAdmin](https://www.pgadmin.org/) (UI) or directly the `psql` client ([using another docker container for instance](https://hub.docker.com/_/postgres/)) (CLI).

### Setup the database

To make your database is correctly installed and to install the latest version of the database schema, run

    ./node_modules/db-migrate/bin/db-migrate up --config config/db.json -e dev

Each time you pull a database migration from the repository, do not forget to rerun this command.

### Test a first service against the database

You should now be able to call a service locally to your local database:

    ./node_modules/serverless/bin/serverless invoke local -f ping

You can follow the path from the service definition to the implementation through `serverless.yml`, `handle.js` and `lib/status.js`.

### Use a local development API server

After running

    ./node_modules/serverless/bin/serverless offline

a development server should make the endpoints available on http://localhost:3000

## Deployment into Production

In production, the code run on AWS, so you first need to configure your environment for it.

### Configure your AWS credentials

If you do not have AWS credentials configured yet for your unix user, configure it using classical AWS tools or [Serverless's](https://serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/). You can modify your own `~/.aws/credentials` if you need to update them later.

### Run a migration

If you need to run migration, you need direct access to the database, so to configure `config/db.json` for the "prod" key. To test whether a migration needs to be executed and run it if needed, use:

    ./node_modules/db-migrate/bin/db-migrate up --config config/db.json -e prod

## Deployment

To redeploy the full stack:

    ./node_modules/serverless/bin/serverless deploy

To (re)deploy a single function:

    ./node_modules/serverless/bin/serverless deploy function -f ping

To run this function in the cloud:

    ./node_modules/serverless/bin/serverless deploy function -f ping
