import { LuBookMinus } from "react-icons/lu";
import { LuClock5 } from "react-icons/lu";
import { TbStairs } from "react-icons/tb";

import Link from "next/link";
import axios from "axios";

const ModulCard = ({ title, id, setIsDeleted }) => {
  const deleteCourse = async () => {
    try {
      await axios.delete(
        `https://backend-itfest-production.up.railway.app/api/courses/${id}`,
        {
          headers: {
            Authorization:
              "Bearer 5|LZWg36UogSJObeor7Fc5vw3PWEDsnRGACoQ8WxQy1a893890",
            "Content-Type": "application/json",
          },
        }
      );
      setIsDeleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#0F171B] rounded-xl py-8 px-10 ">
      {/* top side */}
      <div className="flex md:flex-row flex-col md:items-center justify-between ">
        <Link href="/" className="max-w-[65%] text-2xl font-semibold ">
          <h3>{title}</h3>
        </Link>
        {/*  */}
        <div className="flex items-center space-x-[3rem] md:text-xl text-lg md:mt-0 mt-[1rem]">
          <div className="flex items-center space-x-[1rem]">
            <LuBookMinus />
            <span>5 modul</span>
          </div>
          {/* <div className="flex items-center space-x-[1rem]">
            <LuClock5 />
            <span>3h 10m</span>
          </div>
          <div className="flex items-center space-x-[1rem]">
            <TbStairs />
            <span>Pemula</span>
          </div> */}
        </div>
      </div>

      {/* bottom side */}
      <div className="flex items-center justify-between space-x-[3rem] mt-[2rem]">
        <div className="w-full ">
          <div className="flex items-center justify-between ">
            <span>Progress</span>
            <span>80%</span>
          </div>
          <progress
            className="progress w-full "
            value={50}
            max={100}
          ></progress>
        </div>

        <div className="flex items-center md:space-x-[2rem] space-x-[1.5rem] ">
          <button
            className="btn bg-[#3B82F6] md:p-6 p-4"
            onClick={() => console.log(id)}
          >
            Lanjutkan
          </button>
          <button
            className="btn bg-[#F43F5E] md:p-6 p-4"
            onClick={deleteCourse}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModulCard;
