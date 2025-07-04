"use client";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import generateUsername from "@/lib/username";
import Loading from "@/components/Loading";
import { getUserRank } from "@/lib/rank";
import { FaCrown } from "react-icons/fa6";

const Leaderboard = () => {
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topThree, setTopThree] = useState([]);

  const fetchData = async () => {
    try {
      const sortedUsers = (await getUserRank()).sortedUsers;
      const topThree = sortedUsers.slice(0, 3);
      const otherUsers = sortedUsers.slice(4);

      setOtherUsers(otherUsers);
      setTopThree(topThree);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="md:px-20 px-[1.5rem] py-[4rem]">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <div className="bg-[#0F171B] rounded-full px-6 py-2 font-medium">
          All time
        </div>
      </div>

      {/* Top 3 Leader */}
      <div className="mt-[2rem]">
        <div className="bg-[#0F171B] rounded-xl flex items-end justify-center md:space-x-[6rem] space-x-[1.5rem] pt-[2rem]">
          {topThree.map((user, index) => {
            const rankClass = [
              "bg-[#4F9CF9] md:h-[140px] h-[100px]",
              "bg-blue-600 md:h-[170px] h-[130px]",
              "bg-[#93C5FD] md:h-[110px] h-[80px]",
            ];
            const rankLabel = ["2nd", "1st", "3rd"];
            const heightOrder = [1, 0, 2];

            // satu data saja ambil dari topthree
            const actual = topThree[heightOrder[index]];

            return (
              <div key={actual.id}>
                <div className="flex flex-col items-center justify-center">
                  {actual === topThree[0] && (
                    <FaCrown className="text-yellow-300 text-5xl" />
                  )}

                  {!actual.img ? (
                    <div className="bg-[#212C31] flex items-center justify-center md:w-14 md:h-14 h-12 w-12 p-4 rounded-full">
                      <p>{generateUsername(actual.name)}</p>
                    </div>
                  ) : (
                    <img
                      src={actual.photo}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover bg-[#212C31] "
                    />
                  )}

                  <p className="mt-[0.5rem] font-semibold text-center mx-auto">
                    {actual.name}
                  </p>
                  <p className="text-sm opacity-80">{actual.exp} EXP</p>
                </div>

                <div
                  className={`rounded-lg ${rankClass[index]} mt-[1rem] flex items-center justify-center md:p-[3rem] p-[1.7rem]`}
                >
                  <p className="md:text-3xl text-xl font-bold">
                    {rankLabel[index]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* List User Lainnya */}
        <div className="mt-[1rem]">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-400 border-separate border-spacing-y-[1rem]">
              <thead className="uppercase text-white/70">
                <tr>
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Exp</th>
                  <th className="px-6 py-3">Level</th>
                </tr>
              </thead>
              <tbody>
                {otherUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="bg-[#0F171B] hover:bg-[#212C31] cursor-pointer transition-colors rounded-lg"
                  >
                    <td className="px-6 py-4 text-2xl font-semibold text-white rounded-lg">
                      {index + 4}
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-3">
                      {!user.img ? (
                        <div className="bg-[#212C31] flex items-center justify-center md:w-12 md:h-12 h-10 w-10 p-4 rounded-full">
                          <p className="text-xs">
                            {generateUsername(user?.name)}
                          </p>
                        </div>
                      ) : (
                        <img
                          src={user?.photo}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover bg-[#212C31] "
                        />
                      )}

                      <span className="text-white text-center">
                        {user.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.exp} EXP</td>
                    <td className="px-6 py-4 rounded-r-lg">{user.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {otherUsers.length === 0 && (
              <p className="text-center text-gray-400 mt-4">
                Belum ada data lainnya.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
