"use client";

import { LuClock2 } from "react-icons/lu";
import OptionCard from "@/components/OptionCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import ErrorAlert from "@/components/ErrorAlert";
import { useRouter } from "next/navigation";

const Quiz = () => {
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [quizzes, setQuizzes] = useState("");
  const [module, setModule] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); // 2 menit

  const params = useParams();
  const courseTitle = decodeURIComponent(params["course-title"]);
  const moduleId = Number(params["module-id"]);
  const router = useRouter();

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime < 1) {
          clearInterval(timer);
          router.push(`/my-courses/${courseTitle}`);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format MM:SS
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      const session = await getSession();

      try {
        const response = await fetch(
          "https://backend-itfest-production.up.railway.app/api/courses/",
          {
            headers: {
              Authorization: session.value,
            },
          }
        );
        const courseList = await response.json();
        const selectedCourse = courseList.find(
          (item) => item.title === courseTitle
        );

        const detailResponse = await axios.get(
          `https://backend-itfest-production.up.railway.app/api/courses/${selectedCourse.id}`,
          {
            headers: {
              Authorization: session.value,
            },
          }
        );

        const moduleList = detailResponse.data.modules;
        const selectedModule = moduleList.find(
          (mod) => mod.id === Number(moduleId)
        );

        setModule(selectedModule);
        setQuizzes(selectedModule?.quizzes ?? []);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [indexQuestion]);

  const updateIndexQuestion = (isIncrease) => {
    const currentIndex = indexQuestion + 1;

    if (isIncrease) {
      if (currentIndex <= quizzes.length - 1) {
        setIndexQuestion(indexQuestion + 1);
      }
    } else {
      if (indexQuestion > 0) {
        setIndexQuestion(indexQuestion - 1);
      }
    }
  };

  return (
    <div className="py-[3rem] pb-[5rem] px-20">
      {/* time's up alert */}
      {timeLeft < 1 && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <ErrorAlert text="Waktu habis!" />
        </div>
      )}

      <div>
        <div className="flex md:flex-row flex-col md:items-center justify-between">
          <Link
            href={`/my-courses/${courseTitle}`}
            className="text-[#60A5FA] hover:underline "
          >
            <h2 className="text-xl font-medium">{module.title}</h2>
          </Link>
        </div>

        {/* question */}
        <div className="flex items-center justify-between">
          <p className="md:text-3xl text-2xl font-bold md:max-w-[80%] w-full leading-12 md:text-left text-center mt-[0.5rem]">
            {indexQuestion + 1}. {quizzes[indexQuestion]?.question}
          </p>

          {/* timer */}
          <div className="rounded-full bg-[#4F9CF9] py-2 px-6 flex items-center space-x-[0.5rem] text-white">
            <LuClock2 />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* answer option */}
        <div className="mt-[1.5rem] rounded-md space-y-[2rem]">
          {JSON.parse(quizzes[indexQuestion]?.options || "[]").map(
            (option, idx) => (
              <OptionCard key={idx} optionText={option} />
            )
          )}
        </div>
      </div>

      <div
        className={`flex items-center mt-[2rem] ${
          indexQuestion > 0 ? "justify-between" : "justify-end"
        }`}
      >
        {indexQuestion > 0 && (
          <button
            className="btn bg-[#3B82F6] p-6 rounded-lg text-white"
            onClick={() => updateIndexQuestion(false)}
          >
            Previous
          </button>
        )}
        <button
          className="btn bg-[#3B82F6] p-6 rounded-lg text-white"
          onClick={() => updateIndexQuestion(true)}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default Quiz;
