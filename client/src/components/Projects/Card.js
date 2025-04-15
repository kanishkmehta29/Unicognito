import React from "react";

const Card = (props) => {
  const [hover, setHover] = React.useState(false);
  const project = props.project;
  const handleHover = () => {
    setHover(!hover);
  };
  if (!project) return <div>Error Loading</div>;
  console.log(project.mediaArray.length > 0 && project.mediaArray[0]);
  return (
    <div
      className="md:my-[3vh] ml-4 my-[1vh] md:w-[31vw] md:h-[52vh] w-[80vw] h-[40vh] min-h-fit flex justify-center items-center"
      onClick={() => {
        window.location.href = `/projectView?id=${project._id}`;
      }}
    >
      <div
        className="flex flex-col justify-between md:w-[28vw] md:h-[48vh] h-[35vh] w-[80vw] min-h-fit
            transition-all duration-500 hover:md:w-[31vw] hover:md:h-[52vh] hover:h-[40vh] hover:w-[70vw] hover:pb-4 overflow-hidden rounded-xl shadow-lg"
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
      >
        <div className="object-cover object-center w-full flex flex-col gap-2 ">
          <div className="row-span-7">
            <div className="relative">
              <img
                src={
                  (project.mediaArray.length > 0 && project.mediaArray[0]) ||
                  "./images/demoPic.png"
                }
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
              className={`transition-all duration-500 text-wrap text-[0.875rem] text-gray-500 ${
                hover ? "line-clamp-3" : "line-clamp-2"
              }`}
            >
              {project.description}
            </div>
          </div>
        </div>
        <div className="flex justify-between mx-3 items-center mb-2">
          <div className="flex text-[0.875rem] gap-1">
            <img
              src="./images/star.svg"
              alt="Description"
              className="object-cover object-center w-[1.25rem] h-[1.25rem]"
            />
            {project.rating.toFixed(1)}
          </div>
          <div className="flex gap-2">
            {project.creatorId && project.creatorId.length > 0 ? (
              project.creatorId.map((user, index) => {
                user.profilePic =
                  user.profilePic || "images/defaultThumbnail.jpeg";
                return (
                  <a
                    href={`http://localhost:3000/profile`}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={index}
                  >
                    <div className="md:max-w-[50px] md:max-h-[50px] md:w-[2vw] md:h-[2vw] md:min-w-[20px] md:min-h-[20px] h-[45px] w-[45px] shadow rounded-full overflow-hidden">
                      <img
                        src={user.profilePic}
                        className="md:max-w-[50px] md:max-h-[50px] md:w-[2vw] md:h-[2vw] md:min-w-[20px] md:min-h-[20px] h-[45px] w-[45px]"
                      />
                    </div>
                  </a>
                );
              })
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
