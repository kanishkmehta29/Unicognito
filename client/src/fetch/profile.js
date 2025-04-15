import axios from "axios";

const fetchProfileFromServer = async (profileId) => {
  try {
    // Get the user data from session storage
    const userData = sessionStorage.getItem("user");
    let token = null;
    
    if (userData) {
      // Parse the user data to get the token
      const parsedData = JSON.parse(userData);
      token = parsedData.token;
    }
    
    // Set the Authorization header if token exists
    if (token) {
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
    }
    
    console.log("Fetching profile for ID:", profileId);
    
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
    const response = await axios.get(
      `${backendUrl}/profile/${profileId}`,
      { withCredentials: true }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

const fetchOtherUserProfile = async (profileId) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/profile/${profileId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

const addConnection = (userId) => {
  return axios.put(
    `http://localhost:3001/profile/${userId}/addConnection`,
    {
      userId,
    },
    {
      withCredentials: true,
    }
  );
};

const addtoPortfolio = (projectId) => {
  return axios.put(
    "http://localhost:3001/profile/addtoPortfolio",
    { project: projectId },
    {
      withCredentials: true,
    }
  );
};

const removeConnection = (userId) => {
  return axios.put(
    `http://localhost:3001/profile/${userId}/removeConnection`,
    {
      userId,
    },
    {
      withCredentials: true,
    }
  );
};

const getPortfolio = (userId) => {
  return axios.get(`http://localhost:3001/profile/getPortfolio/${userId}`, {
    withCredentials: true,
  });
};

export {
  fetchProfileFromServer,
  removeConnection,
  fetchOtherUserProfile,
  addConnection,
  addtoPortfolio,
  getPortfolio,
};
