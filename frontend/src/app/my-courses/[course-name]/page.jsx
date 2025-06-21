"use client";

import { useState, useEffect } from "react";
import { getSession } from "@/lib/session";
import { useParams } from "next/navigation";
import { MdOutlineAssignment } from "react-icons/md";
import Link from "next/link";

export default function CoursePage() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const courseName = decodeURIComponent(params["course-name"]);

  useEffect(() => {
    console.log(courseName);

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
          (course) => course.title === courseName
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
        setCourse(result);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen  text-white py-[3.5rem] px-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">{course?.title}</h1>
      </div>
      <p className=" mb-4 max-w-[75%] opacity-80">{course?.description}</p>

      {course?.modules?.map((module, index) => (
        <div key={module?.id}>
          <div className="flex justify-between items-center my-[2rem] mb-[1.5rem]">
            <h2 className="text-xl font-semibold ">{module?.title}</h2>

            <button className="btn bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-[0.1rem] ">
              <MdOutlineAssignment />
              <span>Quiz</span>
            </button>
          </div>

          {module.materials.map((material) => (
            <div
              key={material?.id}
              className="bg-[#0F171B] p-4 rounded-[10px] mb-[1.5rem] flex items-center"
            >
              <img
                src="/images/icon_book.webp"
                alt="Icon Buku"
                className="w-6 h-6 mr-4"
              />

              <Link
                href={`/my-courses/${course.title}/${module.title}/${module.id}/${material.id}`}
              >
                <p className="font-medium hover:text-white/70">
                  {material?.title}
                </p>
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
