const express = require('express');
const router = express.Router();

const { addPost, allPosts  } = require('../controllers/post.controller');
const { protect } = require('../../../middleware/auth');

router.post('/add',protect,  addPost);
router.get('/all', protect, allPosts);


module.exports = router;