const mongoose = require('mongoose');
const Tag = require('../models/Tag');
const Community = require('../models/Community');

// Get all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().select('_id title').sort({ title: 1 });
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Server error occurred while fetching tags" });
  }
};

// Create new tag
exports.createTag = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: "Tag title is required" });
    }
    
    // Normalize the title (lowercase, trim)
    const normalizedTitle = title.trim().toLowerCase();
    
    // Check if tag already exists (case-insensitive)
    const existingTag = await Tag.findOne({ 
      title: { $regex: new RegExp(`^${normalizedTitle}$`, 'i') } 
    });
    
    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }
    
    // Create with original casing but trimmed
    const newTag = new Tag({ title: title.trim() });
    const savedTag = await newTag.save();
    
    res.status(201).json(savedTag);
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: "Server error occurred while creating tag" });
  }
};

// Add tags to a community
exports.addTagsToCommunity = async (req, res) => {
  try {
    const { communityId, tagIds } = req.body;
    
    // Validate community ID format
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ message: "Invalid community ID format" });
    }
    
    // Check if community exists
    const communityExists = await Community.findById(communityId);
    if (!communityExists) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Validate tag IDs and filter out invalid ones
    const validTagIds = tagIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validTagIds.length === 0) {
      return res.status(400).json({ message: "No valid tag IDs provided" });
    }
    
    // Verify tags exist
    const existingTags = await Tag.countDocuments({ _id: { $in: validTagIds } });
    if (existingTags !== validTagIds.length) {
      return res.status(400).json({ message: "Some tags don't exist" });
    }
    
    // Update community with tags
    const updatedCommunity = await Community.findByIdAndUpdate(
      communityId,
      { $addToSet: { tags: { $each: validTagIds } } },
      { new: true }
    ).populate('tags');
    
    // Update each tag with the community
    await Tag.updateMany(
      { _id: { $in: validTagIds } },
      { $addToSet: { communities: communityId } }
    );
    
    res.status(200).json(updatedCommunity);
  } catch (error) {
    console.error("Error adding tags to community:", error);
    res.status(500).json({ message: "Server error occurred while adding tags" });
  }
};