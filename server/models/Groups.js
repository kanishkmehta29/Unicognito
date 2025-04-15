const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    name: {
        type: String,
        default: 'Group'
    }
});

const Groups = mongoose.model('Groups', groupSchema);

module.exports = Groups;