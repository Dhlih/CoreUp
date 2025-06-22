"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import { useParams } from "next/navigation";
import Link from "next/link";

const ModuleMaterial = () => {
  const [moduleData, setModuleData] = useState(null);
  const [materialData, setMaterialData] = useState(null);
  const [session, setSession] = useState(null);

  const params = useParams();
  const moduleId = Number(params["module-id"]);
  const materialId = Number(params["material-id"]);
  const courseTitle = decodeURIComponent(params["course-title"]);

  useEffect(() => {
    const fetchMaterial = async () => {
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

        const course = courses.find((c) => c.title === courseTitle);

        if (!course) return;

        const res = await fetch(
          `https://backend-itfest-production.up.railway.app/api/courses/${course.id}`,
          {
            headers: {
              Authorization: session.value,
            },
          }
        );
        const fullCourse = await res.json();

        const module = fullCourse.modules.find((m) => m.id === moduleId);
        const material = module?.materials.find((mat) => mat.id === materialId);

        console.log(material);

        setModuleData(module);
        setMaterialData(material);
        setSession(session);
      } catch (error) {
        console.error("Error fetching material:", error);
      }
    };

    fetchMaterial();
  }, []);

  if (!materialData || !moduleData) {
    return <div className="text-white px-20 py-[5rem]">Loading...</div>;
  }

  const finishMaterial = async () => {
    try {
      const response = await fetch(
        `https://backend-itfest-production.up.railway.app/api/material/${materialData.id}/done`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.value,
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-[4rem] md:px-20 px-[1.5rem] text-white">
      <Link
        href={`/my-courses/${courseTitle}`}
        className="text-[#60A5FA] hover:underline"
      >
        <h2 className="text-xl font-medium">{moduleData.title}</h2>
      </Link>

      <h1 className="text-4xl font-bold mb-[1.5rem] mt-[1rem]">
        {materialData.title}
      </h1>

      <p className="text-lg opacity-80 md:max-w-[95%] w-full">
        {materialData.content || "Konten belum tersedia."}
      </p>

      <div
        className="flex justify-end mt-[3rem] md:mr-[5rem]"
        onClick={finishMaterial}
      >
        <button className="btn bg-[#3B82F6] hover:bg-[#3B82F6]/70 py-6 px-8 rounded-lg">
          Finish
        </button>
      </div>
    </div>
  );
};

export default ModuleMaterial;
