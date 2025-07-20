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
import { PiBrainLight } from "react-icons/pi";
import { IoChatbubblesOutline } from "react-icons/io5";

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [user, setUser] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
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

  const fetchUserData = async () => {
    const session = await getSession();
    console.log("session : ", session);

    if (session) {
      // Ambil data profil
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        headers: {
          Authorization: session.token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        });
    }
  };

  useEffect(() => {
    setHasMounted(true); // client sudah mount
    fetchUserData();
  }, [pathName, isSuccess]);

  if (!hasMounted) return null;

  const signOutUser = async () => {
    const session = await getSession();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: session.token,
        },
      });
      const isLogout = await deleteSession();

      if (isLogout) {
        router.push("/");
        setUser(null);
        setIsClicked(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileClick = (event) => {
    event.stopPropagation();
    setIsClicked(!isClicked);
  };

  return (
    <div className="navbar fixed top-0 left-0 z-50 bg-[#212C31] backdrop-blur-lg shadow-lg md:py-[1rem] py-[0.8rem] ">
      {/* left side */}
      <div className="relative w-full md:px-15 px-[1rem] flex items-center justify-between ">
        <Link href="/" className="flex items-center space-x-[0.8rem]">
          <PiBrainLight className="text-5xl text-[#4F9CF9]" />
          <h2 className="md:text-2xl text-xl font-bold text-white">CoreUp</h2>
        </Link>

        {/* right side */}
        {user ? (
          <div className="flex items-center md:space-x-[2.5rem] space-x-[1.5rem] ">
            <ul className="hidden md:flex space-x-[3rem]  font-medium text-white">
              <Link
                className="cursor-pointer hover:text-[#60A5FA] hover:font-semibold"
                href="/discussion"
              >
                Discussion
              </Link>

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
              className="btn btn-primary text-white md:text-base text-sm  font-medium md:p-6 p-3 rounded-lg bg-[#3B82F6] hover:bg-[#3B82F6]/70 shadow-none "
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
              {user?.data?.photo ? (
                <img
                  src={user?.data?.photo}
                  className=" w-13 h-13 rounded-full object-cover border-white/20 "
                  alt=""
                />
              ) : (
                <div className=" w-13 h-13 bg-[#131F24] rounded-full object-cover border border-white/20  flex items-center justify-center">
                  {generateUsername(user?.data?.name)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex md:space-x-[1.5rem] space-x-[0.7rem]">
            <ModalLogin setIsSuccess={setIsSuccess} />
            <ModalDaftar />
            <button
              className="btn bg-[#0F171B] text-white  hover:brightness-110 md:p-6 p-4 transition md:text-sm text-xs shadow-none rounded-lg"
              onClick={() => document.getElementById("modal_login").showModal()}
            >
              Login
            </button>
            <button
              className="btn bg-[#3B82F6] rounded-lg text-white shadow-none md:p-6 p-4 hover:opacity-90 transition md:text-sm text-xs "
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
            className="absolute py-2  top-20 md:right-18 right-8  bg-[#212C31]  rounded-xl max-w-[220px] w-full shadow-lg"
            ref={dropdownRef}
          >
            <div className="flex justify-between">
              <div className="flex items-center space-x-[0.8rem] p-3">
                <div
                  className=" bg-[#131F24] rounded-full object-cover border  border-white/20 cursor-pointer flex items-center justify-center"
                  ref={profileImageRef}
                  onClick={handleProfileClick}
                >
                  {user?.data?.photo ? (
                    <Link href="/profile">
                      <img
                        src={user?.data?.photo}
                        className="w-14 h-14 rounded-full object-cover"
                        alt=""
                      />
                    </Link>
                  ) : (
                    <div className="w-14 h-14 bg-[#131F24] rounded-full object-cover border border-white/20  flex items-center justify-center">
                      {generateUsername(user?.data?.name)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user?.data?.name}</h3>
                  <h4 className="font-medium">Level : {user?.data?.level}</h4>
                </div>
              </div>
              <IoCloseOutline
                className="text-2xl cursor-pointer mr-3 mt-2"
                onClick={() => setIsClicked(false)}
              />
            </div>

            <div className="flex flex-col space-y-[0.5rem]">
              <Link
                href="/my-courses"
                className="cursor-pointer w-full  py-3 px-5 hover:bg-[#0F171B]/70  flex items-center space-x-[1rem]"
              >
                <IoMdBook className="text-xl" />
                <span>My Courses</span>
              </Link>
              <Link
                href="/profile"
                className="cursor-pointer w-full py-3 px-5 hover:bg-[#0F171B]/70  flex items-center space-x-[1rem]"
              >
                <CgProfile className="text-xl" />
                <span>Your Profile</span>
              </Link>
              <Link
                href="/leaderboard"
                className="cursor-pointer w-full  py-3 px-5 hover:bg-[#0F171B]/70   flex items-center space-x-[1rem]"
              >
                <MdOutlineLeaderboard className="text-xl" />
                <span>Leaderboard</span>
              </Link>
              <Link
                href="/discussion"
                className="cursor-pointer w-full  py-3 px-5 hover:bg-[#0F171B]/70   flex items-center space-x-[1rem]"
              >
                <IoChatbubblesOutline className="text-xl" />
                <span>Discussion</span>
              </Link>
              <button
                className="cursor-pointer w-full  py-3 px-5  hover:bg-[#0F171B]/70    flex items-center space-x-[1rem]"
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
