const Community = require('../models/Community');
const User = require('../models/User');
const Tag = require('../models/Tag'); // Add this import
const mongoose = require('mongoose'); // Add this import
const fs = require('fs');
const path = require('path');
const Post = require('../models/Posts');
const { uploadFile, uploadMultipleFiles } = require('../utils/fileUpload');

// Create a new community
// In your server/controllers/communityController.js file

const createCommunity = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    const userId = req.user;
    
    // Handle cover image upload
    let coverImageUrl = '';
    if (req.file) {
      coverImageUrl = await uploadFile(req.file, 'communities');
    }
    
    // Create new community
    const newCommunity = new Community({
      title: name,
      description: description,
      userAdmins: [userId],
      members: [userId],
      coverImage: coverImageUrl,
      isPrivate: isPrivate === 'true',
      chatsChannel: [],
      posts: []
    });

    // Save the community to the database
    const savedCommunity = await newCommunity.save();
    
    // Process tags if they exist
    if (req.body.tags) {
      let tagIds = [];
      
      // Handle tags whether they come as array or single value
      if (Array.isArray(req.body.tags)) {
        tagIds = req.body.tags;
      } else if (typeof req.body.tags === 'string') {
        tagIds = [req.body.tags];
      }
      
      // Filter out invalid ObjectIds
      const validTagIds = tagIds.filter(id => mongoose.Types.ObjectId.isValid(id));
      
      if (validTagIds.length > 0) {
        // Update community with tags
        await Community.findByIdAndUpdate(
          savedCommunity._id,
          { $addToSet: { tags: { $each: validTagIds } } }
        );
        
        // Update tags with this community reference
        await Tag.updateMany(
          { _id: { $in: validTagIds } },
          { $addToSet: { communities: savedCommunity._id } }
        );
      }
    }

    // Return the community with populated fields
    const populatedCommunity = await Community.findById(savedCommunity._id)
      .populate('userAdmins', 'name profilePic')
      .populate('tags', 'title');
      
    res.status(201).json(populatedCommunity);
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ message: "Server error occurred" });
  }
};

// Get all communities
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('userAdmins', 'name profilePic')
      .sort({ createdAt: -1 });
    
    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ message: "Server error occurred while fetching communities" });
  }
};

// Get a single community by ID
const getCommunityById = async (req, res) => {
  try {
    const communityId = req.params.id;
    
    const community = await Community.findById(communityId)
      .populate('userAdmins', 'name profilePic')
      .populate({
        path: 'posts',
        populate: {
          path: 'creator',
          select: 'name profilePic'
        }
      });
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    res.status(200).json(community);
  } catch (error) {
    console.error("Error fetching community:", error);
    res.status(500).json({ message: "Server error occurred while fetching the community" });
  }
};

// Add this controller function
const getCommunityPosts = async (req, res) => {
  try {
    const communityId = req.params.id;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ message: 'Invalid community ID format' });
    }
    
    // Find the community first to confirm it exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Get posts from the posts array in the community
    const posts = await Post.find({ _id: { $in: community.posts } })
      .populate('creator', 'name email profilePic') // Use creator instead of author
      .populate('likes', 'name profilePic')
      .populate('comments.creator', 'name profilePic') // Adjust if your schema differs
      .sort({ createdAt: -1 }); // Sort by newest first
    
    // Transform to match frontend expectations
    const transformedPosts = posts.map(post => ({
      _id: post._id,
      content: post.caption, // Map caption to content for frontend
      author: post.creator, // Map creator to author for frontend
      createdAt: post.createdAt,
      likes: post.likes || [],
      comments: post.comments || [],
      community: communityId,
      mediaArray: post.mediaArray || [] // Include media if available
    }));
    
    console.log(`Found ${posts.length} posts for community ${communityId}`);
    res.status(200).json(transformedPosts);
  } catch (error) {
    console.error("Error fetching community posts:", error);
    res.status(500).json({ message: 'Server error occurred while fetching posts' });
  }
};

// Update the createCommunityPost function
const createCommunityPost = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.user; // Use consistent user ID format
    const { content } = req.body; // Frontend uses content instead of caption
    
    console.log(`Creating post in community ${communityId} by user ${userId}`);
    
    // Validate content
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ message: "Post content is required" });
    }
    
    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Check if user is a member
    const isMember = community.members.some(member => 
      member.toString() === userId.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ message: "You must be a member to post in this community" });
    }
    
    // Process uploaded files
    let mediaUrls = [];
    if (req.files && req.files.length > 0) {
      mediaUrls = await uploadMultipleFiles(req.files, 'community-posts');
    }
    
    // Create new post
    const newPost = new Post({
      creator: userId,
      caption: content.trim(),
      mediaArray: mediaUrls,
      likes: [],
      dislikes: [],
      comments: [],
      community: communityId
    });
    
    // Save the post
    const savedPost = await newPost.save();
    
    // Add post reference to community
    community.posts.push(savedPost._id);
    await community.save();
    
    // Return populated post with fields transformed to match frontend expectations
    const populatedPost = await Post.findById(savedPost._id)
      .populate('creator', 'name email profilePic');
    
    // Transform for frontend
    const transformedPost = {
      _id: populatedPost._id,
      content: populatedPost.caption,
      author: populatedPost.creator,
      createdAt: populatedPost.createdAt,
      likes: populatedPost.likes || [],
      comments: populatedPost.comments || [],
      community: communityId,
      mediaArray: populatedPost.mediaArray || []
    };
      
    console.log("Post created successfully:", populatedPost._id);
    return res.status(201).json(transformedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Server error occurred" });
  }
};

