import React, { useContext, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/Chat/ChatContainer";
import Contacts from "../components/Chat/Contacts";
import Welcome from "../components/Chat/Welcome";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { fetchProfileFromServer } from "../fetch/profile";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
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
        return JSON.parse(storedUser).id;
      }
    } catch (error) {
      console.error("Error parsing user from sessionStorage:", error);
    }
    return null;
  };

  useEffect(() => {
    async function fetchData() {
      // Clear chat app user data to ensure fresh start
      sessionStorage.removeItem("chat-app-user");
      
      if (!sessionStorage.getItem("chat-app-user")) {
        const userId = getUserId();
        if (!userId) {
          navigate("/login");
          return;
        }
        
        try {
          // Fetch current user's full profile
          const userProfile = await fetchProfileFromServer(userId);
          console.log("Fetched user profile:", userProfile);
          
          // Store the chat-specific user data
          sessionStorage.setItem("chat-app-user", JSON.stringify(userProfile));
          setCurrentUser(userProfile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          navigate("/login");
        }
      }
    }
    
    fetchData();
  }, [navigate, authUser]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchContacts() {
      if (currentUser) {
        if (currentUser.connections) {
          const connectionsList = await Promise.all(
            currentUser.connections.map(async (connection) => {
              try {
                // Fetch detailed info for each connection
                const response = await fetchProfileFromServer(connection);
                return response;
              } catch (error) {
                console.error(`Error fetching connection ${connection}:`, error);
                return null;
              }
            })
          );
          
          // Filter out failed requests
          const validConnections = connectionsList.filter(c => c !== null);
          setContacts(validConnections);
        }
      }
    }
    
    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome currentUser={currentUser} title="Chats" />
          ) : (
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
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
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
