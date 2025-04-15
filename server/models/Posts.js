const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timeOfCreation: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  caption: {
    type: String,
    required: true,
  },
  mediaArray: [
    {
      type: String,
      default: [],
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
