import React, { useEffect } from "react";
import { DiscussionSection } from "./DiscussionSection";
import { getDiscussions } from "../../fetch/discussions";

const MainDiscussion = (props) => {
  const discussions = props.discussions;
  return (
    <div className="md:ml-[27vw] pl-[7%] pt-4 md:pl-[3%] pr-auto mb-[6rem]">
      <DiscussionSection discussions={discussions} />
    </div>
  );
};

export { MainDiscussion };
