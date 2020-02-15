const express = require('express');
const routes = express.Router();

// @routes   GET api/posts
// @desc     Test route
// @access   Public

routes.get('/', (req, res, next) => res.send('Posts routes'));

module.exports = routes;
