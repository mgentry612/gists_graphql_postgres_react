export {}
const GithubAPI = require('./../../logic/github/github_api_v1.js');

class Controller {
    private githubAPI: GithubAPI;

    constructor () {
        this.githubAPI = new GithubAPI();
    }

    public async getGistsFromUsername (username: string): Promise<GitSummariesResponse> {
        // TODO: better validation
        if (!username) {
            return new Promise((resolve, reject) => {
                reject({
                    success: false,
                    results: {},
                    // TODO: i18n
                    msg: 'Please provide a username.',
                });
            });
        }
        return await this.githubAPI.getGistsFromUsername(username);
    }

    public async getGistDetails (gist_id: string): Promise<GitDetailsResponse> {
        // TODO: better validation
        if (!gist_id) {
            return new Promise((resolve, reject) => {
                reject({
                    success: false,
                    results: {},
                    // TODO: i18n
                    msg: 'Please provide a gist ID.',
                });
            });
        }
        return await this.githubAPI.getGistDetails(gist_id);
    }

    public async getFavoriteGists (): Promise<GitFavoritesListResponse> {
        return await this.githubAPI.getFavoriteGists();
    }

    public async setFavoriteGist (gist_id: string, is_favorite: boolean): Promise<GitFavoritesResponse> {
        // TODO: better validation
        if (!gist_id || is_favorite === undefined || is_favorite === null) {
            return new Promise((resolve, reject) => {
                reject({
                    success: false,
                    results: {},
                    // TODO: i18n
                    msg: 'Please provide  gist_id and is_favorite.',
                });
            });
        }
        return await this.githubAPI.setFavoriteGist(gist_id, is_favorite);
    }
}

module.exports = Controller