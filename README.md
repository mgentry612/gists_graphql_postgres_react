# Gists API

Gists is an API that allows users to retrieve public Github gists and favorite them.

## Installation

Install the latest node.js and npm versions from https://nodejs.org/en/download/.
Install the latest docker.

Clone the repository.

```bash
git clone https://github.com/mgentry612/gists_graphql_postgres_react.git ./<your_dir>/
```

cd into your directory run the following to pull and run the postgres container, then initialize the database and table, next install the graphql and react APIs. Yes, there is a dummy password there, please don't store sensitive data in here.

```bash
docker pull postgres
docker run -d --name gist-postgres -e POSTGRES_PASSWORD=Pass2020! -p 5432:5432 postgres
cd ./gist_react_app/
npm install
cd ../gist_github_api/
npm install
node ./utilities/init_postgres.js
```

## Usage

Run the GraphQL Server from the ./gist_github_api directory
```node
npm start
```
Open another terminal and run the following from the ./gist_react_app
```node
npm start
```
## Run Test Suite
Could be coming soon, see https://github.com/mgentry612/in_memory_db for examples of Jest tests integrated into the controller layer.

```node
npm run test
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
