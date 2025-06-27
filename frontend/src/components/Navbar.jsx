"use client";

import { useEffect, useState, useRef } from "react";
import ModalDaftar from "./modal_register";
import ModalLogin from "./modal_login";
import Link from "next/link";
import { getSession } from "@/lib/session";
import generateUsername from "@/lib/username";

// icons
import { BiLogOut } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoMdBook } from "react-icons/io";
import { deleteSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { MdOutlineLeaderboard } from "react-icons/md";

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [photo, setPhoto] = useState("/images/makima.webp");
  const [user, setUser] = useState("");
  const pathName = usePathname();

  const router = useRouter();
  const dropdownRef = useRef(null);
  const profileImageRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileImageRef.current &&
        !profileImageRef.current.contains(event.target)
      ) {
        setIsClicked(false);
      }
    };

    if (isClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isClicked]);

  useEffect(() => {
    setHasMounted(true); // client sudah mount

    const fetchUserData = async () => {
      const session = await getSession();
      console.log("session :", session);

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
            console.log("data :", data);
            setUser(data);
          });
      }
    };

    fetchUserData();
  }, [pathName]);

  if (!hasMounted) return null;

  const signOutUser = async () => {
    const isLogout = await deleteSession();
    if (isLogout) router.push("/");
  };

  const handleProfileClick = (event) => {
    event.stopPropagation();
    setIsClicked(!isClicked);
  };

  return (
    <div className="navbar fixed top-0 left-0 z-50 bg-[#212C31] backdrop-blur-lg shadow-lg md:py-[0.8rem] py-[1rem] ">
      {/* left side */}
      <div className="relative w-full md:px-20 px-[1rem] flex items-center justify-between ">
        <div className="flex-1">
          <a className="text-2xl font-bold text-white" href="/">
            CoreUp
          </a>
        </div>

        {/* right side */}
        {user ? (
          <div className="flex items-center md:space-x-[2.5rem] space-x-[2rem] ">
            <ul className="hidden md:flex space-x-[3rem]  font-medium text-white">
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
              className="btn btn-primary text-white md:text-base text-sm  font-medium md:p-6 p-4 rounded-lg bg-[#3B82F6] hover:bg-[#3B82F6]/70 shadow-none "
              href="/create-course"
            >
              Create
            </Link>
            {/* profile picture */}
            <div
              ref={profileImageRef}
              onClick={handleProfileClick}
              className="cursor-pointer"
            >
              {user.data.photo ? (
                <img
                  src={user.data.photo}
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
              ) : (
                <div className="w-14 h-14 bg-[#131F24] rounded-full object-cover border border-white/20  flex items-center justify-center">
                  {user.generateUsername(user.data.name)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex space-x-[1.5rem]">
            <ModalLogin />
            <ModalDaftar />
            <button
              className="btn bg-[#0F171B] text-white  hover:brightness-110 p-6 transition text-sm shadow-none rounded-lg"
              onClick={() => document.getElementById("modal_login").showModal()}
            >
              Login
            </button>
            <button
              className="btn bg-[#3B82F6] rounded-lg text-white shadow-none p-6 hover:opacity-90 transition text-sm "
              onClick={() =>
                document.getElementById("modal_daftar").showModal()
              }
            >
              Register
            </button>
          </div>
        )}

        {/* shown after image clicked */}
        {isClicked && (
          <div
            className="absolute  top-20 md:right-18 right-8  bg-[#212C31] p-4 rounded-xl max-w-[220px] w-full shadow-lg"
            ref={dropdownRef}
          >
            <div className="flex justify-between">
              <div className="flex items-center space-x-[1rem]">
                <div
                  className="w-12 h-12 bg-[#131F24] rounded-full object-cover border border-white/20 cursor-pointer flex items-center justify-center"
                  ref={profileImageRef}
                  onClick={handleProfileClick}
                >
                  {user.data.photo ? (
                    <img
                      src={user.data.photo}
                      className="w-12 h-12 rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-14 h-14 bg-[#131F24] rounded-full object-cover border border-white/20  flex items-center justify-center">
                      {user.generateUsername(user.data.name)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user?.data?.name}</h3>
                  <h4 className="font-medium">Level : {user?.data?.level}</h4>
                </div>
              </div>
              <IoCloseOutline
                className="text-2xl cursor-pointer"
                onClick={() => setIsClicked(false)}
              />
            </div>

            <div className="flex flex-col p-2 space-y-[0.7rem]">
              <Link
                href="/my-courses"
                className="cursor-pointer w-full mt-[1rem] hover:text-white/70  rounded-lg   flex items-center space-x-[1rem]"
              >
                <IoMdBook className="text-xl" />
                <span>My Courses</span>
              </Link>
              <Link
                href="/profile"
                className="cursor-pointer w-full mt-[1rem] hover:text-white/70  rounded-lg   flex items-center space-x-[1rem]"
              >
                <CgProfile className="text-xl" />
                <span>Your Profile</span>
              </Link>
              <Link
                href="/leaderboard"
                className="cursor-pointer w-full mt-[1rem] hover:text-white/70  rounded-lg   flex items-center space-x-[1rem]"
              >
                <MdOutlineLeaderboard className="text-xl" />
                <span>Leaderboard</span>
              </Link>
              <button
                className="cursor-pointer w-full mt-[1rem] hover:text-white/70  rounded-lg   flex items-center space-x-[1rem]"
                onClick={signOutUser}
              >
                <BiLogOut className="text-xl" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
