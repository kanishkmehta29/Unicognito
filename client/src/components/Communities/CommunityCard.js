import React, { useState } from 'react';
import { Chip } from '@mui/material';

const CommunityCard = ({ community }) => {
  const [hover, setHover] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [userIconError, setUserIconError] = useState(false);
  const [postIconError, setPostIconError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  
  const DEFAULT_USER_ICON = "/images/user.svg";
  const DEFAULT_POST_ICON = "/images/post.svg";
  const DEFAULT_PROFILE = "/images/defaultThumbnail.jpeg";
  
  const handleHover = () => setHover(!hover);
  
  if (!community) return <div>Error Loading</div>;
  
  return (
    <div
      className="md:my-[3vh] ml-4 my-[1vh] md:w-[31vw] md:h-[52vh] w-[80vw] h-[40vh] min-h-fit flex justify-center items-center"
      onClick={() => {
        window.location.href = `/community/${community._id}`;
      }}
    >
      <div
        className="flex flex-col justify-between md:w-[28vw] md:h-[48vh] h-[35vh] w-[80vw] min-h-fit
            transition-all duration-500 hover:md:w-[31vw] hover:md:h-[52vh] hover:h-[40vh] hover:w-[70vw] hover:pb-4 overflow-hidden rounded-xl shadow-lg"
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
      >
        <div className="object-cover object-center w-full flex flex-col gap-2">
          <div className="row-span-7">
            <div className="relative">
            {community.coverImage && !imageError ? (
                <img
                  src={
                    community.coverImage.startsWith('http') 
                      ? community.coverImage // Cloudinary URL (absolute)
                      : `${process.env.REACT_APP_BACKEND_URL}${community.coverImage.startsWith('/') ? '' : '/'}${community.coverImage}` // Local path (relative)
                  }
                  alt={community.title || community.name}
                  className="w-full md:max-h-[26.67vh] max-h-[20vh] object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full md:max-h-[26.67vh] max-h-[20vh] bg-gradient-to-r from-blue-500 to-purple-600"></div>
              )}
              <div className="absolute flex bottom-2 right-2 bg-[#FFFFFFCC] rounded-lg py-[5px] px-[4px]">
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={!userIconError ? DEFAULT_USER_ICON : "/images/upvote.svg"}
                    alt="Members"
                    className="w-[3.5] h-3 mx-2"
                    onError={() => setUserIconError(true)}
                  />
                  <div className="text-[0.55rem]">{community.members?.length || 0}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-content overflow-hidden mt-2 px-2">
            <h2 className="card-title text-[#0016DA] text-[0.9rem] font-bold">
              {community.title || community.name}
            </h2>
            <div
              className={`transition-all duration-500 text-wrap text-[0.875rem] text-gray-500 ${
                hover ? "line-clamp-3" : "line-clamp-2"
              }`}
            >
              {community.description}
            </div>
            
            {/* Display community tags */}
            {community.tags && community.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {community.tags.map(tag => (
                  <Chip
                    key={tag._id}
                    label={tag.title}
                    size="small"
                    className="text-[0.6rem]"
                    sx={{ 
                      fontSize: '0.6rem',
                      height: '18px',
                      backgroundColor: '#e0e7ff',
                      color: '#4338ca'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between mx-3 items-center mb-2">
          <div className="flex text-[0.875rem] gap-1">
            <img
              src={!postIconError ? DEFAULT_POST_ICON : "/images/star.svg"}
              alt="Posts"
              className="object-cover object-center w-[1.25rem] h-[1.25rem]"
              onError={() => setPostIconError(true)}
            />
            {community.posts?.length || 0} posts
          </div>
          <div className="flex gap-2">
            {community.userAdmins && community.userAdmins[0] ? (
              <div className="md:max-w-[50px] md:max-h-[50px] md:w-[2vw] md:h-[2vw] md:min-w-[20px] md:min-h-[20px] h-[45px] w-[45px] shadow rounded-full overflow-hidden">
                <img
                  src={(!profileError && community.userAdmins[0].profilePic) || DEFAULT_PROFILE}
                  alt="Owner"
                  className="md:max-w-[50px] md:max-h-[50px] md:w-[2vw] md:h-[2vw] md:min-w-[20px] md:min-h-[20px] h-[45px] w-[45px]"
                  onError={() => setProfileError(true)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;