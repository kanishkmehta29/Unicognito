const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const Course = require('../models/Courses');
const User = require('../models/User');
const Comment = require('../models/Comments');
const Skill = require('../models/Skills');
const { uploadMultipleFiles } = require('../utils/fileUpload'); // Added proper import

//get all course reviews: GET
const getCourseReviews = async (req, res) => {
    try{
        const courseReviews = await Course.find();
        res.status(200).json(courseReviews);
    } catch(err){
        res.status(404).json({message: err.message});
    }
}

//get a course review: GET
const getCourseReview = async (req, res) => {
    const { courseid } = req.params;
    console.log(courseid);
    try{
        const courseReview = await Course.findById(courseid)
            .populate('commentsId')
            .populate({
                path: 'commentsId',
                populate: {
                    path: 'userId',
                    model: 'User'
                }
            });
        res.status(200).json(courseReview);
    } catch(err){
        res.status(404).json({message: err.message});
    }
}

//add a course review:  POST
const postCourseReview = async (req, res) => {
    try {
        console.log("Received course review data:", req.body);
        console.log("File data:", req.file);
        
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
        
        // Handle the case where userId might be provided directly
        if (req.body.userId && typeof req.body.userId === 'string') {
            try {
                // Check if userId is a JSON string
                const userObj = JSON.parse(req.body.userId);
                if (userObj && userObj.id) {
                    creatorId = userObj.id; // Extract just the ID
                }
            } catch (e) {
                // If parsing fails, assume it's already an ID string
                console.log("User ID parsing error:", e);
                if (req.body.userId) {
                    creatorId = req.body.userId;
                }
            }
        }
        
        // Create a sanitized review object
        const reviewData = {
            ...req.body,
            creator: creatorId, // Use the extracted ID
            timeOfPost: new Date() // Add current timestamp
        };
        
        const newReview = await new Course(reviewData).save();
        
        // Handle course thumbnail upload
        if (req.file) {
            // Use the imported uploadMultipleFiles utility with a single file
            const mediaUrls = await uploadMultipleFiles([req.file], 'courses');
            if (mediaUrls && mediaUrls.length > 0) {
                newReview.coursePic = mediaUrls[0]; // Use the first URL
                await newReview.save();
            }
        }
        
        const user = await User.findById(creatorId);
        if (user) {
            user.courses.push(newReview._id);
            await user.save();
        }
        
        res.status(201).json(newReview);
    } catch (err) {
        console.error("Error creating course review:", err);
        res.status(409).json({ message: err.message });
    }
}

//delete course review: DELETE
const deleteCourseReview = async (req, res) => {
    const { courseReviewId } = req.params;
    try {
        const courseReview = await Course.findById(courseReviewId);
        await User.findById(req.user).then((user) => {
            if (courseReview.creator.toHexString() !== user._id.toHexString()) {
                res.status(401).json({ message: "Unauthorized" });
            }
            user.courses.pull(courseReviewId);
            user.save();
        });
        await Course.findByIdAndDelete(courseReviewId);
        res.status(200).json(courseReview);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//get my course reviews:GET
//TODO populate courses
const getMyReviews = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        const courses = user.courses;
        console.log(courses);
        const coursearray = await Course.find({ _id: { $in: user.courses } });
        res.status(200).json({ coursearray, courses });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

//comment:PUT
const addComment = async (req, res) => {
    console.log(req.body)
    const { courseId, content } = req.body;
    try{
        // Check if the user data is properly formatted
        let userId = req.user;
        
        // Handle the case where userId might be passed as a string object
        if (req.body.userId && typeof req.body.userId === 'string') {
            try {
                // Check if userId is a JSON string
                const userObj = JSON.parse(req.body.userId);
                if (userObj && userObj.id) {
                    userId = userObj.id; // Extract just the ID
                }
            } catch (e) {
                // If parsing fails, assume it's already an ID string
                console.log("User ID parsing error:", e);
                userId = req.body.userId;
            }
        }
        
        const newComment = await new Comment({content, userId}).save();
        const commentId = newComment._id;
        const review = await Course.findById(courseId);
        review.commentsId.push(commentId);
        await review.save();
        res.status(200).json(review);
    } catch(err){
        console.error("Error adding comment to course review:", err);
        res.status(404).json({message: err.message});
    }
}

const toggleEnroll = async (req, res) => {
    const { courseId } = req.body;
    try{
        // Check if the user data is properly formatted
        let userId = req.user;
        
        // Handle the case where userId might be passed as a string object
        if (req.body.userId && typeof req.body.userId === 'string') {
            try {
                // Check if userId is a JSON string
                const userObj = JSON.parse(req.body.userId);
                if (userObj && userObj.id) {
                    userId = userObj.id; // Extract just the ID
                }
            } catch (e) {
                // If parsing fails, assume it's already an ID string
                console.log("User ID parsing error:", e);
                userId = req.body.userId;
            }
        }
        
        const course = await Course.findById(courseId);
        if(course.enrolledStudents.includes(userId)){
            course.enrolledStudents = course.enrolledStudents.filter(student => student != userId);
            await course.save();
            const user = await User.findById(userId);
            user.courses = user.courses.filter(course => course != courseId);
            await user.save();
            res.status(200).json(course);
        } else {
            course.enrolledStudents.push(userId);
            await course.save();
            const user = await User.findById(userId);
            user.courses.push(courseId);
            await user.save();
            res.status(200).json(course);
        }
    } catch(err){
        console.error("Error toggling course enrollment:", err);
        res.status(404).json({message: err.message});
    }
}

module.exports = {getCourseReview, getCourseReviews, getMyReviews, postCourseReview, addComment, deleteCourseReview, toggleEnroll};