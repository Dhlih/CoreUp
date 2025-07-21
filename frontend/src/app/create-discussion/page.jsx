"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

export default function CreateDiscussion() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSizeAlert, setShowSizeAlert] = useState(false);
  const [session, setSession] = useState(null);
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const isEditMode = Boolean(postId);

  // ambil session saat pertama kali load
  useEffect(() => {
    const fetchAll = async () => {
      const s = await getSession();
      setSession(s);

      if (postId) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: s.value,
              },
            }
          );
          const data = await res.json();
          if (res.ok && data.data) {
            setDescription(data.data.description);
            setPreview(data.data.photo); // URL dari server
          }
        } catch (error) {
          console.error("Gagal ambil data postingan:", error);
        }
      }
    };

    fetchAll();
  }, [postId]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 3 * 1024 * 1024; // 3 MB
    if (file.size > maxSize) {
      setShowSizeAlert(true);
      setPhoto(null);
      setPreview(null);
      return;
    }

    setShowSizeAlert(false);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !session) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("description", description);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts${
          isEditMode ? `/${postId}` : ""
        }`,
        {
          method: "POST",
          headers: {
            Authorization: session.token,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        router.push(`/discussion/${postId}`);
      } else {
        console.error(data);
        alert("Gagal menyimpan postingan!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-[#131F24] text-white px-80 mx-auto py-[4rem]">
      <h1 className="text-4xl font-bold text-left">
        {isEditMode ? "Edit Discussion" : "Create Discussion"}
      </h1>
      <div className="flex items-center justify-center mt-[1.5rem] max-w-[600px] w-full ">
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            placeholder="Insert description..."
            className="w-full p-3 rounded-lg bg-[#0F171B] resize-none outline-none"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="relative border-2 border-dashed border-gray-600 bg-[#0F171B] rounded-lg p-4 mt-[1rem]  text-center cursor-pointer hover:bg-[#0F171B]/50 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer "
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 object-cover w-full"
              />
            ) : (
              <p className="text-gray-400 text-sm">Click to Select Image</p>
            )}
          </div>

          {showSizeAlert && (
            <div
              role="alert"
              className="alert bg-blue-100 text-blue-800 px-4 py-3 rounded flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-blue-500 h-6 w-6 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Image size must not exceed 3 MB.</span>
            </div>
          )}
          <div className="flex justify-end mt-[2rem]">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white py-3 px-10 transition rounded-lg cursor-pointer `}
            >
              {loading ? "..." : isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
