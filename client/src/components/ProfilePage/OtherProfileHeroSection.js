import React, { useState } from "react";
import Portfolio from "./Portfolio";
import OtherConnection from "./OtherConnection";

const OtherProfileHeroSection = (props) => {
  const user = props.user;

  const [card, setCard] = useState("projects");
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);

  const onCLickButton2 = () => {
    setIsActive2(!isActive2);
    setCard("connections");
    setIsActive3(false);
  };

  const onCLickButton3 = () => {
    setIsActive3(!isActive3);
    setCard("portfolio");
    setIsActive2(false);
  };

  return (
    <div className="flex flex-col gap-10  bg-[#f8f8f8] pl-[40vw]">
      <div className=" pt-[1.5rem]">
        <div className="flex gap-10">
          <button
            onClick={onCLickButton3}
            type="button"
            className={`text-black hover:bg-[#0016DA] hover:text-white font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 shadow-xl ${
              isActive3 ? "outline-none text-white bg-[#0016DA]" : ""
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={onCLickButton2}
            type="button"
            className={`text-black hover:bg-[#0016DA] hover:text-white font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 shadow-xl ${
              isActive2 ? "outline-none text-white bg-[#0016DA]" : ""
            }`}
          >
            Connection
          </button>
        </div>
      </div>
      <div className="flex">
        {card === "connections" && (
          <div className="flex flex-col">
            <OtherConnection user={user} />
          </div>
        )}
        {card === "portfolio" && <Portfolio user={user} other={true}/>}
      </div>
    </div>
  );
};

export default OtherProfileHeroSection;
