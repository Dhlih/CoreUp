"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TbTargetArrow } from "react-icons/tb";
import { RiProgress5Line } from "react-icons/ri";
import { getCourseProgress } from "@/lib/progress";

const CompletionQuiz = ({
  courseTitle,
  title,
  correctAnswers,
  previousProgress,
  courseId,
}) => {
  const [progress, setProgress] = useState(0);
  const accuracy = (correctAnswers / 5) * 100;

  const countProgressIncrease = async () => {
    const currentProgress = await getCourseProgress();
    const progressIncrease = currentProgress[courseId] - previousProgress;
    return progressIncrease;
  };

  useEffect(() => {
    const result = countProgressIncrease();
    setProgress(result);
  }, []);

  return (
    <div className="py-[2rem] flex flex-col items-center  px-[1.5rem] md:px-32 space-y-6 md:space-y-0 md:space-x-8">
      <img
        src="/images/completion.png"
        className="w-[24rem] h-[24rem]"
        alt="Completion Illustration"
      />
      <h1 className="text-3xl font-bold mt-[-1rem]">Quiz Completed</h1>

      <div className="flex items-center md:gap-[2rem] gap-[1rem] md:mt-[2rem] mt-[0.8rem]">
        <div className="bg-[#0F171B] md:p-6 p-4 rounded-md md:w-[200px] w-[160px]">
          <span>Course Progress</span>
          <div className="flex items-center space-x-[0.5rem] mt-[1rem]">
            <RiProgress5Line className="md:text-3xl text-2xl" />
            <h3 className="font-semibold md:text-2xl text-xl">+ {progress}%</h3>
          </div>
        </div>

        <div className="bg-[#0F171B] md:p-6 p-4 rounded-md md:w-[200px] w-[160px]">
          <span>Accuracy</span>

          <div className="flex items-center space-x-[0.5rem] mt-[1rem]">
            <TbTargetArrow className="md:text-3xl text-2xl" />
            <h3 className="font-semibold md:text-2xl text-xl ">{accuracy}%</h3>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end md:mt-[7rem] mt-[1rem] ">
        <Link href={`/my-courses/${courseTitle}`}>
          <button className="bg-[#3B82F6] py-3 px-6 md:w-auto rounded-lg cursor-pointer hover:bg-[#3B82F6]/70 mt-[1.2rem] text-white">
            Continue
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CompletionQuiz;
