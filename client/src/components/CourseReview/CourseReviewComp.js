import image from "../../assets/ok.png";
import React from "react";

const CourseReviewComp = (props) => {
  const courseReview = props.courseReview;
  const coursePic = courseReview.coursePic;

  return (
    <div
      className="flex items-center w-[80vw] md:w-[65vw] mt-5 mb-5 h-[23vh] lg:h-[30vh] md:h-[28vh] rounded-xl shadow-lg bg-white hover:scale-[1.03] transition-all duration-300 overflow-hidden"
      onClick={() =>
        (window.location.href = `/courseView?id=${courseReview._id}`)
      }
    >
      <div className="w-2/5 md:w-1/3 lg:w-1/4 flex overflow-hidden">
        <img
          src={coursePic || image}
          alt="course pic"
          className="h-[28vh] w-[100%]"
        />
      </div>
      <div className="w-3/4 py-[20px] px-[20px] flex flex-col h-full justify-between">
        <div>
          <h1
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              paddingBottom: "10px",
            }}
          >
            {courseReview.title}
          </h1>
          <p>{courseReview.description}</p>
        </div>
        <div className="ml-auto pt-4">
          <div className="relative right-6 flex gap-1 align-center items-center">
            <img
              src={`images/comment.svg`}
              alt="Description"
              className="object-cover object-center w-[1rem] h-[1rem]"
            />
            <div className="text-[0.875rem]">
              {courseReview.commentsId.length}
            </div>
            <img
              src={`images/profile.svg`}
              alt="Description"
              className="object-cover object-center w-[1rem] ml-[20px] h-[1rem]"
            />
            <div className="text-[0.875rem]">
              {courseReview.enrolledStudents.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewComp;
