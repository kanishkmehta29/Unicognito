import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { MainDiscussion } from "../components/DiscussionForum/MainDiscussion";
import { getDiscussions } from "../fetch/discussions";
import Navbar from "../components/Navbar/Navbar";
import Topbar from "../components/Navbar/Topbar";
import ChatBot from "../chatBot/ChatBot";
import AddDiscussion from "../components/DiscussionForum/addDiscussions";
import { Autocomplete, Chip, TextField } from "@mui/material";

const DiscussionForum = (props) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [discussions, setDiscussions] = React.useState([]);
  const [filteredDiscussions, setFilteredDiscussions] = React.useState([]);
  const [chatBot, setChatBot] = React.useState(false);
  const [isAddDiscussion, setIsAddDiscussion] = React.useState(false);
  const chatBotRef = useRef(null);
  const [selectedOption, setSelectedOption] = React.useState("");

  const sortList = [
    { id: "upvotes", title: "Upvotes" },
    { id: "views", title: "Views" },
    { id: "comments", title: "No. of Comments" },
    { id: "time", title: "Time" },
  ];

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  function handleChat() {
    setChatBot((prev) => !prev);
  }

  useEffect(() => {
    getDiscussions()
      .then((res) => {
        res.data.sort(
          (a, b) => new Date(b.postingTime) - new Date(a.postingTime)
        );
        setDiscussions(res.data);
        setFilteredDiscussions(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (chatBotRef.current && !chatBotRef.current.contains(event.target)) {
        setChatBot(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let temp = [...filteredDiscussions];
    if (selectedOption === "upvotes") {
      temp.forEach((discussion) => {
        console.log(discussion.upvotes.length);
      });
      temp.sort((a, b) => b.upvotes.length - a.upvotes.length);
      temp.forEach((discussion) => {
        console.log(discussion.upvotes.length);
      });
      console.log(temp);
    } else if (selectedOption === "views") {
      temp.sort((a, b) => b.views - a.views);
    } else if (selectedOption === "comments") {
      temp.sort((a, b) => b.comments.length - a.comments.length);
    } else if (selectedOption === "time") {
      temp.sort((a, b) => new Date(b.postingTime) - new Date(a.postingTime));
    }
    setFilteredDiscussions(temp);
  }, [selectedOption]);

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedOptionForMUI, setSelectedOptionForMUI] = React.useState({
    id: "time",
    title: "Time",
  });
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div>
        <div className="md:w-full flex flex-col md:flex-row bg-[#F8F8F8] w-screen min-h-[100vh]">
          <Navbar
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            select={{ questions: true }}
          />
          <div
            className={`flex justify-center rounded-xl items-center z-[999]
          w-screen h-screen bg-[#00000022] fixed top-0 left-0
          ${isAddDiscussion ? " block" : " hidden"}`}
          >
            <AddDiscussion setIsAddDiscussion={setIsAddDiscussion} />
          </div>
          <div className="w-full">
            <Topbar
              title="Discussion Forum"
              discussions={discussions}
              setFilteredDiscussions={setFilteredDiscussions}
            />
            <div
              className="mt-[2rem] min-h-[2rem] z-[200] relative"
              ref={filterRef}
            >
              <div
                className={`bg-white p-4 absolute mt-[2rem] right-[4vw] shadow-xl min-[200px] w-[20vw] ml-auto ${
                  isFilterOpen ? "block" : "hidden"
                }`}
              >
                <Autocomplete
                  className="mt-4"
                  options={sortList}
                  defaultValue={sortList[3]}
                  clearIcon={false}
                  getOptionLabel={(option) => option.title}
                  value={selectedOptionForMUI}
                  onChange={(e, value) => {
                    setSelectedOption(value.id);
                    setSelectedOptionForMUI(value);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip label={option.title} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Sort By"
                      placeholder="Select sort option"
                    />
                  )}
                />
              </div>
              <img
                src="images/filter.svg"
                alt="arrow"
                className={`w-[1.7rem] h-[1.7rem] ml-auto mr-[5vw]`}
                onClick={handleFilter}
              />
            </div>
            <MainDiscussion discussions={filteredDiscussions} />
          </div>
          <div
            ref={chatBotRef}
            className={`fixed flex gap-2 justify-center items-center ${
              chatBot
                ? "bottom-[33vh] right-[14vw]"
                : "md:bottom-2 md:right-2 bottom-[11vh] right-2"
            }`}
          >
            <div
              className="flex justify-center shadow-lg items-center gap-2
                          w-[140px] h-[45px] bg-[#FFFFFF] rounded-full"
              onClick={() => setIsAddDiscussion(true)}
            >
              <img
                src="images/add.svg"
                alt="add"
                className={`w-[20%] h-[50%] md:w-fit md:h-[65%] object-contain`}
              />
              <div className="text-[#0016DA] text-[0.875rem] font-semibold">
                Question
              </div>
            </div>
            <div className="flex w-[50px] h-[50px] bg-[#FFFFFF] rounded-full justify-center shadow items-center">
              <img
                src="images/chat.svg"
                alt="chat"
                className={`w-[50%] h-[50%] md:w-[65%] md:h-[65%] object-contain ${
                  chatBot ? "hidden" : "block"
                }`}
                onClick={handleChat}
              />
              <div className={`${chatBot ? "block" : "hidden"} z-[300]`}>
                <ChatBot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;
