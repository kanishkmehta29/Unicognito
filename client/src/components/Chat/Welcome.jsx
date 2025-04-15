import React from 'react';
import styled from 'styled-components';
import Robot from '../../assets/robot.gif';
import TopbarChat from './TopbarChat';

export default function Welcome({currentUser, title}) {
  return (
    <Container>
      <TopbarChat currentUser={currentUser} title={title} />
      <div className='mx-auto flex flex-col justify-center items-center'>
        <img src={Robot} alt="Robot" className='robo mx-auto'/>
        <h1 className='mx-auto text-center'>
          Welcome {currentUser && <span>{currentUser.name}!</span>}
          {!currentUser && <span>to the chat!</span>}
        </h1>
        <h3 className='mx-auto'>
          Please select a chat to start messaging!
        </h3>
      </div>
    </Container>
  )
}

const Container = styled.div`
margin-left: 25vw;
width: 75vw;
display: grid;
grid-template-rows: 8% 92%;
gap: 0.1rem;
overflow: hidden;
background-color: #F8F8F8;
.robo {
  height: 20rem;
}
span {
  color: #4e0eff;
}
`;
