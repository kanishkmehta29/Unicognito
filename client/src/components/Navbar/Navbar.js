import React, { useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";

function Tab(props) {
  return (
    <NavLink
      to={props.to}
      activeClassName="active"
      className="grid grid-cols-12 md:w-full py-2 px-2 md:px-0 md:py-2 md:mb-2 rounded-full md:rounded-none"
    >
      <div className="col-span-12 md:col-span-4 flex items-center">
        <img
          src={`/images/${props.img}.png`}
          alt="Description"
          className="mx-auto ml-auto mr-[10%] object-cover object-center w-[1.25rem] h-[1.25rem]"
        />
      </div>
      <div className="md:col-span-8 hidden md:block">{props.name}</div>
    </NavLink>
  );
}

function Navbar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTop, setIsTop] = useState(true);

  const handleHover = () => {
    setIsExpanded(true);
  };

  const handleLeave = () => {
    setIsExpanded(false);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsTop(scrollTop === 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`md:h-[full] md:max-w-[25rem] z-[500] fixed min-w-[12.5rem] transition-all duration-700 md:top-0 md:left-0 bottom-0 left-0
            transform bg-white border-r-[1px] drop-shadow-lg w-full ${
              isExpanded || isTop ? "md:w-[25vw]" : "md:w-[20vw]"
            }`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className="pt-[2vh] text-center hidden md:flex items-center justify-center gap-2">
        <Link to="/feed" className="flex items-center justify-center gap-2 text-2xl font-bold hover:opacity-80 transition-all cursor-pointer">
          <img src="/images/logo.png" alt="Logo" className="h-6 w-6" />
          Unicognito
        </Link>
      </div>
      <div className="w-full">
        <div className="md:pt-[10vh] px-10 md:px-0 py-[2vh] items-center align-center text-xl text-[#424242] flex md:justify-normal justify-between md:flex-col">
          <Tab to="/feed" name="Home" img="home" />
          <Tab to="/courseReview" name="Course Reviews" img="courses" />
          <Tab to="/communities" name="Communities" img="group" />
          <Tab to="/discussion" name="Discussions" img="questions" />
          <Tab to="/search" name="Search" img="search" />
          <Tab to="/community" name="Chat" img="messenger" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;