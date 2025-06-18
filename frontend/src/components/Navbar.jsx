import React from "react";
import Image from "next/image";
import violet from "../assets/violet.jpg";

const Navbar = () => {
  return (
    <div className="w-full bg-[#2D373C] shadow-lg ">
      <div className="max-w-[1450px] mx-auto navbar py-6">
        <div className="navbar-start">
          <a className="btn btn-ghost text-2xl">CourseUp</a>
        </div>

        <div className="navbar-end flex items-center space-x-[3rem]">
          <ul className="menu menu-horizontal text-lg space-x-[2rem]">
            <li>
              <a href="" className="font-semibold">
                Leaderboard
              </a>
            </li>
            <li>
              <a href="" className="font-semibold">
                My Course
              </a>
            </li>
          </ul>
          <a className="btn px-[2.5rem] py-[1.5rem] rounded-lg shadow-none text-lg bg-[#3B82F6]">
            Create
          </a>
          <Image
            src={violet}
            width={65}
            height={65}
            alt="user profile picture"
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
