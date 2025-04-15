const express = require('express');
const { getToken, verifyToken, authenticateUser } = require('../middlewares/verifyToken');
const router = express.Router();
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

// Replace simple dest with configured storage
const upload = multer({ storage: tempStorage });

const { getCourseReviews, getMyReviews, getCourseReview, postCourseReview, deleteCourseReview, addComment, toggleEnroll } = require('../controllers/courseReviewController');

router.post('/', getToken, verifyToken, authenticateUser, upload.single('thumbnail'), postCourseReview);
router.get('/',getToken, verifyToken, authenticateUser, getCourseReviews);
router.get('/my',getToken, verifyToken, authenticateUser, getMyReviews);
router.get('/:courseid',getToken, verifyToken, authenticateUser, getCourseReview);
router.delete('/:courseid',getToken, verifyToken, authenticateUser, deleteCourseReview);
router.post('/comment',getToken, verifyToken, authenticateUser, addComment);
router.put('/enroll',getToken, verifyToken, authenticateUser, toggleEnroll);

module.exports = router;