const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    messageId: {
        type: Number,
        required: true,
        unique: true,
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    timeOfMessage: {
        type: Date,
        default: Date.now,
        required: true,
    },
    messageContent: {
        type: String,
        required: true,
    },
});

const Chats = mongoose.model('Chats', chatSchema);

module.exports = Chats;