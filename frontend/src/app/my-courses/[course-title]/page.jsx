"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/session";
import { useParams, useRouter } from "next/navigation";
import { MdOutlineAssignment } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { LuBookText } from "react-icons/lu";
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
          "https://backend-itfest-production.up.railway.app/api/courses/",
          {
            headers: {
              Authorization: session.value,
            },
          }
        );
        const courses = await response.json();
        console.log("courses :", courses);

        const matchCourse = courses.find(
          (course) => course.title === courseTitle
        );

        const data = await fetch(
          `https://backend-itfest-production.up.railway.app/api/courses/${matchCourse.id}`,
          {
            headers: {
              Authorization: session.value,
            },
          }
        );

        const result = await data.json();
        console.log("result :", result);
        setCourse(result);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  // Handler untuk quiz button
  const handleQuizClick = (module) => {
    setSelectedModule(module);
    setShowQuizModal(true);
  };

  // Handler untuk konfirmasi quiz
  const handleQuizConfirm = () => {
    setShowQuizModal(false);
    router.push(`/my-courses/${course.title}/${selectedModule.id}/quiz`);
  };

  // Handler untuk close modal
  const handleModalClose = () => {
    setShowQuizModal(false);
    setSelectedModule(null);
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen text-white py-[3.5rem] md:px-20 px-[1.5rem]">
      <div className="flex justify-between items-center mb-4 md:max-w-[65%]">
        <h1 className="text-4xl font-bold">{course?.title}</h1>
      </div>
      <p className="mb-4 md:max-w-[75%] opacity-80 text-lg md:my-0">
        {course?.description}
      </p>

      <div className="space-y-[3rem] mt-[1rem]">
        {course?.modules?.map((module, index) => (
          <div key={module?.id}>
            <div className="flex md:flex-row flex-col items-center justify-between my-[2rem] mb-[1.5rem] md:space-y-0 space-y-[1.5rem]">
              <h2 className="text-2xl font-semibold md:max-w-[70%] w-full">
                {module?.title}
              </h2>

              <button
                className="btn bg-[#4F9CF9] text-white px-6 py-2 rounded-full flex items-center space-x-[0.1rem] md:w-auto w-full hover:bg-[#4F9CF9]/70 transition-colors"
                onClick={() => handleQuizClick(module)}
              >
                <MdOutlineAssignment className="text-lg" />
                <span>Quiz</span>
              </button>
            </div>

            {module.materials.map((material) => (
              <div
                key={material?.id}
                className="bg-[#0F171B] p-5 rounded-[10px] mb-[1.5rem] flex items-center"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-[1.5rem]">
                    <div className="bg-[#131F24] p-3 text-xl rounded-lg">
                      <LuBookText />
                    </div>
                    <Link
                      href={`/my-courses/${course.title}/${module.id}/${material.id}`}
                    >
                      <p className="font-medium text-lg hover:text-white/70">
                        {material?.title}
                      </p>
                    </Link>
                  </div>

                  {material.is_done === 1 && (
                    <FaRegCircleCheck className="text-3xl opacity-50" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal dengan selectedModule yang benar */}
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
