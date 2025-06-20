"use client";

import { useEffect, useState } from "react";
import ModalDaftar from "../modal_register";
import ModalLogin from "../modal_login";
import Link from "next/link";

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false); // 👈 tambahan
  const [token, setToken] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("/images/makima.webp");

  useEffect(() => {
    setHasMounted(true); // client sudah mount

    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);

      // Ambil data profil
      fetch("https://backend-itfest-production.up.railway.app/api/profile", {
        headers: {
          Authorization: savedToken,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setName(data.data.name);
          setUsername(data.data.email.split("@")[0]);
          setPhoto("/images/makima.webp");
        });
    }
  }, []);

  // ⛔ jangan render apapun sebelum mounting
  if (!hasMounted) return null;

  return (
    <div className="navbar fixed top-0 left-0 z-50 bg-[#212C31] backdrop-blur-lg shadow-lg py-[1rem] ">
      {/* left side */}
      <div className="max-w-[1250px] w-full mx-auto  flex items-center justify-between ">
        <div className="flex-1">
          <a className="text-2xl font-bold text-white" href="/">
            CoreUp
          </a>
        </div>

        {/* right side */}
        {token ? (
          <div className="flex items-center space-x-[3rem]">
            <ul className="hidden md:flex space-x-[3rem] text-sm font-medium text-white">
              <Link
                className="cursor-pointer hover:text-[#60A5FA] hover:font-semibold text-lg"
                href="/leaderboard"
              >
                Leaderboard
              </Link>
              <Link
                className="cursor-pointer hover:text-[#60A5FA] hover:font-semibold text-lg"
                href="/my-courses"
              >
                My Courses
              </Link>
            </ul>
            <button className="btn btn-primary text-white text-base font-medium p-5 rounded-lg bg-[#3B82F6] shadow-none">
              Create
            </button>
            <div className="flex items-center ">
              <img
                src={photo}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover border border-white/20"
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <ModalLogin />
            <ModalDaftar />
            <button
              className="btn bg-[#131F24] text-white shadow-md hover:brightness-110 transition text-sm"
              onClick={() => document.getElementById("modal_login").showModal()}
            >
              Login
            </button>
            <button
              className="btn btn-primary text-white shadow-md hover:opacity-90 transition text-sm"
              onClick={() =>
                document.getElementById("modal_daftar").showModal()
              }
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
