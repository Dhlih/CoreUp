"use client";
import { useState } from "react";

export default function ModalDaftar() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setFormData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
        });
        document.getElementById("modal_daftar")?.close(); // tutup modal daftar
        document.getElementById("modal_login")?.showModal(); // buka modal login
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

      <dialog id="modal_daftar" className="modal">
        <div className="modal-box max-w-[350px]">
          <form method="dialog" className="absolute right-2 top-2">
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>

          <h3 className="font-bold text-xl text-center mb-1">Register</h3>
          <p className="text-center text-sm text-gray-500 mb-4">
            Please register your account to get started.
          </p>

          <div className="w-full rounded-lg overflow-hidden mb-4">
            <img
              src="/images/bgauth.webp"
              alt="Daftar visual"
              className="w-full h-auto"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              name="name"
              type="text"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              maxLength={10}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              maxLength={50}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <input
              name="password_confirmation"
              type="password"
              placeholder="Confirm Password"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-full mt-2 shadow-none rounded-lg bg-[#3B82F6]"
              disabled={loading}
            >
              {loading ? "..." : "Register"}
            </button>

            {message && (
              <p className="text-center text-sm text-red-500 mt-2">{message}</p>
            )}
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
