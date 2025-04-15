import { React, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OtherProfileComp from "../components/OtherProfile/OtherProfileComp";
import { fetchOtherUserProfile } from "../fetch/profile";
import { AuthContext } from "../context/AuthContext";

function OtherProfilePage() {
  const [user, setUser] = useState(null);
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // Helper function to get user ID safely
  const getUserId = () => {
    if (currentUser) {
      return currentUser.id;
    }
    
    // Fallback to check sessionStorage directly
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser).id;
      }
    } catch (error) {
      console.error("Error parsing user from sessionStorage:", error);
    }
    return null;
  };
  
  useEffect(() => {
    // Check if viewing own profile
    const currentUserId = getUserId();
    if (userId === currentUserId) {
      navigate("/profile");
      return;
    }

    // Fetch other user's profile
    fetchOtherUserProfile(userId)
      .then((response) => setUser(response))
      .catch((error) => console.error(error));
  }, [userId, navigate]);

  return (
    <div className="min-h-[100vh] bg-[#f8f8f8]">
      <OtherProfileComp user={user} userId={userId} />
    </div>
  );
}

export default OtherProfilePage;
