import React, { useEffect, useState } from "react";
// import axios from "axios";
import { fetchProfileFromServer } from "../../fetch/profile";
const ProfileName = (props) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = props.user;

  useEffect(() => {
    setData(user);
    setLoading(false);
  }, [user]);

  if (loading) return "Loading...";
  if (error) return "Error!";

  return (
    <div className="flex flex-col items-center pt-[1rem] ">
      <span className="text-xl font-bold text-[#131313dd]">
        {data && (data.name || data.name)}
      </span>
      <span className=" text-[#9d9a9a] text-center min-h-[10vh] mt-[0.8rem] text-sm font-medium text-center px-[1rem] line-clamp-4">
        {data && data.description}
      </span>
      {/* Removed personal information display (rollNo, program, branch) to maintain anonymity */}
    </div>
  );
};

export default ProfileName;
