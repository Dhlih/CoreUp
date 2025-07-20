import React from "react";
import { PiWarningCircle } from "react-icons/pi";

const ConfirmationModal = ({
  onClose,
  onConfirm,
  description,
  confirmText,
  confirmBg,
}) => {
  return (
    <div
      className="fixed inset-0 z-10 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen px-2 pt-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-[#212C31]  rounded-xl shadow-xl rtl:text-right bg sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div className="flex items-center justify-center text-7xl">
              <PiWarningCircle />
            </div>

            <div className="mt-2 text-center">
              <h3
                className="text-xl font-medium leading-6 text-gray-800 capitalize dark:text-white"
                id="modal-title"
              >
                Are you sure?
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-[90%] mx-auto">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-5 sm:flex sm:items-center sm:justify-center">
            <div className="sm:flex sm:items-center ">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800  focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className={`w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform ${confirmBg}  rounded-md sm:w-auto sm:mt-0 hover:${confirmBg}/70 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 cursor-pointer`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
