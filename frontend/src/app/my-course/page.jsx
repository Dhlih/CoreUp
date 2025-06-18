import { LuBookMinus } from "react-icons/lu";
import { LuClock5 } from "react-icons/lu";
import { TbStairs } from "react-icons/tb";
import { IoIosSearch } from "react-icons/io";

const MyCourse = () => {
  return (
    <div className="max-w-[1350px] mx-auto mt-[5rem]">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-4xl ">My Course</h1>
        {/* input field */}
        <div className="rounded-full bg-[#0F171B] flex items-center space-x-[1rem] py-3 px-6">
          <IoIosSearch className="text-xl" />
          <input
            type="text"
            placeholder="Cari kursus saya..."
            className="max-w-[300px] "
          />
        </div>
      </div>

      {/* main content */}
      <div className="mt-[3rem]">
        <div className="bg-[#0F171B] rounded-xl py-8 px-10 mb-[3rem]">
          {/* top side */}
          <div className="flex items-center justify-between ">
            <h3 className="text-2xl font-semibold">
              Public Speaking from Zero
            </h3>
            {/*  */}
            <div className="flex items-center space-x-[3rem]">
              <div className="text-xl flex items-center space-x-[1rem]">
                <LuBookMinus />
                <span>5 modul</span>
              </div>
              <div className="text-xl flex items-center space-x-[1rem]">
                <LuClock5 />
                <span>3h 10m</span>
              </div>
              <div className="text-xl flex items-center space-x-[1rem]">
                <TbStairs />
                <span>Pemula</span>
              </div>
            </div>
          </div>

          {/* bottom side */}
          <div className="flex items-center justify-between space-x-[5rem] mt-[2rem]">
            <div className="w-full">
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

            <div className="flex items-center space-x-[2rem] ">
              <button className="btn bg-[#3B82F6] p-6">Lanjutkan</button>
              <button className="btn bg-[#F43F5E] p-6">Hapus</button>
            </div>
          </div>
        </div>

        <div className="bg-[#0F171B] rounded-xl py-8 px-10 mb-[3rem]">
          {/* top side */}
          <div className="flex items-center justify-between ">
            <h3 className="text-2xl font-semibold">
              Public Speaking from Zero
            </h3>
            {/*  */}
            <div className="flex items-center space-x-[3rem]">
              <div className="text-xl flex items-center space-x-[1rem]">
                <LuBookMinus />
                <span>5 modul</span>
              </div>
              <div className="text-xl flex items-center space-x-[1rem]">
                <LuClock5 />
                <span>3h 10m</span>
              </div>
              <div className="text-xl flex items-center space-x-[1rem]">
                <TbStairs />
                <span>Pemula</span>
              </div>
            </div>
          </div>

          {/* bottom side */}
          <div className="flex items-center justify-between space-x-[5rem] mt-[2rem]">
            <div className="w-full">
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

            <div className="flex items-center space-x-[2rem] ">
              <button className="btn bg-[#3B82F6] p-6">Lanjutkan</button>
              <button className="btn bg-[#F43F5E] p-6">Hapus</button>
            </div>
          </div>
        </div>

        <div className="bg-[#0F171B] rounded-xl py-8 px-10 mb-[3rem]">
          {/* top side */}
          <div className="flex items-center justify-between ">
            <h3 className="text-2xl font-semibold">
              Public Speaking from Zero
            </h3>
            {/*  */}
            <div className="flex items-center space-x-[3rem]">
              <div className="text-xl flex items-center space-x-[1rem]">
                <LuBookMinus />
                <span>5 modul</span>
              </div>
              <div className="text-xl flex items-center space-x-[1rem]">
                <LuClock5 />
                <span>3h 10m</span>
              </div>
              <div className="text-xl flex items-center space-x-[1rem]">
                <TbStairs />
                <span>Pemula</span>
              </div>
            </div>
          </div>

          {/* bottom side */}
          <div className="flex items-center justify-between space-x-[5rem] mt-[2rem]">
            <div className="w-full">
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

            <div className="flex items-center space-x-[2rem] ">
              <button className="btn bg-[#3B82F6] p-6">Lanjutkan</button>
              <button className="btn bg-[#F43F5E] p-6">Hapus</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;
