const express = require('express');
const router = express.Router();

// @routes   GET api/posts
// @desc     Test route
// @access   Public

router.get('/', (req, res, next) => res.send('Posts routes'));

module.exports = router;
