"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import ErrorAlert from "@/components/ErrorAlert";
import Loading from "@/components/Loading";

export default function CreateCourse() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setAlertModal] = useState(false);
  const [name, setName] = useState("");
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const session = await getSession();

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: session.value,
          },
        });

        const data = await res.json();

        setLoading(false);

        setName(data.data.name || "User");

        // Simulasikan progress (bisa diatur sesuai kebutuhan)
        let val = 0;
        const interval = setInterval(() => {
          val += 10;
          setProgressValue(val);
          if (val >= 100) {
            clearInterval(interval);
            setCreateLoading(false);
          }
        }, 200);
      } catch (error) {
        console.error("Gagal ambil profil:", error);
        setCreateLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    const session = await getSession();

    if (!topic || !level || !language) {
      alert("Harap isi semua field.");
      return;
    }

    setCreateLoading(true);
    setProgressValue(40); // Munculkan progress awal

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.value,
          },
          body: JSON.stringify({ topic, level, language }),
        }
      );

      const data = await response.json();
      console.log("📦 Data respons dari server:", data);

      if (response.ok) {
        setProgressValue(80); // Tambahkan progress saat sukses dapat respons
        setLoading(false);

        // Delay sedikit sebelum set 100%
        setTimeout(() => {
          setProgressValue(100);
          setTimeout(() => {
            setTopic("");
            setLevel("");
            setLanguage("");
            router.push(`/my-courses/${data.course.title}`);
          }, 500); // jeda 500ms untuk memberikan waktu user melihat 100%
        }, 300); // transisi ke 100%
      } else {
        setCreateLoading(false);
        setAlertModal(true);
      }
    } catch (error) {
      showAlertModal(true);
      setCreateLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="py-[4rem]  text-white md:px-20 px-[1.5rem] ">
      {createLoading ? (
        <div className="flex flex-col justify-center items-center space-y-[1rem]">
          {showAlertModal && <ErrorAlert text={"Terjadi sebuah kesalahan"} />}

          <img src="/images/studying.svg" alt="" className="w-90 h-90" />

          <h1 className="font-semibold text-xl mt-[-2rem]">Loading...</h1>
          <div className="flex flex-col items-center w-full space-y-4 ">
            <progress
              className="progress  w-[30%]"
              value={progressValue}
              max={100}
            ></progress>
            <p className=" text-gray-300">{progressValue}%</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl md:mx-auto space-y-6 ">
          <div>
            <p className="text-lg md:text-xl font-medium mb-1">Hello {name}!</p>
            <h1 className="text-2xl md:text-4xl font-bold">
              What do you want to learn?
            </h1>
            <img src="/images/studying2.svg" alt="" />
          </div>

          <input
            type="text"
            placeholder="Enter topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#0F171B] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <input
            type="text"
            placeholder="Enter language..."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#0F171B] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-4 rounded-lg bg-[#0F171B] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          >
            <option value="" disabled>
              Select level
            </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <div className="flex justify-end ">
            <button
              onClick={handleSubmit}
              className="btn py-6 px-4 bg-[#3B82F6] mt-[0.5rem] text-white rounded-md hover:bg-[#3B82F6]/70 transition font-semibold text-sm"
              disabled={createLoading}
            >
              Create Roadmap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
