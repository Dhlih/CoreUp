"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TbTargetArrow } from "react-icons/tb";
import { RiProgress5Line } from "react-icons/ri";
import { getCourseProgress } from "@/lib/progress";

const CompletionMaterial = ({
  courseTitle,
  previousProgress,
  courseId,
  isDone,
}) => {
  const [progress, setProgress] = useState(0);

  const countProgressIncrease = async () => {
    const currentProgress = await getCourseProgress();
    const progressIncrease = currentProgress[courseId] - previousProgress;
    console.log("increase : ", progressIncrease);
    return progressIncrease;
  };

  useEffect(() => {
    const result = countProgressIncrease();
    setProgress(result);
  }, []);

  return (
    <div className="py-[2rem] flex flex-col items-center px-[1.5rem] md:px-32 space-y-6 md:space-y-0 md:space-x-8">
      <img
        src="/images/completion.png"
        className="w-[24rem] h-[24rem]"
        alt="Completion Illustration"
      />
      <h1 className="text-3xl font-bold mt-[-1rem]">Lesson Completed</h1>

      <div className="flex items-center md:gap-[2rem] gap-[1rem] md:mt-[2rem] mt-[0.8rem]">
        <div className="bg-[#0F171B] p-6 rounded-md md:w-[200px] w-[170px]">
          <span>Course Progress</span>
          <div className="flex items-center space-x-[0.5rem] mt-[1rem]">
            <RiProgress5Line className="text-3xl" />
            <h3 className="font-semibold text-2xl">+ {progress}%</h3>
          </div>
        </div>

        <div className="bg-[#0F171B] p-6 rounded-md md:w-[200px] w-[170px]">
          <span>EXP Gain</span>

          <div className="flex items-center space-x-[0.5rem] mt-[1rem]">
            <TbTargetArrow className="text-3xl" />
            <h3 className="font-semibold text-2xl ">+ {isDone ? 0 : 50}</h3>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end md:mt-[7rem] mt-[1rem] ">
        <Link href={`/my-courses/${courseTitle}`} className="md:w-auto w-full">
          <button className="bg-[#3B82F6] md:w-auto w-full py-3 px-6 rounded-lg cursor-pointer hover:bg-[#3B82F6]/70 mt-[1.2rem] text-white">
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CompletionMaterial;
