import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import Topbar from "../components/Navbar/Topbar";
import Footer from "../components/Footer/Footer";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const CommunityView = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [coverImageError, setCoverImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState({
    id: "newest",
    title: "Newest",
  });
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [postMedia, setPostMedia] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { currentUser } = useContext(AuthContext);

  const filterRef = useRef(null);
  const postFormRef = useRef(null);

  const sortOptions = [
    { id: "newest", title: "Newest" },
    { id: "oldest", title: "Oldest" },
    { id: "mostLiked", title: "Most Liked" },
    { id: "mostComments", title: "Most Comments" },
  ];

  const getUserId = () => {
    if (currentUser) {
      return currentUser.id;
    }

    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser).id;
      }
    } catch (error) {
      console.error("Error parsing user from sessionStorage:", error);
    }
    return null;
  };

  const getToken = () => {
    if (currentUser) {
      return currentUser.token;
    }

    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser).token;
      }
    } catch (error) {
      console.error("Error parsing token from sessionStorage:", error);
    }
    return null;
  };

  useEffect(() => {
    // Redirect if not logged in
    const userId = getUserId();
    const token = getToken();

    if (!userId || !token) {
      navigate("/login", { state: { from: `/community/${id}` } });
      return;
    }

    const fetchCommunityAndPosts = async () => {
      try {
        const config = {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        const communityResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/communities/${id}`,
          config
        );
        setCommunity(communityResponse.data);

        const postsResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/communities/${id}/posts`,
          config
        );
        setPosts(postsResponse.data);
        setFilteredPosts(postsResponse.data);

        // Check if user is a member
        if (communityResponse.data.members) {
          setIsMember(
            communityResponse.data.members.some((member) =>
              typeof member === "object"
                ? member._id === userId
                : member === userId
            )
          );
        }

        // Check if user is an admin
        if (communityResponse.data.userAdmins) {
          setIsAdmin(
            communityResponse.data.userAdmins.some((admin) =>
              typeof admin === "object"
                ? admin._id === userId
                : admin === userId
            )
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching community data:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          sessionStorage.removeItem("token");
          navigate("/login", { state: { from: `/community/${id}` } });
        }
        setLoading(false);
      }
    };

    fetchCommunityAndPosts();
  }, [id, navigate]);

  // Sort posts based on selected option
  useEffect(() => {
    let sortedPosts = [...posts];

    if (selectedSortOption.id === "newest") {
      sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (selectedSortOption.id === "oldest") {
      sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (selectedSortOption.id === "mostLiked") {
      sortedPosts.sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
    } else if (selectedSortOption.id === "mostComments") {
      sortedPosts.sort(
        (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
      );
    }

    setFilteredPosts(sortedPosts);
  }, [selectedSortOption, posts]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close filter dropdown
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }

      // Close post form if clicking outside
      if (
        isPostFormOpen &&
        postFormRef.current &&
        !postFormRef.current.contains(event.target) &&
        !event.target.closest(".create-post-button")
      ) {
        setIsPostFormOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isPostFormOpen]);

  const handleJoinCommunity = async () => {
    try {
      const token = getToken();
      const userId = getUserId();

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/communities/${id}/join`,
        {},
        config
      );

      setIsMember(true);
      setCommunity((prev) => ({
        ...prev,
        members: [...(prev.members || []), userId],
      }));

      // Show success message
      alert("You've successfully joined the community!");
    } catch (error) {
      console.error("Error joining community:", error);
      // Only remove token for auth errors (401/403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        sessionStorage.removeItem("token");
        navigate("/login", { state: { from: `/community/${id}` } });
      } else {
        // For other errors, just show the message but don't remove the token
        const errorMessage =
          error.response?.data?.message ||
          "Failed to join community. Please try again.";
        alert(errorMessage);
      }
    }
  };

  const handleLeaveCommunity = async () => {
    if (!window.confirm("Are you sure you want to leave this community?")) {
      return;
    }

    try {
      const token = getToken();
      const userId = getUserId();

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/communities/${id}/leave`,
        {},
        config
      );

      setIsMember(false);
      setCommunity((prev) => ({
        ...prev,
        members: prev.members.filter((member) =>
          typeof member === "object" ? member._id !== userId : member !== userId
        ),
      }));
    } catch (error) {
      console.error("Error leaving community:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        sessionStorage.removeItem("token");
        navigate("/login", { state: { from: `/community/${id}` } });
      } else {
        alert("Failed to leave community. Please try again.");
      }
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = getToken();

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${selectedPost._id}/comment`,
        { text: newComment },
        config
      );

      // Update the selected post with the new comment
      setSelectedPost({
        ...selectedPost,
        comments: [...(selectedPost.comments || []), response.data.comment],
      });

      // Also update in the posts and filteredPosts arrays
      const updatedPosts = posts.map((post) => {
        if (post._id === selectedPost._id) {
          return {
            ...post,
            comments: [...(post.comments || []), response.data.comment],
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);

      // Clear the input
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        sessionStorage.removeItem("token");
        navigate("/login");
      }
      alert("Failed to post comment. Please try again.");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const token = getToken();

      // Create FormData object to handle file uploads
      const formData = new FormData();
      formData.append("content", newPost); // Use 'content' to match backend expectations

      // Add media files if any
      postMedia.forEach((file) => {
        formData.append("media", file);
      });

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/communities/${id}/posts`,
        formData,
        config
      );

      console.log("New post created:", response.data);

      // Add new post to the top of the list
      setPosts([response.data, ...posts]);
      setFilteredPosts((prevFiltered) => {
        // Apply current sort option to the updated posts
        return [response.data, ...prevFiltered];
      });

      setNewPost("");
      setPostMedia([]);
      setPreviewUrls([]);
      setIsPostFormOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
      alert(
        "Failed to create post: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  // Add this function to handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 files
    if (postMedia.length + files.length > 5) {
      alert("You can only upload up to 5 files");
      return;
    }

    setPostMedia((prev) => [...prev, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // Add this function to remove a selected file
  const removeFile = (index) => {
    setPostMedia(postMedia.filter((_, i) => i !== index));

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleLikePost = async (postId) => {
    try {
      const token = getToken();
      const userId = getUserId();

      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/like`,
        {},
        config
      );

      // Update local state to reflect the like
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          // If user has already liked, remove their like; otherwise add it
          const userLiked = post.likes?.includes(userId);
          return {
            ...post,
            likes: userLiked
              ? post.likes.filter((id) => id !== userId)
              : [...(post.likes || []), userId],
          };
        }
        return post; // This return was missing!
      });

      setPosts(updatedPosts);
      // Also update filtered posts
      setFilteredPosts(
        updatedPosts.filter((post) => {
          // Apply current filtering logic
          if (selectedSortOption.id === "newest") {
            return true; // We'll sort later
          }
          // Add other filter conditions as needed
          return true;
        })
      );

      // Re-apply sorting
      if (selectedSortOption.id === "newest") {
        setFilteredPosts((prev) =>
          [...prev].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } else if (selectedSortOption.id === "oldest") {
        setFilteredPosts((prev) =>
          [...prev].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        );
      } else if (selectedSortOption.id === "mostLiked") {
        setFilteredPosts((prev) =>
          [...prev].sort(
            (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
          )
        );
      } else if (selectedSortOption.id === "mostComments") {
        setFilteredPosts((prev) =>
          [...prev].sort(
            (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        sessionStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row bg-[#F8F8F8] min-h-screen">
        <Navbar
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          select={{ communities: true }}
          className="z-[999]"
        />
        <div
          className={`flex-1 ${
            isExpanded ? "md:ml-[240px]" : "md:ml-[80px]"
          } flex justify-center items-center`}
        >
          <p className="text-xl">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex flex-col md:flex-row bg-[#F8F8F8] min-h-screen">
        <Navbar
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          select={{ communities: true }}
          className="z-[999]"
        />
        <div
          className={`flex-1 ${isExpanded ? "md:ml-[240px]" : "md:ml-[80px]"}`}
        >
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold mb-4">
                Community not found
              </h2>
              <button
                onClick={() => navigate("/communities")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Back to Communities
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleShowComments = (post) => {
    setSelectedPost(post);
    setShowComments(true);
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#F8F8F8] min-h-screen pb-[5rem] overflow-x-hidden">
      {/* Navbar - fixed position */}
      <Navbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        select={{ communities: true }}
      />

      {/* Post creation form overlay */}
      {isPostFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div
            ref={postFormRef}
            className="bg-white rounded-xl p-6 w-[90vw] md:w-[600px] max-w-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
            <form onSubmit={handleCreatePost}>
              <div className="mb-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  required
                />
              </div>

              {/* Media upload section */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-4 py-2 rounded-lg flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Photo/Video
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*, video/*"
                    />
                  </label>
                  <span className="text-sm text-gray-500">
                    {postMedia.length}/5 files
                  </span>
                </div>

                {/* Media previews */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        {postMedia[index].type.startsWith("image/") ? (
                          <img
                            src={url}
                            alt="Preview"
                            className="h-24 w-full object-cover rounded"
                          />
                        ) : (
                          <video
                            src={url}
                            className="h-24 w-full object-cover rounded"
                            controls
                          />
                        )}
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                          onClick={() => removeFile(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPostFormOpen(false);
                    setPostMedia([]);
                    setPreviewUrls([]);
                    setNewPost("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!newPost.trim()}
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comments modal - moved outside of post form */}
      {showComments && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-xl p-6 w-[90vw] md:w-[600px] max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Comments</h2>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="font-bold">
                {selectedPost.author?.name || "Unknown"} posted:
              </p>
              <p className="text-gray-700">{selectedPost.content}</p>
            </div>

            <div className="space-y-4 mb-6">
              {selectedPost.comments && selectedPost.comments.length > 0 ? (
                selectedPost.comments.map((comment, index) => (
                  <div key={index} className="border-b pb-3">
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                        {/* Show first letter of name if available */}
                        {comment?.creator?.name ? comment.creator.name.charAt(0) : 
                        typeof comment?.creator === 'object' ? 'U' : 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {/* Show commenter name with robust fallbacks */}
                          {comment?.creator?.name || 
                          (typeof comment?.creator === 'string' ? 
                            'User ' + comment.creator.substring(0, 5) : 'Unknown User')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {comment?.createdAt ? 
                            new Date(comment.createdAt).toLocaleDateString() : 
                            'Recently'}
                        </p>
                      </div>
                    </div>
                    <p className="pl-10">{comment?.text || ''}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No comments yet</p>
              )}
            </div>

            <div className="border-t pt-4">
              <p className="mb-2 font-medium">Add a comment</p>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a comment..."
                rows="2"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content area - Added proper left padding to account for navbar */}
      <div className={`w-full bg-[#F8F8F8] min-h-screen ${isExpanded ? 'md:pl-[25vw]' : 'md:pl-[20vw]'}`}>
        <Topbar title={community.title || community.name} />

        {/* Rest of the community content */}
        <div className="container mx-auto px-4 py-8">
          {/* Community header with image */}
          <div className="relative mb-8 mt-4 mx-auto max-w-full">
            {community?.coverImage && !coverImageError ? (
              <div className="h-48 w-full rounded-lg overflow-hidden shadow-md">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}${community.coverImage}`}
                  alt={community.title || community.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    setCoverImageError(true);
                  }}
                />
                <div className="absolute bottom-4 left-8 text-white">
                  <h1 className="text-3xl font-bold drop-shadow-lg">
                    {community.title || community.name}
                  </h1>
                  <p className="text-lg drop-shadow-md">
                    {community.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md">
                <div className="absolute bottom-4 left-8 text-white">
                  <h1 className="text-3xl font-bold drop-shadow-lg">
                    {community.title || community.name}
                  </h1>
                  <p className="text-lg drop-shadow-md">
                    {community.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Community Info */}
          <div className="mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex flex-wrap justify-between items-center">
                <div className="mb-2 md:mb-0">
                  <p className="text-gray-600">
                    <span className="font-semibold">
                      {community?.members?.length || 0}
                    </span>{" "}
                    members
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Created by:</span>
                  <span className="font-semibold">
                    {community?.userAdmins && community.userAdmins[0]
                      ? community.userAdmins[0].name ||
                        community.userAdmins[0].email ||
                        "Unknown"
                      : "Unknown"}
                  </span>
                </div>
                <div className="w-full md:w-auto mt-2 md:mt-0">
                  {isAdmin ? (
                    <button
                      onClick={() => navigate(`/community/${id}/manage`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full md:w-auto"
                    >
                      Manage Community
                    </button>
                  ) : isMember ? (
                    <button
                      onClick={handleLeaveCommunity}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg w-full md:w-auto"
                    >
                      Leave Community
                    </button>
                  ) : (
                    <button
                      onClick={handleJoinCommunity}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg w-full md:w-auto"
                    >
                      Join Community
                    </button>
                  )}
                </div>
              </div>

              {/* Display tags if any */}
              {community?.tags && community.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {community.tags.map((tag) => (
                    <Chip
                      key={typeof tag === "object" ? tag._id : tag}
                      label={typeof tag === "object" ? tag.title : tag}
                      size="small"
                      sx={{
                        backgroundColor: "#e0e7ff",
                        color: "#4338ca",
                        fontSize: "0.7rem",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div
            className="mt-[2rem] min-h-[2rem] z-[100] relative"
            ref={filterRef}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Posts</h2>
              <img
                src="/images/filter.svg"
                alt="filter"
                className="w-[1.7rem] h-[1.7rem] cursor-pointer"
                onClick={handleFilter}
              />
            </div>
            <div
              className={`bg-white p-4 absolute mt-2 right-4 shadow-xl min-w-[200px] w-[90%] md:w-[300px] z-20 ${
                isFilterOpen ? "block" : "hidden"
              }`}
            >
              <Autocomplete
                options={sortOptions}
                value={selectedSortOption}
                clearIcon={false}
                disableClearable
                getOptionLabel={(option) => option.title}
                onChange={(e, value) => value && setSelectedSortOption(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Sort By"
                    placeholder="Select sorting option"
                  />
                )}
              />
            </div>
          </div>

          {/* Posts List */}
          <div className="mt-4 pb-20">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-xl">No posts yet</p>
                {isMember && (
                  <p className="mt-2 text-gray-600">
                    Be the first to share something!
                  </p>
                )}
                {!isMember && (
                  <p className="mt-2 text-gray-600">
                    Join the community to start posting
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white border rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex items-center mb-3">
                      {post.author?.profilePicture ? (
                        <img
                          src={post.author.profilePicture}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full mr-3"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/40?text=U";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                          {post.author?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">
                          {post.author?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="mb-4">{post.content}</p>

                    {/* Post Media */}
                    {post.mediaArray && post.mediaArray.length > 0 && (
                      <div
                        className={`grid ${
                          post.mediaArray.length === 1
                            ? "grid-cols-1"
                            : post.mediaArray.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-3"
                        } gap-2 mb-4`}
                      >
                        {post.mediaArray.map((media, index) => {
                          const isImage =
                            media.endsWith(".jpg") ||
                            media.endsWith(".jpeg") ||
                            media.endsWith(".png") ||
                            media.endsWith(".gif");
                          const isVideo =
                            media.endsWith(".mp4") ||
                            media.endsWith(".webm") ||
                            media.endsWith(".mov");

                          return (
                            <div
                              key={index}
                              className={`rounded-lg overflow-hidden ${
                                post.mediaArray.length === 1
                                  ? "max-h-[400px]"
                                  : "max-h-[200px]"
                              }`}
                            >
                              {isImage ? (
                                <img
                                  src={`${process.env.REACT_APP_BACKEND_URL}/uploads/communities/${media}`}
                                  alt={`Post attachment ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : isVideo ? (
                                <video
                                  src={`${process.env.REACT_APP_BACKEND_URL}${media}`}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  Attachment
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center space-x-4 text-gray-500">
                      <button
                        className={`flex items-center space-x-1 ${
                          post.likes?.includes(getUserId())
                            ? "text-blue-600"
                            : ""
                        }`}
                        onClick={() => handleLikePost(post._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span>{post.likes?.length || 0} Likes</span>
                      </button>
                      <button
                        className="flex items-center space-x-1"
                        onClick={() => handleShowComments(post)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{post.comments?.length || 0} Comments</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating action button */}
      {(isMember || isAdmin) && (
        <div
          className="fixed flex justify-center shadow-lg items-center gap-2 md:bottom-6 md:right-6 bottom-[11vh] right-6
                     w-[180px] h-[45px] bg-[#FFFFFF] rounded-full cursor-pointer create-post-button z-20"
          onClick={() => setIsPostFormOpen(true)}
        >
          <img
            src="/images/add.svg"
            alt="add post"
            className="h-[50%] md:h-[65%]"
          />
          <div className="text-[#0016DA] text-[0.875rem] font-semibold">
            Create Post
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityView;
