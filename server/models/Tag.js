const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  communities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);