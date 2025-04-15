import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Navbar/Navbar";
import { addConnection, removeConnection } from "../../fetch/profile";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function OtherProfileComp({ user, userId }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [connected, setConnected] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Helper function to get user ID safely
  const getCurrentUserId = () => {
    if (currentUser) {
      return currentUser.id;
    }
    
    // Fallback to check sessionStorage directly
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

  useEffect(() => {
    if (user) {
      // Check if the current user is connected to this profile
      const currentUserId = getCurrentUserId();
      if (currentUserId && user.connections) {
        setConnected(user.connections.some(connection => 
          typeof connection === 'object' 
            ? connection._id === currentUserId 
            : connection === currentUserId
        ));
      }
    }
  }, [user]);

  const handleConnection = async () => {
    try {
      if (connected) {
        await removeConnection(userId);
        setConnected(false);
      } else {
        await addConnection(userId);
        setConnected(true);
      }
    } catch (error) {
      console.error("Failed to update connection:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      <div className={`flex-1 transition-all ${isExpanded ? "md:ml-60" : "md:ml-20"}`}>
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 m-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Profile Image */}
            <div className="mb-4 md:mb-0 md:mr-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.description || "No description provided"}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="font-semibold">{user.discussions?.length || 0}</p>
                  <p className="text-sm text-gray-500">Discussions</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{user.connections?.length || 0}</p>
                  <p className="text-sm text-gray-500">Connections</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{user.projects?.length || 0}</p>
                  <p className="text-sm text-gray-500">Projects</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{user.views || 0}</p>
                  <p className="text-sm text-gray-500">Views</p>
                </div>
              </div>
              
              {/* Connect Button */}
              <button
                onClick={handleConnection}
                className={`px-4 py-2 rounded-lg font-medium ${
                  connected
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                {connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        </div>
        
        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-md p-6 m-4">
          <h2 className="text-xl font-bold mb-4">Projects</h2>
          {user.projects && user.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold">{project.title || "Untitled Project"}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {project.description || "No description provided"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No projects to display</p>
          )}
        </div>

        {/* Discussions Section */}
        <div className="bg-white rounded-lg shadow-md p-6 m-4">
          <h2 className="text-xl font-bold mb-4">Recent Discussions</h2>
          {user.discussions && user.discussions.length > 0 ? (
            <div className="space-y-4">
              {user.discussions.slice(0, 5).map((discussion, index) => (
                <div key={index} className="border-b pb-3">
                  <h3 className="font-semibold">{discussion.title || "Untitled Discussion"}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {discussion.content || "No content provided"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No discussions to display</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OtherProfileComp;