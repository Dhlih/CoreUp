"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import { useParams } from "next/navigation";
import Link from "next/link";

const ModuleMaterial = () => {
  const [course, setCourse] = useState("");

  const params = useParams();
  const materialId = Number(params.id);
  const courseName = decodeURIComponent(params["course-name"]);

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
        console.log("courses :", courses);

        const matchCourse = courses.find(
          (course) => course.title === courseName
        );

        console.log("match course :", matchCourse.id);

        const data = await fetch(
          `https://backend-itfest-production.up.railway.app/api/courses/${matchCourse.id}`,
          {
            headers: {
              Authorization: session.value,
            },
          }
        );

        const results = await data.json();
        console.log("resutls :", results);

        const moduleId = results.modules.find(
          (module) => module.id === materialId
        );
        console.log("module id : ", moduleId);
        setCourse(moduleId);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchMaterial();
  }, []);

  return (
    <div className=" py-[3rem] px-20">
      <Link href={`/my-courses/${course.title}`} className="bg-red-400">
        <h2 className="text-xl font-medium">
          Modul 1: Dasar-dasar Public Speaking
        </h2>
      </Link>

      <h1 className="text-4xl font-bold mb-[1.5rem] mt-[1rem]">
        Apa itu Public Speaking ?
      </h1>

      <p className="text-lg opacity-80 md:max-w-[95%] w-full">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum consequatur
        vel voluptas earum eligendi veniam, natus cupiditate iusto tenetur
        tempora necessitatibus accusamus sunt, dolores hic recusandae aliquam
        fuga dignissimos reprehenderit blanditiis assumenda odit? Saepe expedita
      </p>

      <p className="text-lg mt-[2rem] opacity-80 md:max-w-[95%] w-full">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A praesentium
        repellendus odio quae dolorem quo earum. Harum consequatur ex aperiam
        illum, illo deleniti nam dolor perspiciatis molestiae ducimus omnis quos
        nisi, possimus consequuntur deserunt repellat dignissimos magnam fugiat
        quod aliquam? Amet perferendis
      </p>

      <div className="flex justify-end mt-[3rem] md:mr-[5rem]">
        <button className="btn bg-[#3B82F6] hover:bg-[#3B82F6]/70 py-6 px-8  rounded-lg ">
          Finish
        </button>
      </div>
    </div>
  );
};

export default ModuleMaterial;
