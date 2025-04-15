import React, { useContext, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host, getGroups } from "../utils/APIRoutes";
import ChatContainer from "../components/Chat/ChatContainer";
import GroupChatContainer from "../components/Chat/GroupChatContainer";
import Contacts from "../components/Chat/Contacts";
import Welcome from "../components/Chat/Welcome";
import { io } from "socket.io-client";
import { fetchProfileFromServer } from "../fetch/profile";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function GroupChat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [groups, setGroups] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const { currentUser: authUser } = useContext(AuthContext);

  // Helper function to get user ID safely
  const getUserId = () => {
    if (authUser) {
      return authUser.id;
    }
    
    // Fallback to check sessionStorage directly
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return userData.id || userData;
      }
    } catch (error) {
      console.error("Error parsing user from sessionStorage:", error);
    }
    return null;
  };

  useEffect(() => {
    async function fetchData() {
      if (!sessionStorage.getItem("chat-app-user")) {
        const userId = getUserId();
        if (!userId) {
          navigate("/login");
          return;
        }
        
        try {
          // Fetch current user's full profile
          const userProfile = await fetchProfileFromServer(userId);
          console.log("Fetched user profile for group chat:", userProfile);
          
          // Store the chat-specific user data
          sessionStorage.setItem("chat-app-user", JSON.stringify(userProfile));
          setCurrentUser(userProfile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          navigate("/login");
        }
      } else {
        setCurrentUser(JSON.parse(sessionStorage.getItem("chat-app-user")));
      }
    }
    
    fetchData();
  }, [navigate, authUser]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
      
      // Fetch groups for current user
      const fetchGroups = async () => {
        try {
          console.log("Fetching groups for user:", currentUser._id);
          const response = await axios.get(getGroups(currentUser._id), {
            withCredentials: true
          });
          console.log("Fetched groups:", response.data);
          setGroups(response.data);
        } catch (err) {
          console.error("Error fetching groups:", err);
        }
      };
      
      fetchGroups();
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={groups} currentUser={currentUser} changeChat={handleChatChange} isGroup={true} />
          {currentChat === undefined ? (
            <Welcome currentUser={currentUser} title="Group Chat" />
          ) : (
            <GroupChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #F8F8F8;
  .container {
    height: 100vh;
    width: 100vw;
    background-color: #FFFFFF;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
