const express = require('express');
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();
const port = 3001;

const GithubController = require('./built/controllers/github/controller')
const controller = new GithubController();

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type GistSummaries {
    summaries: [GistSummary]!
  }
 
  type GistDetails {
    gist_id: ID!
    created_at: String!
    description: String
    is_favorite: Boolean!
    files: [String]
  }
 
  type GistSummary {
    gist_id: ID!
    created_at: String!
    description: String
    is_favorite: Boolean!
  }
 
  type Query {
    details(gist_id: ID!): GistDetails
    summaries(username: String!): GistSummaries
    favorites: [String]
  }

  type Mutation {
    favorite(gist_id: ID!, is_favorite: Boolean!): Boolean
  }
`);

var root = {
    summaries: async ({username}) => {
        try {
            const response = await controller.getGistsFromUsername(username);
            if (!response.success) {
                throw new Error('Error retrieving gists. ' + response.msg);
            }
            return {
                summaries: response.results
            };
        } catch (e) {
            const msg = (' ' + e.msg) || '';
            throw new Error('Error retrieving gists.' + msg);
        }
    },
    details: async ({gist_id}) => {
        try {
            const response = await controller.getGistDetails(gist_id);
            if (!response.success) {
                throw new Error('Error retrieving gist details.' + response.msg);
            }
            return response.results;
        } catch (e) {
            const msg = (' ' + e.msg) || '';
            throw new Error('Error retrieving gist details.' + msg);
        }
    },

    // Favorites
    favorites: async ({}) => {
        try {
            const response = await controller.getFavoriteGists();
            if (!response.success) {
                throw new Error('Error retrieving favorite gists. ' + response.msg);
            }
            return response.results;
        } catch (e) {
            const msg = (' ' + e.msg) || '';
            throw new Error('Error retrieving favorite gists.' + msg);
        }
    },
    favorite: async ({gist_id, is_favorite}) => {
        try {
            const response = await controller.setFavoriteGist(gist_id, is_favorite);
            if (!response.success) {
                throw new Error('Error setting favorite gist. ' + response.msg);
            }
            return true;
        } catch (e) {
            const msg = (' ' + e.msg) || '';
            throw new Error('Error setting favorite gist.' + msg);
        }
    },
};

// const githubRouter = require('./routes/github/github');

// app.use('/', githubRouter);

app.use('/gists', cors(), graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})