import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput';
import axios from 'axios';
import { addMember, getAllMessageGroupsRoute, sendMessageGroupsRoute } from '../../utils/APIRoutes';
import { v4 as uuidv4 } from 'uuid';
import TopbarChat from './TopbarChat';
import { addCollab } from '../../fetch/projects';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import ProfileUnit from '../Search/ProfileUnit';
import fetchProfilesBySearch from '../../fetch/search';


const AddUsers = (props) => {
  const {isAddCollab, setIsAddCollab, currentChat} = props;
  const [profiles, setProfiles] = useState([]);
  const [collab, setCollab] = useState("");

  useEffect(() => {
    if (!currentChat || !currentChat.members) {
      return;
    }
    
    fetchProfilesBySearch(collab).then((res) => {
      res = res.filter((profile) => {
        let flag = true;
        currentChat.members.forEach((creator) => {
          // Handle case where creator might be an object or just an ID
          const creatorId = typeof creator === 'object' ? creator._id : creator;
          if(profile._id === creatorId){
            flag = false;
          }
        });
        return flag;
      });
      console.log("Filtered profiles:", res);
      setProfiles(res);
    }).catch((error) => {
      console.error('Error fetching profiles:', error);
    });
  },[collab, currentChat]);


  const handleAddCollab = (profile) => {
    axios.post(addMember, {
      groupId: currentChat._id,
      member: profile._id
    }).then((res) => {
      console.log(res);
    }).catch((error) => {
      console.error('Error adding collab:', error);
    });
  }
  return (
  <div className={`${isAddCollab ? 'block' : 'hidden'} flex justify-center rounded-xl items-center z-[999] 
  w-screen h-screen bg-[#00000022] fixed top-0 left-0`}>
    <div className='bg-white rounded-xl shadow-lg'>
      <div className='flex justify-end'>
        <img src="images/close.svg" alt="close" className='w-[2vw] m-2 hover:cursor-pointer' onClick={() => setIsAddCollab(false)} />
      </div>
      <div className='flex flex-col gap-4 items-center p-8'>
        <div className='text-[#0016DA] text-[1.5rem] font-bold'>
          Add Member
        </div>
        <input type="text" placeholder="Search for users" className='border rounded-lg p-2 w-[20vw]' onChange={(e) => setCollab(e.target.value)} />
        <div className='flex flex-col gap-2 w-[20vw]'>
          {
            profiles && profiles.length!==0 && 
            <div className='flex flex-col gap-2'>
              {profiles.map((profile, index) => (
                <div className='flex justify-between items-center' >
                  <ProfileUnit key={index} user={profile} />
                  <Button variant="contained" className='bg-[#0016DACC] h-10' onClick={() => handleAddCollab(profile)}>Add</Button> 
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  </div>  
  )
}

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [addUser, setAddUser] = useState(false);
  const scrollRef = useRef();
  
  var userSmall = '/images/user.svg';

  useEffect(() => {
    (async () => {
      if (currentChat) {
        console.log("Current Chat: ",currentChat);
        const response = await axios.post(getAllMessageGroupsRoute, {
          from: currentUser._id,
          to: currentChat._id
        });
        setMessages(response.data);
      }
    })();
  }, [currentChat, currentUser._id]);

  // Get all messages every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      (async () => {
        if (currentChat) {
          const response = await axios.post(getAllMessageGroupsRoute, {
            from: currentUser._id,
            to: currentChat._id
          });
          setMessages(response.data);
        }
      })();
    }, 1500);

    return () => clearInterval(interval);
  }, [currentChat, currentUser._id]);

    

    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageGroupsRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: ("("+currentUser.name+") "+msg)
        });
        console.log(msg);
        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            message: ("("+currentUser.name+") "+msg)
        });
        console.log(msg);
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: ("("+currentUser.name+") "+msg) });
        console.log(msgs);
        setMessages(msgs);
    };
    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-receive', (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            })
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: 'smooth' });
    }, [messages]);
    return (
        <Container>
            <TopbarChat currentUser={currentUser} title="Community" />
            <AddUsers isAddCollab={addUser} setIsAddCollab={setAddUser} currentChat={currentChat}/>
            <div className='chat-header flex justify-between'>
              <div className="">
                <div className="user-details">
                    <div className="avatar">
                        <img src={userSmall} alt=''/>
                    </div>
                    <div className="name">
                        <h3>{currentChat.name}</h3>
                    </div>
                </div>
              </div>
              <img
                src="images/addCollab.svg"
                alt="add collab"
                className={` hover:cursor-pointer md:max-w-[60px] md:max-h-[60px] md:w-[3vw] md:h-[3vw] md:min-w-[32px] md:min-h-[32px]  rounded-full h-[45px] w-[45px]`}
                onClick={() => setAddUser(true)}
              />
            </div>
            <div className="chat-messages">
                {messages.map((message) => {
                    return (
                        <div ref={scrollRef} key={uuidv4()}>
                            <div
                                className={`message ${message.fromSelf ? "sended" : "recieved"
                                    }`}
                            >
                                <div className="content ">
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
    );
}

const Container = styled.div`
margin-left: 25vw;
width: 75vw;
display: grid;
grid-template-rows: 8% 10% 72% 10%;
gap: 0.1rem;
overflow: hidden;
background-color: #F8F8F8;
.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #FFFFFFFF;
    box-shadow: 0 0 0.5rem #00000076;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .name {
        h3 {
          font-weight: 600;
          color: #000000;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        padding-left: 1rem;
        padding-right: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #0016DA;
        color: white;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: white;
        color:black;
      }
    }
  }
`;
