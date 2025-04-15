import React, { useState } from "react";
import { TextField } from "@mui/material";

const EditProfileCard = ({ onClose }) => {
  const [name, setName] = React.useState("");
  const [thumb, setThumb] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [review, setReview] = React.useState("");

  return (
    <form
      className="w-full p-6 bg-white rounded-lg shadow-md text-gray-700"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col md:flex-row w-full gap-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-indigo-500 overflow-hidden">
              <img
                src="/images/defaultThumbnail.jpeg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0">
              <button
                type="button"
                className="w-8 h-8 bg-indigo-600 text-white rounded-full flex justify-center items-center hover:bg-indigo-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="flex flex-col md:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-2 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">Aditya Lambat</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Roll No.</p>
              <p className="font-medium">230150002</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium">B-Tech</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">Data Science and Artificial Intelligence</p>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              className="w-full p-3 rounded-md bg-white border border-gray-300 outline-none resize-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about yourself..."
              rows="4"
            />
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-end gap-3 mt-4">
        <button 
          type="button" 
          onClick={onClose} 
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditProfileCard;
