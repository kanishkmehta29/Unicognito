import React from "react";
import ProfileName from "./ProfileName";

const ProfileCard = ({ user, setIsEdit }) => {
  
  return (
    <div className="flex flex-col items-center w-full py-8">
      <div className={`border-8 border-[#0016DA99] shadow-2xl bg-cover w-[12rem] h-[12rem] rounded-full`}>
        <img
          src={user && (user.profilePic || "/images/defaultThumbnail.jpeg")}
          alt="Profile Picture"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <ProfileName user={user} />
      <div className="flex flex-wrap gap-2 mt-[3vh] justify-center max-w-[90%]">
        {(user && user.bio) ? 
          <p className="text-center text-gray-700">{user.bio}</p> :
          <span className="border border-gray-200 rounded-full px-3 py-1 bg-gray-50 text-gray-500 text-sm">No bio added</span>
        }     
      </div>
      <button 
        onClick={() => setIsEdit(true)}
        className="mt-4 bg-[#0016DA] hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;