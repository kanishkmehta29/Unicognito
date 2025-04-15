const express = require('express');
const { getToken, authenticateUser, verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();
const { newDiscussion, getAllDiscussion, getDiscussion, deleteDiscussion, upvoteDiscussion, downvoteDiscussion, getMyDiscussions, addComment } = require('../controllers/discussionController');

router.post('/',getToken, verifyToken, authenticateUser, newDiscussion);
router.get('/', getAllDiscussion);
router.get('/my',getToken, verifyToken, authenticateUser, getMyDiscussions);
router.get('/:discussionId', getDiscussion);
router.delete('/:discussionId',getToken, verifyToken, authenticateUser, deleteDiscussion); // authorization done in controllers
router.put('/upvote',getToken, verifyToken, authenticateUser, upvoteDiscussion);
router.put('/downvote',getToken, verifyToken, authenticateUser, downvoteDiscussion);
router.post('/comment',getToken, verifyToken, authenticateUser, addComment);




module.exports = router;