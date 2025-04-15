const express = require('express');
const router = express.Router();
const Comment = require('../models/Comments');

// like a comment : PUT
const likeComment = async (req, res) => {
    const commentId = req.params.commentId;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        const userId = req.user.toString();
        const userLiked = comment.likes.some(id => id.toString() === userId);
        const userDisliked = comment.dislikes.some(id => id.toString() === userId);
        
        // Use MongoDB's atomic operations for reliable updates
        if (userLiked) {
            // User already liked, so remove the like
            await Comment.findByIdAndUpdate(commentId, {
                $pull: { likes: req.user }
            });
        } else {
            // Add like and remove from dislikes if necessary
            const update = { $addToSet: { likes: req.user } };
            if (userDisliked) {
                update.$pull = { dislikes: req.user };
            }
            await Comment.findByIdAndUpdate(commentId, update);
        }
        
        // Get the updated comment
        const updatedComment = await Comment.findById(commentId);
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ message: error.message });
    }
}

// dislike a comment : PUT
const dislikeComment = async (req, res) => {
    const commentId = req.params.commentId;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        const userId = req.user.toString();
        const userLiked = comment.likes.some(id => id.toString() === userId);
        const userDisliked = comment.dislikes.some(id => id.toString() === userId);
        
        if (userDisliked) {
            // User already disliked, so remove the dislike
            await Comment.findByIdAndUpdate(commentId, {
                $pull: { dislikes: req.user }
            });
        } else {
            // Add dislike and remove from likes if necessary
            const update = { $addToSet: { dislikes: req.user } };
            if (userLiked) {
                update.$pull = { likes: req.user };
            }
            await Comment.findByIdAndUpdate(commentId, update);
        }
        
        // Get the updated comment
        const updatedComment = await Comment.findById(commentId);
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error disliking comment:', error);
        res.status(500).json({ message: error.message });
    }
}

const getComment = async (req,res) => {
    const commentId = req.params.commentId;
    try{
        const comment = await Comment.findById(commentId);
        res.status(200).json(comment);
    }
    catch(error){
        res.status(404).json({message: error.message});
    }
}

module.exports = { likeComment, dislikeComment, getComment };