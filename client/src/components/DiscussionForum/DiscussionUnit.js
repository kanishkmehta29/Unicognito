import React, { useEffect } from "react";
import { fetchProfileFromServer } from "../../fetch/profile";
import { postComment, putUpvote } from "../../fetch/discussions";
import { Link } from "react-router-dom";

const DiscussionUnit = (props) => {
  const [hoursAgo, setHoursAgo] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [submit, setSubmit] = React.useState(false);
  const [comments, setComments] = React.useState(
    props.discussion.comments.length
  );
  const [upvotes, setUpvotes] = React.useState(props.discussion.upvotes.length);
  const [upvoted, setUpvoted] = React.useState(false);
  const { setIsLoading, isLoading } = props;

  useEffect(() => {
    setUpvotes(props.discussion.upvotes.length);
    setComments(props.discussion.comments.length);
    setUpvoted(props.discussion.upvotes.includes(sessionStorage.getItem("user")));
  }, [props.discussion]);

  useEffect(() => {
    const postingTime = props.discussion.postingTime;
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
  }, [props.discussion.postingTime]);

  useEffect(() => {
    fetchProfileFromServer(sessionStorage.getItem("user"))
      .then((res) => {
        console.log(res);
        if (props.discussion.upvotes.includes(res._id)) {
          console.log("upvoted");
          setUpvoted(true);
        } else {
          console.log("not upvoted");
          setUpvoted(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleUpvote = () => {
    putUpvote(props.discussion._id)
      .then((res) => {
        console.log(res);
        setUpvotes(res.data.upvotes.length);
        setUpvoted(!upvoted);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleTextAreaChange = (e) => {
    setComment(e.target.value);
    var element = e.target;
    element.style.overflow = "hidden";
    element.style.height = 0;
    element.style.height = element.scrollHeight + "px";
  };

  // Find the function that handles comment submission, likely containing code like this:
const handleSubmit = () => {
  setIsLoading(true);
  postComment(props.discussion._id, comment)
    .then((res) => {
      if (res.data.message) {
        alert(res.data.message);
        setIsLoading(false); // Make sure this exists
        return;
      }
      console.log("Comment Posted:  ", res);
      // Your existing success logic
      setComments(comments + 1);
      setComment("");
      setSubmit(false);
      setIsLoading(false); // Add this if missing
    })
    .catch((err) => {
      console.error("Error posting comment:", err);
      setIsLoading(false); // Add this to handle errors
    });
};

  const handleBlur = () => {
    setTimeout(() => {
      setSubmit(false);
    }, 200);
  };

  return (
    <div className="w-[100%] min-h-[15rem] md:min-h-[16rem] text-black rounded-lg bg-white mb-2 drop-shadow-lg  mx-auto px-3 py-4">
      <div className="flex md:flex-row md:p-3 mt-[1rem] md:mt-[1rem] flex-wrap w-[100%] ">
        <div className="flex gap-16 w-full lg:gap-[16rem] lg:justify-between">
          <div className="flex gap-2">
            <Link
              to={`/profile/${
                props.discussion.poster && props.discussion.poster._id
              }`}
              className="flex items-center gap-2"
            >
              <div className="flex md:ml-auto">
                <img
                  src={
                    props.discussion.poster
                      ? props.discussion.poster.profilePic ||
                        "/images/defaultThumbnail.jpeg"
                      : "/images/defaultThumbnail.jpeg"
                  }
                  alt="Profile"
                  className="w-[2rem] md:w-[2.5rem] h-[2rem] md:h-[2.5rem] rounded-full"
                />
              </div>
            </Link>
            <div className="flex flex-col md:items-start md:justify-center items-center">
              <div className="flex gap-2 ">
                <Link
                  to={`/profile/${
                    props.discussion.poster && props.discussion.poster._id
                  }`}
                  className="flex items-center gap-2"
                >
                  <div className="md:text-[1rem] text-[0.8rem]  font-semibold">
                    {props.discussion.poster && props.discussion.poster.name}
                  </div>
                </Link>
                <div className="flex items-center">
                  <img
                    src="images/verify.png"
                    alt="Description"
                    className="object-cover object-center w-[1.125rem] h-[1.125rem]"
                  />
                </div>
              </div>
              <Link
                to={`/profile/${
                  props.discussion.poster && props.discussion.poster._id
                }`}
                className="flex items-center gap-2"
              >
                <div className="text-[0.75rem] text-[#0016DA]">
                  @{props.discussion.poster && props.discussion.poster.email}
                </div>
              </Link>
            </div>
          </div>
          <div className="flex">
            <div className="text-[0.875rem] text-[#0016DA]">{hoursAgo}</div>
          </div>
        </div>
      </div>
      <div
        className="w-full md:w-2/3 mt-[1rem] pl-1 hover:cusor-pointer"
        onClick={() => {
          window.location.href = `/discussionView?id=${props.discussion._id}`;
        }}
      >
        <div className="text-[1rem] md:pl-[4rem] pl-[1rem]">
          {props.discussion.content}
        </div>
        <div
          className="flex justify-end md:col-span-3 items-center"
          onClick={() => {
            window.location.href = `/discussionView?id=${props.discussion._id}`;
          }}
        ></div>
      </div>

      <div className="flex gap-2 w-full mt-[3.6rem] items-center ">
        <div className="w-full md:w-2/3 flex text-black px-2">
          <textarea
            onChange={handleTextAreaChange}
            onFocus={() => {
              setSubmit(true);
            }}
            onBlur={handleBlur}
            rows={1}
            type="text"
            placeholder="Answer Here"
            className="overflow-hidden  shadow py-[0.375rem] bg-[#E5E5E5] text-black
                            placeholder:font-semibold p-3 rounded-2xl w-[200%] focus:border-[#0016DA] focus:outline-none 
                            focus:border resize-none"
          />
        </div>
        <div className={`${submit ? "flex" : "hidden"}`}>
          <button
            className="bg-[#0016DA] shadow  text-white text-[12px] font-bold rounded-lg px-4 py-1 ml-4 max-h-[40px]"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div
          className="md:col-span-3"
          onClick={() => {
            window.location.href = `/discussionView?id=${props.discussion._id}`;
          }}
        ></div>

        <div
          className="md:col-span-1"
          onClick={() => {
            window.location.href = `/discussionView?id=${props.discussion._id}`;
          }}
        ></div>
        <div
          className="md:col-span-8"
          onClick={() => {
            window.location.href = `/discussionView?id=${props.discussion._id}`;
          }}
        ></div>

        <div className=" w-full md:w-1/4 flex  gap-4 text-black  items-center py-0.5 px-2 rounded-full">
          <div
            className="flex gap-1 items-center"
            onClick={() => {
              window.location.href = `/discussionView?id=${props.discussion._id}`;
            }}
          >
            <img
              src={"images/comment.svg"}
              alt="Description"
              className="object-cover object-center w-[0.98rem] h-[0.98rem]"
            />
            <div className="text-[0.875rem]">{comments}</div>
          </div>
          <div className="flex gap-1 align-center items-center">
            <img
              src={`images/${upvoted ? "upvote" : "emptyUpvote"}.svg`}
              alt="Description"
              className="object-cover object-center w-[0.875rem] h-[0.875rem]"
              onClick={handleUpvote}
            />
            <div className="text-[0.875rem]">{upvotes}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DiscussionUnit };
