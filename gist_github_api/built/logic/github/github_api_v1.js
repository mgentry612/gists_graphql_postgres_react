var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Octokit = require("@octokit/rest").Octokit;
var _a = require("./../../types"), GistDetails = _a.GistDetails, GitDetailsResponse = _a.GitDetailsResponse;
var postgres = require('postgres');
var GithubAPI = (function () {
    function GithubAPI() {
        this.octokit = new Octokit();
        this.postgres_cn = postgres('postgres://username:password@host:port/database', {
            host: 'localhost',
            port: 5432,
            path: '',
            database: 'gists',
            username: 'postgres',
            password: 'Pass2020!',
            ssl: false,
            max: 10,
            timeout: 0
        });
    }
    GithubAPI.prototype.getGistsFromUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var results, e_1, favorites, summaries, _i, _a, gist;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!username) {
                                        reject({
                                            success: false,
                                            results: {},
                                            msg: 'Please provide a username.'
                                        });
                                        return [2];
                                    }
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4, this.octokit.request('GET /users/{username}/gists', {
                                            username: username
                                        })];
                                case 2:
                                    results = _b.sent();
                                    return [3, 4];
                                case 3:
                                    e_1 = _b.sent();
                                    console.log(e_1);
                                    resolve({
                                        success: true,
                                        results: [],
                                        error: null
                                    });
                                    return [2];
                                case 4:
                                    if (!(results.status === 200)) return [3, 6];
                                    return [4, this.getFavoriteGists()];
                                case 5:
                                    favorites = _b.sent();
                                    if (!favorites.success) {
                                        reject({
                                            success: false,
                                            results: {},
                                            msg: 'Github responded with an error: message.'
                                        });
                                    }
                                    summaries = [];
                                    for (_i = 0, _a = results.data; _i < _a.length; _i++) {
                                        gist = _a[_i];
                                        summaries.push({
                                            gist_id: gist.id,
                                            created_at: gist.created_at,
                                            description: gist.description,
                                            is_favorite: favorites.results.indexOf(gist.id) > -1
                                        });
                                    }
                                    resolve({
                                        success: true,
                                        results: summaries,
                                        error: null
                                    });
                                    return [3, 7];
                                case 6:
                                    reject({
                                        success: false,
                                        results: {},
                                        msg: 'Github responded with an error: message.'
                                    });
                                    return [2];
                                case 7: return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    GithubAPI.prototype.getGistDetails = function (gist_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var results, e_2, details, isFavorite, favoriteResults, files, gistDetails;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!gist_id) {
                                        reject({
                                            success: false,
                                            results: {},
                                            msg: 'Please provide a gist ID.'
                                        });
                                        return [2];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4, this.octokit.request('GET /gists/{gist_id}', {
                                            gist_id: gist_id
                                        })];
                                case 2:
                                    results = _a.sent();
                                    return [3, 4];
                                case 3:
                                    e_2 = _a.sent();
                                    reject({
                                        success: false,
                                        results: {},
                                        msg: 'Failed to retrieve gist from Github.'
                                    });
                                    return [2];
                                case 4:
                                    if (!(results.status === 200)) return [3, 6];
                                    details = results.data;
                                    isFavorite = false;
                                    return [4, this.getFavoriteGists(details.id)];
                                case 5:
                                    favoriteResults = _a.sent();
                                    if (favoriteResults.success && favoriteResults.results.length === 1) {
                                        isFavorite = true;
                                    }
                                    files = [];
                                    if (details.files) {
                                        files = Object.keys(details.files);
                                    }
                                    gistDetails = {
                                        gist_id: details.id,
                                        created_at: details.created_at,
                                        description: details.description,
                                        is_favorite: isFavorite,
                                        files: files
                                    };
                                    resolve({
                                        success: true,
                                        results: gistDetails,
                                        error: null
                                    });
                                    return [3, 7];
                                case 6:
                                    reject({
                                        success: false,
                                        results: {},
                                        msg: 'Github responded with an error: message.'
                                    });
                                    return [2];
                                case 7: return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    GithubAPI.prototype.getFavoriteGists = function (gist_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var data, results, e_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 6]);
                                    data = void 0;
                                    if (!gist_id) return [3, 2];
                                    return [4, this.postgres_cn(__makeTemplateObject(["\n                        SELECT gist_id FROM favorites\n                        WHERE\n                        gist_id = ", "\n                    "], ["\n                        SELECT gist_id FROM favorites\n                        WHERE\n                        gist_id = ", "\n                    "]), gist_id)];
                                case 1:
                                    data = _a.sent();
                                    return [3, 4];
                                case 2: return [4, this.postgres_cn(__makeTemplateObject(["\n                        SELECT gist_id FROM favorites\n                    "], ["\n                        SELECT gist_id FROM favorites\n                    "]))];
                                case 3:
                                    data = _a.sent();
                                    _a.label = 4;
                                case 4:
                                    results = data.map(function (item) {
                                        return item.gist_id;
                                    });
                                    resolve({
                                        success: true,
                                        results: results,
                                        error: null
                                    });
                                    return [3, 6];
                                case 5:
                                    e_3 = _a.sent();
                                    reject({
                                        success: false,
                                        results: null,
                                        msg: 'Failed to get favorites.'
                                    });
                                    return [2];
                                case 6: return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    GithubAPI.prototype.setFavoriteGist = function (gist_id, is_favorite) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var row, e_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!gist_id || is_favorite === undefined || is_favorite === null) {
                                        reject({
                                            success: false,
                                            results: {},
                                            msg: 'Please provide gist_id and is_favorite.'
                                        });
                                        return [2];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 6, , 7]);
                                    if (!is_favorite) return [3, 3];
                                    row = {
                                        gist_id: gist_id
                                    };
                                    return [4, this.postgres_cn(__makeTemplateObject(["\n                        INSERT INTO favorites ", " ON CONFLICT DO NOTHING\n                    "], ["\n                        INSERT INTO favorites ",
                                            " ON CONFLICT DO NOTHING\n                    "]), this.postgres_cn(row, 'gist_id'))];
                                case 2:
                                    _a.sent();
                                    resolve({
                                        success: true,
                                        error: null
                                    });
                                    return [3, 5];
                                case 3: return [4, this.postgres_cn(__makeTemplateObject(["\n                        DELETE FROM favorites\n                        WHERE\n                            gist_id = ", "\n                    "], ["\n                        DELETE FROM favorites\n                        WHERE\n                            gist_id = ", "\n                    "]), gist_id)];
                                case 4:
                                    _a.sent();
                                    resolve({
                                        success: true,
                                        error: null
                                    });
                                    _a.label = 5;
                                case 5: return [3, 7];
                                case 6:
                                    e_4 = _a.sent();
                                    reject({
                                        success: false,
                                        msg: 'Failed to update favorite.'
                                    });
                                    return [2];
                                case 7: return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    return GithubAPI;
}());
module.exports = GithubAPI;
//# sourceMappingURL=github_api_v1.js.map