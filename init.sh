#!/bin/bash
docker pull postgres
docker run -d --name gist-postgres -e POSTGRES_PASSWORD='Pass2020!' -p 5432:5432 postgres
npm --prefix ./gist_github_api/ install
npm --prefix ./gist_react_app/ install
node ./gist_github_api/utilities/init_postgres.js