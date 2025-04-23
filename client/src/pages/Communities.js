import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Topbar from '../components/Navbar/Topbar';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Communities = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  // Helper function to get auth token safely
  const getToken = () => {
    if (currentUser) {
      return currentUser.token;
    }
    
    // Fallback to check sessionStorage directly
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
    const fetchCommunities = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate('/signin');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`http://localhost:3001/communities`, config);
        setCommunities(response.data);
        setFilteredCommunities(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching communities:', error);
        setError('Failed to load communities');
        setLoading(false);
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          navigate('/signin');
        }
      }
    };

    fetchCommunities();
  }, [navigate]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCommunities(communities);
    } else {
      const filtered = communities.filter(community => 
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommunities(filtered);
    }
  }, [searchQuery, communities]);

  // Ensure content is aligned to left when nav width changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [isExpanded]);

  return (
    <>
      {/* Navbar */}
      <Navbar 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded} 
        select={{ communities: true }}
      />
      {/* Main content wrapper offset for fixed sidebar */}
      <div className={`bg-[#F8F8F8] min-h-screen ${isExpanded ? 'md:pl-[25vw]' : 'md:pl-[20vw]'}`}>
        <Topbar title="Communities" />
        
        <div className="container mx-auto px-4 py-8">
          {/* Search and Create buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search communities..."
                  className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => navigate('/create-community')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center"
            >
              <svg
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
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
              Create Community
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold mb-4">No communities found</h2>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'No communities match your search.' : 'Be the first to create a community!'}
              </p>
              <button
                onClick={() => navigate('/create-community')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Create New Community
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <Link
                  key={community._id}
                  to={`/community/${community._id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    {community.coverImage && (
                      <img
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${community.coverImage}`}
                        alt={community.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-white font-bold text-xl">{community.name}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 mb-2 line-clamp-2 h-12">
                      {community.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {community.members?.length || 0} members
                      </span>
                      <span className="text-sm text-blue-600">View Community</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Communities;