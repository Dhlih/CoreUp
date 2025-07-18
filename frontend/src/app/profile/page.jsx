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
import { getSession } from "@/lib/session";
import { getUserRank } from "@/lib/rank";
import { TbMilitaryRank } from "react-icons/tb";

import Loading from "@/components/Loading";

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: session.value,
        },
      }
    );

    const user = await response.json();
    const exp = await countExpLeft();
    console.log("user : ", user);

    console.log("exp di profile :", exp);
    const rank = await getLeaderboardRank();

    setExp(exp);
    setUser(user.data);
    setName(user.data.name);
    setRank(rank);
  };

  const fetchCourseData = async () => {
    const session = await getSession();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
        {
          headers: {
            Authorization: session.value,
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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);
    if (img) formData.append("photo", img);

    try {
      const session = await getSession();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/update`,
        {
          method: "POST",
          headers: {
            Authorization: session.value,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        fetchUserData();
      }
    } catch (error) {
      console.log(error);
      setIsSuccess(false);
    }

    setIsEdit(false);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 1000);
  };

  const handleUploadFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImg(selectedFile);
      setPreviewImg(URL.createObjectURL(selectedFile));
    }
  };

  if (loading) return <Loading />;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-[#212C31] p-6 rounded-xl w-full max-w-sm mx-4 shadow-lg relative">
            <div className="flex justify-end">
              <IoCloseOutline
                className="text-2xl cursor-pointer"
                onClick={() => setIsEdit(false)}
              />
            </div>
            <div className="flex justify-center relative">
              {previewImg || user.photo ? (
                <img
                  src={previewImg || user.photo}
                  className="w-18 h-18 rounded-full object-cover border-white/20"
                  alt=""
                />
              ) : (
                <div className="w-18 h-18 bg-[#131F24] rounded-full object-cover border border-white/20 flex items-center justify-center">
                  {generateUsername(user.name)}
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
                className="absolute top-10 right-26 bg-[#3B82F6] p-2 rounded-full text-sm cursor-pointer"
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
                value={user?.email}
              />

              <span>Password :</span>
              <input
                type="text"
                className="w-full bg-[#131F24] rounded-lg py-2 px-4"
                onChange={(evt) => setPassword(evt.target.value)}
                placeholder="Your password or new password"
              />

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
        <h1 className="font-bold md:text-4xl text-3xl">My Profile</h1>

        <div className="bg-[#0F171B] p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-[1.5rem]">
              {user.photo ? (
                <img
                  src={user.photo}
                  className="w-16 h-16 rounded-full object-cover"
                  alt=""
                />
              ) : (
                <div className="w-16 h-16 bg-[#131F24] rounded-full object-cover border border-white/20 flex items-center justify-center">
                  {generateUsername(user.name)}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-xl">{user.name}</h3>
                <p className="opacity-80">{user.email}</p>
              </div>
            </div>
            <button
              className="md:py-2 py-[6px] md:px-6 px-2 md:rounded-lg rounded-md bg-[#4F9CF9] hover:bg-[#4F9CF9]/70 font-semibold cursor-pointer flex items-center justify-center md:self-auto self-start mt-[-10px]"
              onClick={() => setIsEdit(true)}
            >
              <span className="hidden md:block">Edit</span>
              <MdOutlineModeEdit className="md:hidden md:text-xl text-sm" />
            </button>
          </div>

          <div className="w-full mt-[1rem]">
            <div className="flex items-center justify-between">
              <span>Level {user?.level}</span>
              <span>
                {user?.exp} / {exp?.nextLevelExp} EXP
              </span>
            </div>
            <progress
              className="progress w-full transition-none"
              value={exp.progressValue}
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
                <span className="font-semibold">{rank.userRank}</span>
              </div>
            </div>
            <div className="bg-[#0F171B] px-6 py-8 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Level</h3>
              <div className="flex items-center md:space-x-[1rem] space-x-[0.8rem] md:text-3xl text-xl">
                <FaRegStar className="text-[#38BDF8]" />
                <span className=" font-semibold">{user?.level}</span>
              </div>
            </div>
            <div className="bg-[#0F171B] px-6 py-8 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Exp</h3>
              <div className="flex items-center md:space-x-[1rem] space-x-[0.8rem] md:text-3xl text-xl">
                <AiOutlineThunderbolt className="text-[#EAB308]" />
                <span className="font-semibold">{user?.exp}</span>
              </div>
            </div>
            <div className="bg-[#0F171B] px-6 py-8 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Rank Badge</h3>
              <div className="flex items-center md:space-x-[1rem] space-x-[0.8rem] md:text-3xl text-xl">
                <GiRank2 className={`${getRankColor(user?.exp)}`} />
                <span className="font-semibold">{getUserRank(user?.exp)}</span>
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
              <div
                className="bg-[#0F171B] px-6 py-4 rounded-xl flex items-center space-x-[1.5rem]"
                key={index}
              >
                <div className="bg-[#131F24] p-4 rounded-lg">
                  <IoMdBook className="md:text-3xl text-xl" />
                </div>
                <Link href={`/my-courses/${course.title}`}>
                  <h3 className=" md:text-xl text-base ">{course.title}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
