import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Add this import

import styled from 'styled-components';
import Logo from '../../assets/logo.svg';
import {Button, Box, Container, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { addGroup } from '../../utils/APIRoutes';

const CreateGroupForm = ({ createGroup, setCreateGroup }) => {
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = () => {
    axios.post(addGroup, { name: groupName , members: [
      JSON.parse(sessionStorage.getItem('chat-app-user'))._id
    ] }).then((res) => {
      window.location.reload();
    }).catch((err) => {
      console.log(err);
    });
    setCreateGroup(false);
  };

  return (
      <Container component={Paper} maxWidth="xs">
        <Box p={3}>
          <Typography variant="h4" gutterBottom>Add a new Post</Typography>
          <TextField
            label={"Name *"}
            variant="outlined"
            fullWidth
            size="small"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            margin="normal"
          />
          <div className="flex gap-2 justify-between mt-4">
            <Button variant="contained" onClick={handleCreateGroup} className=' enabled:bg-[#0016DA]'
            disabled={groupName===""}>Add</Button>
            <Button variant="contained"  onClick={() => setCreateGroup(false)} style={{ backgroundColor: '#0016DA' }}>Cancel</Button>
          </div>          
        </Box>
      </Container>
  )
}


export default function Contacts({ contacts, currentUser, changeChat, isGroup }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [createGroup, setCreateGroup] = useState(false);

  var userSmall = '/images/user.svg'
  useEffect(() => {
    (async () => {
      if (currentUser) {
        setCurrentUserImage(userSmall);
        setCurrentUserName(currentUser.name);
      }
    })();
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      <div
        className={`flex justify-center rounded-xl items-center z-[999]
          w-screen h-screen bg-[#00000022] fixed top-0 left-0
          ${createGroup ? " block" : " hidden"}`}
      >
        <CreateGroupForm createGroup={createGroup} setCreateGroup={setCreateGroup} />
      </div>
      {
        currentUserImage && currentUserName && (
          <Cont>
            <div className='h-[100vh] flex flex-col justify-between items-center'>
              <div className='w-full h-[90vh] flex flex-col'>
              <div className="brand">
                <Link to="/feed" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all">
                  <img src="/images/logo.png" alt="Logo" className="h-6 w-6" />
                  <div className='title'>Unicognito</div>
                </Link>
              </div>
                <div className="contacts">
                  {
                    contacts.map((contact, index) => {
                      if (contact === null) return null;
                      return (
                        <div className={`contact ${index === currentSelected ? 'selected' : ''}`} key={index} onClick={() => changeCurrentChat(index, contact)}>
                          <div className="avatar">
                            <img src={userSmall} alt="" />
                          </div>
                          <div className="name">
                            <h3>{contact.name}</h3>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              {/*<div className="current-user">
                            <div className="avatar">
                                <img src={userSmall} alt="avatar" />
                            </div>
                            <div className="name">
                                <h2>{currentUserName}</h2>
                            </div>
                              </div>*/}
              {isGroup &&
                <div>
                  <div
                    className="flex justify-center shadow-lg items-center gap-2
                                      w-[180px] h-[45px] bg-[#FFFFFF] border-[#0016DA] border-2 mb-[1rem] rounded-full "
                    onClick={() => setCreateGroup(true)}
                  >
                    <div className="text-[#0016DA] text-[0.875rem] font-semibold">
                      Create Group
                    </div>
                  </div>
                </div>
              }
            </div>
          </Cont>
        )
      }
    </>
  )
}

const Cont = styled.div`
position: fixed;  
top: 0;
left: 0;
height: 100vh;
width: 25vw;
display: grid;
grid-template-rows: 10% 90%;
overflow: hidden;
background-color: #FFFFFF;
border-right: 1px solid #00000076;
.brand {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center; /* Add this to vertically center items */
    padding: 1rem 0; /* Add padding to the container instead */
    
    .title {
      /* Remove padding-top that was causing misalignment */
      color: black;
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
.connections{
  display: flex;
  justify-content: start;
  margin-top:auto;
  margin-bottom: auto;
  .mycon{
    font-size: 1.1rem;
    font-weight: 500;
    padding-left: 5%;
  }
}
.contacts {
  padding-top: 1rem;
  display: flex;
  padding-bottom: 1rem;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  gap: 0.8rem;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .contact {
    background-color: #FFFFFF;
    min-height: 5rem;
    cursor: pointer;
    width: 90%;
    border-radius: 0.2rem;
    padding: 0.4rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    transition: 0.5s ease-in-out;
    box-shadow: 0 3px 10px #00000055;
    .avatar {
      img {
        height: 3rem;
      }
    }
    .name {
      h3 {
        color: black;
      }
    }
  }
  .selected {
    box-shadow: 0 4px 10px #0016DA77;
  }
}

.current-user {
  background-color: #0d0d30;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  .avatar {
    img {
      height: 4rem;
      max-inline-size: 100%;
    }
  }
  .name {
    h2 {
      color: white;
    }
  }
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    gap: 0.5rem;
    .name {
      h2 {
        font-size: 1rem;
      }
    }
  }
}
`;
