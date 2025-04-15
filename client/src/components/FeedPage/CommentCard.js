import React, { useState, useEffect } from "react";
import { fetchProfileFromServer } from "../../fetch/profile";
import { putUpvote, putDownvote } from "../../fetch/comments";
import { Link } from "react-router-dom";

const CommentCard = (props) => {
  const [hoursAgo, setHoursAgo] = React.useState("");
  const [profile, setProfile] = React.useState({});
  const [upvotes, setUpvotes] = React.useState(0);
  const [upvoted, setUpvoted] = React.useState(false);
  const [downvotes, setDownvotes] = React.useState(0);
  const [downvoted, setDownvoted] = React.useState(false);

  console.log(props);

  useEffect(() => {
    const postingTime = props.comments.timeOfPost || props.comments.createdAt;
    if (!postingTime) {
      setHoursAgo('Recently');
      return;
    }
    
    const currentTime = new Date();
    const timeDifference = currentTime - new Date(postingTime);
  
    let timeAgo = "";
    if (timeDifference < 60000) {
      // Less than 1 minute
      const secondsAgo = Math.floor(timeDifference / 1000);
      timeAgo = `${secondsAgo} seconds ago`;
    } else if (timeDifference < 3600000) {
      // Less than 1 hour
      const minutesAgo = Math.floor(timeDifference / 60000);
      timeAgo = `${minutesAgo} minutes ago`;
    } else if (timeDifference < 86400000) {
      // Less than 1 day
      const hoursAgo = Math.floor(timeDifference / 3600000);
      timeAgo = `${hoursAgo} hours ago`;
    } else {
      // More than 1 day
      const daysAgo = Math.floor(timeDifference / 86400000);
      timeAgo = `${daysAgo} days ago`;
    }
  
    setHoursAgo(timeAgo);
  }, [props.comments]);

  useEffect(() => {
    fetchProfileFromServer(sessionStorage.getItem("user"))
      .then((res) => {
        if (props.comments) {
          // Handle likes/dislikes if they exist
          if (props.comments.likes) {
            setUpvotes(props.comments.likes.length);
            if (props.comments.likes.includes(res._id)) {
              setUpvoted(true);
            }
          }
          
          if (props.comments.dislikes) {
            setDownvotes(props.comments.dislikes.length);
            if (props.comments.dislikes.includes(res._id)) {
              setDownvoted(true);
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [props.comments]);

const handleUpvote = () => {
  if (!props.comments._id) {
    console.error("Cannot upvote: Comment ID is missing", props.comments);
    return;
  }
  
  putUpvote(props.comments._id)
    .then((res) => {
      console.log("Upvote response:", res.data);
      // Don't toggle based on previous state, use the server response
      // Check if user's ID is in the likes array from response
      const userId = sessionStorage.getItem("user");
      const userLiked = res.data.likes.some(id => id === userId);
      
      setUpvoted(userLiked);
      setDownvoted(false); // Update dislike state based on server response
      
      // Update counts directly from response
      setUpvotes(res.data.likes.length);
      setDownvotes(res.data.dislikes.length);
    })
    .catch((error) => {
      console.error("Error upvoting comment:", error);
      alert("Failed to upvote comment: " + (error.response?.data?.message || error.message));
    });
};

const handleDownvote = () => {
  if (!props.comments._id) {
    console.error("Cannot downvote: Comment ID is missing", props.comments);
    return;
  }
  
  putDownvote(props.comments._id)
    .then((res) => {
      console.log("Downvote response:", res.data);
      if (upvoted) setUpvoted(false);
      setDownvoted(!downvoted); // Toggle downvoted state
      // Safely access response data with optional chaining
      setUpvotes(res.data?.likes?.length || 0);
      setDownvotes(res.data?.dislikes?.length || 0);
    })
    .catch((error) => {
      console.error("Error downvoting comment:", error);
      alert("Failed to downvote comment: " + (error.response?.data?.message || error.message));
    });
};

  return (
    <div className="w-full h-auto md:h-auto text-black p-5 bg-white shadow-lg rounded-lg mb-2">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-2 gap-1">
        <Link to={`/profile/${(props.comments.userId && props.comments.userId._id) || (props.comments.creator && props.comments.creator._id) || "#"}`} className="flex items-center gap-2">
          <div className="md:col-span-1 md:mr-auto items-center flex ml-[-10px]">
            <img
              src={
                (props.comments.userId && props.comments.userId.profilePic) ||
                (props.comments.creator && props.comments.creator.profilePic) ||
                "/images/defaultThumbnail.jpeg"
              }
              alt="Profile"
              className="w-[2rem] h-[2rem] rounded-full"
            />
          </div>
        </Link>
        <div className="md:col-span-8 flex flex-col md:items-start md:justify-center items-center">
          <div className="flex gap-2">
            <Link to={`/profile/${(props.comments.userId && props.comments.userId._id) || (props.comments.creator && props.comments.creator._id) || "#"}`} className="flex items-center gap-2">
            <div className="text-[1rem] font-semibold">
              {(props.comments.userId && (props.comments.userId.name || props.comments.userId.name)) ||
              "Anonymous User"}
            </div>
            </Link>
            <div className="flex items-center">
              <img
                src="/images/verify.png"
                alt="Description"
                className="object-cover object-center w-[1.125rem] h-[1.125rem]"
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-3 flex flex-col items-end align-top">
          <div className="text-[0.875rem] text-[#0016DA]">{hoursAgo}</div>
        </div>
        <div className="md:col-span-1"></div>
        <div className="md:col-span-8">
          <div className="text-[1rem]">
            {props.comments && (props.comments.content || props.comments.text || '')}
          </div>
        </div>
        <div className="flex justify-end md:col-span-3 items-center"></div>
        <div className="md:col-span-1"></div>
        <div className="md:col-span-8"></div>
        <div className="md:col-span-3 flex justify-end">
          <div className="flex w-fit h-fit gap-4 justify-end text-black align-center items-center py-0.5 px-2 rounded-full border-[1px] border-white">
            <div className="flex gap-1 align-center items-center">
              <img
                src={`/images/${upvoted ? "upvote" : "emptyUpvote"}.svg`}
                alt="Description"
                className="object-cover object-center w-[1rem] h-[1rem] cursor-pointer"
                onClick={handleUpvote}
              />
              <div className="text-[0.875rem]">{upvotes}</div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <img
                src={`/images/${downvoted ? "downvote" : "emptyDownvote"}.svg`}
                className={`${
                  downvoted ? "w-[1.6rem] h-[1.6rem]" : "w-[1.5rem] h-[1.5rem]"
                } cursor-pointer`}
                alt="star"
                onClick={handleDownvote}
              />
              <div className="text-[1rem]">{downvotes}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
