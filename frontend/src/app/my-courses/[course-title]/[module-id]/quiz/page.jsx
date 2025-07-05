"use client";

import { LuClock2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import ErrorAlert from "@/components/ErrorAlert";
import Loading from "@/components/Loading";
import CompletionQuiz from "@/components/CompletionQuiz";
import { getCourseProgress } from "@/lib/progress";

const Quiz = () => {
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [quizzes, setQuizzes] = useState("");
  const [module, setModule] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showCompletionPage, setShowCompletionPage] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [courseId, setCourseId] = useState("");
  const [previousProgress, setPreviousProgress] = useState(null);

  const params = useParams();
  const courseTitle = decodeURIComponent(params["course-title"]);
  const moduleId = Number(params["module-id"]);
  const router = useRouter();

  // ✅ TIMER
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ Redirect ketika waktu habis
  useEffect(() => {
    if (timeLeft === 0) {
      router.push(`/my-courses/${courseTitle}`);
    }
  }, [timeLeft]);

  // ✅ Format waktu
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const fetchQuizzes = async () => {
    const session = await getSession();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/`,
        {
          headers: { Authorization: session.value },
        }
      );

      const courseList = await response.json();
      const selectedCourse = courseList.find(
        (item) => item.title === courseTitle
      );

      const detailResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${selectedCourse.id}`,
        {
          headers: {
            Authorization: session.value,
          },
        }
      );

      const moduleList = detailResponse.data.modules;
      const selectedModule = moduleList.find((mod) => mod.id === moduleId);

      setModule(selectedModule);
      setQuizzes(selectedModule?.quizzes ?? []);
      setLoading(false);
      setCourseId(selectedCourse.id);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  const getProgress = async () => {
    const previousProgress = await getCourseProgress();
    setPreviousProgress(previousProgress);
  };

  useEffect(() => {
    getProgress();
    fetchQuizzes();
  }, []);

  const updateIndexQuestion = (isIncrease) => {
    if (isIncrease && indexQuestion < quizzes.length - 1) {
      setIndexQuestion((prev) => prev + 1);
    } else if (!isIncrease && indexQuestion > 0) {
      setIndexQuestion((prev) => prev - 1);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      return;
    }

    const session = await getSession();
    const questionId = quizzes[indexQuestion].id;
    setIsSubmit(true);

    if (quizzes[indexQuestion].answer === currentAnswer) {
      setCorrectAnswers(correctAnswers + 1);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/${questionId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.value,
          },
          body: JSON.stringify({ answer: currentAnswer }),
        }
      );

      const data = await response.json();
      console.log(data.message);

      // ✅ Redirect terakhir pakai useEffect (supaya gak error)
      if (indexQuestion === quizzes.length - 1) {
        setShowCompletionPage(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startNextQuestion = () => {
    updateIndexQuestion(true);
    setCurrentAnswer("");
    setIsSubmit(false);
  };

  if (loading) return <Loading />;

  if (showCompletionPage)
    return (
      <CompletionQuiz
        courseTitle={courseTitle}
        title={"Quiz Complete!"}
        correctAnswers={correctAnswers}
        previousProgress={previousProgress[courseId]}
        courseId={courseId}
      />
    );

  return (
    <div className="py-[4rem] pb-[5rem] md:px-20 px-[1.5rem]">
      {/* ALERT waktu habis */}
      {timeLeft < 1 && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50">
          <ErrorAlert text="Waktu habis!" />
        </div>
      )}

      {showAlert && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50">
          <ErrorAlert text="Pilih jawaban!" />
        </div>
      )}

      <div>
        {/* mobile timer */}
        <div className="flex justify-end w-full md:hidden">
          <div
            className={`rounded-full bg-[#4F9CF9] py-2 px-6 flex font-medium  items-center space-x-[0.5rem] mb-[1.5rem]  ${
              timeLeft <= 30 ? "text-red-500" : "text-white"
            }`}
          >
            <LuClock2 />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex md:flex-row flex-col md:items-center justify-between">
          <Link
            href={`/my-courses/${courseTitle}`}
            className="text-[#60A5FA] hover:underline "
          >
            <h2 className="text-lg font-medium">{module.title}</h2>
          </Link>
        </div>

        {/* PERTANYAAN */}
        <div className="flex items-center justify-between">
          <p className="md:text-3xl text-2xl font-bold md:max-w-[80%] w-full mt-[0.5rem]">
            {indexQuestion + 1}. {quizzes[indexQuestion]?.question}
          </p>

          {/* TIMER */}
          <div
            className={`rounded-full bg-[#4F9CF9] py-2 px-6 md:flex hidden font-medium  items-center space-x-[0.5rem] mb-[1.5rem]  ${
              timeLeft < 30 ? "text-red-500" : "text-white"
            }`}
          >
            <LuClock2 />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* OPSI JAWABAN */}
        <div className="mt-[1.5rem] space-y-[2rem]">
          {JSON.parse(quizzes[indexQuestion]?.options || "[]").map(
            (option, idx) => (
              <div
                key={idx}
                onClick={() => !isSubmit && setCurrentAnswer(option)}
                className={`flex items-center space-x-[2rem] p-3 rounded-lg cursor-pointer ${
                  isSubmit
                    ? option === quizzes[indexQuestion].answer
                      ? "bg-[#22C55E]"
                      : option === currentAnswer
                      ? "bg-[#F43F5E]"
                      : "bg-[#0F171B]"
                    : currentAnswer === option
                    ? "bg-[#212C31]"
                    : "bg-[#0F171B]"
                }`}
              >
                <input
                  type="radio"
                  name="radio-1"
                  className="radio"
                  value={option}
                  disabled={isSubmit}
                  checked={currentAnswer === option}
                  onChange={() => setCurrentAnswer(option)}
                />
                <p className="opacity-80 p-2 rounded">{option}</p>
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex items-center mt-[2.5rem] justify-end">
        <button
          className="btn bg-[#3B82F6] p-6 rounded-lg text-white md:w-auto w-full"
          onClick={() => {
            if (!isSubmit) {
              submitAnswer();
            } else {
              startNextQuestion();
            }
          }}
        >
          {!isSubmit ? "Submit Answer" : "Lanjutkan"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
