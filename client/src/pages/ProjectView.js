import React from 'react';
import Topbar from '../components/Navbar/Topbar';
import HeaderCard from '../components/ProjectView/HeaderCard';
import CommentCard from '../components/ProjectView/CommentCard';
import { useEffect, useRef, useState } from 'react';
import { addCollab, getProject,postComment } from '../fetch/projects';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { Input } from '@mui/base';
import fetchProfilesBySearch from '../fetch/search';
import ProfileUnit from '../components/Search/ProfileUnit';
import Loader from '../components/Loader';

function ProjectView() {
    const [comment,setComment] = useState('');
    const [isAddComment, setIsAddComment] = useState(false);
    const [isAddCollab, setIsAddCollab] = useState(false);
    const [collab,setCollab] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('id');
        if (!encodedData) {
          window.location.href = '/404';
        }        
        getProject(encodedData).then((response) => {
            setProject(response.data);
        }).catch((error) => {
            console.error('Error fetching project:', error);
        });
    }, []);

    function NextArrow(props) {
        const { className, style, onClick } = props;
        return (
          <div
            className={className}
            style={{
                ...style,
                display: "flex",
                background: "darkgray",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "1.5px",
                borderRadius: "50%",
            }}
            onClick={onClick}
          />
        );
      }
      
    function PrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    display: "flex",
                    background: "darkgray",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "1.5px",
                    borderRadius: "50%",
                }}
                onClick={onClick}
            />
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />        
    };

    const handleAddComment = () => {
      setIsLoading(true);
      postComment(project._id, comment).then((res) => {
        if (res.data.message) {
          alert(res.data.message);
          setIsLoading(false);
          return;
        }
        console.log('Comment Posted:  ', res);
        window.location.reload();
      });
    };

    useEffect(() => {
        fetchProfilesBySearch(collab).then((res) => {
          res = res.filter((profile) => {
            let flag = true;
            project.creatorId.forEach((creator) => {
              if(profile._id === creator._id){
                flag = false;
              }
            });
            return flag;
          });
          console.log(res);
          setProfiles(res);
        }).catch((error) => {
          console.error('Error fetching collab:', error);
        });
      },[collab, project]);

    const handleAddCollab = (profile) => {
      addCollab(project._id, profile._id).then((res) => {
        window.location.reload();
      }).catch((error) => {
        console.log(error)
      });
    }
  return (
    <div className="w-screen flex flex-col justify-center items-center mb-[10vh]">
      {isLoading && <Loader /> }
      <div className="fixed top-0 left-0 right-0 z-50">
        <Topbar title="Project" isSearchDisabled={true} />
      </div>
      <HeaderCard project={project} isAddCollab={isAddCollab} setIsAddCollab={setIsAddCollab}/>
      <div className={`${isAddCollab ? 'block' : 'hidden'} flex justify-center rounded-xl items-center z-[999] 
      w-screen h-screen bg-[#00000022] fixed top-0 left-0`}>
        <div className='bg-white rounded-xl shadow-lg'>
          <div className='flex justify-end'>
            <img src="images/close.svg" alt="close" className='w-[2vw] m-2 hover:cursor-pointer' onClick={() => setIsAddCollab(false)} />
          </div>
          <div className='flex flex-col gap-4 items-center p-8'>
            <div className='text-[#0016DA] text-[1.5rem] font-bold'>
              Add Collaborator
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
      <div className="flex flex-col gap-2 w-[80vw] mt-[20vh] pl-[2vw]">
        <div className="text-[1.5rem] text-[#0016DA] font-bold">
          Description
        </div>
        <div className="">
          <div className="text-[#000000] text-[1rem] mt-2">
            {project.description}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-[80vw] mt-[10vh] pl-[2vw]">
        <div className="text-[1.5rem] text-[#0016DA] font-bold">
          Project Showcase
        </div>
        {project.mediaArray && project.mediaArray.length!==0 ? 
          <Slider {...settings}>
          {project.mediaArray.map((url, index) => (
            <div className="flex justify-center w-fit">
              {(url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".svg")) ? (
                <img
                  src={url}
                  alt={`${index + 1}`}
                  className="slider-image"
                />
              ) : (
                <video controls>
                  <source src={url} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </Slider> 
        : 
        <div className="text-[#000000] text-[1rem] mt-2">No media to display</div>}

      </div>
      <div className="flex flex-col gap-2 w-[80vw] mt-[10vh] pl-[2vw]">
        <div className="text-[1.5rem] text-[#0016DA] font-bold">
          Comments
        </div>
        <div className="flex flex-col gap-2 w-[80vw] mt-[1vh] pl-[2vw]">
          <div className="text-[1rem] font-bold mb-[3vh]"
                onClick = {() => setIsAddComment(!isAddComment)}>
            Add Comment {isAddComment ? '▲' : '▼'}
          </div>
          <div className={`flex flex-col ml-[2vw] ${isAddComment ? 'block' : 'hidden'}`}>
            <TextField
              label="Add comment here"
              variant="outlined"
              className='w-[70vw]'
              multiline
              rows={4}
              size="small"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              className='enabled:bg-[#0016DA] bg-[#0016DA]'
              disabled={comment===""}              
              onClick={handleAddComment}
              style={{width: "70vw  " }}
            >
              Submit
            </Button>
          </div>
        </div>        
        <div>
          {(project.commentsId && project.commentsId.length!==0) ? project.commentsId.map((comment, index) => (
            <CommentCard key={index} comments={comment} />
          )):
          <div className="text-[#000000] text-[1rem] mt-2">
            No comments yet
          </div>}
        </div>
      </div>
    </div>
  );
}

export default ProjectView;
