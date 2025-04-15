const { addMessage, getAllMessage, addMessageGroups, getAllMessageGroups } = require('../controllers/messagesController');
const router = require('express').Router();

router.post('/addmsg/', addMessage);
router.post('/getmsg/', getAllMessage); 
router.post('/addmsggroups/', addMessageGroups);
router.post('/getmsggroups/', getAllMessageGroups);

module.exports = router;