import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput';
import axios from 'axios';
import { getAllMessageRoute, sendMessageRoute } from '../../utils/APIRoutes';
import { v4 as uuidv4 } from 'uuid';
import TopbarChat from './TopbarChat';

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  
  var userSmall = '/images/user.svg';

  useEffect(() => {
    (async () => {
      if (currentChat) {
        const response = await axios.post(getAllMessageRoute, {
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
          const response = await axios.post(getAllMessageRoute, {
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
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg
        });
        console.log(msg);
        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            message: msg
        });
        console.log(msg);
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
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
            <TopbarChat currentUser={currentUser} title="Chats" />
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        <img src={userSmall} alt=''/>
                    </div>
                    <div className="name">
                        <h3>{currentChat.name}</h3>
                    </div>
                </div>
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
