const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @routes   Post api/posts
// @desc     Create post route
// @access   Public

router.post(
  '/',
  [auth, [check('text', 'Text is reqiured').not().isEmpty()]],
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);
// @routes   GET api/posts
// @desc     Get all posts
// @access   Private

router.get('/', auth, async (req, res, next) => {
  try {
    const post = await Post.find().sort({ date: -1 });
    res.json(post);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
// @routes   GET api/posts/:id
// @desc     Get posts By id
// @access   Private

router.get('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(400).json({ msg: 'Post Not Found' });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'objectId') {
      res.status(400).json({ msg: 'Post Not Found' });
    }
    res.status(500).send('Server Error');
  }
});
// @routes   Delete api/posts/:id
// @desc     Delete posts By id
// @access   Private

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!posts) {
      res.status(404).json({ msg: 'Post Not Found' });
    }
    //Check user
    if (post.user.toString() !== req.params.id) {
      return res.status(401).json({ msg: 'User Not Authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'objectId') {
      res.status(400).json({ msg: 'Post Not Found' });
    }
    res.status(500).send('Server Error');
  }
});
// @routes   Put api/posts/like/:id
// @desc     Like a posts
// @access   Private
router.put('/like/:id', async (res, req, next) => {
  try {
    const post = await Post.findOne(req.params.id);
    //Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @routes   Put api/posts/unlike/:id
// @desc     Unlike a posts
// @access   Private
router.put('/unlike/:id', async (res, req, next) => {
  try {
    const post = await Post.findOne(req.params.id);
    //Check if the post has already been liked
    if (
      post.unlikes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post hasnot yet been liked' });
    }
    //Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @routes   Post api/posts/comment/:id
// @desc     Comment on post
// @access   Public

router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is reqiured').not().isEmpty()]],
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comment.unshift(newComment);
      await post.save();
      res.json(post.comment);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @routes   Delete api/posts/comment/:id/>comment_id
// @desc     Delete Comment
// @access   Private

router.delete('/comment/:id/:comment_id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    //Pull out comment
    const comment = post.comment.find(
      (comment) => comment.id === req.params.comment_id
    );
    //Make sure  comment exixts
    if (!comment) {
      return res.status(400).json({ msg: 'Comment does not exist' });
    }
    //Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User  not Authorized' });
    }
    //Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
