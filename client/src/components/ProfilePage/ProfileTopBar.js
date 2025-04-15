import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {fetchProfileFromServer} from "../../fetch/profile";
import axios from "axios";

const Topbar = (props) => {
  const discussions = props.discussions;
  const courseReviews = props.courseReviews;
  const postSearch = props.postSearch;
  const projects = props.projects;
  const [search, setSearch] = React.useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    const userFromLocalStorage = sessionStorage.getItem('user');
    if (userFromLocalStorage) {
      fetchProfileFromServer(userFromLocalStorage)
        .then((res) => setUser(res))
        .catch((err) => console.log(err));
    }
  }, []);

  const handleMouseEnter = () => {
    setShowDetails(true);
  };

  const handleMouseLeave = () => {
    setShowDetails(false);
  };

    const handleLogout = () => {
      console.log("Logout button clicked");
      try{
        axios.defaults.headers.common["authorization"] = "";
        axios.get("http://localhost:3001/auth/signout", { withCredentials: true }).then((res) => {
          sessionStorage.removeItem("user");
          console.log(res);
          navigate("/");
        });
        
      }
      catch(err){
        console.log(err);
      }
      // Redirect to home page
    };
  const handleSearch = () => {
    if (window.innerWidth < 768) {
      const search = document.querySelector("input");
      search.classList.toggle("hidden");
      const topic = document.querySelector(".topic");
      const profile = document.querySelector(".profile");
      const searchIcon = document.querySelector(".icon");
      if (search.classList.contains("hidden")) {
        topic.classList.remove("hidden");
        profile.classList.remove("hidden");
        searchIcon.classList.remove("absolute");
        search.classList.remove("w-[90vw]");
      } else {
        topic.classList.add("hidden");
        profile.classList.add("hidden");
        searchIcon.classList.add("absolute");
        search.classList.add("w-[90vw]");
      }
    }
  };

  useEffect(() => {
    if(search){
      if(discussions && props.setFilteredDiscussions){
        const filteredDiscussions = discussions.filter((discussion) => discussion.content.toLowerCase().includes(search.toLowerCase())||discussion.title.toLowerCase().includes(search.toLowerCase()));
        props.setFilteredDiscussions(filteredDiscussions);
      }
      if(courseReviews && props.setFilteredCourseReviews){
        const filteredCourseReviews = courseReviews.filter((courseReview) => courseReview.title.toLowerCase().includes(search.toLowerCase())||courseReview.description.toLowerCase().includes(search.toLowerCase()));
        props.setFilteredCourseReviews(filteredCourseReviews);
      }
      if(projects && props.setFilteredProjects){
        const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(search.toLowerCase())||project.description.toLowerCase().includes(search.toLowerCase()));
        props.setFilteredProjects(filteredProjects);
      } 
      if(props.setPostSearch){
        props.setPostSearch(search);
        console.log(search);
      }
    }
    else{
      if (discussions){
        props.setFilteredDiscussions(discussions);
      }
      if(courseReviews){
        props.setFilteredCourseReviews(courseReviews);
      }
      if(projects){
        props.setFilteredProjects(projects);
      }
      if(postSearch){
        props.setPostSearch("");
      }

    }
  }, [search]);

  return (
    <div className="w-screen bg-white drop-shadow-md">
      <div className="flex items-center py-[1.5vh] align-center justify-between">
      <div className="text-center ml-[7vw] hidden md:flex items-center">
        <Link to="/feed" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
          <img 
            src="/images/logo.png" 
            alt="Logo"
            className="h-[2rem] mr-2" 
          />
          <span className="text-2xl font-bold">{props.title}</span>
        </Link>
      </div>
        <div className="flex items-center">
          
          <div className="">
            {user && (
              <a href={`/profile/${user._id}`}>
              <div>
                <img
                  src={user && user.profilePic || "/images/defaultThumbnail.jpeg"}
                  alt="Profile"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="profile mr-[1vw] ml-[1vw] w-[2rem] h-[2rem] rounded-full"
                />
              </div>
              </a>
            )}

            {showDetails && user && (
              <div className="absolute right-[7.5vw] z-[9999] border-1 bg-white rounded-md border">
                <div className="p-2">
                  <p>name: {user.name || user.name}</p>
                </div>
              </div>
            )}
          </div>
          <div>
          <div onClick={() => window.location.href = "/chat"}>
                <img
                  src={"/images/chat_ppl.svg"}
                  alt="Profile"
                  className="mr-[0.5vw] ml-[0.5vw] w-[1.7rem] h-[1.7rem] rounded-full"
                />
              </div>            
          </div>
          <div className="flex items-center overflow-hidden h-[2rem]"
          onMouseEnter={() => setShowExit(true)}
          onMouseLeave={() => setShowExit(false)}>
            <img src = "/images/exit.svg" onClick={handleLogout} className=" py-1 w-[2.8rem] h-[2.8rem] px-2 mr-2 text-black" />
          </div>   
          {showExit &&
            <div className="dialog-box absolute right-[1vw] top-[7vh] z-50 border-1 bg-white rounded-md border">
              <div className="p-2">
                <p>Logout</p>
              </div>
            </div>            
          }     
        </div>
      </div>
    </div>
  );
};

export default Topbar;
