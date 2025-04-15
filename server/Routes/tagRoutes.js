const express = require('express');
const router = express.Router();
const { getToken, verifyToken, authenticateUser } = require('../middlewares/verifyToken');
const { getAllTags, createTag, addTagsToCommunity } = require('../controllers/tagController');

// Get all tags
router.get('/', getAllTags);

// Create a new tag (admin only)
router.post('/', getToken, verifyToken, authenticateUser, createTag);

// Add tags to community
router.post('/community', getToken, verifyToken, authenticateUser, addTagsToCommunity);

module.exports = router;