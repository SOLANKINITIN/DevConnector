const express = require('express');
const routes = express.Router();

// @routes   GET api/auth
// @desc     Test route
// @access   Public

routes.get('/', (req, res, next) => res.send('Auth routes'));

module.exports = routes;