// Server-side join endpoint (example)
const joinCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.user;
    
    console.log("Joining community:", communityId, "User:", userId);
    
    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    
    // Debugging logs
    console.log("User ID type:", typeof userId);
    console.log("User ID value:", userId);
    
    // Convert all member IDs to strings for reliable comparison
    const memberIdsAsStrings = community.members.map(memberId => 
      memberId.toString()
    );
    
    console.log("Member IDs as strings:", memberIdsAsStrings);
    console.log("User ID as string:", userId.toString());
    
    // Check if user is already a member using array includes with string comparison
    const isMember = memberIdsAsStrings.includes(userId.toString());
    console.log("Is member result:", isMember);
    
    if (isMember) {
      return res.status(400).json({ message: "You are already a member of this community" });
    }
    
    // Add the user ID to the community members
    community.members.push(userId);
    
    try {
      await community.save();
      console.log("Successfully joined community");
      return res.status(200).json({ 
        message: "Successfully joined community",
        community: {
          _id: community._id,
          title: community.title,
          membersCount: community.members.length
        }
      });
    } catch (saveError) {
      console.error("Error saving community after joining:", saveError);
      return res.status(500).json({ message: "Error saving membership changes" });
    }
  } catch (error) {
    console.error("Server error in join community:", error);
    return res.status(500).json({ message: "Server error occurred" });
  }
};

// Add a leave community function
const leaveCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.user;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ message: 'Invalid community ID format' });
    }
    
    // Find the community
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if user is a member
    if (!community.members.includes(userId)) {
      return res.status(400).json({ message: 'You are not a member of this community' });
    }
    
    // Check if user is the only admin
    if (community.userAdmins.length === 1 && community.userAdmins.includes(userId)) {
      return res.status(400).json({ message: 'You are the only admin. Transfer ownership before leaving.' });
    }
    
    // Remove user from members
    community.members = community.members.filter(member => member.toString() !== userId);
    
    // If user is an admin, remove from userAdmins too
    if (community.userAdmins.includes(userId)) {
      community.userAdmins = community.userAdmins.filter(admin => admin.toString() !== userId);
    }
    
    await community.save();
    
    res.status(200).json({ message: 'Successfully left community' });
  } catch (error) {
    console.error("Error leaving community:", error);
    res.status(500).json({ message: 'Server error occurred while leaving community' });
  }
};

// Add a community admin
const addCommunityAdmin = async (req, res) => {
  try {
    const communityId = req.params.id;
    const { userId } = req.body; // ID of user to make admin
    const requestingUserId = req.user;
    
    // Validate the community ID
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ message: 'Invalid community ID format' });
    }
    
    // Find the community
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if requesting user is an admin
    const isAdmin = community.userAdmins.some(admin => 
      admin.toString() === requestingUserId.toString()
    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can add other admins' });
    }
    
    // Check if target user is a member
    const isMember = community.members.some(member => 
      member.toString() === userId.toString()
    );
    
    if (!isMember) {
      return res.status(400).json({ message: 'User must be a member before becoming an admin' });
    }
    
    // Check if user is already an admin
    const isAlreadyAdmin = community.userAdmins.some(admin => 
      admin.toString() === userId.toString()
    );
    
    if (isAlreadyAdmin) {
      return res.status(400).json({ message: 'User is already an admin' });
    }
    
    // Add user as admin
    community.userAdmins.push(userId);
    await community.save();
    
    res.status(200).json({ 
      message: 'User successfully added as admin',
      community: {
        _id: community._id,
        title: community.title,
        adminsCount: community.userAdmins.length
      }
    });
  } catch (error) {
    console.error("Error adding community admin:", error);
    res.status(500).json({ message: 'Server error occurred while adding admin' });
  }
};

// Remove a community admin
const removeCommunityAdmin = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userIdToRemove = req.params.userId;
    const requestingUserId = req.user;
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(communityId) || !mongoose.Types.ObjectId.isValid(userIdToRemove)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    // Find the community
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if requesting user is an admin
    const isAdmin = community.userAdmins.some(admin => 
      admin.toString() === requestingUserId.toString()
    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can remove admins' });
    }
    
    // Check if target user is actually an admin
    const targetIsAdmin = community.userAdmins.some(admin => 
      admin.toString() === userIdToRemove.toString()
    );
    
    if (!targetIsAdmin) {
      return res.status(400).json({ message: 'User is not an admin of this community' });
    }
    
    // Prevent removing the last admin
    if (community.userAdmins.length <= 1) {
      return res.status(400).json({ message: 'Cannot remove the only admin of the community' });
    }
    
    // Remove user from admin list
    community.userAdmins = community.userAdmins.filter(admin => 
      admin.toString() !== userIdToRemove.toString()
    );
    
    await community.save();
    
    res.status(200).json({ 
      message: 'Admin successfully removed',
      community: {
        _id: community._id,
        title: community.title,
        adminsCount: community.userAdmins.length
      }
    });
  } catch (error) {
    console.error("Error removing community admin:", error);
    res.status(500).json({ message: 'Server error occurred while removing admin' });
  }
};

