"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/session";
import { useParams, useRouter } from "next/navigation";
import { MdOutlineAssignment } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { LuBookText } from "react-icons/lu";
import Loading from "@/components/Loading";
import Link from "next/link";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function CoursePage() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const params = useParams();
  const router = useRouter();
  const courseTitle = decodeURIComponent(params["course-title"]);

  useEffect(() => {
    const fetchCourse = async () => {
      const session = await getSession();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/`,
          {
            headers: {
              Authorization: session.token,
            },
          }
        );

        const courses = await response.json();
        const matchCourse = courses.find(
          (course) => course.title === courseTitle
        );

        setCourse(matchCourse);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  const handleQuizClick = (module) => {
    setSelectedModule(module);
    setShowQuizModal(true);
  };

  const handleQuizConfirm = () => {
    setShowQuizModal(false);
    router.push(`/my-courses/${course.title}/${selectedModule.id}/quiz`);
  };

  const handleModalClose = () => {
    setShowQuizModal(false);
    setSelectedModule(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white py-[3.5rem] md:px-20 px-[1.5rem] animate-pulse">
        <div className="h-10 w-1/2 bg-gray-700 rounded mb-4"></div>
        <div className="h-6 w-3/4 bg-gray-700 rounded mb-6"></div>

        <div className="space-y-8">
          {[...Array(3)].map((_, idx) => (
            <div key={idx}>
              <div className="h-8 bg-gray-700 w-3/4 rounded mb-4"></div>
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-15 bg-gray-800 rounded mb-3"></div>
              ))}
              <div className="h-12 bg-blue-700/70 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white py-[3.5rem] md:px-20 px-[1.5rem]">
      <div className="flex justify-between items-center mb-4 md:max-w-[80%]">
        <h1 className="text-2xl md:text-4xl font-bold">{course?.title}</h1>
      </div>
      <p className="mb-4 opacity-80 text-lg md:my-0 ">{course?.description}</p>

      <div className="space-y-[3rem] mt-[1rem]">
        {course?.modules?.map((module, index) => (
          <div key={module?.id}>
            <div className="flex md:flex-row flex-col items-center justify-between my-[2rem] mb-[1.5rem] md:space-y-0 space-y-[1.5rem]">
              <h2 className="text-2xl font-semibold md:max-w-[70%] w-full">
                {module?.title}
              </h2>
            </div>

            {module.materials.map((material) => (
              <Link
                key={material?.id}
                href={`/my-courses/${course.title}/${module.id}/${material.id}`}
                className="block bg-[#0F171B] p-4 rounded-[10px] mb-[1.5rem] hover:bg-[#1c2a31] transition"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-[1.5rem]">
                    <div className="bg-[#131F24] p-3 text-xl rounded-lg">
                      <LuBookText />
                    </div>
                    <p className="font-medium  text-white">{material?.title}</p>
                  </div>

                  {material.is_done === 1 && (
                    <FaRegCircleCheck className="text-3xl opacity-50" />
                  )}
                </div>
              </Link>
            ))}
            <button
              className=" bg-[#4F9CF9] text-white p-3 mt-[1.5rem] rounded-lg flex items-center justify-center space-x-[0.5rem] cursor-pointer  w-full hover:bg-[#4F9CF9]/70 transition-colors"
              onClick={() => handleQuizClick(module)}
            >
              <MdOutlineAssignment className="text-2xl" />
              <span className="text-lg"> Quiz</span>
            </button>
          </div>
        ))}
      </div>

      {showQuizModal && selectedModule && (
        <ConfirmationModal
          onClose={handleModalClose}
          onConfirm={handleQuizConfirm}
          description={`Klik lanjutkan untuk mengambil quiz "${selectedModule.title}"?`}
          confirmText={"Lanjutkan"}
          confirmBg={"bg-[#2563EB]"}
        />
      )}
    </div>
  );
}
