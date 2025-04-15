const express = require('express');
const router = express.Router();
const { getToken, verifyToken, authenticateUser } = require('../middlewares/verifyToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure temp directory exists
const tempDir = path.join(__dirname, '..', 'uploads', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log(`Created directory: ${tempDir}`);
}

// Configure multer for temporary file storage
const tempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'temp-' + uniqueSuffix + ext);
  }
});

// Create a single multer instance for all file uploads
const upload = multer({ storage: tempStorage });

// Import your controllers
const { 
  createCommunity, 
  getAllCommunities, 
  getCommunityById, 
  getCommunityPosts,
  joinCommunity,
  leaveCommunity,
  createCommunityPost,
  deleteCommunity,
  addCommunityAdmin,
  removeCommunityAdmin,
  removeCommunityMember,
  searchCommunities,
  getTrendingCommunities
} = require('../controllers/communityController');

const {
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment
} = require('../controllers/postController');

// Community endpoints
router.post('/', getToken, verifyToken, authenticateUser, upload.single('coverImage'), createCommunity);
router.get('/', getAllCommunities);
router.get('/trending', getTrendingCommunities);
router.get('/search', searchCommunities);
router.get('/:id', getCommunityById);
router.delete('/:id', getToken, verifyToken, authenticateUser, deleteCommunity);

// Community membership endpoints
router.post('/:id/join', getToken, verifyToken, authenticateUser, joinCommunity);
router.post('/:id/leave', getToken, verifyToken, authenticateUser, leaveCommunity);

// Community admin management endpoints
router.post('/:id/admins', getToken, verifyToken, authenticateUser, addCommunityAdmin);
router.delete('/:id/admins/:userId', getToken, verifyToken, authenticateUser, removeCommunityAdmin);
router.delete('/:id/members/:userId', getToken, verifyToken, authenticateUser, removeCommunityMember);

// Community posts endpoints - using the same upload middleware
router.get('/:id/posts', getCommunityPosts);
router.post('/:id/posts', getToken, verifyToken, authenticateUser, upload.array('media', 5), createCommunityPost);

// Individual post operations
router.put('/posts/:postId', getToken, verifyToken, authenticateUser, upload.array('media', 5), updatePost);
router.delete('/posts/:postId', getToken, verifyToken, authenticateUser, deletePost);

// Post interactions
router.post('/posts/:postId/like', getToken, verifyToken, authenticateUser, likePost);
router.delete('/posts/:postId/like', getToken, verifyToken, authenticateUser, unlikePost);

// Comment endpoints
router.post('/posts/:postId/comments', getToken, verifyToken, authenticateUser, addComment);
router.delete('/posts/:postId/comments/:commentId', getToken, verifyToken, authenticateUser, deleteComment);

module.exports = router;