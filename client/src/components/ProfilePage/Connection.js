import React, { useState, useEffect } from "react";
import { fetchProfileFromServer, removeConnection } from "../../fetch/profile";

function ProfileInfo({
  name,
  rollNo,
  branch,
  profilePic,
  connection,
  onRemove,
}) {
  const handleRemoveConnection = async () => {
    removeConnection(connection._id)
      .then((res) => {
        console.log("Connection removed!");
        onRemove(connection._id); // Notify parent component to remove this connection
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    connection.visible && (
      <div className="w-[50vw] mb-[1rem] flex items-center shadow-xl p-6 bg-white rounded-lg hover:bg-gray-50 transition duration-300 overflow-x-hidden">
        <img
          src={profilePic || "/images/defaultThumbnail.jpeg"}
          alt="Profile"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-gray-600">{`Roll No: ${rollNo}`}</p>
          <p className="text-gray-600">{`Branch: ${branch}`}</p>
        </div>
        {/* Button for removing connection */}
        <button
          onClick={handleRemoveConnection}
          className="ml-auto bg-transparent hover:bg-[#0016DA] text-[#0016DA] font-semibold hover:text-white py-2 px-4 border border-[#0016DA] hover:border-transparent rounded"
        >
          Remove Connection
        </button>
      </div>
    )
  );
}

function Connection() {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    fetchProfileFromServer(sessionStorage.getItem("user"))
      .then((res) =>
        setConnections(
          res.connections.map((conn) => ({ ...conn, visible: true }))
        )
      )
      .catch((err) => console.log(err));
  }, []);

  const removeConnectionById = (connectionId) => {
    setConnections(
      connections.map((conn) =>
        conn._id === connectionId ? { ...conn, visible: false } : conn
      )
    );
  };

  return (
    <div className="p-4 overflow-y-auto">
      {connections.map((profile, index) => (
        <ProfileInfo
          connection={profile}
          key={index}
          name={profile.name}
          rollNo={profile.rollNo}
          branch={profile.branch}
          profilePic={profile.profilePic}
          onRemove={removeConnectionById}
        />
      ))}
    </div>
  );
}

export default Connection;
