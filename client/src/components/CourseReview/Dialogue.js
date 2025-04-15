// DialogBox.js
import React from "react";

const  DialogBox = ({ isOpen, onClose, message, onAccept }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center bg-[#00000099] justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-2xl mx-auto my-6">
            {/* Modal content */}
            <div className="relative flex flex-col w-full bg-white border-2 border-gray-300 rounded-md shadow-lg outline-none focus:outline-none">
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                <h3 className="text-xl font-semibold">{message.title}</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <div className="flex justify-center items-center text-black h-6 w-6 text-2xl outline-none focus:outline-none ">
                    ×
                  </div>
                </button>
              </div>
              {/* Body */}
              <div className="relative p-6 flex-auto">{message.body}</div>
              {/* Footer */}
              <div className="flex items-center justify-end p-6">
                <div>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={onClose}
                  >
                    Search existing course
                  </button>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={onAccept}
                  >
                    Add new course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DialogBox;
