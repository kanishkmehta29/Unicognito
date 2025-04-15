import React from 'react';
import { Link } from 'react-router-dom';


const ProfileUnit = ({ user }) => {
  return (
    <div className=' m-2 bg-white p-2 text-[#0016DA] flex gap-2 items-center rounded-md shadow-sm' >
      <img src={user.profilePic ? user.profilePic : '/images/defaultThumbnail.jpeg'} className=' p-1 rounded-full size-[2.5rem]' alt="Profile" />
      <h2>
        <Link to={`/profile/${user && user._id}`} className='text-[#0016DA]'>{user && (user.name || user.name)}</Link>
      </h2>
    </div>
  );
};

export default ProfileUnit;
