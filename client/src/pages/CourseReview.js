import { useState, useRef } from "react";
import React, { useEffect } from "react";
import CourseReviewComp from "../components/CourseReview/CourseReviewComp";
import DialogBox from "../components/CourseReview/Dialogue";
import Topbar from "../components/Navbar/Topbar";
import Navbar from "../components/Navbar/Navbar";
import { getCourseReviews } from "../fetch/courseReview";
import AddCourse from "../components/CourseReview/addCourse";
import { Autocomplete, Chip, TextField } from "@mui/material";

// import { useLocation } from 'react-router-dom';
// import { MainDiscussion } from '../components/DiscussionForum/MainDiscussion'
// import getDiscussions from '../fetch/discussions'
// import Topbar from '../components/Navbar/topbar';
// import topbar from './topbar';

const CourseReview = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [courseReviews, setCourseReviews] = useState([]);
  const [filteredCourseReviews, setFilteredCourseReviews] = useState([]);
  const [filteredFilteredCourseReviews, setFilteredFilteredCourseReviews] =
    useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [unit, setUnit] = useState([]);
  const [isAddCourse, setIsAddCourse] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOptionForMUI, setSelectedOptionForMUI] = useState({
    id: "time",
    title: "Time",
  });

  const sortList = [
    { id: "enrolled", title: "Enrolled" },
    { id: "views", title: "Views" },
    { id: "comments", title: "No. of Comments" },
    { id: "time", title: "Time" },
  ];
  console.log("Sort for:", selectedOption);

  useEffect(() => {
    getCourseReviews()
      .then((res) => {
        setCourseReviews(res.data);
        setFilteredCourseReviews(res.data);
        setFilteredFilteredCourseReviews(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const openAdd = () => {
    setIsAddCourse(true);
    setDialogOpen(false);
  };

  useEffect(() => {
    setUnit([]);
    for (let i = 0; i < filteredFilteredCourseReviews.length; i++) {
      setUnit((prev) => [
        ...prev,
        <CourseReviewComp courseReview={filteredFilteredCourseReviews[i]} />,
      ]);
    }
  }, [filteredFilteredCourseReviews]);

  const dialogMessage = {
    title: "Instruction",
    body: "Explore and share your thoughts on an existing course! If it's not there, simply click 'Add New Course' to start the conversation.",
  };

  const handleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  useEffect(() => {
    let temp = [...filteredFilteredCourseReviews];
    if (selectedOption === "enrolled") {
      temp.sort(
        (a, b) => b.enrolledStudents.length - a.enrolledStudents.length
      );
    } else if (selectedOption === "views") {
      temp.sort((a, b) => b.views - a.views);
    } else if (selectedOption === "comments") {
      temp.sort((a, b) => b.commentsId.length - a.commentsId.length);
    } else if (selectedOption === "time") {
      temp.sort((a, b) => new Date(b.timeOfPost) - new Date(a.timeOfPost));
    }
    setFilteredFilteredCourseReviews(temp);
  }, [selectedOption, filteredCourseReviews]);

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
    <div className="flex flex-col md:flex-row bg-[#F8F8F8] md:w-full min-h-[100vh] pb-[5rem] md:pb-[2rem]">
      <Navbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div
        className="fixed z-20 flex justify-center shadow-lg items-center gap-2 md:bottom-2 md:right-2 bottom-[11vh] right-2
                    w-[180px] h-[45px] bg-[#FFFFFF] rounded-full "
        onClick={() => setDialogOpen(true)}
      >
        <img src="images/add.svg" alt="add" className={`w-[20%] h-[50%]`} />
        <div className="text-[#0016DA] text-[0.875rem] font-semibold">
          Add Review
        </div>
      </div>
      <div
        className={`flex justify-center rounded-xl items-center z-[999] 
      w-screen h-screen bg-[#00000022] fixed top-0 left-0
      ${isAddCourse ? " block" : " hidden"}`}
      >
        <AddCourse setIsAddCourse={setIsAddCourse} />
      </div>
      <div className="w-full">
        <Topbar
          title="Course Review"
          courseReviews={courseReviews}
          setFilteredCourseReviews={setFilteredCourseReviews}
        />
        <div
          className="mt-[2rem] min-h-[2rem] z-[200] relative"
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
        <div className="md:ml-[27vw] pl-[10%] pr-[10%] md:pl-[3%] md:pr-[10%] ">
          <DialogBox
            isOpen={isDialogOpen}
            onAccept={openAdd}
            onClose={closeDialog}
            message={dialogMessage}
          />
          {unit}
        </div>
      </div>
    </div>
  );
};

export default CourseReview;