// Remove a community member
const removeCommunityMember = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userIdToRemove = req.params.userId;
    const requestingUserId = req.user;
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(communityId) || !mongoose.Types.ObjectId.isValid(userIdToRemove)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    // Find the community
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if requesting user is an admin
    const isAdmin = community.userAdmins.some(admin => 
      admin.toString() === requestingUserId.toString()
    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can remove members' });
    }
    
    // Check if target user is a member
    const isMember = community.members.some(member => 
      member.toString() === userIdToRemove.toString()
    );
    
    if (!isMember) {
      return res.status(400).json({ message: 'User is not a member of this community' });
    }
    
    // Check if target user is an admin
    const isTargetAdmin = community.userAdmins.some(admin => 
      admin.toString() === userIdToRemove.toString()
    );
    
    if (isTargetAdmin) {
      // If the target is an admin and there's only one admin, don't allow removal
      if (community.userAdmins.length <= 1) {
        return res.status(400).json({ message: 'Cannot remove the only admin of the community' });
      }
      
      // Remove from admin list too
      community.userAdmins = community.userAdmins.filter(admin => 
        admin.toString() !== userIdToRemove.toString()
      );
    }
    
    // Remove from members list
    community.members = community.members.filter(member => 
      member.toString() !== userIdToRemove.toString()
    );
    
    await community.save();
    
    res.status(200).json({ 
      message: 'Member successfully removed',
      community: {
        _id: community._id,
        title: community.title,
        membersCount: community.members.length
      }
    });
  } catch (error) {
    console.error("Error removing community member:", error);
    res.status(500).json({ message: 'Server error occurred while removing member' });
  }
};

// Search for communities
const searchCommunities = async (req, res) => {
  try {
    const { q, tag } = req.query;
    let query = {};
    
    // Search by title or description
    if (q) {
      query = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      };
    }
    
    // Filter by tag if provided
    if (tag) {
      query.tags = tag;
    }
    
    const communities = await Community.find(query)
      .populate('userAdmins', 'name email profilePic')
      .populate('tags', 'title')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.status(200).json(communities);
  } catch (error) {
    console.error("Error searching communities:", error);
    res.status(500).json({ message: 'Server error occurred while searching communities' });
  }
};

// Get trending communities
const getTrendingCommunities = async (req, res) => {
  try {
    // Define "trending" as having the most members or most recent activity
    const trendingCommunities = await Community.aggregate([
      {
        $addFields: {
          memberCount: { $size: "$members" },
          postCount: { $size: "$posts" }
        }
      },
      {
        $sort: {
          memberCount: -1,
          postCount: -1,
          createdAt: -1
        }
      },
      {
        $limit: 10
      }
    ]);
    
    // Populate needed fields
    const populatedCommunities = await Community.populate(trendingCommunities, [
      { path: 'userAdmins', select: 'name email profilePic' },
      { path: 'tags', select: 'title' }
    ]);
    
    res.status(200).json(populatedCommunities);
  } catch (error) {
    console.error("Error getting trending communities:", error);
    res.status(500).json({ message: 'Server error occurred while fetching trending communities' });
  }
};

// Delete a community
const deleteCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    const requestingUserId = req.user;
    
    // Validate community ID
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ message: 'Invalid community ID format' });
    }
    
    // Find the community
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if requesting user is an admin
    const isAdmin = community.userAdmins.some(admin => 
      admin.toString() === requestingUserId.toString()
    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can delete a community' });
    }
    
    // Delete all posts associated with this community
    if (community.posts && community.posts.length > 0) {
      await Post.deleteMany({ _id: { $in: community.posts } });
    }
    
    // Remove community references from tags
    if (community.tags && community.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: community.tags } },
        { $pull: { communities: communityId } }
      );
    }
    
    // Delete cover image if it exists
    if (community.coverImage) {
      const imagePath = path.join(__dirname, '..', 'public', community.coverImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Finally delete the community
    await Community.findByIdAndDelete(communityId);
    
    res.status(200).json({ message: 'Community successfully deleted' });
  } catch (error) {
    console.error("Error deleting community:", error);
    res.status(500).json({ message: 'Server error occurred while deleting community' });
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  getCommunityPosts,
  createCommunityPost,
  joinCommunity,
  leaveCommunity,
  addCommunityAdmin,
  removeCommunityAdmin,
  removeCommunityMember,
  searchCommunities,
  getTrendingCommunities,
  deleteCommunity
};