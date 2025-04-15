const router = require('express').Router();
const { createGroup, getAllGroups, getGroup, addMember} = require('../controllers/groupController');

router.post('/create', createGroup);
router.get('/all/:userId', getAllGroups);
router.get('/:groupId', getGroup);
router.post('/addmember', addMember);

module.exports = router;
