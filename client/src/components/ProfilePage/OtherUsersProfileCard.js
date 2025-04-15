import React, { useState } from "react";
import ProfileName from "./ProfileName";
import { addConnection } from "../../fetch/profile";

const OtherUsersProfileCard = ({ user, isConnected, setIsConnected }) => {
  
  const handleConnectClick = async () => {
    if (!isConnected) {
      try {
        await addConnection(user._id);
        setIsConnected(true);
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full py-8">
      <div className={`border-8 border-[#0016DA99] shadow-2xl bg-cover w-[9rem] h-[9rem] rounded-full`}>
        <img
          src={user && (user.profilePic || "/images/defaultThumbnail.jpeg")}
          alt="Profile Picture"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <ProfileName user={user} />
      <div className="flex flex-wrap gap-2 mt-[2vh] justify-center">
        {(user && user.bio) ? 
          <p className="text-center text-gray-700">{user.bio}</p> :
          <span className="border border-gray-200 rounded-full px-3 py-1 bg-gray-50 text-gray-500 text-sm">No bio added</span>
        }
      </div>
      {isConnected ? 
        <button className="mt-4 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded cursor-not-allowed">
          Connected
        </button>
        :
        <button 
          onClick={handleConnectClick}
          className="mt-4 bg-[#0016DA] hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Connect
        </button>
      }
    </div>
  );
};

export default OtherUsersProfileCard;
