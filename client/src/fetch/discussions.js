import axios from 'axios';

// Get backend URL from environment variable with fallback
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const getDiscussions = () => {
  return axios.get(`${BACKEND_URL}/discussion/`);
};

const getDiscussion = (id) => {
  return axios.get(`${BACKEND_URL}/discussion/${id}`);
};

const postComment = (discussionId, content) => {
  if (
    sessionStorage.getItem("lastCommentTime") &&
    Date.now() - sessionStorage.getItem("lastCommentTime") < 60000
  ) {
    return Promise.resolve({
      data: { message: "Please wait a few seconds before commenting again." },
    });
  }
  sessionStorage.setItem("lastCommentTime", Date.now());

  // Check comment for spam
  return axios.post(`${BACKEND_URL}/evaluate-comment`, { comment: content })
    .then(response => {
      if (response.data.HateRating > 50 || response.data.SpamRating > 50) {
        return Promise.resolve({
          data: { message: "Your comment was flagged as inappropriate/spam and hence not logged." },
        });
      } else {
        return axios.post(`${BACKEND_URL}/discussion/comment`, {
          discussionId,
          content,
        },
          {
            withCredentials: true,
          });
      }
    })
    .catch(error => {
      console.error('Error checking comment:', error);
      return Promise.reject(error);
    });
};

const putUpvote = (discussionId) => {
  return axios.put(`${BACKEND_URL}/discussion/upvote`, {
    discussionId,
  },
    {
      withCredentials: true,
    });
};

const putDownvote = (discussionId) => {
  return axios.put(`${BACKEND_URL}/discussion/downvote`, {
    discussionId,
  },
    {
      withCredentials: true,
    });
}

const postDiscussion = (body) => {
  console.log(body);
  return axios.post(`${BACKEND_URL}/discussion/`, body, {
    withCredentials: true,
  });
}

export {
  getDiscussions,
  postComment,
  putUpvote,
  postDiscussion,
  getDiscussion,
  putDownvote,
};
