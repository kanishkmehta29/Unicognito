const express = require("express");
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const Project = require('../models/Project');
const User = require('../models/User');
const Skill = require('../models/Skills');
const Comment = require('../models/Comments');

cloudinary.config({
  cloud_name: "dpobpe2ga",
  api_key: "528297887196318",
  api_secret: "jcpYq5B7_OEhB5nFK2gvgQmmqn8",
});

//   add a new project
const newProject = async (req, res) => {
    const project = req.body;
    console.log(project);
    try {
        const newProject = await new Project(project).save();
        if (req.files) {
            const uploadPromises = req.files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    resource_type: 'auto' // Automatically detect the resource type (image or video)
                });
            });
            const results = await Promise.all(uploadPromises);
            newProject.mediaArray = results.map(result => result.secure_url); // Add secure URLs to newProject.mediaArray
            await newProject.save();
        }
        const user = await User.findById(req.user);
        user.projects.push(newProject._id);
        await user.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
// get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("creatorId");
    res.status(200).json(projects);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// get project uisng project id
const getProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findById(projectId)
            .populate({
                path: 'commentsId',
                populate: {
                    path: 'userId',
                    model: 'User'
                }
            })
            .populate('creatorId');
        project.views += 1;
        const c = 0.5;
        const d = 2;
        const e = 2;
        const index = project.views - Math.pow(c * project.dislikes.length, d) + (e * project.likes.length);
        const div = project.views + ((e *0.2*project.views));
        const rating = (index/div)*10;
        project.rating = Math.min(10, rating); 
        await project.save();
        res.status(200).json(project);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
}


// delete  a project using its ID
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        
        // Check if the user is authorized to delete the project
        if (!Array.isArray(project.creatorId) || !project.creatorId.includes(req.user)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        project.creatorId.forEach(userId => {
            User.findById(userId).then(user => {
            console.log(user);
            user.projects.forEach(projectId => {
                if (projectId._id.toHexString() === project._id.toHexString()) {
                    user.projects.pull(projectId);
                    user.save()
                    .then((updatedUser) => console.log(updatedUser))
                    .catch(error => console.log(error));
                }
            });
        }).catch(error => console.log(error));
        });
        
        // Delete the project
        await Project.findByIdAndDelete(req.params.projectId);
        
        res.status(200).json(project);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


// like a project: PUT
const likeProject = async (req, res) => {
    const { projectId } = req.body;
    try {
        const project = await Project.findById(projectId);
        console.log("USER:   ",req.user);
        await User.findById(req.user).then(user => {
            if (project.likes.includes(user._id)) {
                project.likes.pull(user._id);
            } else if (project.dislikes.includes(user._id)) {
                project.dislikes.pull(user._id);
                project.likes.push(user._id);
            } else {
                project.likes.push(user._id);
            }
        });
        const c = 0.5;
        const d = 2;
        const e = 2;
        const index = project.views - Math.pow(c * project.dislikes.length, d) + (e * project.likes.length);
        const div = project.views + ((e *0.2*project.views));
        const rating = (index/div)*10;
        project.rating = Math.min(10, rating); 
        await project.save();
        res.status(200).json(project);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
}
//  dislike a project: DELETE
const dislikeProject = async (req, res) => {
    const { projectId } = req.body;
    try {
        const project = await Project.findById(projectId);
        await User.findById(req.user).then(user => {
            if (project.dislikes.includes(user._id)) {
                project.dislikes.pull(user._id);
            } else if (project.likes.includes(user._id)) {
                project.likes.pull(user._id);
                project.dislikes.push(user._id);
            } else {
                project.dislikes.push(user._id);
            }
        });
        const c = 0.5;
        const d = 2;
        const e = 2;
        const index = project.views - Math.pow(c * project.dislikes.length, d) + (e * project.likes.length);
        const div = project.views + ((e *0.2* project.views));
        const rating = (index/div)*10;
        project.rating = Math.min(10, rating); 
        await project.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
// get my projects list
const getMyProjects = async (req, res) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user);
    const projects = user.projects;
    console.log(projects);
    const projectArray = await Project.find({ _id: { $in: projects } });
    res.status(200).json({ projectArray, projects });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// add comment  to project : POST
const addComment = async (req, res) => {
  const { projectId, content } = req.body;
  try {
    const newComment = await new Comment({ content, userId: req.user }).save();
    const commentId = newComment._id;
    const project = await Project.findById(projectId);
    console.log(project);
    project.commentsId.push(commentId);
    await project.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// get my connections projects
const getMyConnectionProjects = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        const connections = user.connections;
        console.log(connections);
        const projects = await Project.find({ creatorId:{ $in: connections } });
        console.log(projects);
        res.status(200).json(projects);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const addCollab = async (req, res) => {
    const { user } = req.body;
    const projectId = req.params.projectId;
    try {
        const project = await Project.findById(projectId);
        project.creatorId.push(user);
        await project.save();
        res.status(200).json(project);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }    
};




module.exports = {newProject, getAllProjects, getProject, deleteProject, likeProject, dislikeProject, getMyProjects, addComment,getMyConnectionProjects, addCollab}