"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const CompletionPage = ({ courseTitle }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
          {
            headers: {
              Authorization:
                "Bearer 11|Nqsy2o4Ei9p5RoraFBG8ucW1FpJRUd8fhBfqYFMM4cc13856",
            },
          }
        );

        const courses = await res.json();
        const selectedCourse = courses.find(
          (course) => course.title === courseTitle
        );

        if (!selectedCourse) return;

        const allMaterials = selectedCourse.modules.flatMap(
          (mod) => mod.materials
        );
        const total = allMaterials.length;
        const done = allMaterials.filter((mat) => mat.is_done === 1).length;

        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
        setProgress(percent);
      } catch (err) {
        console.error("Failed to fetch course data:", err);
      }
    };

    fetchCourseData();
  }, [courseTitle]);

  return (
    <div className="py-[2rem] flex flex-col md:flex-row px-4 md:px-32 space-y-6 md:space-y-0 md:space-x-8">
      <img
        src="/images/completion.png"
        className="w-60 h-60 md:w-130 md:h-130"
        alt="Completion Illustration"
      />
      <div className="space-y-[0.7rem] pt-[2rem]">
        <h1 className="text-4xl font-bold">Congratulations !</h1>
        <p>
          Keep up your good work and continue learning — you're on the right
          track!
        </p>

        <div className="space-y-[1rem] mt-[1.5rem]">
          {/* level progression (contoh dummy 50%) */}
          <div>
            <label className="font-semibold text-lg">Level Progress</label>
            <div className="flex justify-between mt-[0.5rem] text-sm">
              <span>1</span>
              <span>2</span>
            </div>
            <progress
              className="progress w-full"
              value={50}
              max={100}
            ></progress>
          </div>

          {/* course progression berdasarkan API */}
          <div>
            <label className="font-semibold text-lg">Course Progress</label>
            <div className="flex justify-between mt-[0.5rem] text-sm">
              <span>{progress}%</span>
              <span>100%</span>
            </div>
            <progress
              className="progress w-full"
              value={progress}
              max={100}
            ></progress>
          </div>

          <Link href={`/my-courses/${courseTitle}`}>
            <button className="bg-[#3B82F6] py-3 px-4 rounded-lg cursor-pointer hover:bg-[#3B82F6]/70 mt-[1.2rem] text-white">
              Back to Course
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;
