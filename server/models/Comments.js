const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    timeOfPost: {
        type: Date,
        default: Date.now,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Comments = mongoose.model('Comments', CommentsSchema);

module.exports = Comments;
