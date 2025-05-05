import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const CreateCommunity = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: null,
    isPrivate: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Predefined tags
  const predefinedTags = [
    { id: "technology", title: "Technology" },
    { id: "science", title: "Science" },
    { id: "arts", title: "Arts" },
    { id: "sports", title: "Sports" },
    { id: "education", title: "Education" },
    { id: "gaming", title: "Gaming" },
    { id: "health", title: "Health" },
    { id: "music", title: "Music" },
    { id: "business", title: "Business" },
    { id: "travel", title: "Travel" },
    { id: "food", title: "Food" },
    { id: "fashion", title: "Fashion" },
    { id: "literature", title: "Literature" }
  ];
  
  // Filter tags based on input
  const filteredTags = predefinedTags.filter(tag => 
    tag.title.toLowerCase().includes(tagInput.toLowerCase()) && 
    !selectedTags.some(selected => selected.id === tag.id)
  );

  // Handle tag selection
  const addTag = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setTagInput("");
    setDropdownOpen(false);
  };

  // Remove a tag
  const removeTag = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "file" && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // Create preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
    setDropdownOpen(true);
  };

  const handleTagInputFocus = () => {
    setDropdownOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Get token from either AuthContext or session storage
      let token = null;
      
      // Try to get the token from session storage - check both formats
      const userObject = sessionStorage.getItem("user");
      if (userObject) {
        try {
          const parsedUser = JSON.parse(userObject);
          token = parsedUser.token;
        } catch (e) {
          console.error("Error parsing user from session storage:", e);
        }
      }
      
      // If we still don't have a token, try the direct token storage
      if (!token) {
        token = sessionStorage.getItem("token");
      }
      
      if (!token) {
        throw new Error("You must be logged in to create a community");
      }
      
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("isPrivate", formData.isPrivate);
      if (formData.coverImage) {
        data.append("coverImage", formData.coverImage);
      }
      
      // Add selected tags to form data
      selectedTags.forEach(tag => {
        data.append('tags', tag.id);
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Fixed capitalization to match standard
        },
        withCredentials: true
      };
      
      // Get backend URL from environment or use default
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
      
      console.log("Sending request to:", `${backendUrl}/communities`);
      console.log("With token:", token.substring(0, 10) + "...");
      
      const response = await axios.post(
        `${backendUrl}/communities`,
        data,
        config
      );
      
      navigate(`/community/${response.data._id}`);
    } catch (error) {
      console.error("Error creating community:", error);
      setError(error.response?.data?.message || "Failed to create community. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownOpen && !event.target.closest('.tag-dropdown-container')) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Create New Community</h1>
            <p className="text-gray-600">Connect with peers who share your interests</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Community Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxLength="50"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
                maxLength="500"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                Briefly describe what your community is about
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Cover Image</label>
              <div className="flex items-center">
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                  id="cover-image-input"
                />
                <label
                  htmlFor="cover-image-input"
                  className="cursor-pointer bg-white border rounded-lg px-4 py-2 text-blue-600 hover:bg-blue-50"
                >
                  Choose File
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {formData.coverImage ? formData.coverImage.name : "No file chosen"}
                </span>
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Custom Tag Selection Component */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Tags</label>
              <div className="tag-dropdown-container relative">
                {/* Selected Tags Display */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map(tag => (
                    <div key={tag.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                      <span>{tag.title}</span>
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag.id)} 
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tag Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onFocus={handleTagInputFocus}
                    placeholder="Select relevant tags for your community"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Tag Dropdown */}
                  {dropdownOpen && filteredTags.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredTags.map(tag => (
                        <div
                          key={tag.id}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                          onClick={() => addTag(tag)}
                        >
                          {tag.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Add tags to help others find your community
              </p>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Make this community private</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Private communities require approval to join
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/communities")}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Community"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateCommunity;