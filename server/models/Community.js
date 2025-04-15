const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  userAdmins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  coverImage: {
    type: String,
  },
  icon: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  chatsChannel: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chats',
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
}, {
  timestamps: true
});

const Community = mongoose.model("community", communitySchema);

module.exports = Community;