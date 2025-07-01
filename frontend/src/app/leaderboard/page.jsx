"use client";
import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import generateUsername from "@/lib/username";
import Loading from "@/components/Loading";
import { getUserRank } from "@/lib/rank";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sortedUsers = (await getUserRank()).sortedUsers;
        setUsers(sortedUsers);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const topThree = users.slice(0, 3);
  const others = users.slice(3);

  if (loading) return <Loading />;

  return (
    <div className="md:px-20 px-[1.5rem] py-[4rem]">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <div className="bg-[#0F171B] rounded-full px-6 py-2">All time</div>
      </div>

      {/* Top 3 Leader */}
      <div className="mt-[2rem]">
        <div className="bg-[#0F171B] rounded-xl flex items-end justify-center md:space-x-[6rem] space-x-[1.5rem] pt-[3rem]">
          {topThree.map((user, index) => {
            const rankClass = [
              "bg-[#4F9CF9] md:h-[140px] h-[100px]",
              "bg-blue-600 md:h-[170px] h-[130px]",
              "bg-[#93C5FD] md:h-[110px] h-[80px]",
            ];
            const rankLabel = ["2nd", "1st", "3rd"];
            const heightOrder = [1, 0, 2]; // untuk menampilkan 1st di tengah

            const actual = topThree[heightOrder[index]];

            return (
              <div key={actual.id}>
                <div className="flex flex-col items-center justify-center">
                  {!user.img ? (
                    <div className="bg-[#212C31] flex items-center justify-center md:w-14 md:h-14 h-12 w-12 p-4 rounded-full">
                      <p>{generateUsername(user.name)}</p>
                    </div>
                  ) : (
                    <img
                      src={user.photo}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}

                  <p className="mt-[0.5rem] font-semibold">{actual.name}</p>
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
        <div className="mt-[2rem]">
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
                {others.map((user, index) => (
                  <tr
                    key={user.id}
                    className="bg-[#0F171B] hover:bg-[#1a2a33] transition-colors rounded-lg"
                  >
                    <td className="px-6 py-4 text-lg font-semibold text-white rounded-l-lg">
                      {index + 4}
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-3">
                      {!user.img ? (
                        <p>{generateUsername(user.name)}</p>
                      ) : (
                        <img
                          src={user.photo}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}

                      <span className="text-white">{user.name}</span>
                    </td>
                    <td className="px-6 py-4">{user.exp} EXP</td>
                    <td className="px-6 py-4 rounded-r-lg">{user.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {others.length === 0 && (
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
