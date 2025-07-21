import { LuBookMinus } from "react-icons/lu";
import { getSession } from "@/lib/session";
import ConfirmationModal from "./ConfirmationModal";
import { LuClock2 } from "react-icons/lu";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

const ModulCard = ({
  title,
  id,
  setIsDeleted,
  moduleAmount,
  courseProgress,
}) => {
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    console.log("course progress : ", courseProgress);
  }, []);

  const deleteCourse = async () => {
    const session = await getSession();

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`,
        {
          headers: {
            Authorization: session.token,
            "Content-Type": "application/json",
          },
        }
      );
      setIsDelete(false);
      setIsDeleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#0F171B] rounded-xl p-6 shadow-sm">
      {/* top side */}
      <div className="flex md:flex-row flex-col md:items-center justify-between ">
        <Link
          href={`/my-courses/${title}/`}
          className="md:max-w-[65%] w-full text-lg font-semibold "
        >
          <h3 className="hover:text-white/70 text-red md:text-xl">
            {title.length > 65 ? `${title.slice(0, 65)}...` : title}
          </h3>
        </Link>
        <div className="md:flex hidden items-center space-x-[0.5rem] text-base">
          <LuBookMinus />
          <span>{moduleAmount} Module</span>
        </div>
      </div>

      {/* bottom side */}
      <div className="flex md:flex-row flex-col items-center md:justify-between md:mt-[1.5rem] mt-[1rem] md:space-x-[2rem]">
        <div className="w-full ">
          <div className="flex items-center justify-between ">
            <span>Progress</span>
            <span>{courseProgress}%</span>
          </div>
          <progress
            className="progress w-full "
            value={courseProgress}
            max={100}
          ></progress>
        </div>

        <div className="md:w-auto w-full flex items-center justify-between md:mt-0 mt-[1.5rem]">
          <div className="flex md:hidden items-center space-x-[0.5rem] text-base">
            <LuBookMinus />
            <span>{moduleAmount}</span>
          </div>
          <div className="flex items-center md:space-x-[2rem] space-x-[0.8rem]">
            <Link href={`/my-courses/${title}`}>
              <button
                className="btn bg-[#3B82F6] md:p-6 p-4 hover:bg-[#3B82F6]/70 text-sm rounded-lg"
                onClick={() => console.log(id)}
              >
                Continue
              </button>
            </Link>

            <button
              className="btn bg-[#F43F5E] md:p-6 p-4 hover:bg-[#F43F5E]/70 text-sm rounded-lg"
              onClick={() => setIsDelete(!isDelete)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {isDelete && (
        <ConfirmationModal
          onClose={() => setIsDelete(false)}
          confirmBg={"bg-[#F43F5E]"}
          onConfirm={deleteCourse}
          confirmText={"Delete"}
          description={
            "Are you sure you want to delete? This action cannot be undone."
          }
        />
      )}
    </div>
  );
};

export default ModulCard;
