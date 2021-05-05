# Gists API

Gists is an API that allows users to retrieve public Github gists and favorite them.

## Installation

Install the latest node.js and npm versions from https://nodejs.org/en/download/.

Clone the repository.

```bash
git clone https://github.com/mgentry612/gists_graphql_postgres_react.git ./<your_dir>/
```

cd into your directory and install the project dependencies.

```bash
bash init.sh
```
Build the project.

```bash
npm run build
```

## Usage

Run the GraphQL Server
```node
npm start --prefix ./gist_github_api/
```
Open another terminal and run the following from your root directory
```node
npm start --prefix ./gist_react_app/
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
