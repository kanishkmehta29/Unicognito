import React, { useEffect } from "react";
import axios from "axios";
import { fetchProfileFromServer } from "../../fetch/profile";
import { postComment, postFavorite, putLike } from "../../fetch/feed";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import CommentCard from "./CommentCard";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import Loader from "../Loader";

const FeedUnit = (props) => {
  const [hoursAgo, setHoursAgo] = React.useState("");
  const [profile, setProfile] = React.useState({});
  const [isCommenting, setIsCommenting] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [submit, setSubmit] = React.useState(false);
  const [comments, setComments] = React.useState(props.post.comments?.length || 0);
  const [likes, setLikes] = React.useState(props.post.likes.length);
  const [liked, setLiked] = React.useState(false);
  const [isFavorited, setFavorited] = React.useState(false);
  const [commentCount, setCommentCount] = React.useState(0);
  const [isAddComment, setIsAddComment] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const postingTime = props.post.timeOfCreation;
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
  }, [props.post.timeOfCreation]);

  console.log(props.post);

  useEffect(() => {
    fetchProfileFromServer(sessionStorage.getItem("user"))
      .then((res) => {
        console.log(res);
        if (props.post.likes.includes(res._id)) {
          console.log("liked");
          setLiked(true);
        } else {
          console.log("not liked");
          setLiked(false);
        }
        if (res.favPosts.includes(props.post._id)) {
          setFavorited(true);
        } else {
          setFavorited(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLike = () => {
    putLike(props.post._id)
      .then((res) => {
        console.log("Like response:", res.data);
        
        // Properly extract the like count and liked state from the response
        if (res.data.hasOwnProperty('likes')) {
          // If the server returns a likes count
          setLikes(res.data.likes);
        }
        
        if (res.data.hasOwnProperty('liked')) {
          // If the server returns a liked boolean
          setLiked(res.data.liked);
        } else {
          // Fallback to toggle behavior for backward compatibility
          setLiked(!liked);
        }
      })
      .catch((error) => {
        console.error("Error liking post:", error);
      });
  };

  const handleCommentButtonClick = () => {
    setIsCommenting(true);
    setCommentCount(5);
  };

  const handleCommentButtonHide = () => {
    setIsCommenting(false);
  };

  const handleCommentAdd = () => {
    setCommentCount(commentCount + 5);
  };

  const handleFavorite = async () => {
    postFavorite(props.post._id)
      .then((res) => {
        console.log(res);
        setFavorited(!isFavorited);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddComment = () => {
    setIsLoading(true);
    postComment(props.post._id, comment).then((res) => {
      if (res.data.message) {
        alert(res.data.message);
        setIsLoading(false);
        return;
      }
      console.log("Comment Posted:  ", res);
      window.location.reload();
    });
  };

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          background: "darkgray",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "1.5px",
          borderRadius: "50%",
        }}
        onClick={onClick}
      />
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          background: "darkgray",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "1.5px",
          borderRadius: "50%",
        }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };


  return (
    <div className="flex flex-col  w-[90%] md:w-[90%] md:mx-auto min-h-[28rem] rounded-xl p-[15px] bg-white text-gray-700 shadow-md mb-[1rem] items-center">
      {isLoading && <Loader />}
      <div className="flex w-[100%] items-start justify-between md:w-[100%] ">
        <Link
          to={`/profile/${props.post.creator && props.post.creator._id}`}
          className="flex items-center gap-2"
        >
          <div className="flex items-center gap-2">
            <img
              src={
                props.post.creator &&
                (props.post.creator.profilePic ||
                  "/images/defaultThumbnail.jpeg")
              }
              alt="Profile"
              className="w-[2rem] h-[2rem] rounded-full"
            />
            <div className="text-[1rem] font-semibold">
              {props.post.creator && (props.post.creator.name || props.post.creator.name)}
            </div>
            <div className="flex items-center">
              <img
                src="images/verify.png"
                alt="Description"
                className="object-cover object-center w-[1.125rem] h-[1.125rem]"
              />
            </div>
          </div>
        </Link>
        <div className="flex justify-start">
          <button>...</button>
        </div>
      </div>

      {props.post.mediaArray && props.post.mediaArray.length !== 0 ? 
          <div className="flex min-h-[15rem] justify-center md:w-[100%] py-3 overflow-hidden">
            {props.post.mediaArray[0].endsWith(".png") ||
            props.post.mediaArray[0].endsWith(".jpg") ||
            props.post.mediaArray[0].endsWith(".jpeg") ||
            props.post.mediaArray[0].endsWith(".svg") ? (
              <img
                src={props.post.mediaArray[0]}
                className="slider-image"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <video controls>
                <source src={props.post.mediaArray[0]} type="video/mp4" />
              </video>
            )}
          </div>
      :
        <div className=" md:w-[100%] h-[15rem]"></div>
      }

      <div className="flex items-center justify-between w-[100%] md:w-[100%]">
        <div className="flex gap-4">
          <button onClick={handleLike}>
            <img
              src={`/${liked ? "emptyHeart" : "heart"}.svg`}
              alt="Like"
              className="w-[1.5rem] h-[1.5rem]"
            />
          </button>
          <button onClick={handleCommentButtonClick}>
            <img
              src="/comment.svg"
              alt="Comment"
              className="w-[1.5rem] h-[1.5rem]"
            />
          </button>
        </div>
        <button onClick={handleFavorite}>
          <img
            src={`/${isFavorited ? "Filledfavorite" : "favorite"}.svg`}
            alt="Favorite"
            className="w-[1.5rem] h-[1.5rem]"
          />
        </button>
      </div>
      <div className="md:col-span-8 md:w-[100%]"></div>
      <div className="w-[100%] md:w-[100%] py-[1rem]">
        <p className="font-semibold">{likes} likes</p>
        <p>
          {/* <span className="font-semibold">{profile && profile.name}</span> */}
          {props.post.caption}
        </p>
        {!isCommenting ? (
          <button className="text-gray-500" onClick={handleCommentButtonClick}>
            View all {comments} comments
          </button>
        ) : (
          <div>
            <button className="text-gray-500" onClick={handleCommentButtonHide}>
              Hide all comments
            </button>
            <div className="flex flex-col gap-2 w-[100%] mt-[1vh] ">
            <div
              className="text-[1rem] font-bold mb-[3vh] cursor-pointer"
              onClick={() => setIsAddComment(!isAddComment)}
            >
              Add Comment {isAddComment ? "▲" : "▼"}
            </div>
              <div
                className={`flex flex-col ml-[1vw] mr-[3vw] ${
                  isAddComment ? "block" : "hidden"
                }`}
              >
                <TextField
                  label="Add comment here"
                  variant="outlined"
                  className="w-full"
                  multiline
                  rows={4}
                  size="small"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  margin="normal"
                />
                <Button
                  variant="contained"
                  className='enabled:bg-[#0016DA] bg-[#0016DA] w-full'
                  disabled={comment===""}              
                  onClick={handleAddComment}
                >
                  Submit
                </Button>
              </div>
            </div>
            {props.post.comments && props.post.comments.length !== 0 ? (
              <div>
                {props.post.comments.map((comment, index) => {
                  if (index < commentCount) {
                    return <CommentCard key={index} comments={comment} />;
                  }
                  return null;
                })}
                {props.post.comments.length > commentCount && (
                  <button className="text-gray-500" onClick={handleCommentAdd}>
                    View More Comments
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div className=" w-[100%] md:w-[100%] text-[0.875rem] text-[#0016DA] ">
        {hoursAgo}
      </div>
    </div>
  );
};

export { FeedUnit };
