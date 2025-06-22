import { LuBookMinus } from "react-icons/lu";
import { getSession } from "@/lib/session";

import Link from "next/link";
import axios from "axios";

const ModulCard = ({ title, id, setIsDeleted, moduleAmount }) => {
  const deleteCourse = async () => {
    const session = await getSession();

    try {
      await axios.delete(
        `https://backend-itfest-production.up.railway.app/api/courses/${id}`,
        {
          headers: {
            Authorization: session.value,
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
    <div className="bg-[#0F171B] rounded-xl p-6 ">
      {/* top side */}
      <div className="flex md:flex-row flex-col md:items-center justify-between ">
        <Link
          href={`/my-courses/${title}/`}
          className="max-w-[65%] text-xl font-semibold "
        >
          <h3 className="hover:text-white/70">{title}</h3>
        </Link>
        {/*  */}
        <div className="flex items-center space-x-[3rem] md:text-xl text-lg md:mt-0 mt-[1rem]">
          <div className="flex items-center space-x-[0.5rem] text-base">
            <LuBookMinus />
            <span>{moduleAmount} Modul</span>
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
      <div className="flex items-center justify-between space-x-[3rem] mt-[1rem]">
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
          <Link href={`/my-courses/${title}`}>
            <button
              className="btn bg-[#3B82F6] p-4 hover:bg-[#3B82F6]/70 text-xs rounded-lg"
              onClick={() => console.log(id)}
            >
              Lanjutkan
            </button>
          </Link>

          <button
            className="btn bg-[#F43F5E]  p-4 hover:bg-[#F43F5E]/70 text-xs rounded-lg"
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
