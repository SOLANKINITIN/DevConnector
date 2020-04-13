const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @routes   GET api/profile/me
// @desc     Get current user profile
// @access   Private

router.get('/me', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(Profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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
      check('status', 'Status is reqiured').not().isEmpty(),
      check('skills', 'Skills is reqiured').not().isEmpty(),
    ],
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
      likedin,
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
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    //Build social objct

    profileFields.social = {};
    if (youtube) {
      profileFields.social.youtube = youtube;
    }
    if (facebook) {
      profileFields.social.facebook = facebook;
      if (twitter) {
      }
      profileFields.social.twitter = twitter;
    }
    if (likedin) {
      profileFields.social.likedin = likedin;
    }
    if (instagram) {
      profileFields.social.instagram = instagram;
    }
    // console.log(profileFields.social);
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

// @routes   GET api/profile
// @desc     Get all profiles
// @access   Public

router.get('/', async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @routes   GET api/profile/user-id
// @desc     Get all profile by user id
// @access   Public

router.get('/user/:user_id', async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});
// @routes   Delete api/profile/
// @desc     Get delete profile,user& posts
// @access   Public

router.delete('/', auth, async (req, res, next) => {
  try {
    //@Todo-remove users posts

    //Remove Profile
    await Profile.findByIdAndRemove({ user: req.user.id });
    //Remove User
    await User.findByIdAndRemove({ _id: req.user.id });

    res.json({ msg: 'User Deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
// @routes   Put api/profile/expreience
// @desc   Add Profile expreience
// @access   Private
router.put(
  '/expreience',
  [
    auth,
    [
      check('title', 'Title is reqiured').not().isEmpty(),
      check('company', 'Company is reqiured').not().isEmpty(),
      check('form', 'Form is reqiured').not().isEmpty(),
    ],
  ],
  async (res, req, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      form,
      to,
      description,
      location,
      current,
    } = req.body;

    const newExp = {
      title,
      company,
      form,
      to,
      description,
      location,
      current,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      prifile.expreience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);
// @routes   Delete api/profile/expreience
// @desc    Delete Profile expreience
// @access   Private
router.delete('/expreience/:exp.id', auth, async (res, req, next) => {
  try {
    const profile = await Profile.findByIdAndRemove({ user: req.user.id });
    const removeIndex = profile.expreience
      .map((item) => item.id)
      .indexof(req.params.exp_id);

    prifile.expreience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
// @routes   Put api/profile/education
// @desc   Add Profile education
// @access   Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is reqiured').not().isEmpty(),
      check('degree', 'Degree is reqiured').not().isEmpty(),
      check('form', 'Form is reqiured').not().isEmpty(),
      check('fieldofstudy', 'Field of study is reqiured').not().isEmpty(),
    ],
  ],
  async (res, req, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      form,
      to,
      description,
      fieldofstudy,
      current,
    } = req.body;

    const newEdu = {
      school,
      degree,
      form,
      to,
      description,
      fieldofstudy,
      current,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      prifile.expreience.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);
// @routes   Delete api/profile/education/edu.id
// @desc    Delete Profile education
// @access   Private
router.delete('/education/:edu.id', auth, async (res, req, next) => {
  try {
    const profile = await Profile.findByIdAndRemove({ user: req.user.id });
    const removeIndex = profile.expreience
      .map((item) => item.id)
      .indexof(req.params.edu_id);

    prifile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
// @routes   Get api/profile/Github/:username
// @desc   Get user rpos form Github
// @access   Public

router.get('/github:/username', auth, async (req, res, next) => {
  try {
    const options = {
      uri: `https://github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientID'
      )}&client_secret=${config.get('githubClientSecret')}`,
      method: 'Get',
      headers: { 'user-agent': 'node.js' },
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: 'No Github Profile Found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
