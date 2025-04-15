import ProfilePageComp from "../components/ProfilePage/ProfilePageComp";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchProfileFromServer } from "../fetch/profile";
import { React, useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Get user data from AuthContext
    if (!currentUser) {
      console.log("No user found in AuthContext, redirecting to login");
      navigate('/signin');
      return;
    }
    
    // If we have a user, fetch their profile
    console.log("Fetching profile for user ID:", currentUser.id);
    fetchProfileFromServer(currentUser.id)
      .then((response) => {
        console.log("Profile data received:", response);
        setUser(response);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, [currentUser, navigate]);

  return (
    <div className="min-h-[100vh] bg-[#f8f8f8]">
      {user ? (
        <ProfilePageComp user={user} />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
