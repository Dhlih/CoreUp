"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import { useParams } from "next/navigation";
import Link from "next/link";
import CompletionMaterial from "@/components/CompletionMaterial";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const ModuleMaterial = () => {
  const [moduleData, setModuleData] = useState(null);
  const [materialData, setMaterialData] = useState(null);
  const [session, setSession] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const moduleId = Number(params["module-id"]);
  const materialId = Number(params["material-id"]);
  const courseTitle = decodeURIComponent(params["course-title"]);
  const router = useRouter();

  useEffect(() => {
    const fetchMaterial = async () => {
      const session = await getSession();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/`,
          {
            headers: {
              Authorization: session.value,
            },
          }
        );
        const courses = await response.json();

        const course = courses.find((c) => c.title === courseTitle);
        if (!course) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${course.id}`,
          {
            headers: {
              Authorization: session.value,
            },
          }
        );
        const fullCourse = await res.json();

        const module = fullCourse.modules.find((m) => m.id === moduleId);
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

    fetchMaterial();
  }, []);

  const finishMaterial = async () => {
    if (materialData.is_done) {
      router.push(`/my-courses/${courseTitle}`);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/material/${materialData.id}/done`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.value,
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

  if (loading) return <Loading />;

  return isFinished ? (
    <CompletionMaterial courseTitle={courseTitle} />
  ) : (
    <div className="py-[4rem] md:px-30 px-[1.5rem] text-white">
      <Link
        href={`/my-courses/${courseTitle}`}
        className="text-[#60A5FA] hover:underline"
      >
        <h2 className="text-lg font-medium">{moduleData.title}</h2>
      </Link>

      <h1 className="text-4xl font-bold mb-[1.5rem] mt-[1rem] max-w-[85%]">
        {materialData.title}
      </h1>

      <p className="text-lg opacity-80 md:max-w-[95%] w-full">
        {materialData.content || "Konten belum tersedia."}
      </p>

      <div className="flex justify-end mt-[3rem] md:mr-[5rem]">
        <button
          onClick={finishMaterial}
          className="btn bg-[#3B82F6] hover:bg-[#3B82F6]/70 py-6 px-8 rounded-lg"
        >
          Finish Reading
        </button>
      </div>
    </div>
  );
};

export default ModuleMaterial;
