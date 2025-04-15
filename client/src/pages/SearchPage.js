import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Topbar from "../components/Navbar/Topbar";
import { Link } from "react-router-dom";
import { fetchProfiles, searchProfiles } from "../fetch/search";
import ProfileUnit from "../components/Search/ProfileUnit";
import { AuthContext } from "../context/AuthContext";

function SearchPage() {
  const [profiles, setProfiles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hover, setHover] = useState(false);
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
    fetchProfiles()
      .then((res) => {
        const userId = getUserId();
        setProfiles(
          res.filter((profile) => profile._id !== userId)
        );
      })
      .catch((error) => {
        console.error("Error fetching profiles:", error);
      });
  }, [currentUser]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    searchProfiles(searchText)
      .then((res) => {
        const userId = getUserId();
        setProfiles(
          res.filter((profile) => profile._id !== userId)
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error searching profiles:", error);
        setLoading(false);
      });
  };

  return (
    <div className="relative flex flex-col md:flex-row bg-[#F8F8F8] w-screen min-h-[100vh]">
      <Navbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        select={{ search: true }}
      />
      <div className="w-screen">
        <Topbar title="Search" isSearchDisabled={true} />
        <div className="ml-[8vw] md:ml-[40vw] ">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex ${
              hover ? " border-[1px] border-[#0016DA] " : ""
            } pl-0 items-center bg-white shadow-sm mt-10 mb-10 w-[50vw] md:w-[40vw] h-[2.5rem] rounded-xl overflow-hidden`}
          >
            <img
              src="images/search.svg"
              alt="search icon"
              className="w-[1rem] h-[1rem] m-2 hover:cursor-pointer"
            />
            <input
              type="text"
              placeholder="Search for users"
              className="md:w-[20vw] w-[20vw] h-full focus:outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => setHover(true)}
              onBlur={() => setHover(false)}
            />
          </form>
        </div>

        <div className="md:ml-[40vw] w-[90vw] m-auto md:w-[40vw]">
          {loading ? (
            <p>Loading...</p>
          ) : (
            profiles.map((profile) => (
              <ProfileUnit key={profile.id} user={profile} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;