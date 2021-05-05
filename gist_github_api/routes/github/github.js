const express = require('express')
const router = express.Router();

const GithubController = require('./../../built/controllers/github/controller')
const controller = new GithubController();

router.get('/users/:username/gists', function(req, res, next) {
    controller.getGistsFromUsername(req.params.username).then((response) => {
        if (response.success) {
            const status = 200;
            res.status(status).json({ gists: response.results });
        } else {
            const status = 400;
            res.status(status).json({ msg: response.msg });
        }
    }, (response) => {
        const status = 500;
        res.status(status).json({ msg: response.msg });
    });
});

router.get('/gists/:gist_id', function(req, res, next) {
    controller.getGistFromId(req.params.gist_id).then((response) => {
        if (response.success) {
            const status = 200;
            res.status(status).json({ gists: [response.results] });
        } else {
            const status = 400;
            res.status(status).json({ msg: response.msg });
        }
    }, (response) => {
        const status = 500;
        res.status(status).json({ msg: response.msg });
    });
});

module.exports = router;