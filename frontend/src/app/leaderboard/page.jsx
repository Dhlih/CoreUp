import React from "react";

const page = () => {
  return (
    <div className="md:px-20 px-[1.5rem] py-[4rem]">
      <div className="flex justify-between items-center ">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <div className="bg-[#0F171B] rounded-full px-6 py-2 ">
          Reset in 5d:10m
        </div>
      </div>

      {/* main content */}
      <div className="mt-[2rem]">
        <div className="bg-[#0F171B] rounded-xl flex items-end justify-center md:space-x-[5rem] space-x-[1.5rem] pt-[3rem]">
          {/* rank 2 */}
          <div>
            <div className="flex flex-col items-center justify-center ">
              <img
                src="/images/makima.webp"
                alt=""
                className="w-14 h-14 rounded-full object-cover"
              />
              <p className="mt-[0.5rem]">Makima</p>

              <p>900 EXP</p>
            </div>

            {/* bar */}
            <div className="rounded-lg bg-[#4F9CF9] md:p-[3rem] p-[2rem] md:h-[140px] h-[100px] mt-[1rem] flex items-center justify-center">
              <p className="md:text-3xl text-xl font-bold">
                2<span className="text-xl">nd</span>
              </p>
            </div>
          </div>

          {/* rank 1 */}
          <div>
            <div className="flex flex-col  items-center justify-center">
              <img
                src="/images/makima.webp"
                alt=""
                className="w-14 h-14 rounded-full object-cover"
              />
              <p className="mt-[0.5rem]">Makima</p>

              <p>900 EXP</p>
            </div>

            {/* bar */}
            <div className="rounded-lg bg-blue-600 md:p-[3rem] p-[2rem] md:h-[170px] h-[130px] mt-[1rem] flex items-center justify-center">
              <p className="md:text-4xl text-2xl font-bold">
                1<span className="md:text-2xl text-lg">st</span>
              </p>
            </div>
          </div>

          {/* rank 3 */}
          <div>
            <div className="flex flex-col items-center justify-center">
              <img
                src="/images/makima.webp"
                alt=""
                className="w-14 h-14 rounded-full object-cover"
              />
              <p className="mt-[0.5rem]">Makima</p>
              <p>900 EXP</p>
            </div>

            {/* bar */}
            <div className="rounded-lg bg-[#93C5FD] md:p-[3rem] p-[2rem] md:h-[110px] h-[80px] mt-[1rem] flex items-center justify-center">
              <p className="md:text-3xl text-xl font-bold">
                3<span className="md:text-xl text-base">td</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-[1.5rem]">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-400 border-separate border-spacing-y-[1rem]">
              <thead className=" uppercase text-white/70 ">
                <tr>
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Exp</th>
                  <th className="px-6 py-3">Level</th>
                  <th className="px-6 py-3">Course Done</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }, (_, i) => (
                  <tr
                    key={i}
                    className="bg-[#0F171B] hover:bg-[#1a2a33] transition-colors rounded-lg"
                  >
                    <td className="px-6 py-4 text-lg font-semibold text-white rounded-l-lg">
                      {i + 4}
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <img
                        src="/images/makima.webp"
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-white">Gorilla_xd</span>
                    </td>
                    <td className="px-6 py-4">10.000 XP</td>
                    <td className="px-6 py-4">50</td>
                    <td className="px-6 py-4 rounded-r-lg">20</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
