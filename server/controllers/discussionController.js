const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Comment = require('../models/Comments');
const Discussion = require('../models/Discussion')

// create new discussion : POST
const newDiscussion = async (req,res) => {
    try {
        console.log("Received discussion data:", req.body);
        
        // Check if the user data is properly formatted
        let posterId = req.user;
        
        // Handle the case where poster might be passed as a string object
        if (req.body.poster && typeof req.body.poster === 'string') {
            try {
                // Check if poster is a JSON string
                const posterObj = JSON.parse(req.body.poster);
                if (posterObj && posterObj.id) {
                    posterId = posterObj.id; // Extract just the ID
                }
            } catch (e) {
                // If parsing fails, assume it's already an ID string
                console.log("Poster parsing error:", e);
                posterId = req.body.poster;
            }
        }
        
        // Create a sanitized discussion object
        const discussionData = {
            ...req.body,
            poster: posterId, // Use the extracted ID
            postingTime: new Date() // Ensure we have a timestamp
        };
        
        const newDiscussion = await new Discussion(discussionData).save();
        const user = await User.findById(posterId);
        console.log("user: ", user);
        
        if (user) {
            user.discussions.push(newDiscussion._id);
            await user.save();
        }
        
        res.status(201).json(newDiscussion);
    } catch (error) {
        console.error("Error creating discussion:", error);
        res.status(409).json({message: error.message});
    }
}

// get all discussions : GET
const getAllDiscussion = async (req,res) => {
    try{
        const discussions = await Discussion.find().populate('poster');
        res.status(200).json(discussions);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

// get a discussion by id : GET
const getDiscussion = async (req,res) => {
    const { discussionId } = req.params;
    try{
        const discussion = await Discussion.findById(discussionId).populate({
            path: 'comments',
            populate: {
                path: 'userId',
                model: 'User'
            }
        });
        discussion.views += 1;
        await discussion.save();
        res.status(200).json(discussion);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

// delete a discussion by id, requires auth : DELETE
const deleteDiscussion = async (req,res) => {
    const { discussionId } = req.params;
    try{
        const discussion = await Discussion.findById(discussionId);
        await User.findById(req.user).then(user =>{
            console.log(user._id, discussion.poster);
            console.log(user._id.toHexString() === discussion.poster.toHexString());
            if (user._id.toHexString() !== discussion.poster.toHexString()){
                res.status(401).json({message: "Unauthorized"});
            }
            user.discussions.pull(discussionId);
            user.save();
        })
        await Discussion.findByIdAndDelete(discussionId);
        res.status(200).json(discussion);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

// upvote a discussion : PUT
const upvoteDiscussion = async (req,res) => {
    const { discussionId } = req.body;
    try{
        const discussion = await Discussion.findById(discussionId);
        await User.findById(req.user).then(user =>{
            if(discussion.upvotes.includes(user._id)){
                discussion.upvotes.pull(user._id);
            }
            else if(discussion.downvotes.includes(user._id)){
                discussion.downvotes.pull(user._id);
                discussion.upvotes.push(user._id);
            }
            else{
                discussion.upvotes.push(user._id);
            }
        })
        await discussion.save();
        res.status(200).json(discussion);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

// downvote a discussion : PUT
const downvoteDiscussion = async (req,res) => {
    const { discussionId } = req.body;
    try{
        const discussion = await Discussion.findById(discussionId);
        await User.findById(req.user).then(user =>{
            if(discussion.downvotes.includes(user._id)){
                discussion.downvotes.pull(user._id);
            }
            else if(discussion.upvotes.includes(user._id)){
                discussion.upvotes.pull(user._id);
                discussion.downvotes.push(user._id);
            }
            else{
                discussion.downvotes.push(user._id);
            }
        })
        res.status(200).json(discussion);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

// get all discussions posted by user : GET
const getMyDiscussions = async (req,res) => {
    try{
        const discussions = await User.findOne({_id: req.user}).populate('discussions').select({discussions: 1, _id: 0});
        res.status(200).json(discussions['discussions']);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

// add a comment to a discussion : POST
const addComment = async (req,res) => {
    const { discussionId, content } = req.body;
    console.log("discussionId", discussionId, "content", content, "userId", req.user);
    try{
        const newComment = await new Comment({content, userId: req.user}).save();
        const commentId = newComment._id;
        const discussion = await Discussion.findById(discussionId);
        discussion.comments.push(commentId);
        await discussion.save();
        res.status(200).json(discussion);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

module.exports = { newDiscussion, getAllDiscussion, getDiscussion, deleteDiscussion, upvoteDiscussion, downvoteDiscussion, getMyDiscussions, addComment };
