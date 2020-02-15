const express = require('express');
const routes = express.Router();

// @routes   GET api/profile
// @desc     Test route
// @access   Public

routes.get('/', (req, res, next) => res.send('Profile routes'));

module.exports = routes;
