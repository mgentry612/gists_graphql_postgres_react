const { Octokit } = require("@octokit/rest");
const { GistDetails, GitDetailsResponse } = require ("./../../types");
const postgres = require('postgres');

class GithubAPI {
    private octokit: typeof Octokit;
    private postgres_cn: typeof postgres;

    constructor () {
        this.octokit = new Octokit();
        
        this.postgres_cn = postgres('postgres://username:password@host:port/database', {
            host        : 'localhost',         // Postgres ip address or domain name
            port        : 5432,       // Postgres server port
            path        : '',         // unix socket path (usually '/tmp')
            database    : 'gists',         // Name of database to connect to
            username    : 'postgres',         // Username of database user
            // TODO: store pword in keystore
            password    : 'Pass2020!',         // Password of database user
            ssl         : false,      // True, or options for tls.connect
            max         : 10,         // Max number of connections
            timeout     : 0,          // Idle connection timeout in seconds
        });
    }

    public async getGistsFromUsername (username: string): Promise<GitSummariesResponse> {
        return new Promise (async (resolve, reject) => {
            if (!username) {
                reject({
                    success: false,
                    results: {},
                    // TODO: i18n
                    msg: 'Please provide a username.',
                });
                return;
            }

            let results: any;
            try {
                results = await this.octokit.request('GET /users/{username}/gists', {
                    username
                });
            } catch (e) {
                console.log(e);
                // Username not found
                resolve({
                    success: true,
                    results: [],
                    error: null,
                });
                return;
            }

            if (results.status === 200) {
                // TODO: can run concurrently to above request;
                const favorites: any = await this.getFavoriteGists();
                if (!favorites.success) {
                    reject({
                        success: false,
                        results: {},
                        // TODO: i18n, read github docs to retrieve error message
                        msg: 'Github responded with an error: message.',
                    });
                }
                const summaries = [];
                for (const gist of results.data) {
                    summaries.push({
                        gist_id: gist.id,
                        created_at: gist.created_at,
                        description: gist.description,
                        is_favorite: favorites.results.indexOf(gist.id) > -1
                    });
                }

                // GistSummary
                resolve({
                    success: true,
                    results: summaries,
                    error: null,
                });
            } else {
                reject({
                    success: false,
                    results: {},
                    // TODO: i18n, read github docs to retrieve error message
                    msg: 'Github responded with an error: message.',
                });
                return;
            }
        });
    }

    public async getGistDetails (gist_id: string): Promise<GitDetailsResponse> {
        return new Promise (async (resolve, reject) => {
            if (!gist_id) {
                reject({
                    success: false,
                    results: {},
                    // TODO: i18n
                    msg: 'Please provide a gist ID.',
                });
                return;
            }

            let results: any;
            try {
                results = await this.octokit.request('GET /gists/{gist_id}', {
                    gist_id
                });
            } catch (e) {
                reject({
                    success: false,
                    results: {},
                    // TODO: i18n
                    msg: 'Failed to retrieve gist from Github.',
                });
                return;
            }

            if (results.status === 200) {
                const details = results.data;

                // Check if favorite
                let isFavorite = false;

                // TODO: can do this concurrently
                const favoriteResults: any = await this.getFavoriteGists(details.id);
                if (favoriteResults.success && favoriteResults.results.length === 1) {
                    isFavorite = true;
                }

                let files: string[] = [];
                if (details.files) {
                    files = Object.keys(details.files);
                }
                

                const gistDetails: GistDetails = {
                    gist_id: details.id,
                    created_at: details.created_at,
                    description: details.description,
                    // TODO: check db
                    is_favorite: isFavorite,
                    files: files,
                }

                resolve({
                    success: true,
                    results: gistDetails,
                    error: null,
                });
            } else {
                reject({
                    success: false,
                    results: {},
                    // TODO: i18n, read github docs to retrieve error message
                    msg: 'Github responded with an error: message.',
                });
                return;
            }
        });
    }
    
    public async getFavoriteGists (gist_id?: string): Promise<GitFavoritesListResponse> {
        return new Promise (async (resolve, reject) => {

            try {
                let data;
                if (gist_id) {
                    data = await this.postgres_cn`
                        SELECT gist_id FROM favorites
                        WHERE
                        gist_id = ${ gist_id }
                    `
                } else {
                    data = await this.postgres_cn`
                        SELECT gist_id FROM favorites
                    `
                }
                const results = data.map((item: any) => {
                    return item.gist_id;
                });
                    
                resolve({
                    success: true,
                    results: results,
                    error: null,
                });

            } catch (e) {
                reject({
                    success: false,
                    // TODO: i18n
                    results: null,
                    msg: 'Failed to get favorites.',
                });
                return;
            }
        });
    }

    public async setFavoriteGist (gist_id: string, is_favorite: boolean): Promise<GitFavoritesResponse> {
        // TODO: check if gist exists
        return new Promise (async (resolve, reject) => {
            if (!gist_id || is_favorite === undefined || is_favorite === null) {
                reject({
                    success: false,
                    results: {},
                    // TODO: i18n
                    msg: 'Please provide gist_id and is_favorite.',
                });
                return;
            }

            try {

                if (is_favorite) {
    
                    const row = {
                        gist_id,
                    };

                    await this.postgres_cn`
                        INSERT INTO favorites ${
                            this.postgres_cn(row, 'gist_id')
                        } ON CONFLICT DO NOTHING
                    `
                    
                    resolve({
                        success: true,
                        error: null,
                    });

                } else {
                    
                    await this.postgres_cn`
                        DELETE FROM favorites
                        WHERE
                            gist_id = ${ gist_id }
                    `
                    
                    resolve({
                        success: true,
                        error: null,
                    });

                }

            } catch (e) {
                reject({
                    success: false,
                    // TODO: i18n
                    msg: 'Failed to update favorite.',
                });
                return;

            }
        });
    }

}

module.exports = GithubAPI