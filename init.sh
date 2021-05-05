#!/bin/bash
docker pull postgres
docker run -d --name gist-postgres -e POSTGRES_PASSWORD=Pass2020! -p 5432:5432 postgres
node ./gist_github_api/utilities/init_postgres.js
npm --prefix ./gist_github_api/ install
npm --prefix ./gist_react_app/ install