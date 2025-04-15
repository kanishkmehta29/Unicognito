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

const upload = multer({ storage: tempStorage });

const { newPost, getAllPost, getPost, getMyPosts, deletePost, likePost, unlikePost, addComment, getMyConnectionPosts, getMyFavPosts, addMyFavPosts } = require('../controllers/postController');

router.post('/', getToken, verifyToken, authenticateUser, upload.array('media', 10), newPost);
router.get('/', getAllPost);
router.get('/my',getToken, verifyToken, authenticateUser, getMyPosts);
router.get('/myconnectionposts',getToken,verifyToken, authenticateUser, getMyConnectionPosts);
router.post('/myfavposts',getToken,verifyToken, authenticateUser, addMyFavPosts);
router.get('/myfavposts',getToken,verifyToken, authenticateUser, getMyFavPosts);
router.get('/:postId', getToken,getPost);
router.delete('/:postId',getToken,verifyToken,authenticateUser, deletePost); // TODO authorize middleware
router.put('/:postId/like',getToken,verifyToken, authenticateUser, likePost);
router.put('/dislikes',getToken,verifyToken, authenticateUser, unlikePost);
router.post('/:postId/comment',getToken,verifyToken, authenticateUser, addComment);


module.exports = router;