import React, { useEffect, useState } from "react";
import { fetchProfileFromServer } from "../../fetch/profile";
import { putLike, putDislike } from "../../fetch/projects";

const HeaderCard = (props) => {
  console.log("Project:", props.enrolled);
  useEffect(() => {
    if (!props.project) return;
    if (!props.project.title) return;
  }, [props.project]);

  return (
    <div className="mt-[16vh] flex flex-col w-[80vw] bg-white">
      <div
        className="relative bg-[#FFFFFF] w-[80vw] z-10 flex flex-col mx-auto px-[5vw] overflow-hidden rounded-l-xl rounded-t-xl"
        style={{ boxShadow: "0px 0px 15px 0px #CCCCCC" }}
      >
        <img
          src="images/dots1.svg"
          className="absolute top-0 left-0 w-[25vw]"
          alt="dots"
        />
        <img
          src="images/dots2.svg"
          className="absolute bottom-0 right-0 w-[45.8vw] "
          alt="dots"
        />
        <img
          src="images/stars.svg"
          className="absolute ml-[5vw] bottom-0 left-0 w-[10vw] h-[10vh]"
          alt="stars"
        />
        <div className="pt-[11vh] pb-[17vh]">
          <div className="flex gap-2">
            <div className="z-20">
              {props.project.courseLink && (
                <a
                  href={
                    props.project.courseLink.startsWith("http")
                      ? props.project.githubLink
                      : `https://${props.project.courseLink}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0016DA]"
                >
                  Course Link
                </a>
              )}
            </div>
          </div>
          <div className="text-[3rem] font-bold">{props.project.title}</div>
        </div>
      </div>
      <div
        className="relative ml-auto bg-[#FFFFFF] w-[15vw] h-[2.5rem] flex gap-8 px-[5vw] overflow-hidden rounded-b-xl"
        style={{ boxShadow: "0px 0px 15px 0px #CCCCCC" }}
      >
        <div
          className={`flex justify-center w-full items-center gap-4 ${
            props.enrolled ? "text-[#0016DA]" : "text-black"
          }`}
        >
          <img src="images/profile.svg" className={`w-[2rem] h-[2rem] `} />
          <div className="text-[1.3rem]">
            {(props.project &&
              props.project.enrolledStudents &&
              props.project.enrolledStudents.length) ||
              0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCard;
