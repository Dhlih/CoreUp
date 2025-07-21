"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaRegStar } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { RiFireLine } from "react-icons/ri";
import { IoMdBook } from "react-icons/io";
import { GiRank2 } from "react-icons/gi";

import Alert from "@/components/SuccessAlert";
import ErrorAlert from "@/components/ErrorAlert";

import generateUsername from "@/lib/username";
import { getLeaderboardRank, getRankColor } from "@/lib/rank";
import { countExpLeft } from "@/lib/exp";
import { getSession, updateSession, refreshSession } from "@/lib/session";
import { getUserRank } from "@/lib/rank";

import Loading from "@/components/Loading";

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [editedUser, setEditedUser] = useState("");
  const [name, setName] = useState("");
  const [session, setSession] = useState(null);
  const [password, setPassword] = useState("");
  const [fieldAlert, setFieldAlert] = useState(false);
  const [img, setImg] = useState(null);
  const [previewImg, setPreviewImg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [rank, setRank] = useState("");
  const [exp, setExp] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);

  const fetchUserData = async () => {
    const session = await getSession();
    setSession(session);

    const exp = await countExpLeft();
    const rank = await getLeaderboardRank();

    setExp(exp);
    setRank(rank);
  };

  const fetchCourseData = async () => {
    const session = await getSession();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
        {
          headers: {
            Authorization: session.token,
          },
        }
      );
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCourseData();
    setLoading(false);
  }, []);

  const editProfile = async () => {
    if (!password || !name) {
      setFieldAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("password", password);

    if (img) formData.append("photo", img);

    try {
      const session = await getSession();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/update`,
        {
          method: "POST",
          headers: {
            Authorization: session.token,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        setEditedUser(data.data);

        try {
          const updatedSessionData = {
            name: data.data.name || session.name,
            photo: data.data.photo || session.photo,
          };

          await updateSession(updatedSessionData);

          await fetchUserData();
        } catch (sessionError) {
          console.log("Error updating session:", sessionError);

          try {
            await refreshSession();
            await fetchUserData();
          } catch (refreshError) {
            console.log("Error refreshing session:", refreshError);
            window.location.reload();
          }
        }
      }
    } catch (error) {
      console.log(error);
      setIsSuccess(false);
    }

    setIsEdit(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 1000);

    // Reset form
    setName("");
    setPassword("");
    setImg(null);
    setPreviewImg("");
  };

  const handleUploadFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImg(selectedFile);
      setPreviewImg(URL.createObjectURL(selectedFile));
    }
  };

  // Set initial values ketika edit mode dibuka
  const handleEditClick = () => {
    setName(session?.name || "");
    setIsEdit(true);
  };

  const ProfileSkeleton = () => {
    return (
      <div className="w-full min-h-screen animate-pulse">
        <div className="py-[4rem] bg-[#131F24] md:px-30 px-[1.5rem] flex flex-col space-y-[2rem]">
          {/* Header Section */}
          <div className="h-8 bg-[#0F171B] rounded-lg w-48 mb-6"></div>

          {/* Profile Info Section */}
          <div className="bg-[#0F171B] p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-[1.5rem]">
                <div className="w-16 h-16 rounded-full bg-[#131F24]"></div>
                <div>
                  <div className="h-6 bg-[#131F24] rounded w-32 mb-2"></div>
                  <div className="h-4 bg-[#131F24] rounded w-48"></div>
                </div>
              </div>
              <div className="h-8 w-20 bg-[#131F24] rounded-md"></div>
            </div>

            <div className="w-full mt-[1rem]">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-[#131F24] rounded w-24"></div>
                <div className="h-4 bg-[#131F24] rounded w-32"></div>
              </div>
              <div className="progress w-full h-2 bg-[#131F24] rounded-full mt-2"></div>
            </div>
          </div>

          {/* Statistics Section */}
          <div>
            <div className="h-7 bg-[#0F171B] rounded-lg w-40 my-[2rem]"></div>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-[2rem] max-w-[500px] md:max-w-none">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#0F171B] px-6 py-8 rounded-lg space-y-[1rem] max-w-[250px] w-full"
                >
                  <div className="h-5 bg-[#131F24] rounded w-20"></div>
                  <div className="flex items-center md:space-x-[1rem] space-x-[0.8rem] md:text-3xl text-xl">
                    <div className="h-8 w-8 bg-[#131F24] rounded-full"></div>
                    <div className="h-8 bg-[#131F24] rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Courses Section */}
          <div>
            <div className="flex items-center justify-between my-[1.5rem]">
              <div className="h-7 bg-[#0F171B] rounded-lg w-40"></div>
              <div className="h-6 bg-[#131F24] rounded w-24"></div>
            </div>
            <div className="flex flex-col space-y-[1.5rem]">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#0F171B] px-6 py-4 rounded-xl flex items-center space-x-[1.5rem]"
                >
                  <div className="bg-[#131F24] p-4 rounded-lg h-12 w-12"></div>
                  <div className="h-6 bg-[#131F24] rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="w-full relative min-h-screen">
      {showAlert && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          {isSuccess ? (
            <Alert text="Berhasil mengedit" />
          ) : (
            <ErrorAlert text="Gagal mengedit" />
          )}
        </div>
      )}

      {isEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-[1.2rem]">
          <div className="bg-[#212C31] p-6 rounded-xl w-full max-w-sm mx-4 shadow-lg relative">
            <div className="flex justify-end">
              <IoCloseOutline
                className="text-2xl cursor-pointer"
                onClick={() => {
                  setIsEdit(false);
                  setPreviewImg("");
                  setImg(null);
                  setName("");
                  setPassword("");
                }}
              />
            </div>
            <div className="flex justify-center relative">
              {previewImg || session?.photo ? (
                <img
                  src={previewImg || session.photo}
                  className="w-18 h-18 rounded-full object-cover border-white/20"
                  alt=""
                  style={{ aspectRatio: 1 }}
                />
              ) : (
                <div
                  className="w-18 h-18 bg-[#131F24] rounded-full object-cover border border-white/20 flex items-center justify-center"
                  style={{ aspectRatio: 1 }}
                >
                  {generateUsername(session?.name)}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleUploadFile}
                className="hidden"
              />
              <div
                className="absolute top-10 md:right-30 right-22 bg-[#3B82F6] p-2 rounded-full text-sm cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <MdOutlineModeEdit />
              </div>
            </div>

            <div className="flex flex-col space-y-[0.5rem] mt-[1rem]">
              <span>Name :</span>
              <input
                type="text"
                className="w-full bg-[#131F24] rounded-lg p-2 px-4"
                onChange={(evt) => setName(evt.target.value)}
                value={name}
              />

              <span>Email :</span>
              <input
                type="text"
                className="w-full bg-[#131F24] rounded-lg p-2 px-4"
                disabled={true}
                value={session?.email}
              />

              <span>Password :</span>
              <input
                type="password"
                className="w-full bg-[#131F24] rounded-lg py-2 px-4"
                onChange={(evt) => setPassword(evt.target.value)}
                placeholder="Your password or new password"
                value={password}
              />

              {fieldAlert && (
                <p className="text-red-400 text-sm">*Fill all the field</p>
              )}

              <button
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/70 mt-[1.5rem] rounded-lg p-2 font-semibold cursor-pointer"
                onClick={editProfile}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="py-[4rem] bg-[#131F24] md:px-30 px-[1.5rem] flex flex-col space-y-[2rem]">
        <h1 className="font-bold text-2xl md:text-4xl">My Profile</h1>

        <div className="bg-[#0F171B] p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-[1.5rem]">
              {session?.photo ? (
                <img
                  src={session?.photo}
                  className="w-16 h-16 rounded-full object-cover"
                  alt=""
                  style={{ aspectRatio: 1 }}
                />
              ) : (
                <div
                  className="w-16 h-16 bg-[#131F24] rounded-full object-cover border border-white/20 flex items-center justify-center"
                  style={{ aspectRatio: 1 }}
                >
                  {generateUsername(session?.name)}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-xl">{session?.name}</h3>
                <p className="opacity-80">{session?.email}</p>
              </div>
            </div>
            <button
              className="md:py-2 py-[6px] md:px-6 px-2 md:rounded-lg rounded-md bg-[#4F9CF9] hover:bg-[#4F9CF9]/70 font-semibold cursor-pointer flex items-center justify-center md:self-auto self-start mt-[-10px]"
              onClick={handleEditClick}
            >
              <span className="hidden md:block">Edit</span>
              <MdOutlineModeEdit className="md:hidden md:text-xl text-sm" />
            </button>
          </div>

          <div className="w-full mt-[1rem]">
            <div className="flex items-center justify-between">
              <span>Level {session?.level}</span>
              <span>
                {session?.exp} / {exp?.nextLevelExp} EXP
              </span>
            </div>
            <progress
              className="progress w-full transition-none"
              value={exp?.progressValue || 0}
              max={100}
            ></progress>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold my-[2rem]">Statistics</h2>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-[2rem] max-w-[500px] md:max-w-none">
            <div className="bg-[#0F171B] px-6 py-8 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Rank</h3>
              <div className="flex items-center md:space-x-[1rem] space-x-[0.8rem] md:text-3xl text-xl ">
                <RiFireLine className="text-[#F97316]" />
                <span className="font-semibold">{rank?.userRank}</span>
              </div>
            </div>
            <div className="bg-[#0F171B] px-6 py-8 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Level</h3>
              <div className="flex items-center md:space-x-[1rem] space-x-[0.8rem] md:text-3xl text-xl">
                <FaRegStar className="text-[#38BDF8]" />
                <span className=" font-semibold">{session?.level}</span>
              </div>
            </div>
            <div className="bg-[#0F171B] px-6 py-8 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Exp</h3>
              <div className="flex items-center md:space-x-[1rem] space-x-[0.8rem] md:text-3xl text-xl">
                <AiOutlineThunderbolt className="text-[#EAB308]" />
                <span className="font-semibold">{session?.exp}</span>
              </div>
            </div>
            <div className="bg-[#0F171B] px-6 py-8 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Rank Badge</h3>
              <div className="flex items-center md:space-x-[1rem] space-x-[0.8rem] md:text-3xl text-xl">
                <GiRank2 className={`${getRankColor(session?.exp)}`} />
                <span className="font-semibold">
                  {getUserRank(session?.exp)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between my-[1.5rem]">
            <h2 className="text-2xl font-semibold">My Courses</h2>
            <Link
              href="/my-courses"
              className="text-[#4F9CF9] text-lg hover:text-[#4F9CF9]/70"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-col space-y-[1.5rem]">
            {courses?.slice(0, 4).map((course, index) => (
              <Link
                href={`/my-courses/${course.title}`}
                className="bg-[#0F171B] px-6 py-4 rounded-xl flex items-center space-x-[1.5rem] hover:bg-[#1c2a31] transition"
                key={index}
              >
                <div className="bg-[#131F24] p-4 rounded-lg">
                  <IoMdBook className="md:text-3xl text-xl" />
                </div>
                <h3 className=" md:text-lg text-base hover:text-white/70">
                  {course.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
