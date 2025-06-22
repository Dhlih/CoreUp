"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

export default function CreateCourse() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(""); // <== nama user dari API

  // 🔽 Ambil nama user dari /api/profile
  useEffect(() => {
    const fetchProfile = async () => {
      const session = await getSession();

      try {
        const res = await fetch(
          "https://backend-itfest-production.up.railway.app/api/user",
          {
            headers: {
              Authorization: session.value,
            },
          }
        );

        const data = await res.json();
        setName(data.data.name || "User");
      } catch (error) {
        console.error("Gagal ambil profil:", error);
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

    setLoading(true);

    try {
      const response = await fetch(
        "https://backend-itfest-production.up.railway.app/api/courses",
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
        setTopic("");
        setLevel("");
        setLanguage("");
        router.push(`/my-courses/${data.course.title}`);
      } else {
        alert(`❌ Gagal: ${data.message || "Terjadi kesalahan pada data."}`);
      }
    } catch (error) {
      alert("🚫 Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-[3rem] text-white md:px-20 px-[1.5rem] ">
      {loading ? (
        <div className="flex flex-col  space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-white text-sm font-medium">Create a course..</p>
        </div>
      ) : (
        <div className="w-full max-w-xl md:mx-auto space-y-6 ">
          <div>
            <p className="text-lg md:text-xl font-medium mb-1">Hello {name}!</p>
            <h1 className="text-2xl md:text-4xl font-bold">
              What do you want to learn?
            </h1>
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
              Select level{" "}
            </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="btn py-6 px-4 bg-[#3B82F6] mt-[0.5rem] text-white rounded-md hover:bg-[#3B82F6]/70 transition font-semibold text-sm"
              disabled={loading}
            >
              Create Roadmap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
