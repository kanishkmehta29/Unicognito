const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const Post = require('../models/Posts');
const Community = require('../models/Community');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { uploadMultipleFiles } = require('../utils/fileUpload');

// add a new Post : POST
const newPost = async (req, res) => {
  try {
    // Check if the user data is properly formatted
    let creatorId = req.user;
    
    // Handle the case where creator might be passed as a string object
    if (req.body.creator && typeof req.body.creator === 'string') {
      try {
        // Check if creator is a JSON string
        const creatorObj = JSON.parse(req.body.creator);
        if (creatorObj && creatorObj.id) {
          creatorId = creatorObj.id; // Extract just the ID
        }
      } catch (e) {
        // If parsing fails, assume it's already an ID string
        console.log("Creator parsing error:", e);
        creatorId = req.body.creator;
      }
    }
    
    // Create a sanitized post object
    const postData = {
      ...req.body,
      creator: creatorId // Use the extracted ID
    };
    
    const newPost = await new Post(postData).save();
    
    // Handle file uploads using our utility
    if (req.files && req.files.length > 0) {
      // The second parameter 'posts' defines the folder name for organization
      const mediaUrls = await uploadMultipleFiles(req.files, 'posts');
      
      // Save the media URLs to the post
      newPost.mediaArray = mediaUrls;
      await newPost.save();
      console.log("Successfully uploaded media");
    }
    
    const user = await User.findById(creatorId);
    if (user) {
      // Add post reference to user's posts array
      user.posts.push(newPost._id);
      await user.save();
    }
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: error.message });
  }
};

// get All Post: GET
const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
    .populate({
      path: 'comments',
      populate: {
        path: 'userId',
        model: 'User'
      }
    }).populate('creator');
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// get post using id: GET
const getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate("comments");
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// get my posts: GET
const getMyPosts = async (req, res) => {
  try {
    const posts = await User.findOne({ _id: req.user })
      .populate("posts")
      .select({ posts: 1, _id: 0 });
    res.status(200).json(posts["posts"]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// get My connections post: GET
const getMyConnectionPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const connections = user.connections;
    console.log(connections);
    const posts = await Post.find({ creator: { $in: connections } }).populate({
      path: 'comments',
      populate: {
        path: 'userId',
        model: 'User'
      }
    }).populate('creator');;
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// add to my fav post : POST
const addMyFavPosts = async (req, res) => {
  const { postId } = req.body;
  try {
    const post = await Post.findById(postId);
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.favPosts.includes(postId)) {
      user.favPosts.pull(postId);
    } else {
      user.favPosts.push(postId);
    }
    await user.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// Get my fav posts: GET
const getMyFavPosts = async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user);
    console.log(user);
    const favPosts = user.favPosts;
    console.log(favPosts);
    const posts = await Post.find({ _id: { $in: favPosts } }).populate({
      path: 'comments',
      populate: {
        path: 'userId',
        model: 'User'
      }
    }).populate('creator');;
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// In the updatePost method:
const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user;
    const { content } = req.body;
    
    // Find the post
    const post = await Post.findById(postId);
    
    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is authorized to edit this post
    if (post.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }
    
    // Update post content
    if (content) {
      post.caption = content.trim();
    }
    
    // Handle media updates if any - USE CENTRALIZED UTILITY
    if (req.files && req.files.length > 0) {
      const mediaUrls = await uploadMultipleFiles(req.files, 'posts');
      post.mediaArray = [...post.mediaArray, ...mediaUrls];
    }
    
    await post.save();
    
    // Rest of your code...
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error occurred' });
  }
};

// Delete a post
// In postController.js - add or fix this function
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user;
    
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    
    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user is authorized to delete
    if (post.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }
    
    // Delete any media files
    if (post.mediaArray && post.mediaArray.length > 0) {
      post.mediaArray.forEach(media => {
        try {
          const filePath = path.join(__dirname, '..', 'public', media);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
    
    // Delete post from database
    await Post.findByIdAndDelete(postId);
    
    // If this is a community post, update the community
    if (post.community) {
      await Community.updateOne(
        { _id: post.community },
        { $pull: { posts: postId } }
      );
    }
    
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Server error occurred" });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user;
    
    // Find the post
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user has already liked the post - Convert all IDs to strings for proper comparison
    const userIdStr = userId.toString();
    const alreadyLiked = post.likes.some(like => like.toString() === userIdStr);
    
    // Use atomic MongoDB operations instead of array manipulation
    if (alreadyLiked) {
      // Unlike the post
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId }
      });
    } else {
      // Like the post and remove from dislikes if present
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId }
      });
    }
    
    // Get updated post to return accurate counts
    const updatedPost = await Post.findById(postId);
    
    // Check if user is in the likes array after update
    const isNowLiked = updatedPost.likes.some(like => like.toString() === userIdStr);
    
    res.status(200).json({
      message: alreadyLiked ? 'Post unliked successfully' : 'Post liked successfully',
      likes: updatedPost.likes.length, // This is correct - sending the count
      liked: isNowLiked
    });
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    res.status(500).json({ message: 'Server error occurred' });
  }
};

// Unlike a post (for compatibility, redirects to the like endpoint)
const unlikePost = async (req, res) => {
  try {
    // Simply redirect to likePost which handles both liking and unliking
    return this.likePost(req, res);
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Server error occurred' });
  }
};

// Add a comment to a post
// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user;
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    // Find the post
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Create a new Comment document (import this at the top of your file)
    const Comment = require('../models/Comments');
    const newComment = new Comment({
      content: text.trim(),  // Using 'content' field from Comments model
      userId: userId,        // Using 'userId' field from Comments model
      timeOfPost: new Date() // Using 'timeOfPost' field from Comments model
    });
    
    // Save the comment
    const savedComment = await newComment.save();
    
    // Initialize comments array if it doesn't exist
    if (!post.comments) {
      post.comments = [];
    }
    
    // Add comment reference to post
    post.comments.push(savedComment._id);
    await post.save();
    
    // Get user info to return with response
    const user = await User.findById(userId).select('name email profilePic');
    
    // Return populated comment
    const commentWithUser = {
      _id: savedComment._id,
      content: savedComment.content,
      userId: user,
      timeOfPost: savedComment.timeOfPost
    };
    
    return res.status(201).json({
      message: 'Comment added successfully',
      comment: commentWithUser
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Server error occurred' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Find comment by ID
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check authorization
    if (comment.creator.toString() !== userId.toString() && 
        post.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Remove comment
    comment.remove();
    await post.save();
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  newPost,
  getAllPost,
  updatePost,
  getPost,
  deletePost, // Make sure this is included
  likePost,
  unlikePost,
  getMyPosts,
  addComment,
  getMyConnectionPosts,
  getMyFavPosts,
  addMyFavPosts,
  deleteComment
}