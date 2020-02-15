const express = require('express');
const routes = express.Router();

// @routes   GET api/users
// @desc     Test route
// @access   Public

routes.get('/', (req, res, next) => res.send('Users routes'));

module.exports = routes;
