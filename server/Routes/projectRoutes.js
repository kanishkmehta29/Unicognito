const express = require('express');
const { getToken, verifyToken, authenticateUser } = require('../middlewares/verifyToken');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { newProject, getAllProjects, getProject, deleteProject, likeProject, dislikeProject, getMyProjects, addComment,getMyConnectionProjects,addCollab } = require('../controllers/projectController');


router.post('/', getToken, verifyToken, authenticateUser,upload.array('media',10), newProject);
router.get('/', getAllProjects);
router.get('/my',getToken, verifyToken, authenticateUser, getMyProjects);
router.get('/myconnectionprojects', getToken, verifyToken, authenticateUser, getMyConnectionProjects);
router.get('/:projectId', getProject);
router.delete('/:projectId', getToken, verifyToken, authenticateUser, deleteProject);
router.put('/:projectId/addCollab',getToken,verifyToken,authenticateUser,addCollab) // authorization done in controllers
router.put('/likes', getToken, verifyToken, authenticateUser, likeProject);    
router.put('/dislikes', getToken, verifyToken, authenticateUser, dislikeProject);
router.post('/comment', getToken, verifyToken, authenticateUser, addComment);

module.exports = router;
