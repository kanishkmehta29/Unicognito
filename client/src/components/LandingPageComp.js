import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FullpageContainer,
  FullpageSection,
} from "@shinyongjun/react-fullpage";
import "@shinyongjun/react-fullpage/css";

const LandingPageComp = () => {
  const handleSignIn = async () => {
    console.log("clicked");
    window.location.href = "/signin";
  };
  const fullPageOptions = {
    scrollSensitivity: 5,
    touchSensitivity: 5,
    scrollSpeed: 5000,
    hideScrollBars: true,
    enableArrowKeys: true,
  };
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <FullpageContainer
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      onBeforeChange={(beforeIndex, afterIndex) => {
        console.log("before", beforeIndex, afterIndex);
      }}
      onAfterChange={(beforeIndex, afterIndex) => {
        console.log("after", beforeIndex, afterIndex);
      }}
    >
      <FullpageSection>
        <div id="section1">
          <div className="flex flex-col mt-6">
            <div className="flex w-full justify-center items-center  pt-6 h-[7vh] md:h-[5vh]">
            </div>
            <div className="h-[90vh] z-0 pl-0 md:pl-16 flex flex-col md:flex-row items-center md:items-auto justify-between ">
              <div className="flex flex-1 flex-col px-[6vw] w-[90vw] md:w-[60vw] justify-center mt-8 md:mt-0 items-center gap-[20px]">
                <h1 className="text-[28px] md:text-[48px] font-[500] text-center">
                  Your anonymous campus network for{" "}
                  <span className="text-[#4942E4]">candid exchanges</span>
                </h1>
                <p className="text-[16px] md:text-[18px] text-center text-[#000000]">
                  Express yourself freely, share honest course reviews, and engage in authentic discussions 
                  without judgment in our anonymous, spam-free academic community.
                </p>
                <div className="button flex items-center justify-center gap-3 bg-[#4942E4] text-[white] font-medium w-[120px] p-[10px] border-none rounded-lg cursor-pointer">
                  <Link onClick={handleSignIn}>
                    <span>Sign In</span>
                  </Link>
                </div>
              </div>
              <div className="  w-[60vw] md:w-[40vw] flex items-center h-full">
                <img
                  className="w-[100%] md:w-[75%] object-contain md:my-auto md:mr-auto"
                  src="/images/world.png"
                  alt="logo"
                />
              </div>
            </div>
          </div>
        </div>
      </FullpageSection>
      <FullpageSection>
        <div id="section2">
          <div className="h-[100vh] z-0 md:pr-16 w-[100%] md:w-auto  text-black flex justify-center md:justify-between  flex-col md:flex-row items-center md:items-auto">
            <div className="  w-[100vw] md:w-[35vw] justify-center md:justify-auto flex items-center md:h-full mt-7 md:mt-0">
              <img
                className="w-[50vw] md:w-[80%] object-contain md:ml-[6vw] md:mb-[40vh] "
                src="/images/community.png"
                alt="logo"
              />
            </div>
            <div className="flex flex-1 flex-col  mt-[5vh] md:mt-[30vh] px-[6vw] w-[100vw] md:w-[65vw] justify-center items-center gap-[20px]">
              <h1 className="text-[28px] md:text-[48px] font-[500]">
                Discover and <span className="text-[#4942E4]">connect</span>
              </h1>
              <p className="text-[16px] md:text-[18px] text-center">
                Engage in lively discussions, share insights and connect with
                like minded individuals from around the college.
              </p>
            </div>
          </div>
        </div>
      </FullpageSection>
      <FullpageSection>
        <div id="section3">
          <div className="h-[100vh] z-0 flex md:justify-between flex-col md:flex-row items-center md:items-auto">
            <div className="flex flex-1 flex-col mt-[5vh] md:mt-[25vh] px-[6vw]  w-[100vw] md:w-[50vw] justify-start items-center gap-[20px]">
              <h1 className="text-[28px] md:text-[48px] font-[500]">
                Share <span className="text-[#4942E4]">anonymously</span>
              </h1>
              <p className="text-[16px] md:text-[18px] text-center">
                Express your honest opinions without revealing your identity, ensuring a safe space for candid feedback on courses and campus experiences.
              </p>
            </div>
            <div className="  w-[100vw] md:w-[60vw] justify-center mt-[-5vh] md:mt-[0vh] md:justify-auto flex flex-col">
              <img
                className="w-[100%] object-contain md:mt-[35vh] my-auto px-[6vw]"
                src="/images/project.png"
                alt="logo"
              />
            </div>
          </div>
        </div>
      </FullpageSection>
      <FullpageSection>
        <div id="section4">
          <div className="h-[100vh] w-[100vw] z-0 flex justify-between secondElement  md:justify-between flex-col md:flex-row items-center md:items-auto">
            <div className="flex flex-1 flex-col mt-[5vh] md:mt-[25vh] px-[6vw]  w-[100vw] md:w-[50vw] justify-start items-center gap-[20px]">
              <h1 className="text-[28px] md:text-[48px] font-[500]">
                Learn and <span className="text-[#4942E4]">Grow</span>
              </h1>
              <p className="text-[16px] md:text-[18px] text-center">
                Access a diverse range of course reviews, learn from others’
                experiences, and make informed decisions about your educational
                journey.
              </p>
            </div>
            <div className="w-[100vw] md:w-[60vw] flex flex-col">
              <img
                className="w-[100%] object-contain md:mt-[35vh] m-auto px-[6vw]"
                src="https://cdn.dribbble.com/users/8810021/screenshots/17382086/media/89884526259d7b9a58d06fe5faac8010.gif"
                alt="logo"
              />
            </div>
          </div>
        </div>
      </FullpageSection>
      <FullpageSection>
        <div id="section5">
          <div className="h-[100vh] z-0 md:pr-16 text-black flex md:justify-between flex-col md:flex-row items-center md:items-auto md:w-[100vw]">
            <div className="w-[100vw] md:w-[35vw] flex items-center md:h-full justify-center md:justify-auto">
              <img
                className="w-[70%] md:w-[70%] object-contain md:mt-[15vh] md:ml-[6vw] md:mb-[40vh]"
                src="/images/shield.png"
                alt="logo"
              />
            </div>
            <div className="flex flex-1 flex-col mt-[5vh] md:mt-[25vh] px-[6vw]  w-[100vw] md:w-[50vw] justify-center items-center gap-[20px]">
              <h1 className="text-[28px] md:text-[48px] font-[500] flex justify-center md:justify-normal">
                Stay Safe and <span className="text-[#4942E4]">Focussed</span>
              </h1>
              <p className="text-[16px] md:text-[18px] text-center">
                Our advanced spam filtering model ensures a respectful and a
                productive environment for all users
              </p>
            </div>
          </div>
        </div>
      </FullpageSection>
      <FullpageSection>
        <div id="section6">
          <div className="h-[100vh] z-0 md:pr-16 text-black flex justify-between md:justify-between flex-col md:flex-row items-center md:items-auto">
            <div className=" w-[100vw] md:w-[35vw] flex items-center md:h-full justify-center md:justify-auto">
              <img
                className="w-[70%] md:w-[90%] object-contain mt-[5vh] md:ml-[2vw] md:mb-[40vh]"
                src="/images/robo.png"
                alt="logo"
              />
            </div>
            <div className="flex flex-1 flex-col mt-[5vh] md:mt-[25vh] px-[6vw]  w-[100vw] md:w-[50vw] justify-center items-center gap-[20px]">
              <h1 className="text-[28px] md:text-[48px] font-[500] flex justify-center md:justify-normal">
                Personalized <span className="text-[#4942E4]">Experience</span>
              </h1>
              <p className="text-[16px] md:text-[18px] text-center">
                Discover relevant courses and discussions tailored to your academic interests and major, enhancing your educational journey.
              </p>
            </div>
          </div>
        </div>
      </FullpageSection>
      <FullpageSection>
        <div id="section7">
          <div className="h-[100vh] w-[100vw] z-0 flex justify-between secondElement flex-col md:flex-row items-center md:items-auto mt-5 md:mt-0">
            <div className="flex flex-1 flex-col t-[5vh] md:mt-[25vh] px-[6vw] w-[100vw] md:w-[50vw] justify-start items-center gap-[20px]">
              <h1 className="text-[28px] md:text-[48px] font-[500] flex justify-center md:justify-normal">
                Authentic <span className="text-[#4942E4]">Community</span>
              </h1>
              <p className="text-[16px] md:text-[18px] text-center">
                Join a genuine academic community where honesty is valued and protected by anonymity, creating a space where real experiences are shared.
              </p>
            </div>
            <div className="w-[100vw] md:w-[50vw] flex flex-col justify-center md:justify-auto">
              <img
                className="w-[70%]  mt-[5vh] md:mt-[30vh] md:ml-[10vw] object-contain m-auto"
                src="/images/characters.png"
                alt="logo"
              />
            </div>
          </div>
        </div>
      </FullpageSection>
      <FullpageSection isAutoHeight>
        <footer className="bg-[#D4D7F9] w-full flex-col gap-2 text-white text-[20px] font-[700] h-[15vh] flex justify-center items-center">
        </footer>
      </FullpageSection>
    </FullpageContainer>
  );
};

export default LandingPageComp;
