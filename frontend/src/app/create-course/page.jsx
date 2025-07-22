"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import ErrorAlert from "@/components/ErrorAlert";

export default function CreateCourse() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("");
  const [session, setSession] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [loading, setLoading] = useState(true); // Tetap gunakan untuk loading awal halaman
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const fetchProfile = async () => {
    const session = await getSession();
    console.log("session di create course", session);
    setSession(session);

    try {
      // Tidak ada simulasi progress di sini
      setTimeout(() => {
        setLoading(false); // Selesai loading awal setelah data sesi diambil
      }, 800); // Simulasi waktu loading data sesi
    } catch (error) {
      console.error("Gagal ambil profil:", error);
      setLoading(false); // Pastikan loading selesai meskipun ada error
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    const session = await getSession();

    if (!topic || !level || !language) {
      alert("Harap isi semua field.");
      return;
    }

    setCreateLoading(true);
    setProgressValue(10); // Mulai dari 10% saat mulai membuat kursus

    // Simulasi progress saat menunggu fetch
    let currentProgress = 10;
    const progressInterval = setInterval(() => {
      currentProgress += 5; // Tambahkan 5% setiap interval
      if (currentProgress < 70) {
        // Jangan sampai 70% sebelum response diterima
        setProgressValue(currentProgress);
      } else {
        clearInterval(progressInterval);
      }
    }, 700); // Update setiap 200ms

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.token,
          },
          body: JSON.stringify({ topic, level, language }),
        }
      );

      clearInterval(progressInterval); // Hentikan interval setelah fetch selesai
      const data = await response.json();
      console.log("📦 Data respons dari server:", data);

      if (response.ok) {
        setProgressValue(80); // Langsung ke 80% setelah sukses

        setTimeout(() => {
          setProgressValue(100); // Selesaikan ke 100%
          setTimeout(() => {
            setTopic("");
            setLevel("");
            setLanguage("");
            router.push(`/my-courses/${data.course.title}`);
          }, 500);
        }, 300);
      } else {
        setShowAlertModal(true);
        setCreateLoading(false);
        setProgressValue(0); // Reset progress jika ada error

        setTimeout(() => {
          setShowAlertModal(false);
        }, 1000);
      }
    } catch (error) {
      clearInterval(progressInterval); // Pastikan interval dihentikan jika ada error
      setCreateLoading(false);
      setShowAlertModal(true);
      setProgressValue(0); // Reset progress jika ada error

      setTimeout(() => {
        setShowAlertModal(false);
      }, 1000);
    }
  };

  return (
    <div className="py-[4rem] text-white md:px-20 px-[1.5rem]">
      <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
        {showAlertModal && <ErrorAlert text="An error occured!" />}
      </div>

      {/* Tampilan saat membuat kursus (createLoading) */}
      {createLoading ? (
        <div className="flex flex-col justify-center items-center space-y-[1rem]">
          <img src="/images/studying.svg" alt="" className="w-90 h-90" />

          <h1 className="font-semibold text-xl mt-[-2rem]">
            Creating course...
          </h1>
          <div className="flex flex-col items-center w-full space-y-4">
            <progress
              className="progress md:w-[30%] w-[70%]"
              value={progressValue}
              max={100}
            ></progress>
            <p className="text-gray-300">{progressValue}%</p>
          </div>
        </div>
      ) : /* Tampilan saat loading awal halaman (fetchProfile) */
      loading ? (
        <div className="w-full max-w-xl md:mx-auto space-y-6 animate-pulse">
          <div>
            <div className="h-6 w-[40%] bg-gray-700 rounded mb-2"></div>
          </div>

          <div className="h-12 bg-gray-800 rounded-lg"></div>
          <div className="h-12 bg-gray-800 rounded-lg"></div>
          <div className="h-12 bg-gray-800 rounded-lg"></div>

          <div className="flex justify-end">
            <div className="h-10 w-32 bg-gray-700 rounded-md"></div>
          </div>
        </div>
      ) : (
        /* Tampilan utama setelah loading selesai */
        <div className="w-full max-w-xl md:mx-auto space-y-6">
          <div>
            <p className="text-lg md:text-xl font-medium mb-1">
              Hello {session?.name}!
            </p>
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
          >
            <option value="" disabled>
              Select level
            </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="btn px-4 py-6 bg-[#3B82F6] mt-[0.5rem] text-white rounded-md hover:bg-[#3B82F6]/70 transition font-semibold text-sm"
              disabled={createLoading}
            >
              Create Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
