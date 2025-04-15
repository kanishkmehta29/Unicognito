import React from "react";
import Topbar from "../components/Navbar/Topbar";
import HeaderCard from "../components/DiscussionView/HeaderCard";
import CommentCard from "../components/DiscussionView/CommentCard";
import { useEffect, useRef, useState } from "react";
import { getDiscussion, postComment } from "../fetch/discussions";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import Loader from "../components/Loader";

function DiscussionView() {
  const [discussion, setdiscussion] = useState({});
  const [comment, setComment] = useState("");
  const [isAddComment, setIsAddComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get("id");
    if (!encodedData) {
      window.location.href = "/404";
    }
    getDiscussion(encodedData)
      .then((response) => {
        setdiscussion(response.data);
      })
      .catch((error) => {
        console.error("Error fetching discussion:", error);
      });
  }, []);

  const handleAddComment = () => {
    setIsLoading(true);
    postComment(discussion._id, comment).then((res) => {
      if (res.data.message) {
        alert(res.data.message);
        setIsLoading(false);
        return;
      }
      console.log("Comment Posted:  ", res);
      window.location.reload();
    });
  };

  return (
    <div className="w-screen flex  md:w-full flex-col justify-center items-center mb-[10vh]">
      {isLoading && <Loader /> }
      <div className="fixed top-0 left-0 right-0 z-50">
        <Topbar title="Discussion" isSearchDisabled={true} />
      </div>
      <HeaderCard project={discussion} />
      <div className="flex flex-col gap-2 w-[80vw] mt-[20vh] pl-[2vw]">
        <div className="text-[1.5rem] text-[#0016DA] font-bold">
          Description
        </div>
        <div className="">
          <div className="text-[#000000] text-[1rem] mt-2">
            {discussion.content}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-[80vw] mt-[10vh] pl-[2vw]">
        <div className="text-[1.5rem] text-[#0016DA] font-bold">
          Discussion and Answers
        </div>
        <div className="flex flex-col gap-2 w-[80vw] mt-[1vh] pl-[2vw]">
          <div
            className="text-[1rem] font-bold mb-[3vh]"
            onClick={() => setIsAddComment(!isAddComment)}
          >
            Discuss {isAddComment ? "▲" : "▼"}
          </div>
          <div
            className={`flex flex-col mx-[2vw] ${
              isAddComment ? "block" : "hidden"
            }`}
          >
            <TextField
              label="Add comment here"
              variant="outlined"
              className="w-[70vw]"
              multiline
              rows={4}
              size="small"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              className='enabled:bg-[#0016DA] bg-[#0016DA]'
              disabled={comment===""}              
              onClick={handleAddComment}
              style={{width: "70vw  " }}
            >
              Submit
            </Button>
          </div>
        </div>
        <div>
          {discussion.comments && discussion.comments.length !== 0 ? (
            discussion.comments.map((comment, index) => (
              <CommentCard key={index} comments={comment} />
            ))
          ) : (
            <div className="text-[#000000] text-[1rem] mt-2">
              No comments yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscussionView;
