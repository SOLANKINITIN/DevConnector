const express = require('express');
const routes = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @routes   POST api/users
// @desc     Register user
// @access   Public

routes.post(
  '/',
  [
    check('name', 'Name is reqiured')
      .not()
      .isEmpty(),
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Please reqiured password with 6 or more').isLength({
      min: 6
    })
  ],
  async (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(req.body)  ;

    const { name, email, password } = req.body;
    // See if user exits
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user is a alredy exits' }] });
      }
      //Get user gravatar
      const avater = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      user = new User({
        name,
        email,
        gravatar,
        password
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      return res.status(500).send('Server error');
    }

    // res.send('Users Register');
  }
);

module.exports = routes;
