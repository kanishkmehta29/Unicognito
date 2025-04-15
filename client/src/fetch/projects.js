import axios from "axios";

const getProjects = () => {
  return axios.get("http://localhost:3001/projects/");
};

const getProject = (id) => {
  return axios.get(`http://localhost:3001/projects/${id}`);
};

const getMyProjects = () => {
  return axios.get(`http://localhost:3001/projects/my`, {
    withCredentials: true,
  });
};

const addCollab = (id, user) => {
  return axios.put(
    `http://localhost:3001/projects/${id}/addCollab`,
    {
      user,
    },
    {
      withCredentials: true,
    }
  );
};

const putLike = (id) => {
  return axios.put(
    `http://localhost:3001/projects/likes/`,
    {
      projectId: id,
    },
    {
      withCredentials: true,
    }
  );
};

const putDislike = (id) => {
  return axios.put(
    `http://localhost:3001/projects/dislikes/`,
    {
      projectId: id,
    },
    {
      withCredentials: true,
    }
  );
};

// const postComment = (id, content) => {
//   if (
//     sessionStorage.getItem("lastCommentTime") &&
//     Date.now() - sessionStorage.getItem("lastCommentTime") < 60000
//   ) {
//     return new Promise((resolve, reject) => {
//       resolve({
//         data: { message: "Please wait a few seconds before commenting again." },
//       });
//     });
//   }
//   sessionStorage.setItem("lastCommentTime", Date.now());
//   return axios.post(
//     "http://localhost:3001/projects/comment/",
//     {
//       projectId: id,
//       content: content,
//     },
//     {
//       withCredentials: true,
//     }
//   );
// };

const postComment = (id, content) => {
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
          data: { message: "Your comment was flagged as inappropriate/spam and hence not logged. Please refrain from posting such comments otherwise you will be banned from the platform" },
        });
      } else {
        return axios.post(
          "http://localhost:3001/projects/comment/",
          { projectId: id, content: content },
          { withCredentials: true }
        );
      }
    })
    .catch(error => {
      console.error('Error checking comment:', error);
      return Promise.reject(error);
    });
};

const deleteProject = (id) => {
  return axios.delete(`http://localhost:3001/projects/${id}`, {
    withCredentials: true,
  });
}


export {
  getProjects,
  getProject,
  putLike,
  putDislike,
  getMyProjects,
  postComment,
  addCollab,
  deleteProject,
};
