const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const Project = require("../models/Project");
const mongoose = require("mongoose");

cloudinary.config({
  cloud_name: "dpobpe2ga",
  api_key: "528297887196318",
  api_secret: "jcpYq5B7_OEhB5nFK2gvgQmmqn8",
});

// get profile of user
const getUserProfile = async (req, res) => {
  await User.findById(req.params.userid)
    .populate("connections")
    .then((user) => {
      if (user._id.toString() !== req.user.toString()) {
        user.views += 1;
      }
      user.save();
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// get profile of logged in user
const getProfile = async (req, res) => {
  await User.findById(req.user)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//search profiles
const searchProfiles = async (req, res) => {
  const { searchTerm } = req.body;
  try {
    const users = await User.find({
      name: { $regex: searchTerm, $options: "i" },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update profile of logged in user
const updateUserProfile = async (req, res) => {
  console.log("body: ", req.file);
  try {
    const user = await User.findById(req.user);
    
    // Update user fields from request body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        user[key] = req.body[key];
      });
    }
    
    // Handle profile picture upload
    if (req.file) {
      const profilePicUrl = await uploadFile(req.file, 'profiles');
      user.profilePic = profilePicUrl;
    }
    
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
}

const getAllUserChats = async (req, res) => {
  try {
    const users = await User.find({}).select([
      "email",
      "name",
      "avatarImage",
      "connections",
    ]);
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add profile of a user to connections of logged in user
const addtoConnection = async (req, res) => {
  const { userid } = req.params;
  console.log(userid);
  const connectionObject = new mongoose.Types.ObjectId(userid);
  const userObject = new mongoose.Types.ObjectId(req.user);
  try {
    const user2 = await User.findById(userid);
    const user = await User.findById(req.user);

    if (!user2) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user2.connections.includes(userObject));

    if (
      !user2.connections.includes(userObject) &&
      !user.connections.includes(connectionObject)
    ) {
      console.log("connection done");
      user.connections.push(userid);
      user2.connections.push(req.user);
    } else {
      console.log("not connected!");
    }
    await user.save();
    await user2.save();
    res.status(200).json({ user, user2 });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const removeFromConnection = async (req, res) => {
  const { userid } = req.params;
  const user2Id = userid;
  const user1Id = req.user;

  try {
    const user2 = await User.findById(user2Id);
    const user1 = await User.findById(user1Id);

    if (!user2 || !user1) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user2.connections.includes(user1Id) &&
      user1.connections.includes(user2Id)
    ) {
      console.log("Removing connection");
      const index1 = user1.connections.indexOf(user2Id);
      if (index1 !== -1) {
        user1.connections.splice(index1, 1);
      }

      const index2 = user2.connections.indexOf(user1Id);
      if (index2 !== -1) {
        user2.connections.splice(index2, 1);
      }
      console.log(user1);
      console.log(user2);
    } else {
      console.log("Not connected");
    }
    try {
      await user1.save();
    } catch (error) {
      console.error("Error saving user1:", error.message);
      return res.status(500).json({ message: "Error saving user1" });
    }

    try {
      await user2.save();
    } catch (error) {
      console.error("Error saving user2:", error.message);
      return res.status(500).json({ message: "Error saving user2" });
    }

    res.status(200).json({ user1, user2 });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const addtoPortfolio = async (req, res) => {
  const { project } = req.body;
  console.log("addtoPortfolio BODY: ", project);
  try {
    const user = await User.findById(req.user);
    const projectfound = await Project.findById(project);

    if (!projectfound) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (user.portfolio.includes(projectfound._id)) {
      user.portfolio.pull(projectfound._id);
    } else {
      user.portfolio.push(projectfound._id);
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPortfolio = async (req, res) => {
  const userId = req.params.userid;
  try {
    const user = await User.findById(userId).populate("portfolio");
    res.status(200).json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getProfile,
  getUserProfile,
  updateUserProfile,
  addtoConnection,
  getAllUserChats,
  removeFromConnection,
  addtoPortfolio,
  searchProfiles,
  getPortfolio,
};
