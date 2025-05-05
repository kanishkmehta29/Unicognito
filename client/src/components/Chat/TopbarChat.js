import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const TopbarChat = (props) => {
  const [showExit, setShowExit] = useState(false);
  const navigate = useNavigate();
  const {title} = props;

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

  return (
    <div className="w-full bg-white flex items-center drop-shadow-sm">
      <div className="flex w-full items-center align-center justify-between">
        <div className="topic md:text-xl md:text-lg h-fit pl-[2vw]">
          {title}
        </div>
        <div className="flex gap-2 items-center mr-4">
            <div>
              <img
                src={(props.currentUser && props.currentUser.profilePic) || "/images/defaultThumbnail.jpeg"}
                alt="Profile"
                className="profile w-[2rem] h-[2rem] object-cover overflow-hidden rounded-full"
              />
            </div>
          <div className="text-[#080808]">
            {props.currentUser ? props.currentUser.name : "Chat User"}
          </div>
          
          {/* Profile View Button */}
          {props.currentUser && props.currentUser._id && (
            <div className="ml-2 hidden md:block">
              <Link 
                to={`/profile/${props.currentUser._id}`} 
                className="flex items-center bg-[#0016DA] hover:bg-[#0012A6] text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Profile</span>
              </Link>
            </div>
          )}
          
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

export default TopbarChat;
