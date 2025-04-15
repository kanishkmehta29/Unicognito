const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    creatorId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
    }],
    rating: {
        type: Number,
        required: true,
        default : 0,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    description: {
        type: String,
        required: true,
    },
    commentsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments',
    
    }],
    githubLink: {
        type: String,
        required: true,
    },
    timeOfPost: {
        type: Date,
        default: Date.now,
        required: true,
    },
    mediaArray: [{
        type: String,
        default: [],
    }],
    views: {
        type: Number,
        default: 0,
    },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;