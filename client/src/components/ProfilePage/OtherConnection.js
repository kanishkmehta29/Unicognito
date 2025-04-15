import React, { useState, useEffect } from "react";

function OtherConnection(props) {
  const user = props.user;
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("connections", user.connections);
    setData(user.connections);
    console.log("hello: ", data);
  }, [user.connections, data]);

  return (
    <div className="p-4 overflow-y-auto" style={{ maxHeight: "100vh" }}>
      {data.map((data) => (
        <div className="w-[50vw] mb-[1rem] flex items-center shadow-xl p-6 bg-white rounded-lg hover:bg-gray-50 transition duration-300 overflow-x-hidden">
          <img
            src={data.profilePic || "../images/defaultThumbnail.jpeg"}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-bold">{data.name}</p>
            <p className="text-gray-600">{`Roll No: ${data.rollNo}`}</p>
            <p className="text-gray-600">{`Branch: ${data.branch}`}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OtherConnection;
