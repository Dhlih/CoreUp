"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { Suspense } from "react";

// Komponen utama dibungkus dengan Suspense
function CreateDiscussionContent() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSizeAlert, setShowSizeAlert] = useState(false);
  const [session, setSession] = useState(null);
  const [mounted, setMounted] = useState(false);

  const searchParams = useSearchParams();
  const postId = searchParams?.get("id") || null;
  const isEditMode = Boolean(postId);

  // Pastikan komponen sudah di-mount di client
  useEffect(() => {
    setMounted(true);
  }, []);

  // ambil session saat pertama kali load
  useEffect(() => {
    if (!mounted) return;

    const fetchAll = async () => {
      try {
        const s = await getSession();
        setSession(s);
        console.log("Session:", s);

        if (postId) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
          if (!apiUrl) {
            console.error("API URL not configured");
            return;
          }

          const res = await fetch(`${apiUrl}/api/posts/${postId}`, {
            headers: {
              Authorization: s.token,
            },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.data) {
              setDescription(data.data.description || "");
              setPreview(data.data.photo || null);
            }
          }
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    fetchAll();
  }, [postId, mounted]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 500 * 1024;
    if (file.size > maxSize) {
      setShowSizeAlert(true);
      setPhoto(null);
      setPreview(null);
      e.target.value = ""; // Reset input
      return;
    }

    setShowSizeAlert(false);
    setPhoto(file);

    // Cleanup previous preview URL
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !session?.token) {
      alert("Description is required and you must be logged in");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const formData = new FormData();
      formData.append("description", description.trim());

      if (photo) {
        formData.append("photo", photo);
      }

      const url = isEditMode
        ? `${apiUrl}/api/posts/${postId}`
        : `${apiUrl}/api/posts`;

      const res = await fetch(url, {
        method: isEditMode ? "POST" : "POST", // Use proper HTTP methods
        headers: {
          Authorization: session.token,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const redirectId = isEditMode ? postId : data.data?.id;
        if (redirectId) {
          router.push(`/discussion/${redirectId}`);
        } else {
          router.push("/"); // Fallback redirect
        }
      } else {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        alert(errorData.message || "Gagal menyimpan postingan!");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URL saat komponen unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div className="bg-[#131F24] text-white px-[1.5rem] w-full py-[3rem]">
        <div className="max-w-[500px] mx-auto animate-pulse">
          <div className="h-10 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="h-32 bg-gray-700 rounded mb-4"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="flex justify-end mt-[2rem]">
            <div className="p-6 w-[100px] bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#131F24] text-white px-[1.5rem] w-full py-16">
      <div className="max-w-[500px] mx-auto ">
        <h1 className="text-2xl md:text-4xl font-bold text-left mb-6">
          {isEditMode ? "Edit Discussion" : "Create Discussion"}
        </h1>

        <div className="flex items-center justify-center mt-6 max-w-[600px] w-full">
          <form onSubmit={handleSubmit} className="w-full">
            <textarea
              placeholder="Insert description..."
              className="w-full p-3 rounded-lg bg-[#0F171B] resize-none outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="relative border-2 border-dashed border-gray-600 bg-[#0F171B] rounded-lg p-4 mt-4 text-center cursor-pointer hover:bg-[#0F171B]/50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 object-cover w-full rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (preview && preview.startsWith("blob:")) {
                        URL.revokeObjectURL(preview);
                      }
                      setPreview(null);
                      setPhoto(null);
                      // Reset file input
                      const fileInput =
                        document.querySelector('input[type="file"]');
                      if (fileInput) fileInput.value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Click to Select Image</p>
                  <p className="text-gray-500 text-xs mt-1">Max 500 KB</p>
                </div>
              )}
            </div>

            {showSizeAlert && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current h-6 w-6 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span>Image size must not exceed 500 KB.</span>
              </div>
            )}

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={loading || !description.trim()}
                className={`${
                  loading || !description.trim()
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white py-3 px-6 transition rounded-lg font-medium cursor-pointer`}
              >
                {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Komponen utama dengan Suspense wrapper
export default function CreateDiscussion() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#131F24] text-white px-4 md:px-80 mx-auto py-16">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="h-32 bg-gray-700 rounded mb-4"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
          </div>
        </div>
      }
    >
      <CreateDiscussionContent />
    </Suspense>
  );
}
