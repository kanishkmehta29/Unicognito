const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required and must be provided'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    description: {
        type: String,
        default: " "
    },
    profilePic: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        default: 0
    },
    discussions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion'
    }],
    courses: [{
        course:{
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Course'
            },
        isSelected: {
            type: Boolean,
            default: false
    }}],
    projects: [{
        project:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
            },
        isSelected: {
            type: Boolean,
            default: false
    }}],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    favPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    views: {
        type: Number,
        default: 0,
    },
    portfolio: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
});

// Add pre-save middleware to log what's happening
userSchema.pre('save', function(next) {
    console.log('Saving user with data:', {
        name: this.name,
        email: this.email,
        hasPassword: !!this.password
    });
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
