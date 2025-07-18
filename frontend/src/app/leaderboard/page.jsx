"use client";
import { useEffect, useState } from "react";
import generateUsername from "@/lib/username";
import Loading from "@/components/Loading";
import { getLeaderboardRank, getRankColor } from "@/lib/rank";
import { FaCrown } from "react-icons/fa6";
import { getUserRank } from "@/lib/rank";
import { GiRank2 } from "react-icons/gi";

const Leaderboard = () => {
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topThree, setTopThree] = useState([]);

  const fetchData = async () => {
    try {
      const sortedUsers = (await getLeaderboardRank()).sortedUsers;
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

  if (loading) {
  return (
    <div className="md:px-20 px-[1.5rem] py-[4rem] animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 w-40 bg-gray-700 rounded" />
        <div className="h-8 w-24 bg-gray-700 rounded-full" />
      </div>

      <div className="bg-[#0F171B] rounded-xl flex items-end justify-center md:space-x-[6rem] space-x-[1.5rem] pt-[2rem]">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="bg-gray-700 rounded-full w-10 h-10" />
            <div className="h-4 w-20 bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-700 rounded" />
            <div className="rounded-lg bg-gray-700 w-16 md:w-24 h-16 md:h-24 mt-2" />
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-[#0F171B] rounded-lg h-12 md:h-14 w-full"
          ></div>
        ))}
      </div>
    </div>
  );
}


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
            const rankLabel = ["2", "1", "3"];
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

                  <p className="mt-[0.5rem] font-semibold text-center ">
                    {actual.name}
                  </p>
                  <div className="flex items-center justify-start space-x-1">
                    <GiRank2
                      className={`text-xl ${getRankColor(actual.exp)}`}
                    />
                    <span className="font-semibold md:text-base text-sm">
                      {getUserRank(actual.exp)}
                    </span>
                  </div>
                </div>

                <div
                  className={`rounded-lg ${rankClass[index]} mt-[1rem] flex items-center justify-center md:p-[3rem] p-[1rem]`}
                >
                  <p className="md:text-3xl text-2xl font-bold">
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
                  <th className="px-6 py-3">Rank Badge</th>
                </tr>
              </thead>
              <tbody>
                {otherUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="bg-[#0F171B] hover:bg-[#212C31] cursor-pointer transition-colors rounded-lg"
                  >
                    <td className="px-6 py-4 md:text-2xl text-lg font-semibold text-white rounded-lg">
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
                    <td className="px-6 py-4 rounded-r-lg">
                      <div className="flex items-center justify-start space-x-2">
                        <GiRank2
                          className={`text-3xl ${getRankColor(user?.exp)}`}
                        />
                        <span className="font-semibold">
                          {getUserRank(user.exp)}
                        </span>
                      </div>
                    </td>
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
