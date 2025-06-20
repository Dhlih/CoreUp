"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ModalLogin() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
        "https://backend-itfest-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Simpan token jika ada
        if (data.access_token && data.token_type) {
          localStorage.setItem(
            "token",
            `${data.token_type} ${data.access_token}`
          );
        }

        // Reset form dan tutup modal
        setFormData({ email: "", password: "" });
        document.getElementById("modal_login")?.close();

        // Routing ke halaman create_course
        router.push("/create_course");
      } else {
        alert(data.message || "Email atau password salah 😢");
      }
    } catch (error) {
      alert("Gagal terhubung ke server 😓");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <dialog id="modal_login" className="modal">
        <div className="modal-box max-w-sm">
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
              className="btn btn-primary w-full mt-2"
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
