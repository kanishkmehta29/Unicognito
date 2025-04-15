import axios from "axios";

// Helper function to get token safely from sessionStorage
const getToken = () => {
  try {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser).token;
    }
  } catch (error) {
    console.error("Error parsing token from sessionStorage:", error);
  }
  return null;
};

// Fetch all user profiles
const fetchProfiles = async () => {
  try {
    const token = getToken();
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      withCredentials: true
    };
    
    console.log("Fetching all profiles");
    const response = await axios.get(
      `http://localhost:3001/profile/allChats`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
};

// Search profiles by search term
const searchProfiles = async (searchTerm) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      withCredentials: true
    };
    
    console.log("Searching profiles with term:", searchTerm);
    const response = await axios.post(
      `http://localhost:3001/profile/search/`,
      { searchTerm },
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error searching profiles:", error);
    throw error;
  }
};

// Original function (renamed for clarity)
const fetchProfilesBySearch = async (searchTerm) => {
    axios.defaults.headers.common[
        "authorization"
    ] = `Bearer ${getToken()}`;
    try {
        console.log("fetching profiles by search");
        const response = await axios.post(
        `http://localhost:3001/profile/search/`,
        {searchTerm},
        { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching profiles by search:", error);
        throw error;
    }
};

export { fetchProfiles, searchProfiles, fetchProfilesBySearch };
export default fetchProfilesBySearch;