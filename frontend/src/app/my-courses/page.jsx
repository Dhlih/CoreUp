"use client";

import { IoIosSearch } from "react-icons/io";
import ModulCard from "@/components/ModulCard";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "@/components/SuccessAlert";
import { getSession } from "@/lib/session";
import Loading from "@/components/Loading";

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const session = await getSession();

      const response = await axios.get(
        "https://backend-itfest-production.up.railway.app/api/courses",
        {
          headers: {
            Authorization: session.value,
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      console.log("response :", response.data);
      setCourses(response.data);
    };
    getData();

    console.log("is Deleted", isDeleted);

    if (isDeleted) {
      const timeout = setTimeout(() => {
        setIsDeleted(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isDeleted]);

  // Filter courses berdasarkan courseTitle
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(courseTitle.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="bg-[#131F24] px-20 py-[3rem]">
      {isDeleted && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <Alert text="Berhasil dihapus" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="font-bold text-4xl ">My Courses</h1>

        {/* input field */}
        <div className="rounded-full bg-[#0F171B] flex items-center space-x-[1rem] p-3  text-sm  ">
          <IoIosSearch className="opacity-60 text-lg" />
          <input
            type="text"
            placeholder="Cari kursus saya..."
            className="rounded-full outline-none bg-transparent text-white text-sm"
            onChange={(evt) => setCourseTitle(evt.target.value)}
            value={courseTitle}
          />
        </div>
      </div>

      {/* main content */}
      <div className="mt-[2rem] space-y-[2.5rem]">
        {filteredCourses.map((course, idx) => (
          <ModulCard
            title={course.title}
            key={idx}
            id={course.id}
            setIsDeleted={setIsDeleted}
            moduleAmount={course.modules.length}
          />
        ))}
      </div>
    </div>
  );
};

export default MyCourse;
