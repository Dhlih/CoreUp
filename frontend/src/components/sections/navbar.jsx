"use client";

import { useEffect, useState } from "react";
import ModalDaftar from "../modal_register";
import ModalLogin from "../modal_login";
import Link from "next/link";
import { getSession } from "@/lib/session";

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false); // 👈 tambahan
  const [session, setSession] = useState(null);
  const [photo, setPhoto] = useState("/images/makima.webp");

  useEffect(() => {
    setHasMounted(true); // client sudah mount

    const fetchUserData = async () => {
      const session = await getSession();

      if (session) {
        // Ambil data profil
        fetch("https://backend-itfest-production.up.railway.app/api/user", {
          headers: {
            Authorization: session.value,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setPhoto("/images/makima.webp");
            setSession(session);
          });
      }
    };

    fetchUserData();
  }, []);

  if (!hasMounted) return null;

  return (
    <div className="navbar fixed top-0 left-0 z-50 bg-[#212C31] backdrop-blur-lg shadow-lg py-[0.8rem] ">
      {/* left side */}
      <div className="w-full px-20 flex items-center justify-between ">
        <div className="flex-1">
          <a className="text-2xl font-bold text-white" href="/">
            CoreUp
          </a>
        </div>

        {/* right side */}
        {session ? (
          <div className="flex items-center space-x-[3rem]">
            <ul className="hidden md:flex space-x-[3rem] text-sm font-medium text-white">
              <Link
                className="cursor-pointer hover:text-[#60A5FA] hover:font-semibold"
                href="/leaderboard"
              >
                Leaderboard
              </Link>
              <Link
                className="cursor-pointer hover:text-[#60A5FA] hover:font-semibold "
                href="/my-courses"
              >
                My Courses
              </Link>
            </ul>

            <Link
              className="btn btn-primary text-white  font-medium p-5 rounded-lg bg-[#3B82F6] hover:bg-[#3B82F6]/70 shadow-none text-sm"
              href="/create-course"
            >
              Create
            </Link>

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
