import React from "react";
// import axios from "axios";
import HeaderImg from "./HeaderImg";
import OtherUsersProfileCard from "./OtherUsersProfileCard";
import OtherProfileHeroSection from "./OtherProfileHeroSection";
import ProfilePageTopBar from "./ProfileTopBar";
import ProfileNavBar from "./ProfileNavBar";

function OtherProfilePageComp(props) {
  const user = props.user;

  return (
    <div className="bg-[#F8F8F8] h-full">
      <ProfilePageTopBar title={"Unicognito"}/>
      <ProfileNavBar other={true} />
      <HeaderImg />
      <OtherUsersProfileCard user={user} />
      <OtherProfileHeroSection user={user} />
    </div>
  );
}

export default OtherProfilePageComp;
