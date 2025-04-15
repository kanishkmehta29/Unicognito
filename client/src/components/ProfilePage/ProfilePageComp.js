import React from "react";
// import axios from "axios";
import HeaderImg from "./HeaderImg";
import ProfileCard from "./ProfileCard";
import ProfileHeroSection from "./ProfileHeroSection";
import ProfilePageTopBar from "./ProfileTopBar";
import ProfileNavBar from "./ProfileNavBar";
import EditProfile from "./editProfile";

function ProfilePageComp(props) {
  const user = props.user;
  const [isEdit, setIsEdit] = React.useState(false);

  return (
    <div className="bg-[#F8F8F8] h-full">
      <ProfilePageTopBar title={"Unicognito"}/>
      <ProfileNavBar />
      <HeaderImg />
      <ProfileCard user={user} setIsEdit={setIsEdit}/>
      <ProfileHeroSection user={user} />
      <div className={`flex justify-center rounded-xl items-center z-[999]
      w-screen h-screen bg-[#00000022] fixed top-0 left-0
      ${isEdit ? ' block' : ' hidden'}`}>
        <EditProfile setIsEdit={setIsEdit} />
      </div>
    </div>
  );
}

export default ProfilePageComp;
