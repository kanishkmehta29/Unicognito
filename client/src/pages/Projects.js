import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar/Navbar";
import Topbar from "../components/Navbar/Topbar";
import Project from "../components/Projects/MainProject";
import { getProjects } from "../fetch/projects";
import AddProject from "../components/Projects/addProject";
import { Link } from "react-router-dom";
import { Autocomplete, Chip, TextField } from "@mui/material";

function Projects() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredFilteredProjects, setFilteredFilteredProjects] = useState([]);
  const [isAddProject, setIsAddProject] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionForMUI, setSelectedOptionForMUI] = useState({
    id: "time",
    title: "Time",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const sortList = [
    { id: "likes", title: "Likes" },
    { id: "views", title: "Views" },
    { id: "comments", title: "No. of Comments" },
    { id: "rating", title: "Rating" },
    { id: "time", title: "Time" },
  ];

  useEffect(() => {
    getProjects()
      .then((res) => {
        res.data.sort(
          (a, b) => new Date(b.timeOfPost) - new Date(a.timeOfPost)
        );
        setProjects(res.data);
        setFilteredProjects(res.data);
        setFilteredFilteredProjects(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    let temp = [...filteredFilteredProjects];
    if (selectedOption === "likes") {
      temp.sort((a, b) => b.likes.length - a.likes.length);
    } else if (selectedOption === "views") {
      temp.sort((a, b) => b.views - a.views);
    } else if (selectedOption === "comments") {
      temp.sort((a, b) => b.commentsId.length - a.commentsId.length);
    } else if (selectedOption === "rating") {
      temp.sort((a, b) => b.rating - a.rating);
    } else if (selectedOption === "time") {
      temp.sort((a, b) => new Date(b.timeOfPost) - new Date(a.timeOfPost));
    }
    setFilteredFilteredProjects(temp);
  }, [selectedOption, filteredProjects]);

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
    <div className="flex flex-col md:flex-row bg-[#F8F8F8] -min-w-screen min-h-[100vh] pb-[5rem]">
      <Navbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        select={{ projects: true }}
        className="z-[999]"
      />
      <div
        className={`flex justify-center rounded-xl items-center z-[999]
      w-screen h-screen bg-[#00000022] fixed top-0 left-0
      ${isAddProject ? " block" : " hidden"}`}
      >
        <AddProject setIsAddProject={setIsAddProject} />
      </div>
      <div className="w-screen">
        <Topbar
          title="Projects"
          projects={projects}
          setFilteredProjects={setFilteredProjects}
        />
        <div
          className="mt-[2rem] min-h-[2rem] z-[100] relative"
          ref={filterRef}
        >
          <div
            className={`bg-white p-4 absolute mt-[2rem] right-[4vw] shadow-xl min-[200px] w-[50vw] md:w-[20vw] lg:w-[20vw] ml-auto ${
              isFilterOpen ? "block" : "hidden"
            }`}
          >
            <Autocomplete
              className="mt-4"
              options={sortList}
              defaultValue={sortList[4]}
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
            />
          </div>
          <img
            src="images/filter.svg"
            alt="arrow"
            className={`w-[1.7rem] h-[1.7rem] ml-auto mr-[5vw]`}
            onClick={handleFilter}
          />
        </div>
        <div className="w-full">
          <Project projects={filteredFilteredProjects} />
        </div>
      </div>
      <div
        className="fixed flex justify-center shadow-lg items-center gap-2 md:bottom-2 md:right-2 bottom-[11vh] right-2
                     w-[180px] h-[45px] bg-[#FFFFFF] rounded-full "
        onClick={() => setIsAddProject(true)}
      >
        <img
          src="images/add.svg"
          alt="add"
          className={`h-[50%] md:h-[65%]`}
        />
        <div className="text-[#0016DA] text-[0.875rem] font-semibold">
          Add a Project
        </div>
      </div>
    </div>
  );
}

export default Projects;
