"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import { useParams } from "next/navigation";
import Link from "next/link";
import CompletionMaterial from "@/components/CompletionMaterial";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getCourseProgress } from "@/lib/progress";
import remarkGfm from "remark-gfm";

const ModuleMaterial = () => {
  const [moduleData, setModuleData] = useState(null);
  const [materialData, setMaterialData] = useState(null);
  const [session, setSession] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState("");
  const [previousProgress, setPreviousProgress] = useState(null);

  const params = useParams();
  const moduleId = Number(params["module-id"]);
  const materialId = Number(params["material-id"]);
  const courseTitle = decodeURIComponent(params["course-title"]);
  const router = useRouter();

  const getProgress = async () => {
    const previousProgress = await getCourseProgress();
    setPreviousProgress(previousProgress);
  };

  const fetchMaterial = async () => {
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

      const course = courses.find((c) => c.title === courseTitle);
      console.log("course :", course);

      if (!course) return;
      setCourseId(course.id);

      const module = course.modules.find((m) => m.id === moduleId);
      const material = module?.materials.find((mat) => mat.id === materialId);

      console.log("material :", material);

      setModuleData(module);
      setMaterialData(material);
      setSession(session);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching material:", error);
    }
  };

  useEffect(() => {
    getProgress();
    fetchMaterial();
  }, []);

  const finishMaterial = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/material/${materialData.id}/done`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.token,
          },
        }
      );

      if (response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        console.log("update data:", data);
        setIsFinished(true);
      } else {
        console.error("Gagal mengupdate material");
      }
    } catch (error) {
      console.error("Error saat finishMaterial:", error);
    }
  };

  if (loading)
    return (
      <div className="py-[4rem] md:px-30 px-[1.5rem] animate-pulse text-white space-y-4">
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        <div className="h-10 bg-gray-700 rounded w-3/4 mt-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mt-2"></div>
        <div className="h-4 bg-gray-700 rounded w-[95%] mt-2"></div>
        <div className="h-4 bg-gray-700 rounded w-[90%] mt-2"></div>
        <div className="h-4 bg-gray-700 rounded w-[90%] mt-2"></div>
        <div className="flex justify-end mt-[3rem] md:mr-[5rem]">
          <div className="h-10 w-36 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );

  return isFinished ? (
    <CompletionMaterial
      courseTitle={courseTitle}
      isDone={materialData.is_done}
      courseId={courseId}
      previousProgress={previousProgress[courseId]}
    />
  ) : (
    <div className="py-[4rem] md:px-30 px-[1.5rem] text-white">
      <Link
        href={`/my-courses/${courseTitle}`}
        className="text-[#60A5FA] hover:underline"
      >
        <h2 className="text-lg font-medium">{moduleData.title}</h2>
      </Link>

      <h1 className="text-2xl md:text-4xl font-bold mb-[1rem] mt-[1rem] max-w-[95%]">
        {materialData.title}
      </h1>

      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {materialData.content}
        </ReactMarkdown>
      </div>

      <div className="flex justify-end mt-[3rem] md:mr-[5rem]">
        <button
          onClick={finishMaterial}
          className="btn bg-[#3B82F6] hover:bg-[#3B82F6]/70 p-6 rounded-lg"
        >
          Finish Reading
        </button>
      </div>
    </div>
  );
};

export default ModuleMaterial;
