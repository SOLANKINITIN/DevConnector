const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @routes   GET api/profile/me
// @desc     Get current user profile
// @access   Private

router.get('/me', auth, async (req, res, next) => {
  try {
    const profile = await await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'There is no profile for this user' }] });
    }
    req.json(Profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @routes   Post api/profile
// @desc     Create & update profile routes
// @access   Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is reqiured')
        .not()
        .isEmpty(),
      check('skills', 'Skills is reqiured')
        .not()
        .isEmpty()
    ]
  ],

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      likedin
    } = req.body;
    //Build prifile objct
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) {
      profileFields.company = company;
    }
    if (website) {
      profileFields.website = website;
    }
    if (location) {
      profileFields.location = location;
    }
    if (bio) {
      profileFields.bio = bio;
    }
    if (status) {
      profileFields.status = status;
    }
    if (githubusername) {
      profileFields.githubusername = githubusername;
    }
    if (skills) {
      //   console.log(123);
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    //Build social objct

    profileFields.social = {};
    if (youtube) {
      profileFields.youtube = youtube;
    }
    if (facebook) {
      profileFields.facebook = facebook;
    }
    if (twitter) {
      profileFields.twitter = twitter;
    }
    if (likedin) {
      profileFields.likedin = likedin;
    }
    if (instagram) {
      proifileFields.instagram = instagram;
    }
    // console.log(proifileFields.social.twitter);
    // res.send('hello');
    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
