"use client";

import { IoIosSearch } from "react-icons/io";
import ModulCard from "@/components/ModulCard";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "@/components/SuccessAlert";
import { getSession } from "@/lib/session";
import Loading from "@/components/Loading";
import { getCourseProgress } from "@/lib/progress";

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState(0);

  useEffect(() => {
    const loadCoursesWithProgress = async () => {
      try {
        const session = await getSession();

        // fetch courses
        const courseRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
          {
            headers: {
              Authorization: session.value,
            },
          }
        );
        // hitung progress berdasarkan 2 data di atas
        const progressCourses = getCourseProgress();
        setCourses(courseRes.data);
        setCourseProgress(progressCourses);
      } catch (err) {
        console.error("Gagal memuat data course dan quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCoursesWithProgress();
  }, [isDeleted]);

  useEffect(() => {
    console.log(courseProgress);
  }, []);

  // Filter courses berdasarkan courseTitle
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(courseTitle.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-[#131F24] md:px-20 px-[1.5rem] py-[3rem]">
        <h1 className="font-bold text-4xl mb-[2rem]">My Courses</h1>
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-[#0F171B] rounded-2xl p-6 mb-[1.5rem] space-y-4"
          >
            <div className="h-6 bg-gray-700 rounded w-1/3" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
            <div className="h-3 bg-gray-800 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#131F24] md:px-20 px-[1.5rem] py-[3rem]">
      {isDeleted && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <Alert text="Berhasil dihapus" />
        </div>
      )}

      <div className="flex md:flex-row flex-col md:items-center justify-between">
        <h1 className="font-bold text-4xl md:mb-0 mb-[1.5rem]">My Courses</h1>

        {/* input field */}
        <div className="rounded-full bg-[#0F171B] flex items-center space-x-[1rem] p-3  text-sm  ">
          <IoIosSearch className="opacity-60 text-lg" />
          <input
            type="text"
            placeholder="Enter course title..."
            className="rounded-full outline-none bg-transparent text-white text-sm"
            onChange={(evt) => setCourseTitle(evt.target.value)}
            value={courseTitle}
          />
        </div>
      </div>

      {/* main content */}
      <div className="mt-[2rem] space-y-[2.5rem]">
       
   {courses.length === 0 ? (
  <div className="flex items-center justify-center h-[50vh]">
    <p className="text-gray-400 text-center text-lg">
      Haven't created a course yet.
    </p>
  </div>
) : filteredCourses.length === 0 ? (
  <div className="flex items-center justify-center h-[50vh]">
    <p className="text-gray-400 text-center text-lg">
      No course matched your search.
    </p>
  </div>
) : (
  filteredCourses.map((course, idx) => (
    <ModulCard
      title={course.title}
      key={idx}
      id={course.id}
      setIsDeleted={setIsDeleted}
      moduleAmount={course.modules.length}
      courseProgress={courseProgress[course.id] || 0}
    />
  ))
)}
      </div>
    </div>
  );
};

export default MyCourse;
