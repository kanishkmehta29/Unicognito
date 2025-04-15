import axios from "axios";

const putUpvote = (commentId) => {
  if (!commentId) {
    console.error("Missing comment ID");
    return Promise.reject(new Error("Comment ID is required"));
  }
  
  return axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/comment/like/${commentId}`, 
    {}, 
    {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      withCredentials: true,
    }
  );
};

const putDownvote = (commentId) => {
  if (!commentId) {
    console.error("Missing comment ID");
    return Promise.reject(new Error("Comment ID is required"));
  }
  
  return axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/comment/dislike/${commentId}`, 
    {}, 
    {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      withCredentials: true,
    }
  );
};

export { putUpvote, putDownvote };