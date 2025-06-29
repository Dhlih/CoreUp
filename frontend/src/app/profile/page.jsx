"use client";

import { useEffect, useState, useRef } from "react";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaRegStar } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { getSession } from "@/lib/session";
import Alert from "@/components/SuccessAlert";
import ErrorAlert from "@/components/ErrorAlert";
import { IoCloseOutline } from "react-icons/io5";
import generateUsername from "@/lib/username";
import { getUserRank } from "@/lib/rank";
import { RiFireLine } from "react-icons/ri";
import { countExpLeft } from "@/lib/exp";

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [img, setImg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [rank, setRank] = useState("");
  const [exp, setExp] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getSession();

      const response = await fetch(
        `https://backend-itfest-production.up.railway.app/api/user`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: session.value,
          },
        }
      );
      const user = await response.json();
      const exp = await countExpLeft();
      console.log("exp :", exp);
      const rank = await getUserRank();

      setExp(exp);
      setUser(user.data);
      setName(user.data.name);
      setPassword(user.data.password);
      setRank(rank);
    };

    fetchUserData();
  }, []);

  const editProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("password", password);
    formData.append("photo", img);
    formData.append("password_confirmation", passwordConfirmation);

    try {
      const session = await getSession();

      console.log("session :", session);
      const response = await fetch(
        "https://backend-itfest-production.up.railway.app/api/user/update",
        {
          method: "POST",
          headers: {
            Authorization: session.value,
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("berhasil mengedit");
        setIsSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }

    setShowAlert(true);
  };

  const handleUploadFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImg(URL.createObjectURL(selectedFile));
    }
  };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center  ">
          <div className="bg-[#212C31] p-6 rounded-lg w-full max-w-sm mx-4 shadow-lg relative">
            <div className="flex justify-end">
              <IoCloseOutline
                className="text-2xl cursor-pointer"
                onClick={() => setIsEdit(false)}
              />
            </div>
            <div className="flex justify-center relative">
              {user.photo ? (
                <img
                  src={user.photo}
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
              ) : (
                <div className="w-12 h-12 bg-[#131F24] rounded-full object-cover border border-white/20  flex items-center justify-center">
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
                className="absolute top-10 right-26 bg-[#3B82F6]  p-2 rounded-full text-sm cursor-pointer"
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
              />

              <span>Password Confirmation :</span>
              <input
                type="text"
                className="w-full bg-[#131F24] rounded-lg py-2 px-4"
                onChange={(evt) => setPasswordConfirmation(evt.target.value)}
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

      <div className="py-[4rem]   bg-[#131F24]  md:px-30 px-[1.5rem] flex flex-col space-y-[2rem]">
        <h1 className="font-bold md:text-4xl text-3xl ">My Profile</h1>

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
                <div className="w-16 h-16 bg-[#131F24] rounded-full object-cover border border-white/20  flex items-center justify-center">
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

          {/* user level */}
          <div className="w-full mt-[1.5rem]">
            <div className="flex items-center justify-between ">
              <span>Level {user?.level}</span>
              <span>
                {user?.exp} / {exp?.expLeft} EXP
              </span>
            </div>
            <progress
              className="progress w-full transition-none"
              value={exp.progressValue}
              max={100}
            ></progress>
          </div>
        </div>

        {/* statistics */}
        <div>
          <h2 className="text-3xl font-semibold my-[2rem]">Statistics</h2>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-[2rem] max-w-[500px] md:max-w-none">
            <div className="bg-[#0F171B] p-6 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Current Rank</h3>
              <div className="flex items-center space-x-[1rem]">
                <RiFireLine className="text-3xl" />
                <span className="text-3xl font-semibold">{rank.userRank}</span>
              </div>
            </div>
            <div className="bg-[#0F171B] p-6 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Current Level</h3>
              <div className="flex items-center space-x-[1rem]">
                <FaRegStar className="text-3xl" />
                <span className="text-3xl font-semibold">{user?.level}</span>
              </div>
            </div>
            <div className="bg-[#0F171B] p-6 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Current Exp</h3>
              <div className="flex items-center space-x-[1rem]">
                <AiOutlineThunderbolt className="text-3xl" />
                <span className="text-3xl font-semibold">{user?.exp}</span>
              </div>
            </div>
            <div className="bg-[#0F171B] p-6 rounded-lg space-y-[1rem] max-w-[250px] w-full">
              <h3>Course Done</h3>
              <div className="flex items-center space-x-[1rem]">
                <HiOutlineBadgeCheck className="text-3xl" />
                <span className="text-3xl font-semibold">10</span>
              </div>
            </div>
          </div>
        </div>

        {/* achivement */}
        {/* <div>
          <h2 className="text-3xl font-semibold my-[2rem]">Achivement</h2>
          <div className="space-y-[2rem]">
            <div className="bg-[#0F171B] p-6 rounded-lg space-y-[1rem]  w-full">
              <h3>Current Level</h3>
              <div className="flex items-center space-x-[1rem]">
                <FaRegStar className="text-3xl" />
                <span className="text-3xl font-semibold">{user?.level}</span>
              </div>
            </div>

            <div className="bg-[#0F171B] p-6 rounded-lg space-y-[1rem]  w-full">
              <h3>Current Level</h3>
              <div className="flex items-center space-x-[1rem]">
                <FaRegStar className="text-3xl" />
                <span className="text-3xl font-semibold">{user?.level}</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;
