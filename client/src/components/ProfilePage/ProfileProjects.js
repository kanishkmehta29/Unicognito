import React, { useState, useEffect } from "react";
import { addtoPortfolio } from "../../fetch/profile";
import { fetchProfileFromServer } from "../../fetch/profile";
import { getMyProjects, deleteProject } from "../../fetch/projects";

const ProfileProjects = () => {
  const [hover, setHover] = useState(false);
  const [userProjects, setUserProjects] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [user, setUser] = useState();

  const handleDeleteProject = (projectId) => {
    deleteProject(projectId)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };


  const handleHover = () => {
    setHover(!hover);
  };

  const handleAddToPortfolio = (projectId) => {
    addtoPortfolio(projectId)
      .then((res) => {
        setPortfolio(res.data.portfolio)
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProfileFromServer(sessionStorage.getItem("user"))
      .then((res) => {
        setUser(res)
        setPortfolio(res.portfolio)
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getMyProjects().then((response) => {
      const setGetMyProj = response.data.projectArray;
      console.log(setGetMyProj);
      if (setGetMyProj) {
        setUserProjects(setGetMyProj);
        console.log(userProjects);
      } else {
        console.log("Projects data is null or undefined");
      }
    });
  }, []);

  // console.log(projects);

  // const arr = [];
  // for (let i = 0; i < projects.length; i++) {
  //   console.log(projects[i]._id);
  //   arr.push(projects[i]._id);
  // }

  // console.log(arr);

  return (
    <>
      {userProjects &&
        userProjects.map((project, index) => (
          <div className="md:my-[3vh] my-[1vh] md:w-[31vw] md:h-[48vh] h-[40vh] w-[60vw] min-h-fit flex justify-center items-center">
            <div
              key={index}
              className="flex flex-col justify-between md:w-[28vw] md:h-[48vh] w-[85vw] min-h-fit
            transition-all duration-500 hover:md:w-[31vw] hover:md:h-[52vh] hover:w-[90vw] hover:pb-4 border overflow-hidden rounded-xl shadow-lg"
              onMouseEnter={handleHover}
              onMouseLeave={handleHover}
            >
              <div className="object-cover object-center w-full flex flex-col gap-2 "
                    onClick={()=> window.location.href=`/projectView?id=${project._id}`}>
                <div className="row-span-7">
                  <div className="relative">
                    <img
                      src={(project.mediaArray.length > 0 && project.mediaArray[0]) || "./images/demoPic.png"}
                      alt="Card"
                      className="w-full md:max-h-[26.67vh] max-h-[20vh] object-cover"
                    />
                    <div className="absolute flex bottom-2 right-2 bg-[#FFFFFFCC] rounded-lg py-[5px] px-[4px]">
                      <div className="flex flex-col justify-center items-center border-r-[1px] border-black">
                        <img
                          src="./images/upvote.svg"
                          alt="Upvote"
                          className="w-[3.5] h-3 mx-2"
                        />
                        <div className="text-[0.55rem]">{project.likes.length}</div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <img
                          src="./images/downvote.svg"
                          alt="Upvote"
                          className="w-[3.5] h-3 mx-2"
                        />
                        <div className="text-[0.55rem]">
                          {project.dislikes.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-content overflow-hidden mt-2 px-2">
                  <h2 className="card-title text-[#0016DA] text-[0.9rem] font-bold">
                    {project.title}
                  </h2>
                  <div
                    className={`transition-all duration-500 text-wrap text-[0.875rem] text-gray-500 ${hover ? "line-clamp-3" : "line-clamp-2"
                      }`}
                  >
                    {project.description}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mx-3 items-center mb-2">
                <div className="w-[100%] flex justify-between text-[0.875rem] gap-1">
                <div className="flex gap-3 items-center">
                    <div className="flex gap-1">
                      <img
                        src="./images/star.svg"
                        alt="Description"
                        className="object-cover object-center w-[1.25rem] h-[1.25rem]"
                      />
                      {project.rating.toFixed(1)}
                    </div>
                    <img
                        src='./images/delete.svg'
                        className="object-cover object-center w-[1.25rem] h-[1.25rem]"
                        onClick={() => handleDeleteProject(project._id)}
                      />
                </div>          
                  {portfolio && portfolio.includes(project._id) ?
                    <div
                      onClick={() => handleAddToPortfolio(project._id)}
                      className="bg-white text-[#0016DA] border-[#0016DA] border-2 font-semibold px-4 py-2 rounded-full hover:cursor-pointer"
                    >
                      Remove from Portfolio
                    </div>
                    :
                    <div
                      onClick={() => handleAddToPortfolio(project._id)}
                      className="bg-[#0016DA] text-white font-semibold px-4 py-2 rounded-full hover:cursor-pointer"
                    >
                      Add to Portfolio
                    </div>

                  }
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default ProfileProjects;
