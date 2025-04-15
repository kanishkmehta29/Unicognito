import axios from 'axios';

const getPosts = () => {
  return axios.get('http://localhost:3001/posts/');
};

const getMyConnectionPosts = () => {
  return axios.get('http://localhost:3001/posts/myconnectionposts', {
    withCredentials: true,
  });
}

const getFavorites = () => {
  return axios.get('http://localhost:3001/posts/myfavposts', {
    withCredentials: true,
  });
}

const postComment = (postId, content) => {
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
  return axios.post("http://localhost:3001/evaluate-comment", { comment: content })
    .then(response => {
      if (response.data.HateRating > 50 || response.data.SpamRating > 50) {
        return Promise.resolve({
          data: { message: "Your comment was flagged as inappropriate/spam and hence not logged." },
        });
      } else {
        // Update the API endpoint to match the backend route structure
        return axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/comment`, 
          { text: content }, // Change content to text to match what the backend expects
          {
            headers: {
              authorization: `Bearer ${sessionStorage.getItem('token')}`, // Add token for auth
            },
            withCredentials: true,
          }
        );
      }
    })
    .catch(error => {
      console.error('Error checking comment:', error);
      return Promise.reject(error);
    });
};

const postFavorite = (postId) => {
  return axios.post('http://localhost:3001/posts/myfavposts', {
    postId,
  },
    {
      withCredentials: true,
    });
};

// In client/src/fetch/feed.js
const putLike = (postId) => {
  return axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/like`, 
    {}, 
    {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      withCredentials: true,
    }
  ).then(response => {
    console.log("Like response data:", response.data);
    return response;
  });
};


export {
  getPosts,
  postComment,
  putLike,
  postFavorite,
  getMyConnectionPosts,
  getFavorites
};
