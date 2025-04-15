import React, { useEffect } from "react";
import { FeedUnit } from "./FeedUnit";

const FeedSection = (props) => {
  const [units, setUnits] = React.useState([]);
  console.log("Feed Section Rendered");

  useEffect(() => {
    setUnits([]);
    props.posts.map((post) => {
      setUnits((units) => [
        ...units,
        <FeedUnit post={post} key={units.length} />,
      ]);
    });
  }, [props.posts]);

  return (
    <div className="flex flex-col items-center pb-[5rem] md:pb-[1rem] flex flex-col   md:pl-[25vw] mt-[0]">
      {units}
    </div>
  );
};

export { FeedSection };
