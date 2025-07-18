"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/session";
import ErrorAlert from "./ErrorAlert";

export default function ModalLogin({ setIsSuccess }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Simpan token jika ada
        console.log("data :", data);
        await createSession(data.access_token);

        // Reset form dan tutup modal
        setFormData({ email: "", password: "" });
        document.getElementById("modal_login")?.close();

        setIsSuccess(true);

        router.push("/create-course");
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      setShowAlert(true);
      document.getElementById("modal_login")?.close();

      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showAlert && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <ErrorAlert text="Terjadi kesalahan!" />
        </div>
      )}

      <dialog id="modal_login" className="modal">
        <div className="modal-box max-w-[320px]">
          {/* Tombol close */}
          <form method="dialog" className="absolute right-2 top-2">
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>

          {/* Judul dan deskripsi */}
          <h3 className="font-bold text-xl text-center mb-1">Login</h3>
          <p className="text-center text-sm text-gray-500 mb-4">
            Please log in to your account to get started.
          </p>

          {/* Gambar */}
          <div className="w-full rounded-lg overflow-hidden mb-4">
            <img
              src="/images/bgauth.webp"
              alt="Login visual"
              className="w-full h-auto"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-full mt-2 shadow-none rounded-lg bg-[#3B82F6]"
              disabled={loading}
            >
              {loading ? "..." : "Login"}
            </button>
          </form>
        </div>

        {/* Area backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
