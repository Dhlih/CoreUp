import { getSession } from "./session";

export const getLeaderboardRank = async () => {
  try {
    const session = await getSession();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/all`,
      {
        headers: {
          Authorization: session.value,
        },
      }
    );
    const result = await response.json();

    const sortedUsers = result.data.sort((a, b) => b.exp - a.exp);

    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      {
        headers: {
          Authorization: session.value,
        },
      }
    );
    const userData = await userResponse.json();
    const currentUserId = userData.data.id;

    const userRankIndex = sortedUsers.findIndex(
      (user) => user.id === currentUserId
    );

    return {
      userRank: userRankIndex + 1,
      sortedUsers,
    };
  } catch (error) {
    console.log("Gagal mendapatkan ranking user:", error);
  }
};

export const getUserRank = (totalExp) => {
  if (totalExp < 5000) return "Unranked";
  if (totalExp < 15000) return "Bronze";
  if (totalExp < 30000) return "Silver";
  if (totalExp < 60000) return "Gold";
  if (totalExp < 120000) return "Platinum";
  if (totalExp < 250000) return "Diamond";
  if (totalExp < 500000) return "Master";
  if (totalExp < 1000000) return "Grandmaster";
  return "Legend";
};

export const getRankColor = (exp) => {
  if (exp < 5000) return "text-white"; // Unranked
  if (exp < 15000) return "text-orange-500"; // Bronze
  if (exp < 30000) return "text-gray-300"; // Silver
  if (exp < 60000) return "text-yellow-400"; // Gold
  if (exp < 120000) return "text-blue-400"; // Platinum
  if (exp < 250000) return "text-cyan-400"; // Diamond
  if (exp < 500000) return "text-purple-500"; // Master
  if (exp < 1000000) return "text-fuchsia-500"; // Grandmaster
  return "text-red-500"; // Legend
};
