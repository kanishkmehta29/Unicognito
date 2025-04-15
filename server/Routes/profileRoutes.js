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

const {getProfile,getUserProfile,updateUserProfile,addtoConnection,getAllUserChats,searchProfiles,addtoPortfolio,getPortfolio,removeFromConnection} = require("../controllers/profileController");

router.put('/', getToken, verifyToken, authenticateUser, upload.single('avatar'), updateUserProfile);
router.get("/",getToken,verifyToken,authenticateUser,getProfile);
router.post("/search/",getToken,verifyToken,authenticateUser,searchProfiles);
router.get("/allChats",getToken,verifyToken,authenticateUser,getAllUserChats);
router.get("/getPortfolio/:userid",getToken,verifyToken,authenticateUser,getPortfolio);
router.get("/:userid",getToken, verifyToken, authenticateUser, getUserProfile);
router.put("/addtoPortfolio",getToken,verifyToken,authenticateUser,addtoPortfolio);
router.put("/:userid/addConnection",getToken,verifyToken,authenticateUser,addtoConnection);
router.put("/:userid/removeConnection",getToken,verifyToken,authenticateUser,removeFromConnection);



module.exports = router;
