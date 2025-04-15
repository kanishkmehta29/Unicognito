import axios from 'axios';

// Get backend URL from environment variable with fallback
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const getCourseReview = (courseReviewId) => {
  return axios.get(`${BACKEND_URL}/coursereview/${courseReviewId}`,
    {
      withCredentials: true
    });
};

const getCourseReviews = () => {
  return axios.get(`${BACKEND_URL}/coursereview/`,
    {
      withCredentials: true
    });
};

const postComment = (courseId, content) => {
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
        return axios.post(`${BACKEND_URL}/coursereview/comment`, { courseId, content },
          {
            withCredentials: true,
          });
      }
    })
    .catch(error => {
      console.error('Error checking comment:', error);
      return Promise.reject(error);
    });
}

const enrollCourse = (courseId) => {
  return axios.put(`${BACKEND_URL}/coursereview/enroll`, { courseId },
    {
      withCredentials: true,
    });
}

export {
  getCourseReview,
  getCourseReviews,
  postComment,
  enrollCourse
};